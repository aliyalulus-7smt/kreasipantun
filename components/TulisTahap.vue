<!-- Asah Kreativitas: tulis pantun (semua varian) + simpan karya -->
<template>
  <div class="space-y-5">
    <div class="card p-4 bg-sky-50/70">
      <p class="font-semibold text-slate-700 text-sm">{{ data.instruksi }}</p>
      <div v-if="data.kataKunci" class="flex flex-wrap gap-2 mt-3">
        <span v-for="k in data.kataKunci" :key="k" class="pill bg-amber-100 text-amber-700 !px-4 !py-1.5">🔑 {{ k }}</span>
      </div>
      <p v-if="data.gagasan" class="mt-2 text-sm font-bold text-sky-700">💡 {{ data.gagasan }}</p>
      <p v-if="data.pesan" class="mt-2 text-sm font-bold text-sky-700">📜 {{ data.pesan }}</p>
      <div v-if="data.isi" class="mt-3 bg-white rounded-xl p-3 space-y-1">
        <p class="text-xs font-bold text-slate-400">Isi yang disediakan:</p>
        <p v-for="(b, i) in data.isi" :key="i" class="font-display font-semibold text-slate-700 text-sm">{{ b }}</p>
      </div>
      <div v-if="data.sampiran" class="mt-3 bg-white rounded-xl p-3 space-y-1">
        <p class="text-xs font-bold text-slate-400">Sampiran yang disediakan:</p>
        <p v-for="(b, i) in data.sampiran" :key="i" class="font-display font-semibold text-slate-700 text-sm">{{ b }}</p>
      </div>
    </div>

    <div v-if="data.tantangan" class="card p-4">
      <p class="font-display font-bold text-slate-700 mb-3">🎯 Pilih Tantangan</p>
      <div class="space-y-2">
        <button v-for="(t, i) in data.tantangan" :key="i" @click="tantanganKe = i"
          :class="['w-full text-left pill !px-4 !py-2.5 border-2 transition text-sm',
            tantanganKe === i ? '!border-sky-400 bg-sky-50' : 'hover:border-sky-300']">{{ i + 1 }}. {{ t }}</button>
      </div>
    </div>

    <!-- Referensi pilihan rima -->
    <div class="card p-4 bg-amber-50/70">
      <p class="font-display font-bold text-slate-700">🎵 Referensi Pilihan Rima</p>
      <p class="text-xs font-semibold text-slate-500 mt-1 mb-3">Kata-kata dalam satu kelompok bunyi akhirnya sama (berima). Pakai <b>satu kelompok</b> untuk akhir baris 1 &amp; 3 (rima A), dan <b>kelompok lain</b> untuk akhir baris 2 &amp; 4 (rima B) — jadilah sajak a-b-a-b.</p>
      <div class="grid sm:grid-cols-2 gap-2">
        <div v-for="g in referensiRima" :key="g.akhiran" class="bg-white rounded-xl px-3 py-2">
          <span class="pill !px-2.5 !py-0.5 bg-amber-100 text-amber-700 text-xs font-bold mr-1.5">{{ g.akhiran }}</span>
          <span class="text-sm font-semibold text-slate-600">{{ g.kata.join(' · ') }}</span>
        </div>
      </div>
    </div>

    <div class="card p-5">
      <p class="font-display font-bold text-slate-700 mb-3">✍️ Pantunmu</p>
      <div class="space-y-2.5">
        <div v-for="i in 4" :key="i">
          <label class="text-xs font-bold" :class="i <= 2 ? 'text-sky-600' : 'text-emerald-600'">
            Baris {{ i }} {{ i <= 2 ? '(sampiran)' : '(isi)' }}{{ barisTerkunci.has(i - 1) ? ' — dari soal 🔒' : (barisDariSoal.has(i - 1) ? ' — dari soal' : '') }}
          </label>
          <input v-model="baris[i - 1]" :disabled="barisTerkunci.has(i - 1)" class="input-cute !py-2.5 disabled:bg-slate-100 disabled:text-slate-500" :placeholder="`Tulis baris ${i}...`" maxlength="120" />
        </div>
      </div>
    </div>

    <button class="btn-primary w-full" :disabled="!bisaSimpan" @click="simpan">
      {{ tersimpan ? '✓ Tersimpan' : '💾 Simpan Karya' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { referensiRima } from '~/data/rima'

const props = defineProps<{ tipe: string; data: Record<string, any>; fenomenaId: string; dataTersimpan?: Record<string, any> | null }>()
const { antrekan } = useOutbox()

const baris = ref<string[]>(['', '', '', ''])
const tantanganKe = ref<number>(0)
const tersimpan = ref(false)
// Baris yang sudah disediakan soal: sampiran (baris 1-2) langsung terisi;
// isi yang disediakan (baris 3-4) terisi DAN terkunci — siswa mengisi yang kosong saja.
const barisDariSoal = new Set<number>()
const barisTerkunci = new Set<number>()
if (Array.isArray(props.data.sampiran)) {
  props.data.sampiran.forEach((b: string, i: number) => { if (i < 2 && b) { baris.value[i] = b; barisDariSoal.add(i) } })
}
if (Array.isArray(props.data.isi)) {
  props.data.isi.forEach((b: string, j: number) => { const i = j + 2; if (b) { baris.value[i] = b; barisDariSoal.add(i); barisTerkunci.add(i) } })
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
const bisaSimpan = computed(() => !tersimpan.value && baris.value.every(b => b.trim().length > 0))

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
        is_final: false,
      },
    })
  } catch {}
  tersimpan.value = true
}
</script>
