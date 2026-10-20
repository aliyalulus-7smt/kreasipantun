<template>
  <NuxtLink :to="`/fenomena/${item.phenomenon_id}/${item.stage_id}`"
    class="flex items-center gap-3 py-3 px-2 -mx-2 rounded-2xl hover:bg-amber-50/70 transition">
    <span :class="['w-11 h-11 rounded-2xl bg-gradient-to-br flex items-center justify-center text-xl shrink-0', gaya.tile]" aria-hidden="true">
      {{ ikon }}
    </span>
    <span class="flex-1 min-w-0">
      <span class="block font-bold text-sm text-slate-700 truncate">{{ namaTahap }} <span class="text-slate-400 font-semibold">({{ namaFenomena }})</span></span>
      <span class="block text-xs font-semibold text-slate-400 mt-0.5">{{ waktuRamah(item.waktu) }}</span>
    </span>
    <span :class="['pill text-[10px] shrink-0', kelasStatus]">{{ labelStatus }}</span>
    <span class="text-slate-300 shrink-0" aria-hidden="true">›</span>
  </NuxtLink>
</template>

<script setup lang="ts">
import { FENOMENA, DAFTAR_TAHAP } from '~/data/fenomena'
import { GAYA_FENOMENA, GAYA_DEFAULT, IKON_TAHAP, waktuRamah } from '~/utils/fenomena-ui'
import type { AktivitasTerbaru } from '~/composables/useProgresSiswa'

const props = defineProps<{ item: AktivitasTerbaru }>()

const fenomena = computed(() => FENOMENA.find(f => f.id === props.item.phenomenon_id))
const gaya = computed(() => (fenomena.value ? GAYA_FENOMENA[fenomena.value.warna] || GAYA_DEFAULT : GAYA_DEFAULT))
const ikon = computed(() => IKON_TAHAP[props.item.stage_id] || fenomena.value?.icon || '📝')
const namaTahap = computed(() => DAFTAR_TAHAP.find(t => t.id === props.item.stage_id)?.nama || props.item.stage_id)
const namaFenomena = computed(() => fenomena.value?.nama || props.item.phenomenon_id)

const labelStatus = computed(() => ({
  tersinkron: 'Tersinkron',
  menunggu: 'Menunggu sinkron',
  perangkat: 'Di perangkat',
}[props.item.status]))
const kelasStatus = computed(() => ({
  tersinkron: 'bg-emerald-100 text-emerald-700',
  menunggu: 'bg-amber-100 text-amber-700',
  perangkat: 'bg-slate-100 text-slate-500',
}[props.item.status]))
</script>
