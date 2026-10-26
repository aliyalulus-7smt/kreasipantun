<template>
  <div v-if="fenomena && tahap">
    <!-- Memuat progres untuk memeriksa urutan -->
    <div v-if="!pernahMuat" class="text-center py-16">
      <p class="font-bold text-slate-400">Memuat…</p>
    </div>

    <!-- Tahap terkunci: tahap/fenomena sebelumnya belum selesai -->
    <div v-else-if="!bolehAkses" class="max-w-2xl mx-auto">
      <div class="mb-6">
        <NuxtLink :to="`/fenomena/${fenomena.id}`" class="inline-flex items-center gap-1 font-display font-bold text-sm text-primary">
          <span class="material-symbols-outlined text-[18px]" aria-hidden="true">keyboard_backspace</span> {{ fenomena.nama }}
        </NuxtLink>
      </div>
      <div class="kp-card p-6 md:p-8 text-center">
        <div class="w-14 h-14 mx-auto mb-3 rounded-full bg-con flex items-center justify-center text-slate-400">
          <span class="material-symbols-outlined text-[28px]">lock</span>
        </div>
        <p class="font-display font-extrabold text-lg text-slate-700">Tahap ini masih terkunci</p>
        <p class="text-sm font-semibold text-slate-500 mt-1.5 leading-relaxed">
          Setiap tahap wajib dikerjakan berurutan. Selesaikan dulu tahap-tahap sebelumnya
          pada fenomena ini, baru tahap <span class="text-slate-700 font-bold">{{ tahap.nama }}</span> terbuka.
        </p>
        <NuxtLink :to="`/fenomena/${fenomena.id}`" class="kp-btn-primary !px-5 !py-2.5 text-sm mt-4">Lihat Urutan Tahap</NuxtLink>
      </div>
    </div>

    <template v-else>
    <div class="mb-3 flex items-center justify-between gap-2">
      <NuxtLink :to="`/fenomena/${fenomena.id}`" class="inline-flex items-center gap-1 font-display font-bold text-sm text-primary min-w-0">
        <span class="material-symbols-outlined text-[18px] shrink-0" aria-hidden="true">keyboard_backspace</span>
        <span class="truncate">{{ fenomena.nama }}</span>
      </NuxtLink>
      <span :class="['pill shrink-0', warnaTahap.badge]">
        <span class="w-2 h-2 rounded-full animate-pulse" :style="{ backgroundColor: warnaTahap.hex }" aria-hidden="true" />
        {{ tahap.nama }}
      </span>
    </div>

    <!-- Kartu pelacak langkah (struktur referensi Stitch) -->
    <div class="max-w-2xl mx-auto mb-6 bg-white rounded-xl shadow-[0_4px_16px_rgba(31,42,55,0.04)] p-3 flex flex-col gap-2">
      <div class="flex justify-between items-center gap-2">
        <span class="flex items-center gap-1.5 font-display font-bold text-sm" :style="{ color: warnaTahap.hex }">
          <span class="material-symbols-outlined text-[16px]" aria-hidden="true">{{ ikonTahap }}</span>
          {{ tahap.nama }}
        </span>
        <span class="bg-con px-2 py-0.5 rounded-full text-[#003751] text-xs font-extrabold shrink-0">{{ indeksTahap + 1 }} dari 5 Tahap</span>
      </div>
      <div class="w-full bg-con rounded-full h-2.5 overflow-hidden p-0.5">
        <div class="h-full rounded-full transition-all duration-500"
          :style="{ width: ((indeksTahap + 1) / 5 * 100) + '%', background: `linear-gradient(90deg, #38BDF8, ${warnaTahap.hex})` }" />
      </div>
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
        <ChecklistTahap v-else-if="tahapId === 'evaluasi'" :data="konten.data" :fenomena-id="fenomena.id" :data-tersimpan="dataTersimpan" :pantun-asah="pantunAsah" />
      </template>
    </div>

    <!-- Kotak hadiah: hanya untuk penyelesaian fenomena (evaluasi) yang baru
         saja tuntas di kunjungan ini. Kotak dibuka dulu, panel perayaan
         menyusul setelah kotak terbuka; kunjungan ulang tahap yang sudah
         selesai langsung menampilkan panel tanpa kotak. -->
    <div v-if="tahapId === 'evaluasi' && sudahSelesai && baruSelesai && !kotakTerbuka" ref="panelKotak" class="max-w-2xl mx-auto mt-8 kp-card p-5 md:p-6 text-center border-2 !border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50">
      <p class="font-display font-extrabold text-lg text-ink">Fenomena selesai! Kerja bagus! 🎉</p>
      <p class="text-sm font-semibold text-slate-500 mt-1">Buka kotak hadiahmu dulu, yuk!</p>
      <KotakAnimasi @terbuka="kotakTerbuka = true" />
    </div>

    <!-- Panel perayaan: muncul begitu tahap ini selesai (untuk evaluasi,
         setelah kotak hadiah dibuka) -->
    <div v-if="sudahSelesai && !(tahapId === 'evaluasi' && baruSelesai && !kotakTerbuka)" ref="panelSelesai" class="max-w-2xl mx-auto mt-8 kp-card p-5 md:p-6 text-center border-2 !border-emerald-200 bg-gradient-to-br from-emerald-50 to-sky-50">
      <p class="text-4xl mb-2" aria-hidden="true">🎉</p>
      <p class="font-display font-extrabold text-lg text-ink">
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
import { WARNA_TAHAP, WARNA_TAHAP_DEFAULT } from '~/utils/fenomena-ui'
import ConfettiLetus from '~/components/ConfettiLetus.vue'
import KotakAnimasi from '~/components/KotakAnimasi.vue'
import { bacaPayloadLokal } from '~/composables/useOutbox'

definePageMeta({ layout: 'app', middleware: 'auth-bff' })

const route = useRoute()
const fenomena = computed(() => cariFenomena(String(route.params.id)))
const tahapId = computed(() => String(route.params.tahap) as IdTahap)
const tahap = computed(() => DAFTAR_TAHAP.find(t => t.id === tahapId.value))
const warnaTahap = computed(() => WARNA_TAHAP[tahapId.value] || WARNA_TAHAP_DEFAULT)
const indeksTahap = computed(() => DAFTAR_TAHAP.findIndex(t => t.id === tahapId.value))
const ikonTahap = computed(() => ({
  kenali: 'menu_book', eksplorasi: 'explore', ekspresikan: 'lightbulb', asah: 'edit_note', evaluasi: 'fact_check',
}[tahapId.value] || 'menu_book'))
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
// Khusus evaluasi: pantun dari tahap Asah siswa, untuk penilaian otomatis
// (suku kata & sajak a-b-a-b) di daftar periksa.
const pantunAsah = ref<string[] | null>(null)
async function muatTersimpan() {
  const fid = String(route.params.id)
  let changes: any[] | null = null
  const ambilPayload = async (stage: string): Promise<Record<string, any> | null> => {
    const lokal = bacaPayloadLokal(fid, stage)
    if (lokal) return lokal as Record<string, any>
    if (!changes) {
      try {
        const r = await $fetch<{ data: { changes: any[] } }>('/api/v1/sync/pull', { method: 'POST', body: { limit: 500 } })
        changes = r.data.changes || []
      } catch { changes = [] }
    }
    return changes.find((x: any) => x.phenomenon_id === fid && x.stage_id === stage)?.response_payload || null
  }
  dataTersimpan.value = await ambilPayload(tahapId.value)
  if (tahapId.value === 'evaluasi') {
    const asah = await ambilPayload('asah')
    if (Array.isArray(asah?.baris)) pantunAsah.value = asah.baris
  }
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
const panelKotak = ref<HTMLElement | null>(null)
const kotakTerbuka = ref(false)
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
    if (tahapId.value !== 'evaluasi') {
      confetti.value?.letus(false)
      nextTick(() => {
        try { panelSelesai.value?.scrollIntoView({ behavior: 'smooth', block: 'center' }) } catch {}
      })
      timerLanjut = setTimeout(() => {
        void navigateTo(tombolLanjut.value.to)
      }, 2600)
    } else {
      // Fenomena selesai: kotak hadiah tampil dulu. Confetti + lanjut
      // otomatis dimulai setelah kotak dibuka (watch kotakTerbuka).
      nextTick(() => {
        try { panelKotak.value?.scrollIntoView({ behavior: 'smooth', block: 'center' }) } catch {}
      })
    }
  }
})
// Setelah kotak hadiah dibuka: panel perayaan muncul, confetti meletus,
// lalu lanjut otomatis seperti biasa.
watch(kotakTerbuka, (v) => {
  if (!v) return
  confetti.value?.letus(true)
  nextTick(() => {
    try { panelSelesai.value?.scrollIntoView({ behavior: 'smooth', block: 'center' }) } catch {}
  })
  timerLanjut = setTimeout(() => {
    void navigateTo(tombolLanjut.value.to)
  }, 3200)
})
onUnmounted(() => { if (timerLanjut) clearTimeout(timerLanjut) })

function tandai() {
  const key = `${route.params.id}:${tahapId.value}`
  selesai.value[key] = true
  window.dispatchEvent(new CustomEvent('kp-tahap-selesai', {
    detail: { phenomenon_id: route.params.id, stage_id: tahapId.value },
  }))
}

// Semua komponen tahap memicu via outbox -> dengarkan perubahan remote.
// PENTING: tandai selesai HANYA bila perubahan remote itu memang untuk
// fenomena+tahap yang sedang dibuka. Tanpa pemeriksaan ini, tarikan
// sinkronisasi milik tahap SEBELUMNYA (mis. Kenali) yang tiba terlambat
// setelah halaman berpindah akan menandai tahap yang sedang dibuka
// (mis. Eksplorasi) sebagai selesai padahal belum dikerjakan.
onMounted(() => {
  void muat()
  void muatTersimpan()
  const h = (e: Event) => {
    const d = (e as CustomEvent).detail as { phenomenon_id?: string; stage_id?: string } | undefined
    if (d?.phenomenon_id === String(route.params.id) && d?.stage_id === tahapId.value) tandai()
  }
  window.addEventListener('kp-remote-change', h)
  onUnmounted(() => window.removeEventListener('kp-remote-change', h))
})
</script>
