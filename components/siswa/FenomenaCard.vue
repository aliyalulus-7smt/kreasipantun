<template>
  <component :is="terkunci ? 'div' : NuxtLink" :to="terkunci ? undefined : `/fenomena/${fenomena.id}`"
    :class="['kp-card block p-4 transition duration-200',
      terkunci ? '' : 'hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(31,42,55,0.12)] active:scale-[0.99]']"
    :aria-label="terkunci ? `${fenomena.nama} (terkunci)` : fenomena.nama">
    <div class="flex gap-3.5">
      <!-- Ilustrasi persegi -->
      <div class="relative w-24 h-24 rounded-2xl shrink-0 overflow-hidden shadow-sm" :style="{ backgroundColor: hex + '26' }">
        <img :src="fenomena.ilustrasi" :alt="`Ilustrasi ${fenomena.nama}`" loading="lazy"
          :class="['w-full h-full object-cover', terkunci ? 'grayscale opacity-70' : '']" />
        <span v-if="progres === 5" class="absolute top-1 left-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow" title="Tuntas">
          <span class="material-symbols-outlined text-[16px]">check</span>
        </span>
        <span v-else-if="terkunci" class="absolute inset-0 flex items-center justify-center" title="Terkunci">
          <span class="w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center text-base">🔒</span>
        </span>
        <span v-else-if="aktif" class="absolute top-1 left-1 pill !px-2 !py-0.5 text-[10px] text-white shadow" :style="{ backgroundColor: hex }">Aktif</span>
      </div>

      <!-- Konten -->
      <div class="flex-1 min-w-0 flex flex-col">
        <div class="flex items-start justify-between gap-2">
          <span class="text-[11px] font-extrabold uppercase tracking-wide" :style="{ color: hex }">Fenomena {{ nomor }}</span>
          <span v-if="progres === 5" class="pill !px-2 !py-0.5 bg-emerald-100 text-emerald-700 shrink-0">✓ Tuntas</span>
          <span v-else-if="terkunci" class="pill !px-2 !py-0.5 bg-slate-100 text-slate-500 shrink-0">🔒 Terkunci</span>
          <span v-else-if="progres > 0" class="pill !px-2 !py-0.5 bg-pfixed text-primary shrink-0">Sedang jalan</span>
        </div>
        <h3 class="font-display font-bold text-base md:text-lg leading-tight truncate" :class="terkunci ? 'text-slate-500' : 'text-ink'">{{ fenomena.nama }}</h3>
        <p class="text-[13px] font-semibold text-slate-500 leading-snug mt-0.5">{{ fenomena.tagline }}</p>

        <div class="mt-auto pt-2.5">
          <div v-if="progres === 5" class="flex items-center justify-between">
            <span class="flex items-center gap-1 text-emerald-600 text-xs font-bold">
              <span class="material-symbols-outlined text-[16px]">emoji_events</span> Hasil Karya
            </span>
            <span class="px-3 py-1.5 rounded-xl bg-panel text-primary font-display font-bold text-sm">Lihat Hasil 🌟</span>
          </div>
          <div v-else>
            <div class="flex items-center gap-2">
              <span class="flex items-center gap-1" aria-hidden="true">
                <span v-for="i in 5" :key="i" :class="['w-2.5 h-2.5 rounded-full', i <= progres ? gaya.bar : 'bg-slate-200']" />
              </span>
              <span class="text-[11px] font-extrabold" :class="progres ? 'text-slate-500' : 'text-slate-400'">{{ progres }}/5 Tahap</span>
            </div>
            <p v-if="terkunci" class="text-[11px] font-bold text-slate-400 mt-1">Selesaikan fenomena sebelumnya dulu</p>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA untuk fenomena aktif -->
    <span v-if="aktif && !terkunci && progres < 5"
      class="mt-3.5 flex w-full items-center justify-center gap-2 rounded-2xl bg-psky text-white font-display font-bold text-base py-3 shadow-lg shadow-sky-200">
      Lanjutkan Tahap 🚀
    </span>
  </component>
</template>

<script setup lang="ts">
import { NuxtLink } from '#components'
import type { Fenomena } from '~/data/fenomena'
import { GAYA_FENOMENA, GAYA_DEFAULT, HEX_FENOMENA } from '~/utils/fenomena-ui'

const props = defineProps<{ fenomena: Fenomena; progres: number; terkunci?: boolean; nomor?: number; aktif?: boolean }>()
const gaya = computed(() => GAYA_FENOMENA[props.fenomena.warna] || GAYA_DEFAULT)
const hex = computed(() => HEX_FENOMENA[props.fenomena.warna] || '#38BDF8')
</script>
