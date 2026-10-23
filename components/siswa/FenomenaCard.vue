<template>
  <component :is="terkunci ? 'div' : NuxtLink" :to="terkunci ? undefined : `/fenomena/${fenomena.id}`"
    :class="['block p-4 rounded-[20px] relative overflow-hidden transition-all duration-200',
      terkunci ? 'bg-white/80 shadow-[0_4px_16px_rgba(31,42,55,0.04)]'
        : 'bg-white shadow-[0_8px_24px_rgba(31,42,55,0.06)] hover:-translate-y-0.5 active:scale-[0.99]']"
    :style="aktif && !terkunci ? { boxShadow: `0 12px 28px ${hex}38` } : {}"
    :aria-label="terkunci ? `${fenomena.nama} (terkunci)` : fenomena.nama">
    <!-- Cahaya ambient untuk kartu aktif -->
    <div v-if="aktif && !terkunci" class="absolute -right-12 -top-12 w-32 h-32 rounded-full blur-2xl pointer-events-none" :style="{ backgroundColor: hex + '33' }" aria-hidden="true" />
    <div class="flex gap-3.5 relative">
      <!-- Ilustrasi persegi -->
      <div class="relative w-24 h-24 rounded-[16px] shrink-0 overflow-hidden shadow-sm" :style="{ backgroundColor: hex + '26' }">
        <img :src="fenomena.ilustrasi" :alt="`Ilustrasi ${fenomena.nama}`" loading="lazy"
          :class="['w-full h-full object-cover', terkunci ? 'grayscale-[40%] opacity-80' : '']" />
        <span v-if="progres === 5" class="absolute top-1 left-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow" title="Tuntas">
          <span class="material-symbols-outlined text-[16px]">check</span>
        </span>
        <span v-else-if="terkunci" class="absolute inset-0 bg-inverse/20 backdrop-blur-[1px] flex items-center justify-center" title="Terkunci">
          <span class="w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center text-slate-500">
            <span class="material-symbols-outlined text-[18px]">lock</span>
          </span>
        </span>
        <span v-else-if="aktif" class="absolute top-1 left-1 pill !px-2 !py-0.5 text-[10px] text-white shadow" :style="{ backgroundColor: hex }">Aktif</span>
      </div>

      <!-- Konten -->
      <div class="flex-1 min-w-0 flex flex-col">
        <div class="flex items-start justify-between gap-2">
          <span class="text-[11px] font-extrabold uppercase tracking-wide" :class="terkunci ? 'text-slate-400' : ''" :style="terkunci ? {} : { color: hex }">Fenomena {{ nomor }}</span>
          <span v-if="progres === 5" class="pill !px-2 !py-0.5 bg-emerald-500/15 text-emerald-600 shrink-0">
            <span class="material-symbols-outlined text-[13px]">verified</span> Tuntas
          </span>
          <span v-else-if="terkunci" class="pill !px-2 !py-0.5 bg-con text-onvariant shrink-0">
            <span class="material-symbols-outlined text-[13px]">lock</span> Terkunci
          </span>
          <span v-else-if="progres > 0" class="pill !px-2 !py-0.5 bg-pfixed text-primary shrink-0">Sedang jalan</span>
        </div>
        <h3 class="font-display font-bold text-base md:text-lg leading-tight truncate" :class="terkunci ? 'text-slate-500' : 'text-ink'">{{ fenomena.nama }}</h3>
        <p class="text-[13px] font-semibold text-slate-500 leading-snug mt-0.5">{{ fenomena.tagline }}</p>

        <div class="mt-auto pt-2.5">
          <div v-if="progres === 5" class="flex items-center justify-between">
            <span class="flex items-center gap-1 text-emerald-600 text-xs font-bold">
              <span class="material-symbols-outlined text-[16px]">emoji_events</span> Hasil Karya
            </span>
            <span class="px-3.5 py-1.5 rounded-xl bg-conhigh text-primary font-display font-bold text-sm shadow-sm">Lihat Hasil 🌟</span>
          </div>
          <div v-else-if="terkunci">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-con text-onvariant text-xs font-bold">
              <span class="material-symbols-outlined text-[14px] text-[#F59E0B]">lock_clock</span>
              Selesaikan fenomena sebelumnya dulu
            </span>
          </div>
          <div v-else>
            <div class="flex items-center gap-2">
              <span class="flex items-center gap-1.5" aria-hidden="true">
                <span v-for="i in 5" :key="i"
                  :class="i <= progres ? ['w-3.5 h-1.5 rounded-full', gaya.bar] : (aktif && i === progres + 1 ? ['w-3.5 h-1.5 rounded-full animate-pulse', gaya.bar] : 'w-1.5 h-1.5 rounded-full bg-convariant')" />
              </span>
              <span class="text-[11px] font-extrabold" :class="progres ? 'text-slate-500' : 'text-slate-400'">{{ progres }}/5 Tahap</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA untuk fenomena aktif -->
    <span v-if="aktif && !terkunci && progres < 5"
      class="mt-3.5 relative flex w-full h-12 items-center justify-center gap-2 rounded-[16px] bg-gradient-to-r from-psky-light to-psky text-white font-display font-bold text-base shadow-[0_4px_14px_rgba(14,165,233,0.35)]">
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
