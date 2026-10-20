<template>
  <div class="space-y-5">
    <!-- Hero sapaan -->
    <section class="kp-card overflow-hidden">
      <div class="relative bg-gradient-to-br from-emerald-50 via-white to-sky-50 px-5 py-5 md:px-7 md:py-6 flex items-center gap-4">
        <div class="min-w-0 flex-1">
          <h1 class="font-display font-extrabold text-2xl md:text-3xl text-[#123c2b] leading-tight">
            Halo, {{ namaDepan }}! 👋
          </h1>
          <p class="font-semibold text-slate-500 mt-1 text-sm md:text-base">
            Terus semangat belajar dan berkarya dengan pantun!
          </p>
          <div class="mt-3 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-2.5 flex gap-2.5 items-start max-w-md">
            <span class="text-amber-400 text-lg leading-none mt-0.5" aria-hidden="true">❝</span>
            <p class="text-[13px] font-semibold text-slate-600 leading-snug">
              Setiap kata yang kamu tulis adalah langkah kecil menuju karya besar.
            </p>
          </div>
        </div>
        <div class="hidden sm:flex w-28 h-28 md:w-36 md:h-36 rounded-[2rem] bg-gradient-to-br from-emerald-100 to-sky-100 items-center justify-center shrink-0" aria-hidden="true">
          <span class="text-6xl md:text-7xl">🧑‍🎓</span>
        </div>
      </div>
    </section>

    <!-- Loading -->
    <div v-if="memuat && !pernahMuat" class="space-y-5" aria-busy="true">
      <div class="kp-card p-5"><div class="skeleton h-16 rounded-2xl" /></div>
      <div class="kp-card p-5"><div class="skeleton h-28 rounded-2xl" /></div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div v-for="i in 8" :key="i" class="kp-card p-3"><div class="skeleton h-24 rounded-2xl mb-3" /><div class="skeleton h-4 rounded-full" /></div>
      </div>
    </div>

    <template v-else>
      <!-- Error tarik data (data lokal tetap tampil bila ada) -->
      <div v-if="galat" class="rounded-2xl bg-rose-50 border border-rose-100 px-4 py-3 flex items-center justify-between gap-3">
        <p class="text-sm font-bold text-rose-600">Sebagian data belum bisa dimuat dari server.</p>
        <button @click="muat" class="text-sm font-display font-bold text-rose-700 underline shrink-0">Coba lagi</button>
      </div>

      <RingkasanProgres :fenomena-selesai="fenomenaSelesai" :total-tahap="totalTahap" />

      <LanjutkanCard
        :terakhir="terakhir"
        :progres="terakhir ? progresFenomena(terakhir.phenomenon_id) : 0"
        :tahap-lanjut="terakhir ? tahapLanjut(terakhir.phenomenon_id) : null" />

      <!-- Pilih fenomena -->
      <section>
        <div class="flex items-center justify-between mb-3">
          <h2 class="kp-section-title flex items-center gap-2"><span aria-hidden="true">🧩</span> Pilih Fenomena</h2>
          <span class="text-xs font-bold text-slate-400">Urutannya bebas!</span>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          <FenomenaCard v-for="f in FENOMENA" :key="f.id" :fenomena="f" :progres="progresFenomena(f.id)" />
        </div>
      </section>

      <!-- Aktivitas terbaru -->
      <section class="kp-card p-4 md:p-5">
        <h2 class="kp-section-title flex items-center gap-2 mb-1"><span aria-hidden="true">🕘</span> Aktivitas Terbaru</h2>
        <div v-if="aktivitas.length" class="divide-y divide-slate-50">
          <AktivitasItem v-for="a in aktivitas.slice(0, 5)" :key="a.key" :item="a" />
        </div>
        <p v-else class="text-sm font-semibold text-slate-400 py-3">
          Belum ada aktivitas. Aktivitas belajarmu akan muncul di sini.
        </p>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { FENOMENA } from '~/data/fenomena'
import RingkasanProgres from '~/components/siswa/RingkasanProgres.vue'
import LanjutkanCard from '~/components/siswa/LanjutkanCard.vue'
import FenomenaCard from '~/components/siswa/FenomenaCard.vue'
import AktivitasItem from '~/components/siswa/AktivitasItem.vue'

definePageMeta({ layout: 'siswa', middleware: 'auth-bff' })

const { user } = useAuth()
const { aktivitas, memuat, galat, pernahMuat, muat, progresFenomena, totalTahap, fenomenaSelesai, terakhir, tahapLanjut } = useProgresSiswa()

const namaDepan = computed(() => (user.value?.nama_lengkap || 'Teman').split(' ')[0])

onMounted(() => { void muat() })
</script>
