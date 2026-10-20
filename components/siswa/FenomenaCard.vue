<template>
  <NuxtLink :to="`/fenomena/${fenomena.id}`"
    class="kp-card overflow-hidden block hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(15,80,60,0.10)] transition duration-200 active:scale-[0.98]">
    <div :class="['relative bg-gradient-to-br h-24 md:h-28 flex items-center justify-center text-6xl md:text-7xl', gaya.tile]" aria-hidden="true">
      {{ fenomena.icon }}
      <span v-if="progres === 5" class="absolute top-2 right-2 w-7 h-7 rounded-full bg-emerald-500 text-white text-sm flex items-center justify-center shadow" title="Selesai">✓</span>
      <span v-else-if="progres > 0" class="absolute top-2 right-2 pill bg-white/90 text-amber-600 shadow-sm text-[10px]">Sedang jalan</span>
    </div>
    <div class="p-3.5">
      <p class="font-display font-bold text-slate-800 text-sm md:text-[15px] leading-snug min-h-[2.5em]">{{ fenomena.nama }}</p>
      <div class="flex items-center gap-2 mt-1">
        <div class="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
          <div :class="['h-full rounded-full transition-all', gaya.bar]" :style="{ width: (progres / 5 * 100) + '%' }" />
        </div>
        <span class="text-[11px] font-extrabold" :class="progres === 5 ? 'text-emerald-600' : 'text-slate-400'">{{ progres }}/5</span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Fenomena } from '~/data/fenomena'
import { GAYA_FENOMENA, GAYA_DEFAULT } from '~/utils/fenomena-ui'

const props = defineProps<{ fenomena: Fenomena; progres: number }>()
const gaya = computed(() => GAYA_FENOMENA[props.fenomena.warna] || GAYA_DEFAULT)
</script>
