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
    <!-- Pilih makanan sehat ke piring (Kenali Hidup Sehat) -->
    <div v-else-if="tipe === 'pilih-makanan'" class="space-y-4">
      <div class="card p-5 bg-lime-50/70">
        <p class="font-semibold text-slate-700 text-sm text-center">{{ data.instruksi }}</p>
        <div class="flex flex-wrap justify-center gap-2 mt-4">
          <button v-for="m in data.makanan" :key="m.nama" @click="toggleMakanan(m.nama)" :disabled="tersimpan"
            :class="['pill !px-4 !py-2 border-2 transition inline-flex items-center gap-1.5',
              diPiring(m.nama) ? '!bg-lime-200 !border-lime-500' : 'bg-white hover:border-lime-400']">
            {{ ikonMakanan(m.nama) }} {{ m.nama }}
          </button>
        </div>
      </div>
      <div class="card p-5 text-center">
        <p class="font-display font-bold text-slate-700">🍽️ Piringku</p>
        <div v-if="piring.length" class="flex flex-wrap justify-center gap-2 mt-3">
          <span v-for="n in piring" :key="n" class="pill bg-lime-100 text-lime-800 !px-3.5 !py-1.5">{{ ikonMakanan(n) }} {{ n }}</span>
        </div>
        <p v-else class="text-sm font-semibold text-slate-400 mt-2">Piringmu masih kosong — ketuk makanan di atas untuk meletakkannya di sini.</p>
        <button v-if="piring.length && !piringBenar && !tersimpan" class="btn-soft w-full mt-4" @click="piringDicek = true">🔍 Periksa Piringku</button>
        <p v-if="piringBenar" class="mt-3 text-sm font-bold text-emerald-600">🎉 Hebat! Semua isi piringmu makanan sehat dan bergizi!</p>
        <p v-else-if="piringDicek" class="mt-3 text-sm font-bold text-rose-500">Masih ada yang kurang tepat — mungkin ada makanan kurang sehat di piringmu, atau ada makanan sehat yang belum kamu ambil. Ketuk makanannya untuk mengubah isi piringmu.</p>
      </div>
    </div>

    <div v-else class="card p-5 bg-amber-50/60">
      <template v-if="data.artikel">
        <p v-if="artikelJudul" class="font-display font-extrabold text-center text-slate-800 text-lg mb-3">{{ artikelJudul }}</p>
        <p class="text-slate-700 leading-relaxed whitespace-pre-line">{{ artikelIsi }}</p>
      </template>
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

// Artikel diawali judul cerita pada blok pertamanya (dipisah baris kosong);
// judul ditampilkan di tengah & tebal, sisanya jadi isi cerita.
const blokArtikel = computed(() => (props.data.artikel || '').split(/\n\s*\n/))
const artikelJudul = computed(() => (blokArtikel.value.length > 1 ? blokArtikel.value[0].trim() : ''))
const artikelIsi = computed(() => (blokArtikel.value.length > 1 ? blokArtikel.value.slice(1).join('\n\n') : (props.data.artikel || '')))
const tersimpan = ref(!!props.dataTersimpan?.tanggapan)
const gambarGagal = ref(false)
const bisaSimpan = computed(() => respons.value.trim().length > 0 && !tersimpan.value
  && (props.tipe !== 'pilih-makanan' || piringBenar.value))

const embedUrl = computed(() => {
  if (props.tipe !== 'video' || !props.data.videoUrl) return ''
  const dasar = props.data.videoUrl.replace('youtu.be/', 'www.youtube.com/embed/').replace('watch?v=', 'embed/').split('?')[0]
  // Autoplay saat halaman dibuka (aturan browser: mulai tanpa suara).
  return `${dasar}?autoplay=1&mute=1&playsinline=1&rel=0`
})

// ── Pilih makanan (Kenali Hidup Sehat): susun piring berisi makanan sehat ──
const piring = ref<string[]>([...(props.dataTersimpan?.piring || [])])
const piringDicek = ref(false)
const makananSehat = computed(() => (props.data.makanan || []).filter((m: any) => m.sehat).map((m: any) => m.nama))
const piringBenar = computed(() => piring.value.length === makananSehat.value.length
  && makananSehat.value.every((n: string) => piring.value.includes(n)))
const diPiring = (n: string) => piring.value.includes(n)
function toggleMakanan(n: string) {
  if (tersimpan.value) return
  piring.value = diPiring(n) ? piring.value.filter(x => x !== n) : [...piring.value, n]
  piringDicek.value = false
}
function ikonMakanan(n: string) {
  return ({ Nasi: '🍚', 'Minuman soda': '🥤', Susu: '🥛', Brokoli: '🥦', Permen: '🍬', Telur: '🥚', Donat: '🍩', 'Kentang goreng': '🍟', Apel: '🍎', Ikan: '🐟' } as Record<string, string>)[n] || '🍽️'
}

function simpan() {
  if (!bisaSimpan.value) return
  antrekan({
    phenomenon_id: props.fenomenaId, stage_id: 'kenali', content_version: 'v1', base_version: 0,
    response_payload: { tanggapan: respons.value.trim(), ...(props.tipe === 'pilih-makanan' ? { piring: piring.value } : {}) },
    context: { activity_id: `${props.fenomenaId}-kenali`, activity_version: 'v1' },
  })
  tersimpan.value = true
  emit('selesai')
}
</script>
