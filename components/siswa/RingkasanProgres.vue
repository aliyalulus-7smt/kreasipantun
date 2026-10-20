<template>
  <div class="kp-card p-4 md:p-5">
    <div class="flex items-stretch gap-3 md:gap-4">
      <div class="flex-1 flex items-center gap-3 bg-amber-50 rounded-2xl px-4 py-3 border border-amber-100">
        <span class="text-3xl" aria-hidden="true">⭐</span>
        <div>
          <p class="font-display font-extrabold text-xl leading-none text-slate-800">{{ fenomenaSelesai }}<span class="text-slate-400 text-base">/8</span></p>
          <p class="text-xs font-bold text-slate-500 mt-1">Fenomena selesai</p>
        </div>
      </div>
      <div class="flex-1 flex items-center gap-3 bg-sky-50 rounded-2xl px-4 py-3 border border-sky-100">
        <span class="text-3xl" aria-hidden="true">🏅</span>
        <div>
          <p class="font-display font-extrabold text-xl leading-none text-slate-800">{{ totalTahap }}<span class="text-slate-400 text-base">/40</span></p>
          <p class="text-xs font-bold text-slate-500 mt-1">Tahap selesai</p>
        </div>
      </div>
      <NuxtLink to="/fenomena" class="hidden md:flex flex-1 items-center justify-between gap-2 bg-emerald-50 rounded-2xl px-4 py-3 border border-emerald-100 font-display font-bold text-emerald-700 hover:bg-emerald-100 transition">
        Lihat Detail Progres <span aria-hidden="true">→</span>
      </NuxtLink>
    </div>
    <NuxtLink to="/fenomena" class="md:hidden mt-3 flex items-center justify-center gap-2 font-display font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-2xl py-2.5">
      Lihat Detail Progres →
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
defineProps<{ fenomenaSelesai: number; totalTahap: number }>()
</script>
