<template>
  <div class="mb-6 flex items-center justify-between">
    <NuxtLink to="/limar/explain" class="btn-soft !px-4 !py-2 text-sm">← Menu Explain</NuxtLink>
    <span class="pill bg-violet-100 text-violet-700">Permainan 4 dari 6</span>
  </div>

  <div class="text-center mb-6">
    <h1 class="page-title">✏️ Melengkapi Pantun</h1>
    <p class="page-sub">Pilih kata yang sesuai untuk melengkapi pantun. Klik bagian yang rumpang, lalu pilih katanya!</p>
  </div>

  <div class="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto items-start">
    <div class="card p-6">
      <div class="bg-amber-50 rounded-2xl p-6 space-y-2">
        <p v-for="(b, i) in baris" :key="i" class="font-display text-xl font-semibold text-slate-700">
          {{ b.depan }}
          <button @click="blankAktif = i"
            class="inline-block min-w-[110px] rounded-xl px-3 py-0.5 font-extrabold border-b-4 transition"
            :class="[
              blankAktif === i ? 'border-violet-400 bg-violet-100' : 'border-amber-300 bg-white',
              hasil && jawaban[i] ? (jawaban[i] === b.kunci ? '!border-emerald-400 !bg-emerald-100' : '!border-rose-400 !bg-rose-100') : ''
            ]">
            {{ jawaban[i] || '______' }}
          </button>{{ b.belakang }}
        </p>
      </div>
      <div class="flex justify-center gap-3 mt-5">
        <button class="btn-primary" :disabled="!lengkap" @click="periksa">🔍 Periksa Jawaban</button>
        <button class="btn-soft" @click="ulangi">🔄 Ulangi</button>
      </div>
      <div v-if="hasil" class="mt-4 text-center">
        <p class="font-display text-xl font-extrabold" :class="hasil.benar ? 'text-emerald-600' : 'text-amber-600'">
          {{ hasil.pesan }}
        </p>
        <NuxtLink v-if="hasil.benar" to="/limar/explain-evaluasi" class="btn-primary mt-3">
          Lanjut ke Evaluasi Pantun →
        </NuxtLink>
      </div>
    </div>

    <div class="space-y-4">
      <div class="card p-5">
        <p class="font-display font-bold text-slate-700 mb-3">🎯 Pilihan Kata</p>
        <div class="flex flex-wrap gap-2">
          <button v-for="k in pilihan" :key="k" @click="pilihKata(k)"
            class="pill !text-base !px-5 !py-2.5 border-2 transition hover:scale-105"
            :class="jawaban.includes(k)
              ? 'bg-violet-500 text-white border-violet-500'
              : 'bg-white text-slate-700 border-violet-200'">
            {{ k }}
          </button>
        </div>
        <p class="text-xs font-bold text-slate-400 mt-3">Bagian rumpang aktif: <b class="text-violet-600">baris {{ blankAktif + 1 }}</b></p>
      </div>
      <div v-if="hasil" class="card p-5 bg-sky-50/60">
        <p class="font-display font-bold text-slate-700 mb-1">🔑 Kunci Jawaban dan Pembahasan</p>
        <p class="text-sm font-semibold text-slate-600"><b>Jawaban:</b> 1. angsa, 2. pakaian, 3. bangsa, 4. zaman.</p>
        <p class="text-sm font-semibold text-slate-600 mt-1"><b>Pembahasan:</b> Kata yang tepat harus sesuai makna dan memperhatikan rima (angsa–bangsa, pakaian–zaman).</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'app', middleware: 'auth' })

const baris = [
  { depan: 'Kain batik bermotif', kunci: 'angsa', belakang: '' },
  { depan: 'Dijahit dijadikan', kunci: 'pakaian', belakang: '' },
  { depan: 'Mari lestarikan budaya', kunci: 'bangsa', belakang: '' },
  { depan: 'Agar tak hilang ditelan', kunci: 'zaman', belakang: '' },
]

function acak<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// 4 kunci + 4 pengecoh yang berima mirip
const pilihan = ref(acak(['angsa', 'pakaian', 'bangsa', 'zaman', 'rusa', 'makanan', 'biasa', 'taman']))
const jawaban = ref<string[]>(['', '', '', ''])
const blankAktif = ref(0)
const hasil = ref<{ benar: boolean; pesan: string } | null>(null)

const lengkap = computed(() => jawaban.value.every(j => j))

function pilihKata(k: string) {
  // hapus dari posisi lain bila kata dipakai dua kali
  jawaban.value.forEach((j, i) => {
    if (i !== blankAktif.value && j === k) jawaban.value[i] = ''
  })
  jawaban.value[blankAktif.value] = k
  hasil.value = null
  // pindah otomatis ke rumpang berikutnya yang masih kosong
  const berikutnya = jawaban.value.findIndex((j, i) => !j && i !== blankAktif.value)
  if (berikutnya !== -1) blankAktif.value = berikutnya
}

const sfx = useSound()

function periksa() {
  const ok = jawaban.value.every((j, i) => j === baris[i].kunci)
  hasil.value = ok
    ? { benar: true, pesan: '🎉 Tepat sekali! Rima dan maknanya pas!' }
    : { benar: false, pesan: '💪 Belum tepat. Perhatikan rima akhir barisnya!' }
  ok ? sfx.success() : sfx.error()
}

function ulangi() {
  jawaban.value = ['', '', '', '']
  blankAktif.value = 0
  hasil.value = null
  pilihan.value = acak(pilihan.value)
}
</script>
