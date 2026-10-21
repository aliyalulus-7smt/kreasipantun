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

    <!-- Pasang rima: dua kolom papan kayu, disambung tali rami -->
    <div v-if="tipe === 'pasang-rima'" class="space-y-3">
      <p class="text-sm font-bold text-slate-500">Ketuk satu papan di kiri, lalu papan pasangannya di kanan — keduanya akan terikat tali rami. Ketuk papan yang sudah terikat untuk melepasnya.</p>
      <div ref="wadahRef" class="relative">
        <svg class="absolute inset-0 w-full h-full pointer-events-none" :viewBox="`0 0 ${ukuranSvg.w} ${ukuranSvg.h}`" preserveAspectRatio="none" aria-hidden="true">
          <g v-for="t in tali" :key="t.kunci">
            <template v-if="!t.putus">
              <path :d="`M ${t.x1} ${t.y1} Q ${t.mx} ${t.my} ${t.x2} ${t.y2}`" fill="none" stroke="#c9a06b" stroke-width="6" stroke-linecap="round" />
              <path :d="`M ${t.x1} ${t.y1} Q ${t.mx} ${t.my} ${t.x2} ${t.y2}`" fill="none" stroke="#9a743f" stroke-width="6" stroke-linecap="round" stroke-dasharray="3 6" />
            </template>
            <template v-else>
              <path :d="`M ${t.x1} ${t.y1} Q ${(t.x1 + t.mx) / 2} ${(t.y1 + t.my) / 2 + 8} ${t.mx - 12} ${t.my + 8}`" fill="none" stroke="#c9a06b" stroke-width="6" stroke-linecap="round" />
              <path :d="`M ${t.x1} ${t.y1} Q ${(t.x1 + t.mx) / 2} ${(t.y1 + t.my) / 2 + 8} ${t.mx - 12} ${t.my + 8}`" fill="none" stroke="#9a743f" stroke-width="6" stroke-linecap="round" stroke-dasharray="3 6" />
              <path :d="`M ${t.mx + 12} ${t.my + 8} Q ${(t.mx + t.x2) / 2} ${(t.my + t.y2) / 2 + 8} ${t.x2} ${t.y2}`" fill="none" stroke="#c9a06b" stroke-width="6" stroke-linecap="round" />
              <path :d="`M ${t.mx + 12} ${t.my + 8} Q ${(t.mx + t.x2) / 2} ${(t.my + t.y2) / 2 + 8} ${t.x2} ${t.y2}`" fill="none" stroke="#9a743f" stroke-width="6" stroke-linecap="round" stroke-dasharray="3 6" />
              <text :x="t.mx" :y="t.my + 4" text-anchor="middle" font-size="13">✂️</text>
            </template>
          </g>
        </svg>
        <div class="grid grid-cols-2 gap-x-20 gap-y-3 relative">
          <div class="space-y-3">
            <button v-for="k in kolomKiri" :key="'kiri-' + k" :data-kata-kiri="k" @click="klikKata('kiri', k)"
              :class="kelasPapan('kiri', k)">{{ k }}</button>
          </div>
          <div class="space-y-3">
            <button v-for="k in kolomKanan" :key="'kanan-' + k" :data-kata-kanan="k" @click="klikKata('kanan', k)"
              :class="kelasPapan('kanan', k)">{{ k }}</button>
          </div>
        </div>
      </div>
      <p v-if="!semuaTerpasang" class="text-center text-sm font-bold text-slate-400">{{ jumlahTerpasang }} dari {{ (data.pasangan || []).length }} pasangan terikat</p>
      <p v-else-if="semuaPasanganBenar" class="text-center font-bold text-emerald-600">🎉 Semua pasangan benar — talinya utuh!</p>
      <p v-else class="text-center font-bold text-rose-500">Ada tali yang putus ✂️ — pasangan itu belum tepat. Ketuk papannya untuk melepas, lalu pasangkan lagi.</p>
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
// pasang-rima — dua kolom papan kayu + tali rami; posisi selalu diacak
const petaPasangan = new Map<string, string>((props.data.pasangan || []).map((p: string[]) => [p[0], p[1]]))
const kolomKiri = ref<string[]>(acakArray([...petaPasangan.keys()]))
const kolomKanan = ref<string[]>(acakArray([...petaPasangan.values()]))
const pasanganSiswa = ref<Record<string, string>>({})
const pilihanAktif = ref<{ sisi: 'kiri' | 'kanan'; kata: string } | null>(null)
if (Array.isArray(props.dataTersimpan?.pasangan)) {
  const init: Record<string, string> = {}
  for (const pr of props.dataTersimpan.pasangan as string[][]) {
    const [a, b] = pr
    if (petaPasangan.get(a) === b) init[a] = b
    else if (petaPasangan.get(b) === a) init[b] = a
  }
  pasanganSiswa.value = init
}
const jumlahTerpasang = computed(() => Object.keys(pasanganSiswa.value).length)
const semuaTerpasang = computed(() => petaPasangan.size > 0 && jumlahTerpasang.value === petaPasangan.size)
const pasanganBenar = (kiri: string) => petaPasangan.get(kiri) === pasanganSiswa.value[kiri]
const semuaPasanganBenar = computed(() => semuaTerpasang.value && [...petaPasangan.keys()].every(k => pasanganBenar(k)))
const taliPutus = (kiri: string) => semuaTerpasang.value && !pasanganBenar(kiri)

const wadahRef = ref<HTMLElement | null>(null)
const ukuranSvg = ref({ w: 0, h: 0 })
const tali = ref<{ kunci: string; x1: number; y1: number; x2: number; y2: number; mx: number; my: number; putus: boolean }[]>([])
function hitungTali() {
  const wadah = wadahRef.value
  if (!wadah) { tali.value = []; return }
  const wr = wadah.getBoundingClientRect()
  ukuranSvg.value = { w: wadah.clientWidth, h: wadah.clientHeight }
  const out: typeof tali.value = []
  for (const [kiri, kanan] of Object.entries(pasanganSiswa.value)) {
    const elK = wadah.querySelector(`[data-kata-kiri="${CSS.escape(kiri)}"]`)
    const elR = wadah.querySelector(`[data-kata-kanan="${CSS.escape(kanan)}"]`)
    if (!elK || !elR) continue
    const a = elK.getBoundingClientRect(); const b = elR.getBoundingClientRect()
    const x1 = a.right - wr.left; const y1 = a.top + a.height / 2 - wr.top
    const x2 = b.left - wr.left; const y2 = b.top + b.height / 2 - wr.top
    out.push({ kunci: kiri, x1, y1, x2, y2, mx: (x1 + x2) / 2, my: (y1 + y2) / 2 + 14, putus: taliPutus(kiri) })
  }
  tali.value = out
}
function kelasPapan(sisi: 'kiri' | 'kanan', kata: string) {
  const terikat = sisi === 'kiri' ? kata in pasanganSiswa.value : Object.values(pasanganSiswa.value).includes(kata)
  const kunciKiri = sisi === 'kiri' ? kata : Object.keys(pasanganSiswa.value).find(k => pasanganSiswa.value[k] === kata)
  return ['papan-kayu',
    pilihanAktif.value?.kata === kata && pilihanAktif.value?.sisi === sisi ? 'papan-aktif' : '',
    terikat ? 'papan-terikat' : '',
    terikat && semuaTerpasang.value && kunciKiri ? (pasanganBenar(kunciKiri) ? 'papan-benar' : 'papan-putus') : '']
}
function klikKata(sisi: 'kiri' | 'kanan', kata: string) {
  if (tersimpan.value) return
  const pasanganAda = sisi === 'kiri' ? pasanganSiswa.value[kata] : Object.keys(pasanganSiswa.value).find(k => pasanganSiswa.value[k] === kata)
  if (!pilihanAktif.value) {
    if (pasanganAda !== undefined && pasanganAda !== false) {
      const next = { ...pasanganSiswa.value }
      if (sisi === 'kiri') delete next[kata]; else delete next[pasanganAda as string]
      pasanganSiswa.value = next
      return
    }
    pilihanAktif.value = { sisi, kata }
    return
  }
  if (pilihanAktif.value.sisi === sisi) {
    pilihanAktif.value = pilihanAktif.value.kata === kata ? null : { sisi, kata }
    return
  }
  const kiri = sisi === 'kiri' ? kata : pilihanAktif.value.kata
  const kanan = sisi === 'kanan' ? kata : pilihanAktif.value.kata
  const next = { ...pasanganSiswa.value }
  delete next[kiri]
  for (const k of Object.keys(next)) if (next[k] === kanan) delete next[k]
  next[kiri] = kanan
  pasanganSiswa.value = next
  pilihanAktif.value = null
}
watch(pasanganSiswa, () => { void nextTick(hitungTali) })
onMounted(() => {
  void nextTick(hitungTali)
  setTimeout(hitungTali, 350)
  window.addEventListener('resize', hitungTali)
})
onUnmounted(() => { window.removeEventListener('resize', hitungTali) })
// susun-larik — urutan tampil SELALU diacak tiap halaman dimuat
function acakArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] }
  return a
}
const acakTampil = ref<string[]>(acakArray(props.data.acak || []))
// Pulihkan indeks acak yang terpakai dari urutan tersimpan (susun-larik)
if (urutan.value.length && acakTampil.value.length) {
  const terpakai = new Set<number>()
  for (const kata of urutan.value) {
    const idx = acakTampil.value.findIndex((a: string, i: number) => a === kata && !terpakai.has(i))
    if (idx >= 0) terpakai.add(idx)
  }
  acakDipakai.value = [...terpakai]
}

const sisaAcak = computed(() => acakTampil.value.filter((_: string, i: number) => !acakDipakai.value.includes(i)))
const sisaKata = computed(() => (props.data.kata || []).filter((k: string) => !Object.keys(pasanganSiswa.value).includes(k) && !Object.values(pasanganSiswa.value).includes(k)))
const daftarSoal = computed(() => {
  if (Array.isArray(props.data.soal) && props.data.soal.length) return props.data.soal
  // Soal tunggal di level atas data (mis. lengkapi-rumpang Stop Perundungan):
  // tanpa ini daftar kosong dan halamannya blank.
  if (Array.isArray(props.data.pantun) && Array.isArray(props.data.pilihan)) {
    return [{
      pantun: props.data.pantun, rumpangKe: props.data.rumpangKe ?? -1,
      pilihan: props.data.pilihan, kunci: props.data.kunci,
      tanya: props.data.tanya || 'Kata yang tepat untuk melengkapi pantun:',
    }]
  }
  return []
})
const cekHasil = computed(() => {
  if (!urutan.value.length) return null
  if (urutan.value.length < props.data.benar.length) return null
  return urutan.value.every((b, i) => b === props.data.benar[i])
})
const bisaSimpan = computed(() => {
  if (tersimpan.value) return false
  switch (props.tipe) {
    case 'susun-larik': return cekHasil.value === true
    case 'pasang-rima': return semuaPasanganBenar.value
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
  const idxAsli = acakTampil.value.map((_: string, x: number) => x).filter((x: number) => !acakDipakai.value.includes(x))[i]
  acakDipakai.value.push(idxAsli)
  urutan.value.push(acakTampil.value[idxAsli])
}
function batalSatu() { acakDipakai.value.pop(); urutan.value.pop() }
function simpan() {
  antrekan({
    phenomenon_id: props.fenomenaId, stage_id: 'ekspresikan', content_version: 'v1', base_version: 0,
    response_payload: { jawaban: jawaban.value, urutan: urutan.value, pasangan: props.tipe === 'pasang-rima' ? Object.entries(pasanganSiswa.value) : [] },
    context: { activity_id: `${props.fenomenaId}-ekspresikan`, activity_version: 'v1' },
  })
  tersimpan.value = true
}
</script>
