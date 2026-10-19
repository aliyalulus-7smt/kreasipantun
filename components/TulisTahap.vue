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

    <div class="card p-5">
      <p class="font-display font-bold text-slate-700 mb-3">✍️ Pantunmu</p>
      <div class="space-y-2.5">
        <div v-for="i in 4" :key="i">
          <label class="text-xs font-bold" :class="i <= 2 ? 'text-sky-600' : 'text-emerald-600'">
            Baris {{ i }} {{ i <= 2 ? '(sampiran)' : '(isi)' }}
          </label>
          <input v-model="baris[i - 1]" class="input-cute !py-2.5" :placeholder="`Tulis baris ${i}...`" maxlength="120" />
        </div>
      </div>
    </div>

    <button class="btn-primary w-full" :disabled="!bisaSimpan" @click="simpan">
      {{ tersimpan ? '✓ Tersimpan' : '💾 Simpan Karya' }}
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ tipe: string; data: Record<string, any>; fenomenaId: string }>()
const { antrekan } = useOutbox()

const baris = ref<string[]>(['', '', '', ''])
const tantanganKe = ref<number>(0)
const tersimpan = ref(false)
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
