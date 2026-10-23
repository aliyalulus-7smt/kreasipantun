<template>
  <div class="relative min-h-screen flex flex-col bg-[#FFFBF3]">
    <!-- Blob warna lembut di latar (dekoratif, ala Stitch) -->
    <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      <div class="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-sky-400/10 blur-2xl" />
      <div class="absolute top-1/3 -right-20 w-64 h-64 rounded-full bg-amber-400/15 blur-3xl" />
      <div class="absolute bottom-24 -left-12 w-52 h-52 rounded-full bg-pink-400/10 blur-2xl" />
    </div>
    <SiswaHeader />
    <main class="relative z-10 flex-1 w-full max-w-5xl mx-auto px-4 pt-5 pb-28 md:pt-8">
      <slot />
    </main>
    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import SiswaHeader from '~/components/siswa/SiswaHeader.vue'
import BottomNav from '~/components/siswa/BottomNav.vue'
</script>
