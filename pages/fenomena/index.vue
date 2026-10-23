<template>
  <div>
    <div class="mb-5">
      <h1 class="kp-section-title !text-2xl flex items-center gap-2"><span aria-hidden="true">🗺️</span> Pilih Petualangan Fenomena</h1>
      <p class="text-slate-500 font-semibold mt-1 text-sm md:text-base">Selesaikan tiap fenomena untuk membuka petualangan berpantun berikutnya!</p>
    </div>

    <div v-if="memuat && !pernahMuat" class="flex flex-col gap-4" aria-busy="true">
      <div v-for="i in 4" :key="i" class="kp-card p-4 flex gap-3.5">
        <div class="skeleton w-24 h-24 rounded-2xl shrink-0" />
        <div class="flex-1 space-y-2 py-1"><div class="skeleton h-4 rounded-full w-1/3" /><div class="skeleton h-5 rounded-full w-2/3" /><div class="skeleton h-4 rounded-full w-1/2" /></div>
      </div>
    </div>
    <div v-else class="flex flex-col gap-4">
      <FenomenaCard v-for="(f, i) in FENOMENA" :key="f.id" :fenomena="f" :progres="progresFenomena(f.id)" :terkunci="!fenomenaTerbuka(f.id)" :nomor="i + 1" :aktif="f.id === idAktif" />
    </div>

    <div class="mt-6 kp-card p-4 md:p-5">
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
// Fenomena aktif = fenomena pertama yang terbuka dan belum tuntas.
const idAktif = computed(() => FENOMENA.find(f => fenomenaTerbuka(f.id) && progresFenomena(f.id) < 5)?.id)

onMounted(() => { void muat() })
</script>
