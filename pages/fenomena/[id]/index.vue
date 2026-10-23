<template>
  <div v-if="fenomena">
    <div class="mb-4 flex items-center justify-between gap-2">
      <NuxtLink to="/fenomena" class="flex items-center gap-1 py-1.5 px-3 rounded-full bg-white shadow-sm text-sm font-bold text-[#006C49] transition active:scale-95">
        <span class="material-symbols-outlined text-[18px]" aria-hidden="true">arrow_back</span>
        Semua Fenomena
      </NuxtLink>
      <span class="pill !px-3 !py-1 bg-secfixed text-onsecfix">{{ selesaiCount }}/5 tahap</span>
    </div>

    <!-- Banner fenomena -->
    <section class="relative w-full rounded-2xl bg-white p-4 shadow-md overflow-hidden mb-6">
      <div class="absolute -right-6 -bottom-6 w-32 h-32 rounded-full pointer-events-none" :style="{ backgroundColor: hex + '26' }" aria-hidden="true" />
      <div class="flex flex-col sm:flex-row gap-4 items-center relative z-10">
        <div class="relative w-28 h-28 shrink-0 rounded-2xl bg-conlow p-2 shadow-sm flex items-center justify-center overflow-hidden">
          <img :src="fenomena.ilustrasi" :alt="`Ilustrasi ${fenomena.nama}`" class="w-full h-full object-contain" />
          <div class="absolute top-1 left-1 bg-white/90 rounded-full w-7 h-7 shadow-sm flex items-center justify-center text-sm leading-none" aria-hidden="true">
            {{ fenomena.icon }}
          </div>
        </div>
        <div class="flex flex-col flex-1 text-center sm:text-left min-w-0 w-full">
          <div class="flex items-center justify-center sm:justify-start gap-2 mb-1">
            <span class="px-2.5 py-0.5 rounded-full bg-secfixed text-onsecfix text-xs font-bold shadow-sm">
              {{ tahapAktif ? `Tahap ${indeksAktif + 1} dari 5` : 'Semua tahap tuntas 🎉' }}
            </span>
          </div>
          <h1 class="font-display font-extrabold text-2xl md:text-[28px] text-ink leading-tight">{{ fenomena.nama }} {{ fenomena.icon }}</h1>
          <p class="font-semibold text-slate-500 text-sm mt-1">{{ fenomena.tagline }}</p>
        </div>
      </div>
      <!-- Progres di dalam banner -->
      <div class="mt-4 pt-3 flex flex-col gap-1.5 relative z-10">
        <div class="flex justify-between items-center text-xs font-bold text-onvariant">
          <span>Kelanjutan Petualangan</span>
          <span :class="gaya.teks">{{ persen }}% Selesai</span>
        </div>
        <div class="w-full h-2.5 rounded-full bg-convariant overflow-hidden p-0.5">
          <div :class="['h-full rounded-full transition-all duration-500', gaya.bar]" :style="{ width: persen + '%' }" />
        </div>
      </div>
    </section>

    <!-- Fenomena terkunci: fenomena sebelumnya belum tuntas -->
    <div v-if="!terbuka" class="kp-card p-6 md:p-8 text-center max-w-2xl mx-auto">
      <div class="w-14 h-14 mx-auto mb-3 rounded-full bg-con flex items-center justify-center text-slate-400">
        <span class="material-symbols-outlined text-[28px]">lock</span>
      </div>
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
      <div class="flex items-center justify-between mb-4 px-1">
        <h2 class="font-display font-bold text-lg text-ink flex items-center gap-2">
          <span class="w-2.5 h-6 rounded-full shrink-0" :style="{ backgroundColor: hex }" aria-hidden="true" />
          Jejak 5 Tahap Pantun
        </h2>
        <span class="text-xs font-bold text-muted">Alur Bertahap</span>
      </div>

      <div class="relative flex flex-col gap-4">
        <!-- Garis jalur vertikal + segmen menyala sesuai progres -->
        <span class="absolute left-[1.375rem] top-6 bottom-8 w-1 rounded-full bg-convariant" aria-hidden="true" />
        <span v-if="selesaiCount" class="absolute left-[1.375rem] top-6 w-1 rounded-full" :style="{ backgroundColor: hex, height: tinggiGlow }" aria-hidden="true" />
        <template v-for="(t, i) in DAFTAR_TAHAP" :key="t.id">
          <NuxtLink v-if="tahapBuka(t.id)" :to="`/fenomena/${fenomena.id}/${t.id}`"
            class="relative z-10 flex items-start gap-4 transition active:scale-[0.99]">
            <!-- Node -->
            <span v-if="sudah(t.id)" class="w-11 h-11 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
              <span class="material-symbols-outlined text-[24px]">check_circle</span>
            </span>
            <span v-else class="relative shrink-0">
              <span class="absolute -inset-1 rounded-full animate-ping opacity-30" :style="{ backgroundColor: hex }" aria-hidden="true" />
              <span class="relative w-11 h-11 rounded-full text-white flex items-center justify-center shadow-lg" :style="{ backgroundColor: hex }">
                <span class="material-symbols-outlined text-[24px]">play_arrow</span>
              </span>
            </span>
            <!-- Kartu tahap -->
            <span :class="['flex-1 min-w-0 rounded-2xl bg-white p-4 block', sudah(t.id) ? 'shadow-sm' : 'shadow-lg relative overflow-hidden']">
              <span v-if="!sudah(t.id)" class="absolute top-0 right-0 w-24 h-24 rounded-bl-full pointer-events-none" :style="{ backgroundColor: hex + '1A' }" aria-hidden="true" />
              <span class="relative flex items-center justify-between gap-2 mb-1">
                <span class="px-2.5 py-0.5 rounded-full bg-con text-xs font-bold" :style="{ color: WARNA_TAHAP[t.id].hex }">Tahap {{ i + 1 }} • {{ namaPendek(t.nama) }}</span>
                <span v-if="sudah(t.id)" class="text-xs font-bold text-emerald-600 flex items-center gap-0.5 shrink-0">
                  <span class="material-symbols-outlined text-[14px]">done_all</span> Selesai
                </span>
              </span>
              <span class="relative block font-display font-bold text-lg text-ink">{{ t.nama }}</span>
              <span v-if="sudah(t.id)" class="relative flex items-center justify-end mt-2">
                <span class="px-3 py-1.5 rounded-full bg-conlow text-primary text-xs font-bold">Buka Ulang →</span>
              </span>
              <span v-else class="relative block">
                <span class="block text-sm font-semibold text-slate-400 mt-0.5">Belum dikerjakan — ketuk untuk mulai</span>
                <span class="mt-3 w-full py-3 px-4 rounded-xl text-white font-display font-bold flex items-center justify-center gap-2 shadow-md"
                  :style="{ background: `linear-gradient(90deg, ${WARNA_TAHAP[t.id].hex}, ${hex})` }">
                  Mulai Bermain 🎮
                </span>
              </span>
            </span>
          </NuxtLink>
          <div v-else class="relative z-10 flex items-start gap-4 opacity-85" :aria-label="`${t.nama} (terkunci)`">
            <span class="w-11 h-11 rounded-full bg-convariant text-muted flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-[20px]">lock</span>
            </span>
            <div class="flex-1 min-w-0 rounded-2xl bg-white p-4 shadow-none">
              <div class="flex items-center justify-between gap-2 mb-1">
                <span class="px-2.5 py-0.5 rounded-full bg-conhigh text-xs font-bold" :style="{ color: WARNA_TAHAP[t.id].hex }">Tahap {{ i + 1 }} • {{ namaPendek(t.nama) }}</span>
                <span class="text-xs font-bold text-slate-400 flex items-center gap-0.5 shrink-0">
                  <span class="material-symbols-outlined text-[14px]">lock</span> Terkunci
                </span>
              </div>
              <p class="font-display font-bold text-lg text-slate-500">{{ t.nama }}</p>
              <p class="flex items-center gap-1.5 text-slate-400 text-xs font-semibold mt-1.5">
                <span class="material-symbols-outlined text-[15px]">info</span>
                Terkunci — selesaikan tahap sebelumnya dulu
              </p>
            </div>
          </div>
        </template>
      </div>

      <!-- CTA bawah -->
      <NuxtLink v-if="tahapAktif" :to="`/fenomena/${fenomena.id}/${tahapAktif.id}`"
        class="w-full mt-5 py-3.5 rounded-2xl text-white font-display font-bold text-base shadow-md flex items-center justify-center gap-2 transition active:scale-[0.98]"
        :style="{ background: `linear-gradient(90deg, ${WARNA_TAHAP[tahapAktif.id].hex}, ${hex})` }">
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
const indeksAktif = computed(() => (tahapAktif.value ? DAFTAR_TAHAP.findIndex(t => t.id === tahapAktif.value!.id) : -1))
const persen = computed(() => Math.round(selesaiCount.value / 5 * 100))
/** Tinggi segmen garis menyala (perkiraan dekoratif mengikuti jumlah tahap selesai). */
const tinggiGlow = computed(() => `calc(${selesaiCount.value / 5 * 100}% - 3rem)`)
/** Nama pendek tahap untuk chip: "Kenali Fenomena" → "Kenali", "Ekspresikan Pengetahuan" → "Ekspresikan". */
const namaPendek = (nama: string) => nama.split(' ')[0]

onMounted(() => { void muat() })
</script>
