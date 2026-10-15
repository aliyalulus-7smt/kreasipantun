<template>
  <div class="mb-6">
    <span class="pill bg-emerald-100 text-emerald-700">ENGAGE — Kenali Fenomena</span>
    <span class="float-right pill bg-amber-100 text-amber-700">2 dari 2</span>
  </div>

  <div class="text-center mb-6">
    <h1 class="page-title">📜 Baca Pantunnya!</h1>
    <p class="page-sub">Bacalah pantun berikut dengan saksama, lalu jawab pertanyaan pemantiknya.</p>
  </div>

  <div class="max-w-2xl mx-auto space-y-5">
    <!-- Pantun -->
    <div class="card p-6">
      <PantunCard :baris="pantun" />
    </div>

    <!-- Pertanyaan pemantik -->
    <div class="card p-6 border-l-8 !border-l-amber-400">
      <p class="pill bg-amber-100 text-amber-700 mb-3">❓ Pertanyaan Pemantik</p>
      <ol class="list-decimal list-inside space-y-2 font-semibold text-slate-700 text-left">
        <li>Apa yang diceritakan dalam pantun tersebut?</li>
        <li>Pesan apa yang ingin disampaikan penulis?</li>
      </ol>
    </div>

    <!-- Kolom tanggapan -->
    <div class="card p-6">
      <p class="pill bg-sky-100 text-sky-700 mb-3">✍️ Tanggapanmu</p>
      <textarea
        v-model="tanggapan"
        rows="3"
        placeholder="Tuliskan pendapatmu di sini..."
        class="w-full border-2 border-slate-200 rounded-xl px-4 py-3 font-semibold text-slate-700 text-sm focus:outline-none focus:border-emerald-400 resize-none"
      />
    </div>

    <!-- Tombol pembahasan -->
    <div class="text-center">
      <button v-if="!tampilPembahasan" class="btn-primary text-lg" @click="lihatPembahasan">
        📖 Lihat Pembahasan
      </button>
    </div>

    <!-- Pembahasan (muncul setelah tombol ditekan) -->
    <div v-if="tampilPembahasan" class="space-y-4">
      <div class="card p-5 border-l-8 !border-l-emerald-400">
        <p class="pill bg-emerald-100 text-emerald-700 mb-2">💡 Gagasan</p>
        <p class="font-bold text-slate-800">Menghargai perbedaan.</p>
      </div>
      <div class="card p-5 border-l-8 !border-l-violet-400">
        <p class="pill bg-violet-100 text-violet-700 mb-2">📜 Pesan</p>
        <p class="font-semibold text-slate-600 text-sm">Perbedaan suku dan budaya bukan penghalang untuk berteman. Kita harus saling menghormati agar tercipta kerukunan.</p>
      </div>
    </div>
  </div>

  <div class="text-center mt-8 flex justify-center gap-3">
    <NuxtLink to="/limar/engage-1" class="btn-soft">← Sebelumnya</NuxtLink>
    <NuxtLink to="/limar/explore-fenomena" class="btn-primary text-lg">Lanjut →</NuxtLink>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'app', middleware: 'auth' })

const pantun = [
  'Pergi ke pasar membeli pepaya',
  'Pulang melewati rumah paman',
  'Walau berbeda suku dan budaya',
  'Kita tetap hidup dalam kerukunan',
]

const tanggapan = ref('')
const tampilPembahasan = ref(false)
const sfx = useSound()

function lihatPembahasan() {
  tampilPembahasan.value = true
  sfx.success()
}
</script>
