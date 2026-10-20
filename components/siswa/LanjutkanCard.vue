<template>
  <div class="kp-card p-4 md:p-5">
    <div class="flex items-center justify-between mb-3">
      <h2 class="kp-section-title flex items-center gap-2"><span aria-hidden="true">▶️</span> Lanjutkan Belajar</h2>
      <NuxtLink v-if="fenomena" :to="tujuan" class="pill bg-emerald-100 text-emerald-700 font-display">Lanjutkan →</NuxtLink>
    </div>

    <div v-if="fenomena" class="flex gap-4 items-center">
      <div :class="['w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-gradient-to-br flex items-center justify-center text-5xl md:text-6xl shrink-0', gaya.tile]" aria-hidden="true">
        {{ fenomena.icon }}
      </div>
      <div class="min-w-0 flex-1">
        <p :class="['text-[11px] font-extrabold uppercase tracking-wide', gaya.teks]">Fenomena</p>
        <p class="font-display font-extrabold text-lg md:text-xl text-slate-800 leading-tight truncate">{{ fenomena.nama }}</p>
        <p class="text-sm font-semibold text-slate-500 mt-0.5">
          Terakhir dikerjakan: <span class="text-slate-700 font-bold">{{ namaTahapTerakhir }}</span>
        </p>
        <div class="flex items-center gap-2 mt-2.5">
          <div class="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden">
            <div :class="['h-full rounded-full transition-all', gaya.bar]" :style="{ width: (progres / 5 * 100) + '%' }" />
          </div>
          <span class="text-xs font-extrabold text-slate-500">{{ progres }}/5 tahap</span>
        </div>
      </div>
    </div>

    <!-- Empty state: belum ada aktivitas -->
    <div v-else class="text-center py-4">
      <p class="text-4xl mb-2" aria-hidden="true">🚀</p>
      <p class="font-display font-bold text-slate-700">Kamu belum mulai belajar</p>
      <p class="text-sm font-semibold text-slate-400 mt-1 mb-4">Pilih fenomena favoritmu dan mulai petualangan pantunmu!</p>
      <NuxtLink to="/fenomena" class="kp-btn-primary !px-5 !py-2.5 text-sm">Mulai Belajar</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FENOMENA, DAFTAR_TAHAP, type Fenomena } from '~/data/fenomena'
import { GAYA_FENOMENA, GAYA_DEFAULT } from '~/utils/fenomena-ui'
import type { AktivitasTerbaru } from '~/composables/useProgresSiswa'

const props = defineProps<{ terakhir: AktivitasTerbaru | null; progres: number; tahapLanjut: string | null }>()

const fenomena = computed<Fenomena | null>(() =>
  props.terakhir ? FENOMENA.find(f => f.id === props.terakhir!.phenomenon_id) || null : null)
const gaya = computed(() => (fenomena.value ? GAYA_FENOMENA[fenomena.value.warna] || GAYA_DEFAULT : GAYA_DEFAULT))
const namaTahapTerakhir = computed(() =>
  DAFTAR_TAHAP.find(t => t.id === props.terakhir?.stage_id)?.nama || '')
const tujuan = computed(() => {
  if (!fenomena.value) return '/fenomena'
  return props.tahapLanjut
    ? `/fenomena/${fenomena.value.id}/${props.tahapLanjut}`
    : `/fenomena/${fenomena.value.id}`
})
</script>
