<!-- Kuis generik: benar/salah, pilihan ganda, pilah kelompok -->
<template>
  <div class="space-y-5">
    <div v-if="data.instruksi" class="card p-4 bg-sky-50/70">
      <p class="font-semibold text-slate-700 text-sm">{{ data.instruksi }}</p>
    </div>

    <!-- Kartu fakta -->
    <div v-if="data.kartuFakta?.length" class="card p-5">
      <p class="font-display font-bold text-slate-700 mb-3">📇 Kartu Fakta</p>
      <div class="space-y-2.5">
        <div v-for="(f, i) in data.kartuFakta" :key="i" class="bg-amber-50 rounded-xl p-3.5 text-sm font-semibold text-slate-600">
          {{ f }}
        </div>
      </div>
    </div>

    <!-- Mode benar/salah -->
    <div v-if="tipe === 'benar-salah'" class="space-y-3">
      <div v-for="(p, i) in data.pernyataan" :key="i" class="card p-4">
        <p class="font-semibold text-slate-700 text-sm mb-3">{{ i + 1 }}. {{ p.teks }}</p>
        <div class="flex gap-2">
          <button @click="jawab(i, true)" :disabled="terkunci"
            :class="['pill !px-5 !py-2 border-2 transition', jawaban[i] === true ? (p.benar ? '!bg-emerald-100 !border-emerald-400' : '!bg-rose-100 !border-rose-400') : 'hover:border-sky-300']">
            ✅ Benar
          </button>
          <button @click="jawab(i, false)" :disabled="terkunci"
            :class="['pill !px-5 !py-2 border-2 transition', jawaban[i] === false ? (!p.benar ? '!bg-emerald-100 !border-emerald-400' : '!bg-rose-100 !border-rose-400') : 'hover:border-sky-300']">
            ❌ Salah
          </button>
        </div>
      </div>
    </div>

    <!-- Mode pilah kelompok (tap-to-place) -->
    <div v-if="tipe === 'pilah'" class="space-y-4">
      <div class="grid grid-cols-2 gap-3">
        <div v-for="k in data.kelompok" :key="k" @click="kelompokAktif = k"
          :class="['card p-4 text-center cursor-pointer border-2 transition', kelompokAktif === k ? '!border-sky-400 bg-sky-50' : '']">
          <p class="font-display font-bold text-slate-700">{{ k }}</p>
          <p class="text-xs font-bold text-slate-400 mt-1">{{ isiKelompok(k).length }} item</p>
        </div>
      </div>
      <div class="flex flex-wrap gap-2">
        <button v-for="(it, i) in sisa" :key="i" @click="tempatkan(i)"
          class="pill !px-4 !py-2 bg-white border-2 hover:border-sky-300 transition">
          {{ it.teks }}
        </button>
      </div>
      <p v-if="!sisa.length" class="text-center font-bold text-sm"
        :class="semuaBenar ? 'text-emerald-600' : 'text-amber-600'">
        {{ semuaBenar ? '🎉 Semua benar!' : '⚠️ Ada yang kurang tepat, coba periksa lagi.' }}
      </p>
      <button v-if="!sisa.length && !semuaBenar" class="btn-soft w-full" @click="ulangi">🔄 Ulangi</button>
    </div>

    <!-- Mode kuis / pilih-tindakan -->
    <div v-if="tipe === 'kuis' || tipe === 'pilih-tindakan'" class="space-y-4">
      <div v-for="(s, si) in daftarSoal" :key="si" class="card p-4">
        <p class="font-semibold text-slate-700 text-sm mb-3">{{ si + 1 }}. {{ s.teks }}</p>
        <div class="space-y-2">
          <button v-for="(p, pi) in s.pilihan" :key="pi" @click="jawab(si, pi)" :disabled="terkunci"
            :class="['w-full text-left pill !px-4 !py-2.5 border-2 transition text-sm',
              jawaban[si] === pi ? (pi === s.kunci ? '!bg-emerald-100 !border-emerald-400' : '!bg-rose-100 !border-rose-400') : 'hover:border-sky-300']">
            {{ ['a', 'b', 'c'][pi] }}. {{ p }}
          </button>
        </div>
      </div>
    </div>

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
const terkunci = ref(!!props.dataTersimpan)
const tersimpan = ref(!!props.dataTersimpan)
const kelompokAktif = ref<string>('')
const penempatan = ref<Record<number, string>>({ ...(props.dataTersimpan?.penempatan || {}) })

const daftarSoal = computed(() => props.data.soal || props.data.situasi || [])
const sisa = computed(() => (props.data.item || []).filter((_: any, i: number) => !(i in penempatan.value)))
const semuaBenar = computed(() => (props.data.item || []).every((it: any, i: number) => penempatan.value[i] === it.kelompok))
const bisaSimpan = computed(() => {
  if (tersimpan.value || terkunci.value) return false
  if (props.tipe === 'benar-salah') return Object.keys(jawaban.value).length === props.data.pernyataan.length
  if (props.tipe === 'pilah') return !sisa.value.length && semuaBenar.value
  return Object.keys(jawaban.value).length === daftarSoal.value.length
})

function jawab(i: number, v: any) { jawaban.value = { ...jawaban.value, [i]: v } }
function isiKelompok(k: string) { return Object.entries(penempatan.value).filter(([_, v]) => v === k) }
function tempatkan(i: number) {
  if (!kelompokAktif.value) return
  const asli = (props.data.item || []).findIndex((_: any, x: number) => !(x in penempatan.value) && x >= 0)
  const idxSisa = (props.data.item || []).map((_: any, x: number) => x).filter((x: number) => !(x in penempatan.value))[i]
  penempatan.value = { ...penempatan.value, [idxSisa]: kelompokAktif.value }
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
  terkunci.value = true
  tersimpan.value = true
}
</script>
