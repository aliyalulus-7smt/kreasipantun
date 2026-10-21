<template>
  <div>
    <div class="mb-5">
      <h1 class="kp-section-title !text-2xl flex items-center gap-2"><span aria-hidden="true">🧩</span> Pilih Fenomena</h1>
      <p class="text-slate-500 font-semibold mt-1 text-sm md:text-base">Kerjakan satu per satu secara berurutan, mulai dari nomor 1. Fenomena berikutnya terbuka setelah yang sebelumnya selesai semua tahapnya.</p>
    </div>

    <div v-if="memuat && !pernahMuat" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4" aria-busy="true">
      <div v-for="i in 8" :key="i" class="kp-card p-3"><div class="skeleton h-24 rounded-2xl mb-3" /><div class="skeleton h-4 rounded-full" /></div>
    </div>
    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
      <FenomenaCard v-for="(f, i) in FENOMENA" :key="f.id" :fenomena="f" :progres="progresFenomena(f.id)" :terkunci="!fenomenaTerbuka(f.id)" :nomor="i + 1" />
    </div>

    <div class="mt-6">
      <RingkasanProgres :fenomena-selesai="fenomenaSelesai" :total-tahap="totalTahap" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { FENOMENA } from '~/data/fenomena'
import FenomenaCard from '~/components/siswa/FenomenaCard.vue'
import RingkasanProgres from '~/components/siswa/RingkasanProgres.vue'

definePageMeta({ layout: 'siswa', middleware: 'auth-bff' })

const { memuat, pernahMuat, muat, progresFenomena, totalTahap, fenomenaSelesai, fenomenaTerbuka } = useProgresSiswa()

onMounted(() => { void muat() })
</script>
