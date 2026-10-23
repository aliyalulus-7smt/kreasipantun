<template>
  <div class="mb-6">
    <h1 class="kp-section-title !text-2xl">📖 Karya Saya</h1>
    <p class="text-slate-500 font-semibold mt-1 text-sm md:text-base">Kumpulan pantun yang sudah kamu tulis. Hanya kamu (dan gurumu) yang bisa melihat.</p>
  </div>

  <div v-if="loading" class="text-center py-12 text-slate-400 font-bold">Memuat...</div>
  <div v-else-if="!karya.length" class="kp-card text-center py-12 px-4">
    <p class="text-5xl mb-3">📝</p>
    <p class="font-bold text-slate-500">Belum ada karya.</p>
    <NuxtLink to="/fenomena" class="kp-btn-primary mt-4">Mulai Berkreasi →</NuxtLink>
  </div>
  <div v-else class="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
    <div v-for="w in karya" :key="w.id" class="kp-card p-5">
      <p class="text-xs font-bold text-primary mb-2">{{ namaFenomena(w.phenomenon_id) }} · {{ formatTgl(w.created_at) }}</p>
      <div class="bg-panel rounded-xl p-4 space-y-1">
        <p v-for="i in 4" :key="i" class="font-display font-semibold text-slate-700">{{ w['larik' + i] }}</p>
      </div>
      <span v-if="w.is_final" class="pill bg-emerald-100 text-emerald-700 !px-3 !py-1 text-xs mt-3 inline-block">✓ Final</span>
    </div>
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
function formatTgl(s: string) {
  try { return new Date(s).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) } catch { return '' }
}
</script>
