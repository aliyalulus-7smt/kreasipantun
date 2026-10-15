<template>
  <div class="mb-6 flex items-center justify-between">
    <NuxtLink to="/limar/explain" class="btn-soft !px-4 !py-2 text-sm">← Menu Explain</NuxtLink>
    <span class="pill bg-violet-100 text-violet-700">Permainan 6 dari 6</span>
  </div>

  <div class="text-center mb-6">
    <h1 class="page-title">🔍 Evaluasi Pantun</h1>
    <p class="page-sub">Periksa pantun berikut! Tentukan setiap pernyataan Benar atau Salah.</p>
  </div>

  <div class="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto items-start">
    <!-- Pantun yang dievaluasi -->
    <div class="card p-6">
      <p class="font-display font-bold text-slate-700 mb-3">📜 Pantun yang Dievaluasi</p>
      <div class="bg-amber-50 rounded-2xl p-6 space-y-1.5">
        <p v-for="(b, i) in pantun" :key="i" class="font-display text-lg font-semibold text-slate-700">
          <span class="text-xs font-bold text-slate-400 mr-2">{{ i + 1 }}.</span>{{ b }}
        </p>
      </div>
      <div class="flex justify-center gap-3 mt-5">
        <button class="btn-primary" :disabled="!lengkap" @click="periksa">🔍 Periksa Evaluasi</button>
        <button class="btn-soft" @click="ulangi">🔄 Ulangi</button>
      </div>
      <div v-if="hasil" class="mt-4 text-center">
        <p class="font-display text-2xl font-extrabold" :class="hasil.benar ? 'text-emerald-600' : 'text-amber-600'">
          {{ hasil.pesan }}
        </p>
        <p class="font-bold text-slate-500 mt-1">Skor: {{ skor }} / {{ pernyataan.length }}</p>
      </div>
    </div>

    <!-- Checklist pernyataan -->
    <div class="space-y-4">
      <div class="card p-5">
        <p class="font-display font-bold text-slate-700 mb-3">✅ Checklist Penilaian</p>
        <div class="space-y-3">
          <div v-for="(p, i) in pernyataan" :key="i"
            class="rounded-2xl p-3 border-2 transition"
            :class="hasil
              ? (jawaban[i] === p.kunci ? 'border-emerald-300 bg-emerald-50' : 'border-rose-300 bg-rose-50')
              : 'border-slate-100 bg-slate-50'">
            <p class="text-sm font-bold text-slate-700 mb-2">{{ i + 1 }}. {{ p.teks }}</p>
            <div class="flex gap-2">
              <button @click="setJawaban(i, true)"
                class="pill !py-1.5 !px-5 border-2 transition"
                :class="jawaban[i] === true ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-emerald-700 border-emerald-200'">
                Benar
              </button>
              <button @click="setJawaban(i, false)"
                class="pill !py-1.5 !px-5 border-2 transition"
                :class="jawaban[i] === false ? 'bg-rose-500 text-white border-rose-500' : 'bg-white text-rose-700 border-rose-200'">
                Salah
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="hasil" class="card p-5 bg-sky-50/60">
        <p class="font-display font-bold text-slate-700 mb-2">🔑 Kunci Jawaban dan Pembahasan</p>
        <ul class="text-sm font-semibold text-slate-600 space-y-2">
          <li v-for="(p, i) in pernyataan" :key="i">
            <b>{{ i + 1 }}. {{ p.kunci ? 'Benar' : 'Salah' }}.</b> {{ p.bahas }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'app', middleware: 'auth' })

const pantun = [
  'Pergi ke taman memetik melati',
  'Singgah sebentar membeli jamu',
  'Rajin belajar setiap hari',
  'Agar tercapai cita-citamu',
]

const pernyataan = [
  {
    teks: 'Pantun terdiri atas empat larik.',
    kunci: true,
    bahas: 'Pantun memang terdiri atas empat larik (baris).'
  },
  {
    teks: 'Larik pertama dan kedua merupakan bagian isi.',
    kunci: false,
    bahas: 'Larik pertama dan kedua merupakan sampiran, bukan isi.'
  },
  {
    teks: 'Larik pertama dan ketiga memiliki rima yang sama.',
    kunci: true,
    bahas: 'Kata "melati" dan "hari" memiliki bunyi akhir yang sama (-i).'
  },
  {
    teks: 'Larik kedua dan ketiga memiliki rima yang sama.',
    kunci: false,
    bahas: 'Kata "jamu" (bunyi -u) dan "hari" (bunyi -i) tidak berima sama.'
  },
  {
    teks: 'Larik ketiga dan keempat merupakan bagian sampiran.',
    kunci: false,
    bahas: 'Larik ketiga dan keempat merupakan isi, bukan sampiran.'
  },
]

const jawaban = ref<(boolean | null)[]>(pernyataan.map(() => null))
const hasil = ref<{ benar: boolean; pesan: string } | null>(null)
const skor = ref(0)

const lengkap = computed(() => jawaban.value.every(j => j !== null))

function setJawaban(i: number, v: boolean) {
  jawaban.value[i] = v
  hasil.value = null
}

const sfx = useSound()

function periksa() {
  const s = jawaban.value.filter((j, i) => j === pernyataan[i].kunci).length
  skor.value = s
  hasil.value = s === pernyataan.length
    ? { benar: true, pesan: '🎉 Sempurna! Kamu hebat mengevaluasi pantun!' }
    : { benar: false, pesan: `💪 ${s} dari ${pernyataan.length} benar. Pelajari pembahasannya!` }
  hasil.value.benar ? sfx.success() : sfx.error()
}

function ulangi() {
  jawaban.value = pernyataan.map(() => null)
  hasil.value = null
  skor.value = 0
}
</script>
