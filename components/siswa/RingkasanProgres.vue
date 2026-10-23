<template>
  <div class="bg-panel rounded-[18px] p-4 flex flex-col gap-2">
    <div class="flex items-center justify-between gap-2">
      <div class="flex items-center gap-2 min-w-0">
        <span class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-sm shrink-0" aria-hidden="true">
          <span class="material-symbols-outlined text-[18px]">auto_stories</span>
        </span>
        <div class="min-w-0">
          <p class="font-display font-bold text-sm text-ink leading-tight">Petualangan Pantun</p>
          <p class="text-[13px] font-semibold text-slate-500 leading-tight">{{ fenomenaSelesai }} dari 8 Fenomena Tuntas</p>
        </div>
      </div>
      <span class="px-2.5 py-0.5 rounded-full bg-pfixed text-primary text-xs font-extrabold shrink-0">{{ persen }}%</span>
    </div>
    <div class="w-full bg-[#E4EFFF] h-2.5 rounded-full overflow-hidden">
      <div class="bg-emerald-500 h-full rounded-full transition-all duration-700" :style="{ width: persen + '%' }" />
    </div>
    <div class="flex items-center justify-between gap-2 pt-0.5">
      <span class="text-[13px] font-semibold text-slate-500 flex items-center gap-1">
        <span class="material-symbols-outlined text-[16px] text-amber-500">task_alt</span>
        <strong class="text-ink">{{ totalTahap }} / 40</strong> Tahap Selesai
      </span>
      <span class="text-[13px] font-bold text-primary text-right">{{ teksSemangat }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ fenomenaSelesai: number; totalTahap: number }>()
const persen = computed(() => Math.round(props.totalTahap / 40 * 100))
const teksSemangat = computed(() => {
  if (props.totalTahap >= 40) return 'Luar biasa, semua tuntas! 🎉'
  if (props.totalTahap > 0) return 'Hebat, lanjut terus!'
  return 'Ayo mulai petualanganmu!'
})
</script>
