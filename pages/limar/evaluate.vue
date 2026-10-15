<template>
  <div class="mb-6">
    <span class="pill bg-rose-100 text-rose-700">EVALUATE — Evaluasi Karya</span>
  </div>

  <div class="text-center mb-8">
    <h1 class="page-title">🏆 Evaluasi Karya</h1>
    <p class="page-sub">Periksa kedua pantunmu, revisi bila perlu, lalu simpan sebagai karya akhir!</p>
  </div>

  <!-- 1. Periksa kedua pantun -->
  <div class="max-w-5xl mx-auto mb-6">
    <p class="font-display font-bold text-lg text-slate-700 mb-4 text-center">1️⃣ Periksa Kedua Pantun</p>
    <div class="grid md:grid-cols-2 gap-6 items-start">
      <div v-for="(p, pi) in pantuns" :key="pi" class="card p-6">
        <p class="font-display font-bold text-slate-700 mb-3">
          {{ pi === 0 ? '📜 Pantun Pertama' : '🎡 Pantun Kedua (Tantangan)' }}
        </p>

        <div v-if="p">
          <!-- Tampilan pantun -->
          <div v-if="!p.merevisi" class="bg-amber-50 rounded-2xl p-5 mb-4">
            <p v-for="(b, bi) in p.baris" :key="bi"
              class="font-display font-semibold text-slate-700 leading-relaxed">
              {{ b }}
            </p>
            <p v-if="p.pola" class="text-xs font-bold text-slate-400 mt-2">{{ p.pola }}</p>
          </div>

          <!-- Kolom penyuntingan (revisi) -->
          <div v-else class="space-y-2 mb-4">
            <input v-for="bi in 4" :key="bi" v-model="p.editBaris[bi - 1]"
              class="input-cute !py-2.5" :placeholder="`Baris ${bi}...`" maxlength="120" />
            <button class="btn-primary w-full !py-2.5" @click="selesaiRevisi(pi)">✅ Selesai Revisi</button>
          </div>

          <!-- Checklist -->
          <p class="text-sm font-bold text-slate-500 mb-2">Checklist pemeriksaan:</p>
          <div class="space-y-2">
            <label v-for="(k, ki) in p.checklist" :key="ki"
              class="flex items-start gap-2.5 text-sm font-semibold text-slate-600 cursor-pointer bg-slate-50 rounded-xl px-3 py-2">
              <input type="checkbox" v-model="k.cek" class="w-5 h-5 mt-0.5 accent-rose-500 shrink-0" />
              {{ k.teks }}
            </label>
          </div>
          <div class="mt-3 text-center">
            <span class="pill text-sm" :class="skorChecklist(p) === 6 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'">
              {{ skorChecklist(p) }} / 6 kriteria terpenuhi
            </span>
          </div>

          <button v-if="!p.merevisi" class="btn-soft w-full mt-4 !py-2.5" @click="p.merevisi = true">
            ✏️ Revisi Pantun
          </button>
        </div>

        <div v-else class="text-center text-slate-400 font-semibold py-8">
          <div class="text-5xl mb-2">🪶</div>
          <p>Belum ada {{ pi === 0 ? 'pantun pertama' : 'pantun kedua' }}.</p>
          <NuxtLink :to="pi === 0 ? '/limar/elaborate' : '/limar/tantangan'" class="btn-primary mt-3">
            {{ pi === 0 ? '✍️ Buat di Elaborate' : '🎡 Buat di Tantangan' }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>

  <!-- 2 & 3. Simpan karya akhir -->
  <div class="max-w-3xl mx-auto">
    <div class="card p-6 text-center bg-gradient-to-br from-rose-50 to-amber-50">
      <p class="font-display font-bold text-lg text-slate-700 mb-1">2️⃣ Simpan Karya Akhir</p>
      <p class="text-sm font-semibold text-slate-500 mb-4">
        Pastikan kedua pantun sudah diperiksa dan direvisi, lalu simpan sebagai hasil akhirmu.
      </p>
      <button class="btn-primary text-lg" :disabled="!bisaSimpanAkhir || menyimpan" @click="simpanAkhir">
        {{ menyimpan ? 'Menyimpan...' : tersimpanAkhir ? '✅ Karya Akhir Tersimpan' : '💾 Simpan Karya Akhir' }}
      </button>
      <p v-if="error" class="text-rose-500 text-sm font-bold mt-2">{{ error }}</p>
      <p v-if="tersimpanAkhir" class="text-emerald-600 font-bold text-sm mt-3">
        🎉 Kedua pantunmu tersimpan sebagai karya akhir. Kerja bagus!
      </p>
      <div v-if="tersimpanAkhir" class="flex flex-wrap justify-center gap-3 mt-4">
        <NuxtLink to="/karyaku" class="btn-primary">📖 Lihat di Buku Karyaku</NuxtLink>
        <NuxtLink to="/pilih" class="btn-soft">🏠 Kembali ke Menu</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'app', middleware: 'auth' })

const { siswaId, karyaTerakhir, karyaKedua } = useSession()
const supabase = useSupabase()
const sync = useSync()
const sfx = useSound()

const kriteriaTeks = [
  'Terdiri atas empat baris.',
  'Baris pertama dan kedua merupakan sampiran.',
  'Baris ketiga dan keempat merupakan isi.',
  'Memiliki pola rima yang sesuai.',
  'Isi pantun menyampaikan gagasan dan pesan yang jelas.',
  'Pilihan kata sesuai dengan gagasan dan pesan.',
]

interface PantunState {
  sumber: any
  baris: string[]
  editBaris: string[]
  checklist: { teks: string; cek: boolean }[]
  merevisi: boolean
  pola?: string
}

function buatState(sumber: any): PantunState | null {
  if (!sumber) return null
  const baris = [...(sumber.baris ?? [])]
  while (baris.length < 4) baris.push('')
  return {
    sumber,
    baris,
    editBaris: [...baris],
    checklist: kriteriaTeks.map(teks => ({ teks, cek: false })),
    merevisi: false,
    pola: sumber.pola,
  }
}

const pantuns = ref<(PantunState | null)[]>([
  buatState(karyaTerakhir.value),
  buatState(karyaKedua.value),
])

const menyimpan = ref(false)
const tersimpanAkhir = ref(false)
const error = ref('')

function skorChecklist(p: PantunState) {
  return p.checklist.filter(k => k.cek).length
}

function selesaiRevisi(pi: number) {
  const p = pantuns.value[pi]
  if (!p) return
  if (p.editBaris.some(b => !b.trim())) return
  p.baris = p.editBaris.map(b => b.trim())
  p.sumber.baris = [...p.baris]
  p.merevisi = false
  sfx.success()
}

const bisaSimpanAkhir = computed(() =>
  pantuns.value.every(p => p && p.baris.every(b => b.trim()))
)

async function simpanAkhir() {
  if (!bisaSimpanAkhir.value) return
  menyimpan.value = true
  error.value = ''
  try {
    for (const p of pantuns.value) {
      if (!p) continue
      // Perbarui state sesi dengan hasil revisi
      p.sumber.baris = [...p.baris]
      p.sumber.final = true
      // Perbarui record database bila sudah punya id asli (bukan lokal)
      const id = p.sumber.id
      if (supabase && id && !String(id).startsWith('lokal-')) {
        const res = await sync.tulisTertunda('karya', 'update', {
          baris1: p.baris[0], baris2: p.baris[1], baris3: p.baris[2], baris4: p.baris[3],
        }, { id })
        if (!res.ok && !res.queued) console.error(res.error)
      }
    }
    // Sinkronkan kembali ke session agar /karyaku menampilkan versi final
    karyaTerakhir.value = pantuns.value[0]?.sumber ?? karyaTerakhir.value
    karyaKedua.value = pantuns.value[1]?.sumber ?? karyaKedua.value
    tersimpanAkhir.value = true
    sfx.success()
  } catch (e) {
    console.error(e)
    error.value = 'Gagal menyimpan karya akhir.'
  }
  menyimpan.value = false
}
</script>
