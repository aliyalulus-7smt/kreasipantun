<template>
  <div class="space-y-5">
    <!-- Hero sapaan + snapshot progres -->
    <section class="kp-card relative overflow-hidden px-5 py-5 md:px-6">
      <div class="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-pfixed/40 blur-2xl pointer-events-none" aria-hidden="true" />
      <div class="absolute -left-6 -bottom-6 w-28 h-28 rounded-full bg-amber-400/15 blur-xl pointer-events-none" aria-hidden="true" />
      <div class="relative">
        <h1 class="font-display font-extrabold text-2xl md:text-3xl text-ink leading-tight">
          Halo, {{ namaDepan }}! 👋
        </h1>
        <p class="font-semibold text-slate-500 mt-1 text-sm md:text-base flex items-center gap-1.5">
          <span class="inline-block w-2 h-2 rounded-full bg-emerald-500 shrink-0" aria-hidden="true" />
          Siswa Aktif
        </p>
        <div class="mt-4">
          <RingkasanProgres :fenomena-selesai="fenomenaSelesai" :total-tahap="totalTahap" />
        </div>
      </div>
    </section>

    <!-- Loading -->
    <div v-if="memuat && !pernahMuat" class="space-y-4" aria-busy="true">
      <div class="kp-card p-5"><div class="skeleton h-28 rounded-2xl" /></div>
      <div v-for="i in 4" :key="i" class="kp-card p-4 flex gap-3.5">
        <div class="skeleton w-24 h-24 rounded-2xl shrink-0" />
        <div class="flex-1 space-y-2 py-1"><div class="skeleton h-4 rounded-full w-1/3" /><div class="skeleton h-5 rounded-full w-2/3" /><div class="skeleton h-4 rounded-full w-1/2" /></div>
      </div>
    </div>

    <template v-else>
      <!-- Error tarik data (data lokal tetap tampil bila ada) -->
      <div v-if="galat" class="rounded-2xl bg-rose-50 border border-rose-100 px-4 py-3 flex items-center justify-between gap-3">
        <p class="text-sm font-bold text-rose-600">Sebagian data belum bisa dimuat dari server.</p>
        <button @click="muat" class="text-sm font-display font-bold text-rose-700 underline shrink-0">Coba lagi</button>
      </div>

      <!-- Pilih fenomena -->
      <section>
        <div class="mb-3">
          <h2 class="kp-section-title !text-[22px] flex items-center gap-2"><span aria-hidden="true">🗺️</span> Pilih Petualangan Fenomena</h2>
          <p class="text-sm font-semibold text-slate-500 mt-1">Selesaikan tiap fenomena untuk membuka petualangan berpantun berikutnya!</p>
        </div>
        <div class="flex flex-col gap-4">
          <FenomenaCard v-for="(f, i) in FENOMENA" :key="f.id" :fenomena="f" :progres="progresFenomena(f.id)" :terkunci="!fenomenaTerbuka(f.id)" :nomor="i + 1" :aktif="f.id === idAktif" />
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
import FenomenaCard from '~/components/siswa/FenomenaCard.vue'
import AktivitasItem from '~/components/siswa/AktivitasItem.vue'

definePageMeta({ layout: 'siswa', middleware: 'auth-bff' })

const { user } = useAuth()
const { aktivitas, memuat, galat, pernahMuat, muat, progresFenomena, totalTahap, fenomenaSelesai, fenomenaTerbuka } = useProgresSiswa()

const namaDepan = computed(() => (user.value?.nama_lengkap || 'Teman').split(' ')[0])
// Fenomena aktif = fenomena pertama yang terbuka dan belum tuntas.
const idAktif = computed(() => FENOMENA.find(f => fenomenaTerbuka(f.id) && progresFenomena(f.id) < 5)?.id)

onMounted(() => { void muat() })
</script>
