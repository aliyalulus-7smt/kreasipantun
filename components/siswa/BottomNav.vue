<template>
  <nav class="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-slate-200/80 shadow-[0_-6px_20px_rgba(0,0,0,0.05)]"
    style="padding-bottom: env(safe-area-inset-bottom)">
    <div class="max-w-lg mx-auto grid grid-cols-4">
      <NuxtLink v-for="m in menu" :key="m.to" :to="m.to"
        class="flex flex-col items-center gap-0.5 py-2.5 min-h-[60px] justify-center transition active:scale-95"
        :class="aktif(m.to) ? 'text-[#0e7a4f]' : 'text-slate-400'">
        <span :class="['text-[22px] leading-none px-4 py-0.5 rounded-full transition', aktif(m.to) ? 'bg-emerald-100' : '']" aria-hidden="true">{{ m.icon }}</span>
        <span class="text-[11px] font-display font-bold">{{ m.label }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
const route = useRoute()
const menu = [
  { to: '/beranda', label: 'Beranda', icon: '🏠' },
  { to: '/fenomena', label: 'Fenomena', icon: '🧩' },
  { to: '/karya', label: 'Karya Saya', icon: '📖' },
  { to: '/profil', label: 'Profil', icon: '👤' },
]
function aktif(to: string) {
  return route.path === to || route.path.startsWith(to + '/')
}
</script>
