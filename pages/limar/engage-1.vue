<template>
  <div class="mb-6">
    <span class="pill bg-emerald-100 text-emerald-700">ENGAGE — Kenali Fenomena</span>
    <span class="float-right pill bg-amber-100 text-amber-700">1 dari 2</span>
  </div>

  <div class="text-center mb-6">
    <h1 class="page-title">🔍 Amati Fenomenanya!</h1>
    <p class="page-sub">Perhatikan gambar berikut dengan saksama, lalu jawab pertanyaan pemantiknya.</p>
  </div>

  <div class="max-w-2xl mx-auto space-y-5">
    <!-- Gambar fenomena -->
    <div class="card p-6 text-center">
      <img src="/img/bersih-sekolah.png" alt="Siswa bergotong royong membersihkan lingkungan sekolah" loading="lazy"
        class="rounded-2xl w-full object-cover" />
    </div>

    <!-- Pertanyaan pemantik -->
    <div class="card p-6 border-l-8 !border-l-amber-400">
      <p class="pill bg-amber-100 text-amber-700 mb-3">❓ Pertanyaan Pemantik</p>
      <ol class="list-decimal list-inside space-y-2 font-semibold text-slate-700 text-left">
        <li>Apa yang terjadi pada gambar tersebut?</li>
        <li>Apa yang dapat kita pelajari dari kejadian tersebut?</li>
      </ol>
    </div>

    <!-- Tombol penjelasan -->
    <div class="text-center">
      <button v-if="!tampilPenjelasan" class="btn-primary text-lg" @click="lihatPenjelasan">
        👁️ Klik untuk Melihat Penjelasan
      </button>
    </div>

    <!-- Penjelasan (muncul setelah tombol ditekan) -->
    <div v-if="tampilPenjelasan" class="space-y-4">
      <div class="card p-5 border-l-8 !border-l-emerald-400">
        <p class="pill bg-emerald-100 text-emerald-700 mb-2">💡 Gagasan</p>
        <p class="font-bold text-slate-800">Menjaga kebersihan lingkungan sekolah.</p>
      </div>
      <div class="card p-5 border-l-8 !border-l-violet-400">
        <p class="pill bg-violet-100 text-violet-700 mb-2">📜 Pesan</p>
        <p class="font-semibold text-slate-600 text-sm">Jagalah kebersihan lingkungan sekolah agar dapat belajar dengan nyaman.</p>
      </div>
    </div>
  </div>

  <div class="text-center mt-8 flex justify-center gap-3">
    <NuxtLink to="/pilih" class="btn-soft">← Menu</NuxtLink>
    <NuxtLink to="/limar/engage-2" class="btn-primary text-lg">Lanjutkan →</NuxtLink>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'app', middleware: 'auth' })

const tampilPenjelasan = ref(false)
const sfx = useSound()

function lihatPenjelasan() {
  tampilPenjelasan.value = true
  sfx.success()
}
</script>
