<template>
  <!-- Kepala halaman (struktur referensi Stitch: kartu hero + ubin ikon) -->
  <section class="kp-card p-5 relative overflow-hidden mb-5">
    <div class="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-pfixed/40 blur-xl pointer-events-none" aria-hidden="true" />
    <div class="flex items-start justify-between gap-3 relative">
      <div class="min-w-0">
        <h1 class="kp-section-title !text-2xl flex items-center gap-2">📖 Karya Saya
          <span class="material-symbols-outlined text-psky text-2xl" aria-hidden="true">draw</span>
        </h1>
        <p class="text-slate-500 font-semibold mt-1 text-sm md:text-base">Kumpulan pantun yang sudah kamu tulis. Hanya kamu (dan gurumu) yang bisa melihat.</p>
      </div>
      <div class="w-12 h-12 rounded-2xl bg-con flex items-center justify-center text-primary shrink-0">
        <span class="material-symbols-outlined text-3xl" aria-hidden="true">auto_stories</span>
      </div>
    </div>
    <p v-if="!loading && karya.length" class="mt-3 relative">
      <span class="pill bg-con text-onfixvar !px-3 !py-1 text-xs">{{ karya.length }} karya tersimpan</span>
    </p>
  </section>

  <div v-if="loading" class="text-center py-12 text-slate-400 font-bold">Memuat...</div>
  <div v-else-if="!karya.length" class="kp-card text-center py-12 px-4">
    <p class="text-5xl mb-3">📝</p>
    <p class="font-bold text-slate-500">Belum ada karya.</p>
    <NuxtLink to="/fenomena" class="kp-btn-primary mt-4">Mulai Berkreasi →</NuxtLink>
  </div>
  <div v-else class="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
    <article v-for="w in karya" :key="w.id" class="kp-card p-4">
      <div class="flex items-start gap-3">
        <img v-if="fenomenaDari(w.phenomenon_id)?.ilustrasi" :src="fenomenaDari(w.phenomenon_id)?.ilustrasi" :alt="namaFenomena(w.phenomenon_id)"
          class="w-16 h-16 rounded-2xl object-contain bg-conlow p-1.5 shrink-0" />
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2">
            <p class="font-display font-extrabold text-ink leading-tight">{{ namaFenomena(w.phenomenon_id) }}</p>
            <span class="text-[11px] font-bold text-slate-400 shrink-0">{{ formatTgl(w.created_at) }}</span>
          </div>
          <span v-if="w.is_final" class="pill bg-emerald-100 text-emerald-700 !px-2.5 !py-0.5 text-[11px] mt-1.5">✓ Final</span>
        </div>
      </div>
      <div class="bg-conlow rounded-xl p-4 mt-3 space-y-1">
        <p v-for="i in 4" :key="i" class="font-display font-semibold"
          :class="i <= 2 ? 'italic text-slate-600' : 'font-bold text-primary'">{{ w['larik' + i] }}</p>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { FENOMENA } from '~/data/fenomena'

definePageMeta({ layout: 'siswa', middleware: 'auth-bff' })

const karya = ref<any[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const r = await $fetch<{ data: { items: any[] } }>('/api/v1/works?limit=100')
    karya.value = r.data.items || []
  } catch {} finally { loading.value = false }
})

function namaFenomena(id: string) { return FENOMENA.find(f => f.id === id)?.nama || id }
function fenomenaDari(id: string) { return FENOMENA.find(f => f.id === id) }
function formatTgl(s: string) {
  try { return new Date(s).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) } catch { return '' }
}
</script>
