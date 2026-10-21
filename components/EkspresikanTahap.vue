<!-- Ekspresikan: susun larik / identifikasi sampiran-isi / pasang rima / hitung suku kata / dst. -->
<template>
  <div class="space-y-5">
    <div v-if="data.instruksi" class="card p-4 bg-violet-50/70">
      <p class="font-semibold text-slate-700 text-sm">{{ data.instruksi }}</p>
    </div>

    <!-- Susun larik -->
    <div v-if="tipe === 'susun-larik'" class="space-y-3">
      <p class="text-sm font-bold text-slate-500">Ketuk baris sesuai urutan yang benar:</p>
      <div class="space-y-2">
        <div v-for="(b, i) in urutan" :key="i" class="card p-3.5 flex items-center gap-3">
          <span class="w-7 h-7 rounded-full bg-violet-100 text-violet-700 font-bold text-sm flex items-center justify-center">{{ i + 1 }}</span>
          <p class="font-display font-semibold text-slate-700">{{ b }}</p>
        </div>
      </div>
      <div class="flex flex-wrap gap-2">
        <button v-for="(b, i) in sisaAcak" :key="i" @click="pilih(i)"
          class="pill !px-4 !py-2 bg-white border-2 hover:border-violet-300 transition text-sm">{{ b }}</button>
      </div>
      <button v-if="urutan.length" class="btn-soft w-full" @click="batalSatu">↩️ Batalkan terakhir</button>
      <p v-if="cekHasil !== null" class="text-center font-bold" :class="cekHasil ? 'text-emerald-600' : 'text-rose-500'">
        {{ cekHasil ? '🎉 Urutan benar!' : '❌ Belum tepat, coba lagi.' }}
      </p>
    </div>

    <!-- Identifikasi sampiran / isi -->
    <div v-if="tipe === 'identifikasi-sampiran-isi'" class="space-y-3">
      <div v-for="(l, i) in data.larik" :key="i" class="card p-4">
        <p class="font-display font-semibold text-slate-700 mb-2">"{{ l.teks }}"</p>
        <div class="flex gap-2">
          <button @click="jawab(i, 'sampiran')" :class="klsTombol(jawaban[i] === 'sampiran', jawaban[i] !== undefined && l.kunci === 'sampiran')">Sampiran</button>
          <button @click="jawab(i, 'isi')" :class="klsTombol(jawaban[i] === 'isi', jawaban[i] !== undefined && l.kunci === 'isi')">Isi</button>
        </div>
      </div>
    </div>

    <!-- Pasang rima -->
    <div v-if="tipe === 'pasang-rima'" class="space-y-3">
      <p class="text-sm font-bold text-slate-500">Ketuk dua kata yang berima sama:</p>
      <div class="flex flex-wrap gap-2">
        <button v-for="(k, i) in sisaKata" :key="k + i" @click="pilihKata(k)"
          :class="['pill !px-4 !py-2 border-2 transition', pilihanKata.includes(k) ? '!border-violet-400 bg-violet-50' : 'bg-white hover:border-violet-300']">{{ k }}</button>
      </div>
      <div v-if="pasanganDitemukan.length" class="space-y-1.5">
        <p v-for="(p, i) in pasanganDitemukan" :key="i" class="text-sm font-bold text-emerald-600">✓ {{ p[0] }} = {{ p[1] }}</p>
      </div>
    </div>

    <!-- Hitung suku kata -->
    <div v-if="tipe === 'hitung-suku-kata'" class="space-y-3">
      <div v-for="(l, i) in data.larik" :key="i" class="card p-4">
        <p class="font-display font-semibold text-slate-700 mb-2">{{ l.teks }}</p>
        <div class="flex items-center gap-2">
          <input v-model.number="jawaban[i]" type="number" min="1" max="20" class="input-cute !w-24" placeholder="?" />
          <span class="text-sm font-bold text-slate-500">suku kata</span>
          <span v-if="dicek" class="text-sm font-bold" :class="jawaban[i] === l.kunci ? 'text-emerald-600' : 'text-rose-500'">
            {{ jawaban[i] === l.kunci ? '✓' : `✗ (jawaban: ${l.kunci})` }}
          </span>
        </div>
      </div>
      <button v-if="!dicek" class="btn-soft w-full" @click="dicek = true">🔍 Cek Jawaban</button>
    </div>

    <!-- Lengkapi rumpang / pilih kata -->
    <div v-if="tipe === 'lengkapi-rumpang' || tipe === 'pilih-kata'" class="space-y-4">
      <div v-for="(s, si) in daftarSoal" :key="si" class="card p-4">
        <div class="bg-amber-50 rounded-xl p-4 mb-3 space-y-1">
          <p v-for="(b, bi) in s.pantun" :key="bi" class="font-display font-semibold text-slate-700">
            {{ bi === s.rumpangKe ? b.replace('___', '.....') : b }}
          </p>
        </div>
        <p class="text-sm font-bold text-slate-600 mb-2">{{ s.tanya || 'Pilih jawaban:' }}</p>
        <div class="space-y-2">
          <button v-for="(p, pi) in s.pilihan" :key="pi" @click="jawab(si, pi)"
            :class="['w-full text-left pill !px-4 !py-2.5 border-2 transition text-sm',
              jawaban[si] === pi ? (pi === s.kunci ? '!bg-emerald-100 !border-emerald-400' : '!bg-rose-100 !border-rose-400') : 'hover:border-violet-300']">
            {{ ['a', 'b', 'c'][pi] }}. {{ p }}
          </button>
        </div>
      </div>
    </div>

    <!-- Pasang sampiran-isi -->
    <div v-if="tipe === 'pasang-sampiran-isi'" class="space-y-3">
      <div class="bg-violet-50 rounded-xl p-4 space-y-1">
        <p v-for="(b, i) in data.sampiran" :key="i" class="font-display font-semibold text-slate-700">{{ b }}</p>
      </div>
      <div class="space-y-2">
        <button v-for="(p, i) in data.pilihan" :key="i" @click="jawab(0, i)"
          :class="['w-full text-left card p-4 border-2 transition',
            jawaban[0] === i ? (p.benar ? '!border-emerald-400 bg-emerald-50' : '!border-rose-400 bg-rose-50') : 'hover:border-violet-300']">
          <p v-for="(b, j) in p.isi" :key="j" class="font-display font-semibold text-slate-700 text-sm">{{ b }}</p>
        </button>
      </div>
    </div>

    <!-- Perbaiki rima (kuis) -->
    <div v-if="tipe === 'perbaiki-rima'" class="space-y-4">
      <div class="bg-amber-50 rounded-xl p-4 space-y-1 mb-2">
        <p v-for="(b, i) in data.pantun" :key="i" class="font-display font-semibold text-slate-700">{{ b }}</p>
      </div>
      <div v-for="(s, si) in data.soal" :key="si" class="card p-4">
        <p class="font-semibold text-slate-700 text-sm mb-3">{{ si + 1 }}. {{ s.tanya }}</p>
        <div class="space-y-2">
          <button v-for="(p, pi) in s.pilihan" :key="pi" @click="jawab(si, pi)"
            :class="['w-full text-left pill !px-4 !py-2.5 border-2 transition text-sm',
              jawaban[si] === pi ? (pi === s.kunci ? '!bg-emerald-100 !border-emerald-400' : '!bg-rose-100 !border-rose-400') : 'hover:border-violet-300']">
            {{ p }}
          </button>
        </div>
      </div>
    </div>

    <button v-if="bisaSimpan" class="btn-primary w-full" @click="simpan">💾 Simpan Jawaban</button>
    <p v-if="tersimpan" class="text-center text-emerald-600 font-bold text-sm">✓ Tersimpan</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ tipe: string; data: Record<string, any>; fenomenaId: string; dataTersimpan?: Record<string, any> | null }>()
const { antrekan } = useOutbox()

const jawaban = ref<Record<number, any>>({ ...(props.dataTersimpan?.jawaban || {}) })
const tersimpan = ref(!!props.dataTersimpan)
const dicek = ref(!!props.dataTersimpan && Object.keys(props.dataTersimpan?.jawaban || {}).length > 0)
// susun-larik
const urutan = ref<string[]>([...(props.dataTersimpan?.urutan || [])])
const acakDipakai = ref<number[]>([])
// pasang-rima
const pilihanKata = ref<string[]>([])
const pasanganDitemukan = ref<string[][]>(Array.isArray(props.dataTersimpan?.pasangan) ? props.dataTersimpan!.pasangan.map((p: string[]) => [...p]) : [])
const kataTerpakai = ref<Set<string>>(new Set(pasanganDitemukan.value.flat()))
// Pulihkan indeks acak yang terpakai dari urutan tersimpan (susun-larik)
if (urutan.value.length && Array.isArray(props.data.acak)) {
  const terpakai = new Set<number>()
  for (const kata of urutan.value) {
    const idx = props.data.acak.findIndex((a: string, i: number) => a === kata && !terpakai.has(i))
    if (idx >= 0) terpakai.add(idx)
  }
  acakDipakai.value = [...terpakai]
}

const sisaAcak = computed(() => (props.data.acak || []).filter((_: string, i: number) => !acakDipakai.value.includes(i)))
const sisaKata = computed(() => (props.data.kata || []).filter((k: string) => !kataTerpakai.value.has(k)))
const daftarSoal = computed(() => props.data.soal || [])
const cekHasil = computed(() => {
  if (!urutan.value.length) return null
  if (urutan.value.length < props.data.benar.length) return null
  return urutan.value.every((b, i) => b === props.data.benar[i])
})
const bisaSimpan = computed(() => {
  if (tersimpan.value) return false
  switch (props.tipe) {
    case 'susun-larik': return cekHasil.value === true
    case 'pasang-rima': return pasanganDitemukan.value.length === (props.data.pasangan || []).length
    case 'identifikasi-sampiran-isi': return Object.keys(jawaban.value).length === (props.data.larik || []).length
    case 'hitung-suku-kata': return dicek.value
    default: return Object.keys(jawaban.value).length === (daftarSoal.value.length || 1)
  }
})

function klsTombol(aktif: boolean, benar: boolean) {
  return ['pill !px-5 !py-2 border-2 transition text-sm',
    aktif ? (benar ? '!bg-emerald-100 !border-emerald-400' : '!bg-rose-100 !border-rose-400') : 'hover:border-violet-300']
}
function jawab(i: number, v: any) { jawaban.value = { ...jawaban.value, [i]: v } }
function pilih(i: number) {
  const idxAsli = (props.data.acak || []).map((_: string, x: number) => x).filter((x: number) => !acakDipakai.value.includes(x))[i]
  acakDipakai.value.push(idxAsli)
  urutan.value.push(props.data.acak[idxAsli])
}
function batalSatu() { acakDipakai.value.pop(); urutan.value.pop() }
function pilihKata(k: string) {
  pilihanKata.value.push(k)
  if (pilihanKata.value.length === 2) {
    const [a, b] = pilihanKata.value
    const cocok = (props.data.pasangan || []).some((p: string[]) =>
      (p[0] === a && p[1] === b) || (p[0] === b && p[1] === a))
    if (cocok) { pasanganDitemukan.value.push([a, b]); kataTerpakai.value.add(a); kataTerpakai.value.add(b) }
    pilihanKata.value = []
  }
}

function simpan() {
  antrekan({
    phenomenon_id: props.fenomenaId, stage_id: 'ekspresikan', content_version: 'v1', base_version: 0,
    response_payload: { jawaban: jawaban.value, urutan: urutan.value, pasangan: pasanganDitemukan.value },
    context: { activity_id: `${props.fenomenaId}-ekspresikan`, activity_version: 'v1' },
  })
  tersimpan.value = true
}
</script>
