<template>
  <div class="mb-6 flex items-center justify-between">
    <NuxtLink to="/limar/engage-1" class="btn-soft !px-4 !py-2 text-sm">← Kembali</NuxtLink>
    <span class="pill bg-emerald-100 text-emerald-700">Kenali Fenomena · 2 dari 3</span>
  </div>

  <div class="text-center mb-6">
    <h1 class="page-title">📜 Amati Pantunnya!</h1>
    <p class="page-sub">Bacalah pantun berikut dengan saksama, lalu sampaikan tanggapanmu.</p>
  </div>

  <div class="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto items-start">
    <!-- Pantun -->
    <div class="card p-6">
      <p class="font-display font-bold text-slate-700 mb-3">📜 Pantun</p>
      <div class="bg-amber-50 rounded-2xl p-6 space-y-1.5">
        <p v-for="(b, i) in pantun" :key="i" class="font-display text-lg font-semibold text-slate-700">
          {{ b }}
        </p>
      </div>
    </div>

    <!-- Pertanyaan + tanggapan -->
    <div class="space-y-4">
      <div class="card p-5">
        <p class="font-display font-bold text-slate-700 mb-3">💬 Pertanyaan Pemantik</p>
        <ol class="list-decimal list-inside space-y-2 text-sm font-semibold text-slate-600">
          <li>Apa yang diceritakan dalam pantun tersebut?</li>
          <li>Pesan apa yang ingin disampaikan penulis?</li>
        </ol>
      </div>

      <div class="card p-5">
        <label class="block font-display font-bold text-slate-700 mb-2">
          ✏️ Tanggapan Singkatmu
        </label>
        <textarea v-model="tanggapan" rows="4" class="input-cute"
          placeholder="Tuliskan pendapatmu tentang pantun di atas..."></textarea>
        <button class="btn-primary w-full mt-3" :disabled="!tanggapan.trim()" @click="lihatPembahasan">
          📖 Lihat Pembahasan
        </button>
      </div>

      <div v-if="tampilBahasan" class="card p-5 bg-emerald-50/70">
        <p class="font-display font-bold text-slate-700 mb-2">💡 Pembahasan</p>
        <p class="text-sm font-semibold text-slate-600">
          <b class="text-emerald-700">Gagasan:</b> Menghargai perbedaan
        </p>
        <p class="text-sm font-semibold text-slate-600 mt-1">
          <b class="text-emerald-700">Pesan:</b> Perbedaan suku, budaya bukan penghalang untuk berteman.
          Kita harus saling menghormati agar tercipta kerukunan.
        </p>
        <NuxtLink to="/limar/engage-2" class="btn-primary w-full mt-4">
          Lanjut →
        </NuxtLink>
      </div>
    </div>
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
const tampilBahasan = ref(false)
const sfx = useSound()

function lihatPembahasan() {
  if (!tanggapan.value.trim()) return
  tampilBahasan.value = true
  sfx.success()
}
</script>
