<template>
  <div v-if="fenomena">
    <div class="mb-6 flex items-center justify-between">
      <NuxtLink to="/fenomena" class="btn-soft !px-4 !py-2 text-sm">← Semua Fenomena</NuxtLink>
      <span class="pill bg-slate-100 text-slate-600">{{ selesaiCount }}/5 tahap</span>
    </div>

    <div class="text-center mb-6">
      <p class="text-5xl mb-2">{{ fenomena.icon }}</p>
      <h1 class="page-title">{{ fenomena.nama }}</h1>
      <p class="page-sub">Pilih tahap mana pun — bebas urutan!</p>
    </div>

    <div class="space-y-3 max-w-2xl mx-auto">
      <NuxtLink v-for="(t, i) in DAFTAR_TAHAP" :key="t.id" :to="`/fenomena/${fenomena.id}/${t.id}`"
        class="card p-4 flex items-center gap-4 hover:border-sky-300 transition">
        <span :class="['w-10 h-10 rounded-2xl flex items-center justify-center font-bold',
          sudah(t.id) ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500']">
          {{ sudah(t.id) ? '✓' : (i + 1) }}
        </span>
        <div class="flex-1">
          <p class="font-display font-bold text-slate-700">{{ t.nama }}</p>
          <p class="text-xs font-semibold text-slate-400">{{ fenomena.tahap[t.id].judul }}</p>
        </div>
        <span class="text-slate-300">→</span>
      </NuxtLink>
    </div>
  </div>
  <div v-else class="text-center py-16">
    <p class="font-bold text-slate-500">Fenomena tidak ditemukan.</p>
    <NuxtLink to="/fenomena" class="btn-soft mt-4">← Kembali</NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { FENOMENA, DAFTAR_TAHAP, cariFenomena } from '~/data/fenomena'

definePageMeta({ layout: 'app', middleware: 'auth-bff' })

const route = useRoute()
const fenomena = computed(() => cariFenomena(String(route.params.id)))
const selesai = useState<Record<string, boolean>>('kp-tahap-selesai', () => ({}))

const sudah = (tahap: string) => !!selesai.value[`${route.params.id}:${tahap}`]
const selesaiCount = computed(() => DAFTAR_TAHAP.filter(t => sudah(t.id)).length)

// Tandai selesai saat komponen tahap emit
onMounted(() => {
  const h = (e: Event) => {
    const d = (e as CustomEvent).detail
    if (d?.phenomenon_id && d?.stage_id) {
      selesai.value[`${d.phenomenon_id}:${d.stage_id}`] = true
    }
  }
  window.addEventListener('kp-tahap-selesai', h)
  onUnmounted(() => window.removeEventListener('kp-tahap-selesai', h))
})
</script>
