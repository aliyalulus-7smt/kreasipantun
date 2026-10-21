<template>
  <component :is="terkunci ? 'div' : NuxtLink" :to="terkunci ? undefined : `/fenomena/${fenomena.id}`"
    :class="['kp-card overflow-hidden block transition duration-200',
      terkunci ? 'opacity-80' : 'hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(15,80,60,0.10)] active:scale-[0.98]']"
    :aria-label="terkunci ? `${fenomena.nama} (terkunci)` : fenomena.nama">
    <div :class="['relative bg-gradient-to-br h-24 md:h-28 flex items-center justify-center text-6xl md:text-7xl', gaya.tile, terkunci ? 'grayscale-[0.6]' : '']" aria-hidden="true">
      {{ fenomena.icon }}
      <span class="absolute top-2 left-2 w-6 h-6 rounded-full bg-white/90 text-slate-600 text-xs font-extrabold flex items-center justify-center shadow-sm">{{ nomor }}</span>
      <span v-if="terkunci" class="absolute top-2 right-2 w-7 h-7 rounded-full bg-slate-700/85 text-white text-sm flex items-center justify-center shadow" title="Terkunci">🔒</span>
      <span v-else-if="progres === 5" class="absolute top-2 right-2 w-7 h-7 rounded-full bg-emerald-500 text-white text-sm flex items-center justify-center shadow" title="Selesai">✓</span>
      <span v-else-if="progres > 0" class="absolute top-2 right-2 pill bg-white/90 text-amber-600 shadow-sm text-[10px]">Sedang jalan</span>
    </div>
    <div class="p-3.5">
      <p class="font-display font-bold text-sm md:text-[15px] leading-snug min-h-[2.5em]" :class="terkunci ? 'text-slate-500' : 'text-slate-800'">{{ fenomena.nama }}</p>
      <div class="flex items-center gap-2 mt-1">
        <div class="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
          <div :class="['h-full rounded-full transition-all', gaya.bar]" :style="{ width: (progres / 5 * 100) + '%' }" />
        </div>
        <span class="text-[11px] font-extrabold" :class="progres === 5 ? 'text-emerald-600' : 'text-slate-400'">{{ progres }}/5</span>
      </div>
      <p v-if="terkunci" class="text-[11px] font-bold text-slate-400 mt-1.5">Selesaikan fenomena sebelumnya dulu</p>
    </div>
  </component>
</template>

<script setup lang="ts">
import { NuxtLink } from '#components'
import type { Fenomena } from '~/data/fenomena'
import { GAYA_FENOMENA, GAYA_DEFAULT } from '~/utils/fenomena-ui'

const props = defineProps<{ fenomena: Fenomena; progres: number; terkunci?: boolean; nomor?: number }>()
const gaya = computed(() => GAYA_FENOMENA[props.fenomena.warna] || GAYA_DEFAULT)
</script>
