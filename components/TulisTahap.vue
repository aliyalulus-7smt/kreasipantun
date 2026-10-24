<!-- Asah Kreativitas: tulis pantun (semua varian) + simpan karya.
     Tantangan dipilih lewat roda spin; kamus kata berima (satu panel)
     ada di paling bawah: klik kata untuk memasukkannya ke baris aktif.
     Baris yang sudah disediakan soal TIDAK ditampilkan sebagai kolom
     input — hanya kolom yang perlu diisi siswa yang muncul. -->
<template>
  <div class="space-y-5">
    <div class="card !rounded-2xl p-4 bg-amber-50/70 border !border-amber-100">
      <p class="font-semibold text-slate-700 text-sm">{{ data.instruksi }}</p>
      <div v-if="data.kataKunci" class="flex flex-wrap gap-2 mt-3">
        <span v-for="k in data.kataKunci" :key="k" class="pill bg-amber-100 text-amber-700 !px-4 !py-1.5">🔑 {{ k }}</span>
      </div>
      <p v-if="data.gagasan" class="mt-2 text-sm font-bold text-amber-700">💡 {{ data.gagasan }}</p>
      <p v-if="data.pesan" class="mt-2 text-sm font-bold text-amber-700">📜 {{ data.pesan }}</p>
      <div v-if="data.isi" class="mt-3 bg-white rounded-xl p-3 space-y-1">
        <p class="text-xs font-bold text-slate-400">Isi yang disediakan:</p>
        <p v-for="(b, i) in data.isi" :key="i" class="font-display font-semibold text-slate-700 text-sm">{{ b }}</p>
      </div>
      <div v-if="data.sampiran" class="mt-3 bg-white rounded-xl p-3 space-y-1">
        <p class="text-xs font-bold text-slate-400">Sampiran yang disediakan:</p>
        <p v-for="(b, i) in data.sampiran" :key="i" class="font-display font-semibold text-slate-700 text-sm">{{ b }}</p>
      </div>
    </div>

    <!-- Tantangan via roda spin -->
    <div v-if="data.tantangan" class="card !rounded-2xl p-4">
      <p class="font-display font-bold text-slate-700 mb-1 text-center">🎯 Tantanganmu Ditentukan Roda Spin</p>
      <p class="text-xs font-semibold text-slate-400 text-center mb-4">Putar rodanya — tantangan yang berhenti di jarum adalah tugasmu.</p>
      <RodaSpin :segments="segmenTantangan" :awal-indeks="tantanganKe" :nonaktif="tersimpan || sudahSpin" @hasil="terimaSpin" />
      <div v-if="tantanganDipilih" class="mt-4 bg-amber-50 rounded-xl p-3.5">
        <p class="text-xs font-bold text-amber-600 mb-1">🎯 Tantanganmu (Tantangan {{ tantanganKe + 1 }}):</p>
        <p class="font-semibold text-slate-700 text-sm">{{ data.tantangan[tantanganKe] }}</p>
        <p v-if="!tersimpan" class="text-[11px] font-semibold text-slate-400 mt-1.5">Roda hanya bisa diputar satu kali — hasil putaran inilah tantanganmu.</p>
      </div>
      <p v-else class="text-center text-sm font-bold text-slate-400 mt-3">Putar rodanya dulu untuk mendapat tantanganmu 🎡</p>
    </div>

    <div class="card !rounded-2xl p-5">
      <p class="font-display font-bold text-slate-700 mb-3">✍️ Pantunmu</p>
      <div class="space-y-2.5">
        <template v-for="i in 4" :key="i">
          <div v-if="!barisDariSoal.has(i - 1)">
            <label class="text-xs font-bold" :class="i <= 2 ? 'text-sky-600' : 'text-amber-600'">
              Baris {{ i }} {{ i <= 2 ? '(sampiran)' : '(isi)' }}
            </label>
            <input v-model="baris[i - 1]" :disabled="tersimpan" @focus="barisFokus = i - 1" class="w-full bg-conlow rounded-xl px-4 py-2.5 font-semibold text-ink placeholder:text-muted placeholder:font-medium focus:bg-white focus:outline-none focus:shadow-md transition disabled:bg-slate-100 disabled:text-slate-500" :placeholder="`Tulis baris ${i}...`" maxlength="120" />
          </div>
        </template>
      </div>
    </div>

    <!-- Cek pantun benar: tampil saat siswa mulai menulis -->
    <div v-if="adaIsian && !tersimpan" class="card !rounded-2xl p-4">
      <p class="font-display font-bold text-slate-700 text-sm mb-2">🔍 Cek Pantunmu</p>
      <div class="space-y-1 text-sm font-semibold">
        <p v-for="i in 4" :key="i" :class="(cekKarya.suku[i - 1] >= 8 && cekKarya.suku[i - 1] <= 12) ? 'text-emerald-600' : 'text-rose-500'">
          Baris {{ i }}: {{ cekKarya.suku[i - 1] }} suku kata
          {{ (cekKarya.suku[i - 1] >= 8 && cekKarya.suku[i - 1] <= 12) ? '✓ (8–12)' : '✗ (harus 8–12)' }}
        </p>
        <p :class="cekKarya.sajakOk ? 'text-emerald-600' : 'text-rose-500'">
          Sajak a-b-a-b: {{ cekKarya.sajakOk ? '✓ cocok' : '✗ akhir baris 1 & 3 harus sama, begitu pula 2 & 4' }}
        </p>
      </div>
      <p v-if="!cekKarya.valid" class="text-xs font-semibold text-slate-400 mt-2">Perbaiki pantunmu hingga semua cek hijau — tombol Simpan aktif setelah itu.</p>
      <p v-else class="text-xs font-bold text-emerald-600 mt-2">Pantunmu sudah benar dan siap disimpan ✓</p>
    </div>

    <button v-if="tersimpan" class="btn-soft w-full" @click="tersimpan = false">✏️ Ubah Karya</button>
    <button v-else class="btn-primary w-full" :disabled="!bisaSimpan" @click="simpan">
      💾 Simpan Karya
    </button>
    <p v-if="tersimpan" class="text-center text-emerald-600 font-bold text-sm">✓ Tersimpan</p>

    <!-- Referensi Pilihan Rima (paling bawah, model /limar/elaborate) -->
    <div class="card !rounded-2xl p-4">
      <button class="w-full flex items-center justify-between" @click="tampilRima = !tampilRima">
        <span class="font-display font-bold text-slate-700">📖 Kamus Kata Berima <span class="text-xs font-semibold text-slate-400">(opsional)</span></span>
        <span class="text-xl">{{ tampilRima ? '▲' : '▼' }}</span>
      </button>
      <p v-if="!tampilRima" class="text-xs font-semibold text-slate-500 mt-1">
        Klik untuk melihat kamus kata berima sebagai referensi menyusun pantunmu.
      </p>

      <div v-if="tampilRima" class="mt-4 border-2 border-amber-200 bg-amber-50/50 rounded-2xl p-4">
        <p class="text-xs font-semibold text-slate-500 mb-3">Pilih akhiran, lalu klik kata untuk memasukkannya ke baris pantun yang sedang kamu isi.</p>

        <p class="text-xs font-bold text-slate-500 mb-2">Akhiran:</p>
        <div class="flex flex-wrap gap-1.5 mb-3">
          <button v-for="g in referensiRima" :key="g.akhiran" @click="akhiranPilihan = g.akhiran"
            class="pill !text-xs border-2 transition"
            :class="akhiranPilihan === g.akhiran
              ? 'bg-amber-500 text-white border-amber-500'
              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'">
            {{ g.akhiran }}
          </button>
        </div>

        <div v-if="kelompokDipilih()">
          <p class="text-xs font-bold text-slate-500 mb-2">Kata (klik untuk memasukkan):</p>
          <div class="space-y-2 max-h-48 overflow-y-auto pr-1">
            <div v-for="kat in urutanKategori" :key="kat">
              <template v-if="kataKategori(kat).length">
                <p class="text-xs font-bold text-slate-400 mb-1">{{ labelKategori[kat] }}</p>
                <div class="flex flex-wrap gap-1.5">
                  <button v-for="w in kataKategori(kat)" :key="w.teks" @click="sisipKata(w.teks)"
                    class="pill !text-xs border-2 bg-white text-slate-600 border-slate-200 hover:border-amber-300 transition">
                    {{ w.teks }}
                  </button>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
      <p v-if="pesanSisip" class="mt-3 text-center text-sm font-bold text-emerald-600">{{ pesanSisip }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { referensiRima, labelKategori, type KataRimaRef } from '~/data/rima'
import { cekPantunBenar } from '~/utils/validatePantun'

const props = defineProps<{ tipe: string; data: Record<string, any>; fenomenaId: string; dataTersimpan?: Record<string, any> | null }>()
const { antrekan } = useOutbox()

const baris = ref<string[]>(['', '', '', ''])
const tantanganKe = ref<number>(0)
const tantanganDipilih = ref(!!props.dataTersimpan)
// Roda spin hanya boleh diputar SATU kali (arahan guru): jawaban tersimpan
// berarti roda sudah pernah diputar; hasil putaran menguncinya.
const sudahSpin = ref(!!props.dataTersimpan)
const tersimpan = ref(false)
// Baris yang sudah disediakan soal (sampiran / isi) tetap terisi di state
// agar payload pantun utuh 4 baris, tetapi TIDAK dirender sebagai kolom
// input — siswa hanya mengisi kolom yang memang kosong untuknya.
const barisDariSoal = new Set<number>()
if (Array.isArray(props.data.sampiran)) {
  props.data.sampiran.forEach((b: string, i: number) => { if (i < 2 && b) { baris.value[i] = b; barisDariSoal.add(i) } })
}
if (Array.isArray(props.data.isi)) {
  props.data.isi.forEach((b: string, j: number) => { const i = j + 2; if (b) { baris.value[i] = b; barisDariSoal.add(i) } })
}
if (Array.isArray(props.dataTersimpan?.baris)) {
  props.dataTersimpan!.baris.forEach((b: string, i: number) => { if (i < 4) baris.value[i] = b || '' })
  tersimpan.value = baris.value.some(b => b.trim().length > 0)
  const tTersimpan = props.dataTersimpan!.tantangan
  if (tTersimpan && Array.isArray(props.data.tantangan)) {
    const idx = props.data.tantangan.findIndex((t: any) => JSON.stringify(t) === JSON.stringify(tTersimpan))
    if (idx >= 0) tantanganKe.value = idx
  }
}
// ── Cek pantun benar (suku kata + sajak) ────────────────────────────
// Hanya pantun yang lolos cek ini yang bisa disimpan sebagai karya —
// pantun yang salah tidak tersimpan dan tidak tampil di /karya maupun
// panel guru. Aturan sama dengan penilaian otomatis tahap Evaluasi.
const cekKarya = computed(() => cekPantunBenar(baris.value))
const adaIsian = computed(() => baris.value.some(b => b.trim().length > 0))
const bisaSimpan = computed(() =>
  !tersimpan.value && cekKarya.value.valid && (!props.data.tantangan || tantanganDipilih.value))

// ── Roda spin tantangan ─────────────────────────────────────────────
const segmenTantangan = computed(() =>
  (props.data.tantangan || []).map((_: string, i: number) => ({ label: `Tantangan ${i + 1}`, indeks: i })))
function terimaSpin(seg: { indeks: number }) {
  tantanganKe.value = seg.indeks
  tantanganDipilih.value = true
  sudahSpin.value = true
}

// ── Kamus Kata Berima (satu panel referensi) ────────────────────────
const tampilRima = ref(false)
const akhiranPilihan = ref<string | null>(null)
const barisFokus = ref<number | null>(null)
const pesanSisip = ref('')
const urutanKategori: KataRimaRef['kategori'][] = ['benda', 'sifat', 'kerja']
function kelompokDipilih() {
  return referensiRima.find(g => g.akhiran === akhiranPilihan.value) || null
}
function kataKategori(kat: KataRimaRef['kategori']) {
  return (kelompokDipilih()?.kata || []).filter(w => w.kategori === kat)
}
function sisipKata(kata: string) {
  // Target: baris yang sedang difokus siswa; bila tidak ada, baris pertama
  // yang memang perlu diisi siswa (baris dari soal tidak bisa disisipi).
  let target: number | undefined
  if (barisFokus.value !== null && !barisDariSoal.has(barisFokus.value)) {
    target = barisFokus.value
  } else {
    target = [0, 1, 2, 3].find(i => !barisDariSoal.has(i))
  }
  if (target === undefined) return
  const kini = baris.value[target]
  baris.value[target] = kini.trim() ? `${kini.replace(/\s+$/, '')} ${kata}` : kata.charAt(0).toUpperCase() + kata.slice(1)
  barisFokus.value = target
  pesanSisip.value = `Kata "${kata}" ditambahkan ke baris ${target + 1} ✓`
  setTimeout(() => { pesanSisip.value = '' }, 2600)
}

async function simpan() {
  if (!bisaSimpan.value) return
  // Simpan draf via outbox (progres tahap asah)
  antrekan({
    phenomenon_id: props.fenomenaId, stage_id: 'asah', content_version: 'v1', base_version: 0,
    response_payload: { baris: baris.value.map(b => b.trim()), tantangan: props.data.tantangan?.[tantanganKe.value] || null },
    context: { activity_id: `${props.fenomenaId}-asah`, activity_version: 'v1' },
  })
  // Simpan karya via BFF
  try {
    await $fetch('/api/v1/works', {
      method: 'POST',
      body: {
        phenomenon_id: props.fenomenaId,
        larik1: baris.value[0].trim(), larik2: baris.value[1].trim(),
        larik3: baris.value[2].trim(), larik4: baris.value[3].trim(),
        // Hanya pantun yang lolos cek yang sampai ke sini → final.
        is_final: true,
      },
    })
  } catch {}
  tersimpan.value = true
}
</script>
