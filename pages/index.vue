<template>
  <div class="min-h-screen flex items-center justify-center">
    <p class="font-bold text-slate-400">Mengalihkan...</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'app' })
// Konsep baru: beranda -> halaman masuk/daftar
await navigateTo('/masuk', { replace: true })
</script>
