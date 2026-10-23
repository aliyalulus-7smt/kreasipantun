<template>
  <div class="mb-6 flex items-center justify-between">
    <NuxtLink to="/limar/explain" class="btn-soft !px-4 !py-2 text-sm">← Menu Explain</NuxtLink>
    <span class="pill bg-violet-100 text-violet-700">Permainan 5 dari 6</span>
  </div>

  <div class="text-center mb-6">
    <h1 class="page-title">📖 Kamus Kata Berima</h1>
    <p class="page-sub">Temukan kata yang memiliki bunyi akhir serupa dengan kata acuan, lalu jelajahi kamusnya di bawah!</p>
  </div>

  <div class="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto items-start">
    <div class="card p-6 text-center relative overflow-hidden">
      <div class="grid grid-cols-2 gap-4 items-center">
        <div class="bg-emerald-50 rounded-2xl p-5">
          <p class="text-xs font-bold text-emerald-600 mb-1">KATA ACUAN</p>
          <p class="font-display text-3xl font-extrabold text-emerald-700">hati</p>
          <p class="text-2xl mt-1">🔊</p>
        </div>
        <div class="text-7xl">📖</div>
      </div>
      <p class="font-bold text-slate-500 text-sm mt-4 mb-3">Klik kata yang berima sama dengan "hati":</p>
      <div class="flex flex-wrap justify-center gap-2">
        <button v-for="k in daftarKata" :key="k"
          @click="toggle(k)"
          class="pill !text-base !px-5 !py-2.5 border-2 transition hover:scale-105"
          :class="[
            dipilih.includes(k) ? 'bg-emerald-500 text-white border-emerald-500 shadow' : 'bg-amber-50 text-slate-700 border-amber-200',
            hasil && dipilih.includes(k) ? (benarList.includes(k) ? '!bg-emerald-500 !border-emerald-500' : '!bg-rose-400 !border-rose-400') : ''
          ]">
          {{ dipilih.includes(k) ? '✓ ' : '' }}{{ k }}
        </button>
      </div>
      <div class="flex justify-center gap-3 mt-6">
        <button class="btn-primary" :disabled="!dipilih.length" @click="periksa">🔍 Periksa Jawaban</button>
        <button class="btn-soft" @click="ulangi">🔄 Ulangi</button>
      </div>
      <div v-if="hasil" class="mt-4">
        <p class="font-display text-xl font-extrabold" :class="hasil.benar ? 'text-emerald-600' : 'text-amber-600'">
          {{ hasil.pesan }}
        </p>
      </div>
    </div>

    <div v-if="hasil" class="card p-5 bg-emerald-50/60">
      <p class="font-display font-bold text-slate-700 mb-2">🔑 Kunci Jawaban dan Pembahasan</p>
      <p class="text-sm font-semibold text-slate-600"><b>Kata yang memiliki bunyi akhir serupa:</b></p>
      <ul class="text-sm font-semibold text-slate-600 list-disc list-inside mt-1">
        <li>hati, pagi — sama-sama berakhiran <b>-i</b></li>
        <li>buku, guru → berakhiran -u; awan → -an; malam → -am</li>
      </ul>
      <p class="text-sm font-semibold text-slate-600 mt-2"><b>Pembahasan:</b> Kata-kata dalam satu kelompok Kamus Kata Berima memiliki bunyi akhir yang sama. "hati" dan "pagi" sama-sama ada di kelompok akhiran <b>-i</b>.</p>
    </div>
  </div>

  <!-- Kamus Kata Berima: 30 kelompok akhiran dari data/rima -->
  <div class="card p-6 max-w-4xl mx-auto mt-6">
    <p class="font-display font-bold text-slate-700 text-lg mb-1">📖 Jelajahi Kamus Kata Berima</p>
    <p class="text-sm font-semibold text-slate-500 mb-4">Pilih akhiran, lalu lihat kata-kata yang berima dengan akhiran itu — bekal menyusun pantunmu.</p>
    <div class="flex flex-wrap gap-1.5 mb-4">
      <button v-for="g in referensiRima" :key="g.akhiran" @click="akhiranAktif = g.akhiran"
        class="pill !text-xs border-2 transition"
        :class="akhiranAktif === g.akhiran ? 'bg-violet-500 text-white border-violet-500' : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300'">
        {{ g.akhiran }}
      </button>
    </div>
    <div v-if="kelompokAktif">
      <div v-for="kat in urutanKategori" :key="kat" class="mb-3">
        <template v-if="kataKategori(kat).length">
          <p class="text-xs font-bold text-slate-400 mb-1.5">{{ labelKategori[kat] }}</p>
          <div class="flex flex-wrap gap-1.5">
            <span v-for="w in kataKategori(kat)" :key="w.teks" class="pill bg-violet-50 text-slate-700 border border-violet-100 !text-xs">{{ w.teks }}</span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { referensiRima, labelKategori, type KataRimaRef } from '~/data/rima'

definePageMeta({ layout: 'app', middleware: 'auth' })

// Permainan: kata berima dengan acuan "hati" (kelompok akhiran -i).
const daftarKata = ['hati', 'pagi', 'buku', 'awan', 'guru', 'malam']
const benarList = ['hati', 'pagi']
const dipilih = ref<string[]>([])
const hasil = ref<{ benar: boolean; pesan: string } | null>(null)

function toggle(k: string) {
  const i = dipilih.value.indexOf(k)
  if (i >= 0) dipilih.value.splice(i, 1)
  else dipilih.value.push(k)
  hasil.value = null
}

const sfx = useSound()

function periksa() {
  const ok = dipilih.value.length === benarList.length &&
    benarList.every(k => dipilih.value.includes(k))
  const benarCount = dipilih.value.filter(k => benarList.includes(k)).length
  hasil.value = ok
    ? { benar: true, pesan: '🎉 Hebat! Kamu menemukan semua kata berima!' }
    : { benar: false, pesan: `💪 ${benarCount} kata tepat. Cari yang berakhiran "-i"!` }
  ok ? sfx.success() : sfx.error()
}

function ulangi() {
  dipilih.value = []
  hasil.value = null
}

// Penjelajah kamus
const akhiranAktif = ref<string>('-i')
const kelompokAktif = computed(() => referensiRima.find(g => g.akhiran === akhiranAktif.value) || null)
const urutanKategori: KataRimaRef['kategori'][] = ['benda', 'sifat', 'kerja']
function kataKategori(kat: KataRimaRef['kategori']) {
  return (kelompokAktif.value?.kata || []).filter(w => w.kategori === kat)
}
</script>
