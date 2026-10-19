<template>
  <div class="mb-6">
    <h1 class="page-title">🌟 Pilih Fenomena</h1>
    <p class="page-sub">Bebas pilih urutan — kerjakan yang paling menarik dulu!</p>
  </div>

  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
    <NuxtLink v-for="f in FENOMENA" :key="f.id" :to="`/fenomena/${f.id}`"
      class="card p-5 text-center hover:scale-[1.03] transition cursor-pointer">
      <p class="text-4xl mb-2">{{ f.icon }}</p>
      <p class="font-display font-bold text-slate-700 text-sm">{{ f.nama }}</p>
      <p class="text-xs font-bold mt-1.5" :class="progres(f.id) === 5 ? 'text-emerald-600' : 'text-slate-400'">
        {{ progres(f.id) }}/5 tahap
      </p>
      <div class="h-1.5 rounded-full bg-slate-100 mt-2 overflow-hidden">
        <div class="h-full rounded-full bg-emerald-400 transition-all" :style="{ width: (progres(f.id) / 5 * 100) + '%' }" />
      </div>
    </NuxtLink>
  </div>

  <div class="text-center mt-8">
    <NuxtLink to="/karya" class="btn-soft">🖼️ Galeri Karyaku</NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { FENOMENA } from '~/data/fenomena'

definePageMeta({ layout: 'app', middleware: 'auth-bff' })

const selesai = useState<Record<string, boolean>>('kp-tahap-selesai', () => ({}))

function progres(fid: string): number {
  return ['kenali', 'eksplorasi', 'ekspresikan', 'asah', 'evaluasi']
    .filter(t => selesai.value[`${fid}:${t}`]).length
}

// Muat status dari server saat buka
onMounted(async () => {
  try {
    const r = await $fetch<{ data: { changes: any[] } }>('/api/v1/sync/pull', { method: 'POST', body: { limit: 500 } })
    for (const c of r.data.changes) {
      selesai.value[`${c.phenomenon_id}:${c.stage_id}`] = true
    }
  } catch {}
})
</script>
