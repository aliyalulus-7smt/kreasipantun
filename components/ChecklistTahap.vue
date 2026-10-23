<!-- Evaluasi Karya: checklist refleksi diri.
     Item suku kata (8-12) & sajak a-b-a-b dinilai OTOMATIS dari pantun yang
     dibuat siswa di tahap Asah; item lain dicentang manual. -->
<template>
  <div class="space-y-5">
    <div class="card !rounded-2xl p-5">
      <p class="font-display font-bold text-slate-700 mb-1">📋 Evaluasi Karyamu</p>
      <p class="text-sm font-semibold text-slate-500 mb-4">Centang setiap pernyataan yang sudah sesuai dengan pantunmu. Item bertanda 🤖 dinilai otomatis dari pantunmu di tahap Asah.</p>
      <div class="space-y-2.5">
        <div v-for="(it, i) in data.item" :key="i">
          <button @click="toggle(i)" :disabled="otomatisAktif(i) || tersimpan"
            :class="['w-full text-left card !rounded-2xl p-4 border-2 transition flex items-start gap-3',
              nilaiItem(i) ? '!border-emerald-400 bg-emerald-50/60' : 'hover:border-slate-300',
              otomatisAktif(i) ? 'cursor-default' : '']">
            <span :class="['w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5',
              nilaiItem(i) ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300']">
              <span v-if="nilaiItem(i)" class="text-sm">✓</span>
            </span>
            <span class="flex-1">
              <span class="font-semibold text-slate-700 text-sm">{{ it }}</span>
              <span v-if="jenisOtomatis(it)" class="ml-2 pill !px-2 !py-0.5 bg-con text-onfixvar text-[11px] font-bold align-middle">🤖 Otomatis</span>
              <span v-if="jenisOtomatis(it) === 'suku' && analisis" class="block mt-1.5 text-xs font-bold" :class="analisis.sukuOk ? 'text-emerald-600' : 'text-rose-500'">
                Pantunmu: baris 1 = {{ analisis.suku[0] }}, baris 2 = {{ analisis.suku[1] }}, baris 3 = {{ analisis.suku[2] }}, baris 4 = {{ analisis.suku[3] }} suku kata {{ analisis.sukuOk ? '— semua dalam rentang 8–12 ✓' : '— masih ada baris di luar rentang 8–12' }}
              </span>
              <span v-else-if="jenisOtomatis(it) === 'sajak' && analisis" class="block mt-1.5 text-xs font-bold" :class="analisis.sajakOk ? 'text-emerald-600' : 'text-rose-500'">
                Bunyi akhir pantunmu: {{ analisis.akhir.join(' · ') }} {{ analisis.sajakOk ? '— membentuk sajak a-b-a-b ✓' : '— belum membentuk sajak a-b-a-b (baris 1 = 3 dan 2 = 4)' }}
              </span>
              <span v-else-if="jenisOtomatis(it) && !analisis" class="block mt-1.5 text-xs font-bold text-slate-400">
                Penilaian otomatis aktif setelah pantun tahap Asah tersimpan.
              </span>
            </span>
          </button>
        </div>
      </div>
    </div>

    <div class="card !rounded-2xl p-5">
      <label class="block font-bold text-slate-700 mb-1.5 text-sm">💭 Refleksimu (wajib diisi)</label>
      <textarea v-model="refleksi" rows="3" class="w-full bg-conlow rounded-xl px-4 py-3 font-semibold text-ink placeholder:text-muted placeholder:font-medium focus:bg-white focus:outline-none focus:shadow-md transition disabled:bg-slate-100" :disabled="tersimpan" placeholder="Apa yang sudah bagus dan apa yang ingin kamu perbaiki?" />
    </div>

    <div v-if="!tersimpan && daftarKurang.length" class="card !rounded-2xl p-5 border-2 !border-rose-300 bg-rose-50/70">
      <p class="font-display font-bold text-rose-600 mb-2">⚠️ Belum bisa lanjut — masih ada yang kurang:</p>
      <ul class="list-disc list-inside space-y-1.5 text-sm font-semibold text-rose-500">
        <li v-for="(k, i) in daftarKurang" :key="i">{{ k }}</li>
      </ul>
    </div>

    <button v-if="tersimpan" class="btn-soft w-full" @click="tersimpan = false">✏️ Ubah Evaluasi</button>
    <button v-else class="btn-primary w-full" :disabled="!bisaSimpan" @click="simpan">
      💾 Simpan Evaluasi
    </button>
    <p v-if="tersimpan" class="text-center text-emerald-600 font-bold text-sm">✓ Tersimpan</p>
  </div>
</template>

<script setup lang="ts">
import { countLineSyllables } from '~/utils/validatePantun'

const props = defineProps<{ data: Record<string, any>; fenomenaId: string; dataTersimpan?: Record<string, any> | null; pantunAsah?: string[] | null }>()
const { antrekan } = useOutbox()

const centang = ref<Record<number, boolean>>({})
const refleksi = ref(props.dataTersimpan?.refleksi || '')
const tersimpan = ref(!!props.dataTersimpan)
if (Array.isArray(props.dataTersimpan?.checklist)) {
  const awal: Record<number, boolean> = {}
  props.dataTersimpan!.checklist.forEach((it: any, i: number) => { awal[i] = !!it?.ya })
  centang.value = awal
}

// ── Penilaian otomatis dari pantun Asah ─────────────────────────────
function bunyiAkhir(line: string): string {
  const kata = (line || '').trim().split(/\s+/).pop()?.toLowerCase().replace(/[^a-z]/g, '') || ''
  const m = kata.match(/[aiueo]+[^aiueo]*$/)
  return m ? m[0] : kata.slice(-2)
}
const analisis = computed(() => {
  const b = props.pantunAsah
  if (!b || b.length < 4 || b.some(x => !x?.trim())) return null
  const suku = b.map(l => countLineSyllables(l))
  const akhir = b.map(bunyiAkhir)
  return {
    suku,
    sukuOk: suku.every(n => n >= 8 && n <= 12),
    akhir,
    sajakOk: akhir[0] === akhir[2] && akhir[1] === akhir[3],
  }
})
function jenisOtomatis(it: string): 'suku' | 'sajak' | null {
  const t = (it || '').toLowerCase()
  if (t.includes('suku kata')) return 'suku'
  if (t.includes('sajak') || t.includes('a-b-a-b')) return 'sajak'
  return null
}
function otomatisAktif(i: number) {
  return !!analisis.value && !!jenisOtomatis(props.data.item?.[i] || '')
}
function nilaiItem(i: number): boolean {
  const jenis = jenisOtomatis(props.data.item?.[i] || '')
  if (analisis.value && jenis === 'suku') return analisis.value.sukuOk
  if (analisis.value && jenis === 'sajak') return analisis.value.sajakOk
  return !!centang.value[i]
}

function toggle(i: number) {
  if (otomatisAktif(i)) return
  centang.value = { ...centang.value, [i]: !centang.value[i] }
}

// ── Gerbang kelengkapan: semua item harus tercentang & refleksi terisi ──
// Item otomatis hanya dihitung terpenuhi dari hasil analisis pantun Asah
// (bukan dari centang manual), supaya evaluasi tidak bisa diloloskan
// sebelum pantunnya memenuhi ketentuan suku kata & sajak.
function itemTerpenuhi(i: number): boolean {
  const jenis = jenisOtomatis(props.data.item?.[i] || '')
  if (jenis) return !!analisis.value && nilaiItem(i)
  return !!centang.value[i]
}
const semuaTercentang = computed(() => (props.data.item || []).every((_: string, i: number) => itemTerpenuhi(i)))
const refleksiTerisi = computed(() => refleksi.value.trim().length > 0)
const bisaSimpan = computed(() => semuaTercentang.value && refleksiTerisi.value)

/** Rincian kekurangan dalam bahasa siswa, ditampilkan selama belum lengkap. */
const daftarKurang = computed(() => {
  const kurang: string[] = []
  const a = analisis.value
  if (!a) {
    kurang.push('Pantunmu di tahap Asah Kreativitas belum tersimpan — selesaikan tahap Asah dulu, ya.')
  } else {
    if (!a.sukuOk) {
      a.suku.forEach((n, i) => {
        if (n < 8 || n > 12) kurang.push(`Baris ${i + 1} pantunmu ${n} suku kata — harusnya 8 sampai 12 suku kata.`)
      })
    }
    if (!a.sajakOk) {
      kurang.push(`Sajak pantunmu belum a-b-a-b: bunyi akhir baris 1 harus sama dengan baris 3, dan baris 2 sama dengan baris 4 (sekarang: ${a.akhir.join(' · ')}).`)
    }
    if (!a.sukuOk || !a.sajakOk) {
      kurang.push('Perbaiki pantunmu lewat tombol ✏️ Ubah Karya di tahap Asah Kreativitas, lalu kembali ke sini.')
    }
  }
  ;(props.data.item || []).forEach((it: string, i: number) => {
    if (!jenisOtomatis(it) && !centang.value[i]) kurang.push(`Pernyataan "${it}" belum kamu centang.`)
  })
  if (!refleksiTerisi.value) kurang.push('Refleksimu belum diisi.')
  return kurang
})

function simpan() {
  if (!bisaSimpan.value) return
  antrekan({
    phenomenon_id: props.fenomenaId, stage_id: 'evaluasi', content_version: 'v1', base_version: 0,
    response_payload: {
      checklist: (props.data.item || []).map((it: string, i: number) => ({
        item: it, ya: nilaiItem(i), ...(otomatisAktif(i) ? { otomatis: true } : {}),
      })),
      refleksi: refleksi.value.trim() || null,
    },
    context: { activity_id: `${props.fenomenaId}-evaluasi`, activity_version: 'v1' },
  })
  tersimpan.value = true
}
</script>
