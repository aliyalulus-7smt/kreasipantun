<template>
  <div class="min-h-screen flex flex-col bg-[#fff9ef]">
    <SiswaHeader />
    <main class="flex-1 w-full max-w-5xl mx-auto px-4 pt-5 pb-28 md:pt-8">
      <slot />
    </main>
    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import SiswaHeader from '~/components/siswa/SiswaHeader.vue'
import BottomNav from '~/components/siswa/BottomNav.vue'
</script>
