<template>
  <nav class="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl shadow-[0_-4px_20px_rgba(31,42,55,0.06)]"
    style="padding-bottom: env(safe-area-inset-bottom)">
    <div class="flex justify-around items-center h-16 px-1 max-w-md mx-auto">
      <NuxtLink v-for="m in menu" :key="m.to" :to="m.to"
        class="flex flex-col items-center justify-center gap-0.5 min-w-[70px] h-12 rounded-2xl transition-all"
        :class="aktif(m.to) ? 'text-primary bg-pfixed/50 font-bold scale-[1.02]' : 'text-onvariant'">
        <span class="material-symbols-outlined text-[24px] leading-none" aria-hidden="true">{{ m.simbol }}</span>
        <span class="text-xs font-bold">{{ m.label }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
const route = useRoute()
const menu = [
  { to: '/beranda', label: 'Beranda', simbol: 'cottage' },
  { to: '/fenomena', label: 'Fenomena', simbol: 'explore' },
  { to: '/karya', label: 'Karya', simbol: 'history_edu' },
  { to: '/profil', label: 'Profil', simbol: 'face_6' },
]
function aktif(to: string) {
  return route.path === to || route.path.startsWith(to + '/')
}
</script>
