<!-- Stimulus: artikel / video / gambar + pertanyaan pemantik + respons -->
<template>
  <div class="space-y-5">
    <div v-if="tipe === 'video'" class="aspect-video rounded-2xl overflow-hidden bg-slate-900">
      <iframe :src="embedUrl" class="w-full h-full" frameborder="0" allowfullscreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
    </div>
    <figure v-else-if="tipe === 'gambar'" class="rounded-2xl overflow-hidden bg-slate-100">
      <template v-if="!gambarGagal">
        <a v-if="data.pinUrl" :href="data.pinUrl" target="_blank" rel="noopener" title="Lihat sumber foto di Pinterest">
          <img :src="data.gambarUrl" :alt="data.catatan || 'Foto fenomena'" referrerpolicy="no-referrer" loading="lazy"
            class="w-full h-auto block" @error="gambarGagal = true" />
        </a>
        <img v-else :src="data.gambarUrl" :alt="data.catatan || 'Foto fenomena'" referrerpolicy="no-referrer" loading="lazy"
          class="w-full h-auto block" @error="gambarGagal = true" />
        <figcaption v-if="data.catatan" class="px-4 py-2.5 text-xs font-semibold text-slate-500 bg-white/70">
          {{ data.catatan }}<span v-if="data.pinUrl"> · Sumber: Pinterest</span>
        </figcaption>
      </template>
      <p v-else class="p-6 text-center text-slate-500 font-semibold">
        🖼️ {{ data.catatan || 'Lihat gambar pada tautan:' }}<br />
        <a :href="data.pinUrl || data.gambarUrl" target="_blank" class="text-sky-600 underline break-all">{{ data.pinUrl || data.gambarUrl }}</a>
      </p>
    </figure>
    <div v-else class="card p-5 bg-amber-50/60">
      <p v-if="data.artikel" class="text-slate-700 leading-relaxed whitespace-pre-line">{{ data.artikel }}</p>
      <p v-else class="text-slate-500 font-semibold italic">📄 {{ data.catatan || 'Materi artikel menyusul.' }}</p>
    </div>

    <div class="card p-5">
      <p class="font-display font-bold text-slate-700 mb-3">❓ Pertanyaan Pemantik</p>
      <ol class="list-decimal list-inside space-y-2 text-sm font-semibold text-slate-600 mb-4">
        <li v-for="(t, i) in data.pertanyaan" :key="i">{{ t }}</li>
      </ol>
      <label class="block font-bold text-slate-700 mb-1.5 text-sm">✏️ Tanggapanmu</label>
      <textarea v-model="respons" rows="3" class="input-cute disabled:bg-slate-100 disabled:text-slate-500" :disabled="tersimpan" placeholder="Tulis tanggapanmu di sini..." />
    </div>

    <button v-if="tersimpan" class="btn-soft w-full" @click="tersimpan = false">✏️ Ubah Tanggapan</button>
    <button v-else class="btn-primary w-full" :disabled="!bisaSimpan" @click="simpan">
      💾 Simpan Tanggapan
    </button>
    <p v-if="tersimpan" class="text-center text-emerald-600 font-bold text-sm">✓ Tersimpan</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ tipe: string; data: Record<string, any>; fenomenaId: string; dataTersimpan?: Record<string, any> | null }>()
const emit = defineEmits(['selesai'])
const { antrekan } = useOutbox()

const respons = ref(props.dataTersimpan?.tanggapan || '')
const tersimpan = ref(!!props.dataTersimpan?.tanggapan)
const gambarGagal = ref(false)
const bisaSimpan = computed(() => respons.value.trim().length > 0 && !tersimpan.value)

const embedUrl = computed(() => {
  if (props.tipe !== 'video' || !props.data.videoUrl) return ''
  return props.data.videoUrl.replace('youtu.be/', 'www.youtube.com/embed/').replace('watch?v=', 'embed/').split('?')[0]
})

function simpan() {
  if (!bisaSimpan.value) return
  antrekan({
    phenomenon_id: props.fenomenaId, stage_id: 'kenali', content_version: 'v1', base_version: 0,
    response_payload: { tanggapan: respons.value.trim() },
    context: { activity_id: `${props.fenomenaId}-kenali`, activity_version: 'v1' },
  })
  tersimpan.value = true
  emit('selesai')
}
</script>
