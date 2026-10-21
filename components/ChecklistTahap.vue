<!-- Evaluasi Karya: checklist refleksi diri -->
<template>
  <div class="space-y-5">
    <div class="card p-5">
      <p class="font-display font-bold text-slate-700 mb-1">📋 Evaluasi Karyamu</p>
      <p class="text-sm font-semibold text-slate-500 mb-4">Centang setiap pernyataan yang sudah sesuai dengan pantunmu.</p>
      <div class="space-y-2.5">
        <button v-for="(it, i) in data.item" :key="i" @click="toggle(i)"
          :class="['w-full text-left card p-4 border-2 transition flex items-start gap-3',
            centang[i] ? '!border-emerald-400 bg-emerald-50/60' : 'hover:border-slate-300']">
          <span :class="['w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5',
            centang[i] ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300']">
            <span v-if="centang[i]" class="text-sm">✓</span>
          </span>
          <span class="font-semibold text-slate-700 text-sm">{{ it }}</span>
        </button>
      </div>
    </div>

    <div class="card p-5">
      <label class="block font-bold text-slate-700 mb-1.5 text-sm">💭 Refleksimu (opsional)</label>
      <textarea v-model="refleksi" rows="3" class="input-cute" placeholder="Apa yang sudah bagus dan apa yang ingin kamu perbaiki?" />
    </div>

    <button class="btn-primary w-full" :disabled="tersimpan" @click="simpan">
      {{ tersimpan ? '✓ Tersimpan' : '💾 Simpan Evaluasi' }}
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ data: Record<string, any>; fenomenaId: string; dataTersimpan?: Record<string, any> | null }>()
const { antrekan } = useOutbox()

const centang = ref<Record<number, boolean>>({})
const refleksi = ref(props.dataTersimpan?.refleksi || '')
const tersimpan = ref(!!props.dataTersimpan)
if (Array.isArray(props.dataTersimpan?.checklist)) {
  const awal: Record<number, boolean> = {}
  props.dataTersimpan!.checklist.forEach((it: any, i: number) => { awal[i] = !!it?.ya })
  centang.value = awal
}

function toggle(i: number) { centang.value = { ...centang.value, [i]: !centang.value[i] } }

function simpan() {
  antrekan({
    phenomenon_id: props.fenomenaId, stage_id: 'evaluasi', content_version: 'v1', base_version: 0,
    response_payload: {
      checklist: (props.data.item || []).map((it: string, i: number) => ({ item: it, ya: !!centang.value[i] })),
      refleksi: refleksi.value.trim() || null,
    },
    context: { activity_id: `${props.fenomenaId}-evaluasi`, activity_version: 'v1' },
  })
  tersimpan.value = true
}
</script>
