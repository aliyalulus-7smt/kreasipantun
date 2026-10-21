<template>
  <div v-if="fenomena && tahap">
    <!-- Memuat progres untuk memeriksa urutan -->
    <div v-if="!pernahMuat" class="text-center py-16">
      <p class="font-bold text-slate-400">Memuat…</p>
    </div>

    <!-- Tahap terkunci: tahap/fenomena sebelumnya belum selesai -->
    <div v-else-if="!bolehAkses" class="max-w-2xl mx-auto">
      <div class="mb-6">
        <NuxtLink :to="`/fenomena/${fenomena.id}`" class="btn-soft !px-4 !py-2 text-sm">← {{ fenomena.nama }}</NuxtLink>
      </div>
      <div class="kp-card p-6 md:p-8 text-center">
        <p class="text-5xl mb-3" aria-hidden="true">🔒</p>
        <p class="font-display font-extrabold text-lg text-slate-700">Tahap ini masih terkunci</p>
        <p class="text-sm font-semibold text-slate-500 mt-1.5 leading-relaxed">
          Setiap tahap wajib dikerjakan berurutan. Selesaikan dulu tahap-tahap sebelumnya
          pada fenomena ini, baru tahap <span class="text-slate-700 font-bold">{{ tahap.nama }}</span> terbuka.
        </p>
        <NuxtLink :to="`/fenomena/${fenomena.id}`" class="kp-btn-primary !px-5 !py-2.5 text-sm mt-4">Lihat Urutan Tahap</NuxtLink>
      </div>
    </div>

    <template v-else>
    <div class="mb-6 flex items-center justify-between">
      <NuxtLink :to="`/fenomena/${fenomena.id}`" class="btn-soft !px-4 !py-2 text-sm">← {{ fenomena.nama }}</NuxtLink>
      <span class="pill bg-sky-100 text-sky-700">{{ tahap.nama }}</span>
    </div>

    <div class="text-center mb-6">
      <h1 class="page-title">{{ konten.judul }}</h1>
    </div>

    <div class="max-w-2xl mx-auto">
      <p v-if="!dataSiap" class="text-center font-bold text-slate-400 py-10">Memuat jawaban tersimpan…</p>
      <template v-else>
        <StimulusTahap v-if="tahapId === 'kenali'" :tipe="konten.tipe" :data="konten.data" :fenomena-id="fenomena.id" :data-tersimpan="dataTersimpan" @selesai="tandai" />
        <KuisTahap v-else-if="tahapId === 'eksplorasi'" :tipe="konten.tipe" :data="konten.data" :fenomena-id="fenomena.id" :data-tersimpan="dataTersimpan" />
        <EkspresikanTahap v-else-if="tahapId === 'ekspresikan'" :tipe="konten.tipe" :data="konten.data" :fenomena-id="fenomena.id" :data-tersimpan="dataTersimpan" />
        <TulisTahap v-else-if="tahapId === 'asah'" :tipe="konten.tipe" :data="konten.data" :fenomena-id="fenomena.id" :data-tersimpan="dataTersimpan" />
        <ChecklistTahap v-else-if="tahapId === 'evaluasi'" :data="konten.data" :fenomena-id="fenomena.id" :data-tersimpan="dataTersimpan" />
      </template>
    </div>

    <!-- Panel perayaan: muncul begitu tahap ini selesai -->
    <div v-if="sudahSelesai" ref="panelSelesai" class="max-w-2xl mx-auto mt-8 kp-card p-5 md:p-6 text-center border-2 !border-emerald-200 bg-gradient-to-br from-emerald-50 to-amber-50">
      <p class="text-4xl mb-2" aria-hidden="true">🎉</p>
      <p class="font-display font-extrabold text-lg text-[#123c2b]">
        {{ tahapId === 'evaluasi' ? 'Fenomena selesai! Kerja bagus!' : 'Tahap selesai! Hebat!' }}
      </p>
      <p class="text-sm font-semibold text-slate-500 mt-1">
        {{ teksPanel }}
      </p>
      <NuxtLink :to="tombolLanjut.to" class="kp-btn-primary !px-6 !py-3 mt-4 text-base">
        {{ tombolLanjut.label }}
      </NuxtLink>
      <p v-if="baruSelesai" class="text-xs font-semibold text-slate-400 mt-3">
        ⏳ Tunggu sebentar — kamu akan otomatis dilanjutkan…
      </p>
    </div>
    </template>
    <ConfettiLetus ref="confetti" />
  </div>
</template>

<script setup lang="ts">
import { DAFTAR_TAHAP, FENOMENA, cariFenomena, type IdTahap } from '~/data/fenomena'
import ConfettiLetus from '~/components/ConfettiLetus.vue'
import { bacaPayloadLokal } from '~/composables/useOutbox'

definePageMeta({ layout: 'app', middleware: 'auth-bff' })

const route = useRoute()
const fenomena = computed(() => cariFenomena(String(route.params.id)))
const tahapId = computed(() => String(route.params.tahap) as IdTahap)
const tahap = computed(() => DAFTAR_TAHAP.find(t => t.id === tahapId.value))
const konten = computed(() => fenomena.value!.tahap[tahapId.value])
const selesai = useState<Record<string, boolean>>('kp-tahap-selesai', () => ({}))
const { pernahMuat, muat, tahapTerbuka } = useProgresSiswa()
const bolehAkses = computed(() => tahapTerbuka(String(route.params.id), tahapId.value))

const tahapBerikutnya = computed(() => {
  const idx = DAFTAR_TAHAP.findIndex(t => t.id === tahapId.value)
  return idx >= 0 && idx < DAFTAR_TAHAP.length - 1 ? DAFTAR_TAHAP[idx + 1] : null
})

const sudahSelesai = computed(() => !!selesai.value[`${route.params.id}:${tahapId.value}`])

/**
 * Jawaban tersimpan siswa untuk tahap ini — agar membuka ulang tahap
 * menampilkan data yang pernah diisi, bukan formulir kosong.
 * Prioritas: antrean lokal perangkat (paling baru, mungkin belum tersinkron),
 * lalu record server via sync/pull.
 */
const dataTersimpan = ref<Record<string, any> | null>(null)
const dataSiap = ref(false)
async function muatTersimpan() {
  const fid = String(route.params.id)
  const lokal = bacaPayloadLokal(fid, tahapId.value)
  if (lokal) { dataTersimpan.value = lokal as Record<string, any>; dataSiap.value = true; return }
  try {
    const r = await $fetch<{ data: { changes: any[] } }>('/api/v1/sync/pull', { method: 'POST', body: { limit: 500 } })
    const c = (r.data.changes || []).find((x: any) => x.phenomenon_id === fid && x.stage_id === tahapId.value)
    if (c?.response_payload) dataTersimpan.value = c.response_payload
  } catch {}
  dataSiap.value = true
}
const fenomenaBerikutnya = computed(() => {
  const idx = FENOMENA.findIndex(f => f.id === String(route.params.id))
  return idx >= 0 && idx < FENOMENA.length - 1 ? FENOMENA[idx + 1] : null
})

/** Tombol lanjut kontekstual setelah tahap selesai. */
const tombolLanjut = computed(() => {
  const fid = String(route.params.id)
  if (tahapBerikutnya.value) {
    return { label: `Selanjutnya: ${tahapBerikutnya.value.nama} →`, to: `/fenomena/${fid}/${tahapBerikutnya.value.id}` }
  }
  if (fenomenaBerikutnya.value) {
    // Langsung masuk ke progres pertama fenomena berikutnya.
    return { label: `Lanjutkan ke Fenomena ${fenomenaBerikutnya.value.nama} →`, to: `/fenomena/${fenomenaBerikutnya.value.id}/kenali` }
  }
  // Progres terakhir di fenomena terakhir: Selesai -> halaman Profil.
  return { label: 'Selesai 🎉', to: '/profil' }
})
const teksPanel = computed(() => {
  if (tahapBerikutnya.value) return `Kamu sudah menyelesaikan tahap ${tahap.value?.nama}. Lanjut ke tahap berikutnya, yuk!`
  if (fenomenaBerikutnya.value) return `Semua tahap fenomena ${fenomena.value?.nama} sudah kamu selesaikan. Fenomena berikutnya sudah terbuka!`
  return 'Luar biasa! Kamu sudah menuntaskan semua fenomena sampai yang terakhir. 🎓'
})

const confetti = ref<InstanceType<typeof ConfettiLetus> | null>(null)
const panelSelesai = ref<HTMLElement | null>(null)
const baruSelesai = ref(false)
let timerLanjut: ReturnType<typeof setTimeout> | null = null
// Keadaan tahap SAAT data progres pertama kali termuat di halaman ini.
// Transisi "belum termuat -> selesai" ketika membuka ulang tahap lama BUKAN
// penyelesaian baru — confetti + auto-lanjut hanya untuk tahap yang saat
// halaman dibuka memang belum selesai, lalu diselesaikan di kunjungan ini.
const keadaanAwal = ref<boolean | null>(null)
watch(pernahMuat, (v) => {
  if (v && keadaanAwal.value === null) keadaanAwal.value = sudahSelesai.value
}, { immediate: true })
watch(sudahSelesai, (baru) => {
  if (baru && keadaanAwal.value === false && !baruSelesai.value) {
    baruSelesai.value = true
    confetti.value?.letus(tahapId.value === 'evaluasi')
    nextTick(() => {
      try { panelSelesai.value?.scrollIntoView({ behavior: 'smooth', block: 'center' }) } catch {}
    })
    timerLanjut = setTimeout(() => {
      void navigateTo(tombolLanjut.value.to)
    }, tahapId.value === 'evaluasi' ? 3200 : 2600)
  }
})
onUnmounted(() => { if (timerLanjut) clearTimeout(timerLanjut) })

function tandai() {
  const key = `${route.params.id}:${tahapId.value}`
  selesai.value[key] = true
  window.dispatchEvent(new CustomEvent('kp-tahap-selesai', {
    detail: { phenomenon_id: route.params.id, stage_id: tahapId.value },
  }))
}

// Semua komponen tahap memicu via outbox -> dengarkan perubahan remote
onMounted(() => {
  void muat()
  void muatTersimpan()
  const h = () => tandai()
  window.addEventListener('kp-remote-change', h)
  onUnmounted(() => window.removeEventListener('kp-remote-change', h))
})
</script>
