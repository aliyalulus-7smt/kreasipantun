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
      <StimulusTahap v-if="tahapId === 'kenali'" :tipe="konten.tipe" :data="konten.data" :fenomena-id="fenomena.id" @selesai="tandai" />
      <KuisTahap v-else-if="tahapId === 'eksplorasi'" :tipe="konten.tipe" :data="konten.data" :fenomena-id="fenomena.id" />
      <EkspresikanTahap v-else-if="tahapId === 'ekspresikan'" :tipe="konten.tipe" :data="konten.data" :fenomena-id="fenomena.id" />
      <TulisTahap v-else-if="tahapId === 'asah'" :tipe="konten.tipe" :data="konten.data" :fenomena-id="fenomena.id" />
      <ChecklistTahap v-else-if="tahapId === 'evaluasi'" :data="konten.data" :fenomena-id="fenomena.id" />
    </div>

    <div class="max-w-2xl mx-auto mt-8 flex justify-between">
      <NuxtLink :to="`/fenomena/${fenomena.id}`" class="btn-soft">← Tahap Lain</NuxtLink>
      <NuxtLink v-if="tahapBerikutnya && tahapTerbuka(fenomena.id, tahapBerikutnya.id)" :to="`/fenomena/${fenomena.id}/${tahapBerikutnya.id}`" class="btn-primary">
        {{ tahapBerikutnya.nama }} →
      </NuxtLink>
    </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { DAFTAR_TAHAP, cariFenomena, type IdTahap } from '~/data/fenomena'

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
  const h = () => tandai()
  window.addEventListener('kp-remote-change', h)
  onUnmounted(() => window.removeEventListener('kp-remote-change', h))
})
</script>
