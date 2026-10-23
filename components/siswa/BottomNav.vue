<template>
  <nav class="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur shadow-[0_-4px_16px_rgba(31,42,55,0.05)]"
    style="padding-bottom: env(safe-area-inset-bottom)">
    <div class="max-w-lg mx-auto grid grid-cols-4">
      <NuxtLink v-for="m in menu" :key="m.to" :to="m.to"
        class="flex flex-col items-center gap-0.5 py-2.5 min-h-[60px] justify-center transition active:scale-95"
        :class="aktif(m.to) ? 'text-primary' : 'text-slate-400'">
        <span :class="['px-4 py-0.5 rounded-full transition flex items-center justify-center', aktif(m.to) ? 'bg-pfixed' : '']" aria-hidden="true">
          <span class="material-symbols-outlined text-[24px] leading-none">{{ m.simbol }}</span>
        </span>
        <span class="text-[11px] font-display font-bold">{{ m.label }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
const route = useRoute()
const menu = [
  { to: '/beranda', label: 'Beranda', simbol: 'home' },
  { to: '/fenomena', label: 'Fenomena', simbol: 'explore' },
  { to: '/karya', label: 'Karya', simbol: 'menu_book' },
  { to: '/profil', label: 'Profil', simbol: 'person' },
]
function aktif(to: string) {
  return route.path === to || route.path.startsWith(to + '/')
}
</script>
