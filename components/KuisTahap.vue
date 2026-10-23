<!-- Kuis generik: benar/salah, pilihan ganda, pilah kelompok.
     Alur: siswa menjawab SEMUA dulu tanpa tahu benar/salah, lalu menekan
     Periksa — hasil + pembahasan muncul per item; jawaban yang salah bisa
     diperbaiki sampai semua benar. Kartu Fakta ada di paling bawah dan
     terbuka (model kartu bolak-balik) hanya setelah semua jawaban benar. -->
<template>
  <div class="space-y-5">
    <div v-if="data.instruksi" class="card !rounded-2xl p-4 bg-teal-50/70 border !border-teal-100">
      <p class="font-semibold text-slate-700 text-sm">{{ data.instruksi }}</p>
    </div>

    <!-- Mode benar/salah -->
    <div v-if="tipe === 'benar-salah'" class="space-y-3">
      <div v-for="(p, i) in data.pernyataan" :key="i" class="card !rounded-2xl p-4">
        <p class="font-semibold text-slate-700 text-sm mb-3">{{ i + 1 }}. {{ p.teks }}</p>
        <div class="flex gap-2">
          <button @click="jawab(i, true)" :disabled="kunciItemTerkunci(i)"
            :class="kelasPilihanBs(i, true)">
            ✅ {{ labelBenar }}
          </button>
          <button @click="jawab(i, false)" :disabled="kunciItemTerkunci(i)"
            :class="kelasPilihanBs(i, false)">
            ❌ {{ labelSalah }}
          </button>
        </div>
        <div v-if="tampilHasil(i)" :class="['mt-3 rounded-xl p-3 text-sm font-semibold', benarItem(i) ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800']">
          <p>{{ benarItem(i) ? '✅ Jawabanmu benar!' : `❌ Masih kurang tepat — jawaban yang benar: ${p.benar ? labelBenar : labelSalah}.` }}</p>
          <p v-if="p.penjelasan" class="mt-1 font-medium">💡 {{ p.penjelasan }}</p>
          <p v-if="!benarItem(i)" class="mt-1 font-medium">Silakan perbaiki jawaban ini, lalu periksa lagi ya.</p>
        </div>
      </div>
    </div>

    <!-- Mode pilah kelompok: wadah model tempat sampah (tap-to-place).
         Ketuk wadah untuk memilih, ketuk barang untuk memasukkan; tutup
         wadah beranimasi terbuka setiap ada barang masuk. Isi wadah
         terlihat sebagai daftar dan bisa dikeluarkan lagi (ketuk item). -->
    <div v-if="tipe === 'pilah'" class="space-y-4">
      <p class="text-center text-sm font-bold text-slate-500">Ketuk satu wadah untuk memilihnya, lalu ketuk barang untuk memasukkannya.</p>
      <div class="grid grid-cols-2 gap-3 items-start">
        <div v-for="k in data.kelompok" :key="k" @click="kelompokAktif = k" class="wadah-pilah" :class="{ 'wadah-aktif': kelompokAktif === k }">
          <div class="tutup-wadah" :class="[kelasTutup(k), { terbuka: tutupTerbuka === k }]">
            <span>{{ ikonKelompok(k) }} {{ k }}</span>
          </div>
          <div class="badan-wadah" :class="kelasWadah(k)">
            <p class="text-[11px] font-bold text-slate-500 text-center">{{ isiKelompok(k).length }} item di dalam</p>
            <div v-if="isiKelompok(k).length" class="mt-2 space-y-1.5">
              <button v-for="entri in isiKelompok(k)" :key="entri[0]" :disabled="tersimpan" @click.stop="keluarkan(Number(entri[0]))"
                class="isi-wadah" :title="tersimpan ? '' : 'Ketuk untuk mengeluarkan dari wadah'">
                <IkonSampah v-if="ikonUntukItem(Number(entri[0]))" :nama="ikonUntukItem(Number(entri[0]))" class="w-5 h-5 shrink-0" />
                <span class="flex-1">{{ itemTeks(Number(entri[0])) }}</span>
                <span v-if="!tersimpan" class="text-slate-400 font-bold">✕</span>
              </button>
            </div>
            <p v-else class="mt-2 text-xs font-semibold text-slate-400 text-center">Masih kosong</p>
          </div>
        </div>
      </div>
      <div class="flex flex-wrap gap-2 justify-center">
        <button v-for="(it, i) in sisa" :key="i" @click="tempatkan(i)"
          class="pill !px-4 !py-2 bg-white border-2 hover:border-sky-300 transition inline-flex items-center gap-2">
          <IkonSampah v-if="ikonUntukTeks(it.teks)" :nama="ikonUntukTeks(it.teks)" class="w-6 h-6" />
          {{ it.teks }}
        </button>
      </div>
      <p v-if="!kelompokAktif && sisa.length" class="text-center text-xs font-bold text-amber-600">Pilih dulu wadahnya, ya 👆</p>
      <p v-if="!sisa.length" class="text-center font-bold text-sm"
        :class="semuaBenar ? 'text-emerald-600' : 'text-amber-600'">
        {{ semuaBenar ? '🎉 Semua benar!' : '⚠️ Ada yang kurang tepat, coba periksa lagi.' }}
      </p>
      <button v-if="!sisa.length && !semuaBenar" class="btn-soft w-full" @click="ulangi">🔄 Ulangi</button>
    </div>

    <!-- Mode kuis / pilih-tindakan -->
    <div v-if="tipe === 'kuis' || tipe === 'pilih-tindakan'" class="space-y-4">
      <div v-for="(s, si) in daftarSoal" :key="si" class="card !rounded-2xl p-4">
        <p class="font-semibold text-slate-700 text-sm mb-3">{{ si + 1 }}. {{ s.teks }}</p>
        <div class="space-y-2">
          <button v-for="(p, pi) in s.pilihan" :key="pi" @click="jawab(si, pi)" :disabled="kunciItemTerkunci(si)"
            :class="kelasPilihanKuis(si, pi)">
<span class="w-6 h-6 rounded-full bg-con text-primary font-display font-bold text-xs flex items-center justify-center shrink-0">{{ ['a', 'b', 'c', 'd'][pi] }}</span>
            <span>{{ p }}</span>
          </button>
        </div>
        <div v-if="tampilHasil(si)" :class="['mt-3 rounded-xl p-3 text-sm font-semibold', benarItem(si) ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800']">
          <p>{{ benarItem(si) ? '✅ Jawabanmu benar!' : `❌ Masih kurang tepat — jawaban yang benar: ${['a', 'b', 'c', 'd'][s.kunci]}. ${s.pilihan[s.kunci]}` }}</p>
          <p v-if="s.penjelasan" class="mt-1 font-medium">💡 {{ s.penjelasan }}</p>
          <p v-if="!benarItem(si)" class="mt-1 font-medium">Silakan perbaiki jawaban ini, lalu periksa lagi ya.</p>
        </div>
      </div>
    </div>

    <!-- Aksi periksa (simpan ada di paling bawah, di bawah Kartu Fakta) -->
    <div v-if="tampilSedihKuis" class="card !rounded-2xl p-4 bg-sky-50/60">
      <AnimasiSedih />
      <p class="text-center font-bold text-slate-600 text-sm mt-1">Jawaban yang masih salah belum bisa membawamu lanjut. Ulangi sampai semuanya benar ya.</p>
    </div>
    <button v-if="bisaPeriksa" class="btn-primary w-full" @click="periksa">
      🔍 Periksa Jawaban
    </button>
    <p v-if="tipe !== 'pilah' && diperiksa && !semuaTerbuktiBenar && !tersimpan" class="text-center text-amber-600 font-bold text-sm">
      Masih ada jawaban yang belum tepat — perbaiki yang ditandai merah, lalu periksa lagi.
    </p>
    <div v-if="semuaTerbuktiBenar && !tersimpan" class="card !rounded-2xl p-4 bg-emerald-50 text-center">
      <p class="font-display font-bold text-emerald-700">🎉 Semua jawabanmu benar!</p>
      <p class="text-sm font-semibold text-emerald-600 mt-1">Kartu Fakta sudah terbuka di bawah — setelah membacanya, simpan jawabanmu di paling bawah ya.</p>
    </div>

    <!-- Kartu Fakta: paling bawah, kartu bolak-balik, terbuka setelah semua benar -->
    <div v-if="data.kartuFakta?.length" class="space-y-3 pt-1">
      <template v-if="tampilkanFakta">
        <p class="font-display font-bold text-slate-700">📇 Kartu Fakta <span class="text-xs font-bold text-slate-400">— ketuk kartunya untuk membalik</span></p>
        <div class="grid sm:grid-cols-2 gap-3">
          <div v-for="(f, i) in data.kartuFakta" :key="i" class="kartu-balik" :class="{ terbuka: kartuTerbuka[i] }"
            @click="kartuTerbuka[i] = !kartuTerbuka[i]" role="button" :aria-label="`Kartu fakta ${i + 1}`">
            <div class="kartu-dalam">
              <div class="kartu-muka kartu-depan">
                <span class="text-3xl">📇</span>
                <p class="font-display font-bold text-amber-800">Kartu Fakta {{ i + 1 }}</p>
                <p class="text-xs font-bold text-amber-600">Ketuk untuk membuka 👆</p>
              </div>
              <div class="kartu-muka kartu-belakang">
                <p class="text-sm font-semibold text-slate-700 leading-snug overflow-y-auto max-h-full">{{ f }}</p>
              </div>
            </div>
          </div>
        </div>
      </template>
      <div v-else class="card p-4 text-center">
        <p class="text-sm font-bold text-slate-400">🔒 Kartu Fakta masih terkunci</p>
        <p class="text-xs font-semibold text-slate-400 mt-1">Selesaikan semua soal dengan benar, lalu Kartu Fakta akan muncul di sini.</p>
      </div>
    </div>

    <!-- Aksi ubah & simpan: paling bawah, di bawah Kartu Fakta (arahan guru) -->
    <button v-if="tersimpan" class="btn-soft w-full" @click="mulaiUbah">✏️ Ubah Jawaban</button>
    <button v-if="bisaSimpan" class="btn-primary w-full" @click="simpan">
      💾 Simpan Jawaban
    </button>
    <p v-if="tersimpan" class="text-center text-emerald-600 font-bold text-sm">✓ Tersimpan</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ tipe: string; data: Record<string, any>; fenomenaId: string; dataTersimpan?: Record<string, any> | null }>()
const { antrekan } = useOutbox()

const jawaban = ref<Record<number, any>>({ ...(props.dataTersimpan?.jawaban || {}) })
const tersimpan = ref(!!props.dataTersimpan)
const penempatan = ref<Record<number, string>>({ ...(props.dataTersimpan?.penempatan || {}) })
const kelompokAktif = ref<string>('')
// Penilaian ditunda: hasil hanya tampil setelah tombol Periksa ditekan.
const diperiksa = ref(!!props.dataTersimpan)
const snapshot = ref<Record<number, any>>({ ...(props.dataTersimpan?.jawaban || {}) })
const terbukti = ref<Set<number>>(new Set())
const kartuTerbuka = ref<Record<number, boolean>>({})

const daftarSoal = computed(() => props.data.soal || props.data.situasi || [])
// Label pilihan benar/salah bisa diganti per fenomena (Hidup Sehat: Fakta/Mitos).
const labelBenar = computed(() => props.data.labelBenar || 'Benar')
const labelSalah = computed(() => props.data.labelSalah || 'Salah')
const jumlahItem = computed(() => props.tipe === 'benar-salah' ? (props.data.pernyataan || []).length : daftarSoal.value.length)
const sisa = computed(() => (props.data.item || []).filter((_: any, i: number) => !(i in penempatan.value)))
const semuaBenar = computed(() => (props.data.item || []).every((it: any, i: number) => penempatan.value[i] === it.kelompok))
const semuaTerisi = computed(() => Object.keys(jawaban.value).length >= jumlahItem.value && jumlahItem.value > 0)
const semuaTerbuktiBenar = computed(() => jumlahItem.value > 0 && terbukti.value.size >= jumlahItem.value)
const tampilkanFakta = computed(() => tersimpan.value || (props.tipe === 'pilah' ? semuaBenar.value : semuaTerbuktiBenar.value))
const tampilSedihKuis = computed(() => !tersimpan.value && (
  (props.tipe !== 'pilah' && diperiksa.value && !semuaTerbuktiBenar.value) ||
  (props.tipe === 'pilah' && !sisa.value.length && !semuaBenar.value)
))
const bisaPeriksa = computed(() => props.tipe !== 'pilah' && !tersimpan.value && semuaTerisi.value && !semuaTerbuktiBenar.value)
const bisaSimpan = computed(() => {
  if (tersimpan.value) return false
  if (props.tipe === 'pilah') return !sisa.value.length && semuaBenar.value
  return semuaTerbuktiBenar.value
})

// Data tersimpan = sudah pernah selesai: semua item dianggap terbukti benar.
if (props.dataTersimpan && props.tipe !== 'pilah') {
  for (let i = 0; i < jumlahItem.value; i++) terbukti.value.add(i)
}

function kunciItem(i: number) {
  return props.tipe === 'benar-salah' ? props.data.pernyataan[i]?.benar : daftarSoal.value[i]?.kunci
}
function benarItem(i: number) { return jawaban.value[i] !== undefined && jawaban.value[i] === kunciItem(i) }
function kunciItemTerkunci(i: number) { return tersimpan.value || terbukti.value.has(i) }
function tampilHasil(i: number) {
  return diperiksa.value && jawaban.value[i] !== undefined && snapshot.value[i] === jawaban.value[i]
}
function kelasDasar(aktif: boolean) {
  return ['pill !px-5 !py-2 border-2 transition', aktif ? '!bg-teal-100 !border-teal-400' : 'hover:border-teal-300']
}
function kelasPilihanBs(i: number, nilai: boolean) {
  const dipilih = jawaban.value[i] === nilai
  if (tampilHasil(i)) {
    if (dipilih) return ['pill !px-5 !py-2 border-2 transition', benarItem(i) ? '!bg-emerald-100 !border-emerald-400' : '!bg-rose-100 !border-rose-400']
    if (kunciItem(i) === nilai) return ['pill !px-5 !py-2 border-2 transition', '!bg-emerald-50 !border-emerald-300']
  }
  return kelasDasar(dipilih)
}
function kelasPilihanKuis(si: number, pi: number) {
  const dasar = 'w-full text-left rounded-xl px-4 py-2.5 border-2 transition text-sm bg-white flex items-center gap-2.5 font-semibold text-slate-700'
  const dipilih = jawaban.value[si] === pi
  if (tampilHasil(si)) {
    if (dipilih) return [dasar, benarItem(si) ? '!bg-emerald-100 !border-emerald-400' : '!bg-rose-100 !border-rose-400']
    if (kunciItem(si) === pi) return [dasar, '!bg-emerald-50 !border-emerald-300']
  }
  return [dasar, dipilih ? '!bg-teal-100 !border-teal-400' : 'hover:border-teal-300']
}

function jawab(i: number, v: any) {
  if (kunciItemTerkunci(i)) return
  jawaban.value = { ...jawaban.value, [i]: v }
}
// Mode ubah: buka kunci semua item & ulangi alur periksa dari awal.
function mulaiUbah() {
  tersimpan.value = false
  terbukti.value = new Set()
  diperiksa.value = false
  snapshot.value = {}
}
function periksa() {
  snapshot.value = { ...jawaban.value }
  diperiksa.value = true
  for (let i = 0; i < jumlahItem.value; i++) if (benarItem(i)) terbukti.value.add(i)
}
function isiKelompok(k: string) { return Object.entries(penempatan.value).filter(([_, v]) => v === k) }
function itemTeks(idx: number) { return props.data.item?.[idx]?.teks || '' }

// ── Wadah pilah model tempat sampah ──────────────────────────────────
const tutupTerbuka = ref<string>('')
let pewaktuTutup: ReturnType<typeof setTimeout> | undefined
const petaIkonSampah: Record<string, string> = {
  'Kantong plastik': 'kantong-plastik', 'Kulit pisang': 'kulit-pisang', 'Sisa nasi': 'sisa-nasi',
  'Botol plastik': 'botol-plastik', 'Daun kering': 'daun-kering', 'Kaleng bekas': 'kaleng-bekas',
}
function ikonUntukTeks(teks: string) { return petaIkonSampah[teks] || '' }
function ikonUntukItem(idx: number) { return ikonUntukTeks(itemTeks(idx)) }
function ikonKelompok(k: string) {
  return ({ Organik: '🌿', Anorganik: '♻️', Menyakiti: '💔', 'Tidak menyakiti': '💚', Positif: '🌟', Negatif: '⚠️', Sesuai: '🤝', 'Tidak sesuai': '🚫' } as Record<string, string>)[k] || '📦'
}
function kelasWadah(k: string) {
  if (['Organik', 'Tidak menyakiti', 'Positif', 'Sesuai'].includes(k)) return '!border-emerald-300 bg-emerald-50/70'
  if (['Menyakiti', 'Negatif', 'Tidak sesuai'].includes(k)) return '!border-rose-300 bg-rose-50/70'
  return '!border-sky-300 bg-sky-50/70'
}
function kelasTutup(k: string) {
  if (['Organik', 'Tidak menyakiti', 'Positif', 'Sesuai'].includes(k)) return 'bg-emerald-400 text-white'
  if (['Menyakiti', 'Negatif', 'Tidak sesuai'].includes(k)) return 'bg-rose-400 text-white'
  return 'bg-sky-400 text-white'
}
function tempatkan(i: number) {
  if (!kelompokAktif.value) return
  const idxSisa = (props.data.item || []).map((_: any, x: number) => x).filter((x: number) => !(x in penempatan.value))[i]
  penempatan.value = { ...penempatan.value, [idxSisa]: kelompokAktif.value }
  // Animasi: tutup wadah terbuka sebentar setiap ada barang masuk.
  tutupTerbuka.value = kelompokAktif.value
  clearTimeout(pewaktuTutup)
  pewaktuTutup = setTimeout(() => { tutupTerbuka.value = '' }, 900)
}
function keluarkan(idx: number) {
  if (tersimpan.value) return
  const next = { ...penempatan.value }
  delete next[idx]
  penempatan.value = next
}
function ulangi() { penempatan.value = {}; jawaban.value = {} }

function simpan() {
  const payload: Record<string, any> = { jawaban: jawaban.value }
  if (props.tipe === 'pilah') payload.penempatan = penempatan.value
  antrekan({
    phenomenon_id: props.fenomenaId, stage_id: 'eksplorasi', content_version: 'v1', base_version: 0,
    response_payload: payload,
    context: { activity_id: `${props.fenomenaId}-eksplorasi`, activity_version: 'v1' },
  })
  tersimpan.value = true
}
</script>
