<template>
  <div v-if="fenomena">
    <div class="mb-4 flex items-center justify-between">
      <NuxtLink to="/fenomena" class="kp-btn-soft !px-4 !py-2 !min-h-[40px] text-sm">← Semua Fenomena</NuxtLink>
      <span class="pill" :class="gaya.badge">{{ selesaiCount }}/5 tahap</span>
    </div>

    <!-- Banner fenomena -->
    <section class="kp-card overflow-hidden mb-5">
      <div class="px-5 py-5 md:px-6 flex items-center gap-4" :style="{ background: `linear-gradient(120deg, ${hex}14, #ffffff 65%)` }">
        <img :src="fenomena.ilustrasi" :alt="`Ilustrasi ${fenomena.nama}`"
          class="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover shrink-0 shadow-sm" :style="{ backgroundColor: hex + '26' }" />
        <div class="min-w-0 flex-1">
          <p class="text-[11px] font-extrabold uppercase tracking-wide" :style="{ color: hex }">Fenomena {{ indeks + 1 }}</p>
          <h1 class="font-display font-extrabold text-2xl md:text-3xl text-ink leading-tight">{{ fenomena.nama }} {{ fenomena.icon }}</h1>
          <p class="font-semibold text-slate-500 text-sm mt-0.5">{{ fenomena.tagline }}</p>
          <div class="flex items-center gap-2.5 mt-3">
            <div class="flex-1 max-w-xs h-2.5 rounded-full bg-slate-100 overflow-hidden">
              <div :class="['h-full rounded-full transition-all', gaya.bar]" :style="{ width: (selesaiCount / 5 * 100) + '%' }" />
            </div>
            <span class="pill !px-2.5 !py-0.5 shrink-0" :class="gaya.badge">{{ selesaiCount }}/5 Tahap ({{ Math.round(selesaiCount / 5 * 100) }}%)</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Fenomena terkunci: fenomena sebelumnya belum tuntas -->
    <div v-if="!terbuka" class="kp-card p-6 md:p-8 text-center max-w-2xl mx-auto">
      <p class="text-5xl mb-3" aria-hidden="true">🔒</p>
      <p class="font-display font-extrabold text-lg text-slate-700">Fenomena ini masih terkunci</p>
      <p class="text-sm font-semibold text-slate-500 mt-1.5 leading-relaxed">
        Fenomena dikerjakan berurutan. Selesaikan dulu semua tahap pada fenomena
        <span class="text-slate-700 font-bold">{{ namaSebelumnya }}</span>, baru fenomena ini terbuka.
      </p>
      <NuxtLink :to="`/fenomena/${idSebelumnya}`" class="kp-btn-primary !px-5 !py-2.5 text-sm mt-4">Ke {{ namaSebelumnya }}</NuxtLink>
    </div>

    <template v-else>
    <!-- Jejak 5 tahap (stepper vertikal) -->
    <div class="max-w-2xl mx-auto">
      <div class="flex items-center justify-between mb-3 px-1">
        <h2 class="font-display font-bold text-lg text-ink">Jejak 5 Tahap Pantun</h2>
        <span class="text-xs font-bold text-slate-400">Alur Bertahap</span>
      </div>

      <div class="relative space-y-3">
        <!-- Garis penghubung vertikal -->
        <span class="absolute left-[1.375rem] top-4 bottom-4 w-0.5 bg-slate-100" aria-hidden="true" />
        <template v-for="(t, i) in DAFTAR_TAHAP" :key="t.id">
          <NuxtLink v-if="tahapBuka(t.id)" :to="`/fenomena/${fenomena.id}/${t.id}`"
            class="kp-card relative p-4 flex items-center gap-4 hover:-translate-y-0.5 transition active:scale-[0.99]"
            :style="tahapAktif?.id === t.id && !sudah(t.id) ? { borderColor: WARNA_TAHAP[t.id].hex, borderWidth: '2px' } : {}">
            <span :class="['relative z-10 w-11 h-11 rounded-full flex items-center justify-center font-display font-extrabold shrink-0 shadow-sm',
              sudah(t.id) ? 'bg-emerald-500 text-white' : WARNA_TAHAP[t.id].bg + ' text-white']">
              {{ sudah(t.id) ? '✓' : (i + 1) }}
            </span>
            <div class="flex-1 min-w-0">
              <span :class="['pill !px-2.5 !py-0.5 text-[11px]', WARNA_TAHAP[t.id].badge]">Tahap {{ i + 1 }} • {{ namaPendek(t.nama) }}</span>
              <p class="font-display font-bold text-slate-700 mt-1">{{ t.nama }}</p>
              <p class="text-xs font-semibold mt-0.5" :class="sudah(t.id) ? 'text-emerald-600' : 'text-slate-400'">
                {{ sudah(t.id) ? 'Selesai ✓' : 'Belum dikerjakan — ketuk untuk mulai' }}
              </p>
            </div>
            <span class="text-slate-300" aria-hidden="true">›</span>
          </NuxtLink>
          <div v-else class="kp-card relative p-4 flex items-center gap-4 opacity-80 !shadow-none" :aria-label="`${t.nama} (terkunci)`">
            <span class="relative z-10 w-11 h-11 rounded-full flex items-center justify-center shrink-0 bg-slate-100 text-slate-400 text-lg">🔒</span>
            <div class="flex-1 min-w-0">
              <span :class="['pill !px-2.5 !py-0.5 text-[11px]', WARNA_TAHAP[t.id].badge]">Tahap {{ i + 1 }} • {{ namaPendek(t.nama) }}</span>
              <p class="font-display font-bold text-slate-500 mt-1">{{ t.nama }}</p>
              <p class="text-xs font-semibold mt-0.5 text-slate-400">Terkunci — selesaikan tahap sebelumnya dulu</p>
            </div>
          </div>
        </template>
      </div>

      <!-- CTA bawah -->
      <NuxtLink v-if="tahapAktif" :to="`/fenomena/${fenomena.id}/${tahapAktif.id}`" class="kp-btn-primary w-full mt-5">
        {{ selesaiCount ? 'Lanjutkan' : 'Mulai' }}: {{ tahapAktif.nama }} →
      </NuxtLink>
      <div v-else class="mt-5 rounded-[1.5rem] bg-emerald-50 border border-emerald-100 p-5 text-center">
        <p class="font-display font-extrabold text-emerald-700">🎉 Fenomena ini sudah tuntas!</p>
        <p class="text-sm font-semibold text-emerald-600 mt-1">Semua tahap selesai. Kerja bagus!</p>
        <NuxtLink to="/fenomena" class="kp-btn-soft !px-5 !py-2.5 text-sm mt-3">Lihat Fenomena Lain</NuxtLink>
      </div>
    </div>
    </template>
  </div>
  <div v-else class="text-center py-16">
    <p class="font-bold text-slate-500">Fenomena tidak ditemukan.</p>
    <NuxtLink to="/fenomena" class="kp-btn-soft mt-4">← Kembali</NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { DAFTAR_TAHAP, FENOMENA, cariFenomena } from '~/data/fenomena'
import { GAYA_FENOMENA, GAYA_DEFAULT, HEX_FENOMENA, WARNA_TAHAP } from '~/utils/fenomena-ui'

definePageMeta({ layout: 'siswa', middleware: 'auth-bff' })

const route = useRoute()
const fenomena = computed(() => cariFenomena(String(route.params.id)))
const gaya = computed(() => (fenomena.value ? GAYA_FENOMENA[fenomena.value.warna] || GAYA_DEFAULT : GAYA_DEFAULT))
const hex = computed(() => (fenomena.value ? HEX_FENOMENA[fenomena.value.warna] || '#38BDF8' : '#38BDF8'))

const { selesai, muat, fenomenaTerbuka, tahapTerbuka } = useProgresSiswa()
const sudah = (tahap: string) => !!selesai.value[`${route.params.id}:${tahap}`]
const selesaiCount = computed(() => DAFTAR_TAHAP.filter(t => sudah(t.id)).length)
const terbuka = computed(() => fenomenaTerbuka(String(route.params.id)))
const tahapBuka = (tahap: string) => tahapTerbuka(String(route.params.id), tahap)
const indeks = computed(() => FENOMENA.findIndex(f => f.id === String(route.params.id)))
const idSebelumnya = computed(() => (indeks.value > 0 ? FENOMENA[indeks.value - 1].id : ''))
const namaSebelumnya = computed(() => (indeks.value > 0 ? FENOMENA[indeks.value - 1].nama : ''))
// Tahap yang sedang gilirannya dikerjakan: pertama yang terbuka & belum selesai.
const tahapAktif = computed(() => DAFTAR_TAHAP.find(t => tahapBuka(t.id) && !sudah(t.id)) || null)
/** Nama pendek tahap untuk chip: "Kenali Fenomena" → "Kenali", "Ekspresikan Pengetahuan" → "Ekspresikan". */
const namaPendek = (nama: string) => nama.split(' ')[0]

onMounted(() => { void muat() })
</script>
