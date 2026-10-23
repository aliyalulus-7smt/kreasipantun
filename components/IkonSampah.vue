<!-- Ikon SVG barang pilah sampah (Eksplorasi Cinta Lingkungan).
     Digambar sederhana & berwarna agar anak mengenali barangnya. -->
<template>
  <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <!-- Kantong plastik: kantong kresek putih dengan simpul di atas -->
    <template v-if="nama === 'kantong-plastik'">
      <path d="M18 6c1 3 11 3 12 0l-1 5h-10L18 6Z" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2" stroke-linejoin="round" />
      <path d="M15 11h18l3 27a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4l3-27Z" fill="#f1f5f9" stroke="#94a3b8" stroke-width="2" stroke-linejoin="round" />
      <path d="M19 20c2 6 2 10 0 16M29 20c-2 6-2 10 0 16" stroke="#cbd5e1" stroke-width="2" stroke-linecap="round" />
    </template>
    <!-- Kulit pisang: kulit terkelupas dengan buah di tengah -->
    <template v-else-if="nama === 'kulit-pisang'">
      <path d="M24 8c2 6 1 10-1 14h2c-1-4-1-8 0-14Z" fill="#fde68a" stroke="#d97706" stroke-width="2" stroke-linejoin="round" />
      <path d="M23 20C16 16 10 18 6 26c7 2 13 0 17-3v-3ZM25 20c7-4 13-2 17 6-7 2-13 0-17-3v-3Z" fill="#fcd34d" stroke="#d97706" stroke-width="2" stroke-linejoin="round" />
      <path d="M24 22c-1 8-4 13-9 18 6 1 12-2 15-8 2-4 1-8-1-10h-5Z" fill="#fbbf24" stroke="#d97706" stroke-width="2" stroke-linejoin="round" />
    </template>
    <!-- Sisa nasi: mangkuk berisi nasi -->
    <template v-else-if="nama === 'sisa-nasi'">
      <path d="M14 24c1-6 5-9 10-9s9 3 10 9c-3-2-6-1-8 1-2-2-4-3-6-2-2 1-4 1-6 1Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" stroke-linejoin="round" />
      <path d="M8 24h32c0 9-6 16-14 16h-4C14 40 8 33 8 24Z" fill="#38bdf8" stroke="#0284c7" stroke-width="2" stroke-linejoin="round" />
      <path d="M16 30c3 3 13 3 16 0" stroke="#bae6fd" stroke-width="2" stroke-linecap="round" />
    </template>
    <!-- Botol plastik: botol minuman dengan tutup biru -->
    <template v-else-if="nama === 'botol-plastik'">
      <rect x="20" y="4" width="8" height="5" rx="1.5" fill="#38bdf8" stroke="#0284c7" stroke-width="2" />
      <path d="M20 9h8v5c4 2 6 5 6 10v14a5 5 0 0 1-5 5h-10a5 5 0 0 1-5-5V24c0-5 2-8 6-10V9Z" fill="#e0f2fe" stroke="#0284c7" stroke-width="2" stroke-linejoin="round" />
      <path d="M14 28h20M14 34h20" stroke="#7dd3fc" stroke-width="2" />
    </template>
    <!-- Daun kering: daun cokelat dengan tulang daun -->
    <template v-else-if="nama === 'daun-kering'">
      <path d="M36 6C20 8 10 18 9 34c-1 4 1 6 3 7 2 1 5 0 8-1 12-4 18-16 16-34Z" fill="#d97706" stroke="#92400e" stroke-width="2" stroke-linejoin="round" />
      <path d="M13 37C19 27 27 18 35 10M20 30l6 1M24 23l6 1M17 34l5 1" stroke="#92400e" stroke-width="2" stroke-linecap="round" />
      <path d="M12 41c-2 2-4 3-6 3 1-2 2-4 4-6" fill="#b45309" stroke="#92400e" stroke-width="2" stroke-linejoin="round" />
    </template>
    <!-- Kaleng bekas: kaleng dengan garis tutup -->
    <template v-else-if="nama === 'kaleng-bekas'">
      <ellipse cx="24" cy="9" rx="11" ry="3.5" fill="#e2e8f0" stroke="#64748b" stroke-width="2" />
      <path d="M13 9v26c0 2 5 3.5 11 3.5s11-1.5 11-3.5V9" fill="#cbd5e1" stroke="#64748b" stroke-width="2" stroke-linejoin="round" />
      <path d="M13 20c6 2 16 2 22 0v8c-6 2-16 2-22 0v-8Z" fill="#f87171" />
      <ellipse cx="24" cy="9" rx="5" ry="1.6" fill="#f1f5f9" stroke="#64748b" stroke-width="1.5" />
    </template>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ nama: string }>()
</script>
