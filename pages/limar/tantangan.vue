<template>
  <div class="mb-6">
    <span class="pill bg-sky-100 text-sky-700">ELABORATE — Tantangan Pantun</span>
  </div>

  <div class="text-center mb-6">
    <h1 class="page-title">🎡 Tantangan Spin Wheel</h1>
    <p class="page-sub">Tulis pantun keduamu dengan tantangan seru dari roda putar!</p>
  </div>

  <!-- Langkah 1: Pilih fenomena -->
  <div class="card p-6 max-w-4xl mx-auto mb-6">
    <p class="font-display font-bold text-slate-700 mb-3">1️⃣ Pilih Fenomena</p>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <button v-for="f in fenomena5e" :key="f.id" @click="fenomenaDipilih = f"
        class="rounded-2xl border-2 p-2 text-center transition hover:scale-[1.03]"
        :class="fenomenaDipilih?.id === f.id ? '!border-sky-400 !ring-4 !ring-sky-100 !bg-sky-50/70' : 'border-slate-100'">
        <img v-if="f.gambar" :src="f.gambar" :alt="f.nama" loading="lazy"
          class="rounded-xl w-full aspect-[4/3] object-cover mb-1" />
        <div v-else class="text-4xl mb-1 rounded-xl bg-slate-50 py-4">{{ f.icon }}</div>
        <p class="font-bold text-xs text-slate-700">{{ f.nama }}</p>
      </button>
    </div>
  </div>

  <!-- Langkah 2: Spin wheel -->
  <div class="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto items-start mb-6">
    <div class="card p-6">
      <p class="font-display font-bold text-slate-700 mb-3 text-center">2️⃣ Putar Roda Tantangan</p>
      <SpinWheel :segments="tantangan" @hasil="terimaTantangan" />
    </div>
    <div>
      <div v-if="tantanganTerpilih" class="card p-6 bg-amber-50/70">
        <p class="pill bg-amber-200 text-amber-800 mb-3">🎯 Tantangan Terpilih</p>
        <h2 class="font-display text-xl font-extrabold text-slate-800">{{ tantanganTerpilih.judul }}</h2>
        <p class="text-sm font-semibold text-slate-600 mt-2">{{ tantanganTerpilih.deskripsi }}</p>
        <button class="btn-soft !px-4 !py-1.5 text-xs mt-3" @click="tantanganTerpilih = null">🔄 Putar Ulang</button>
      </div>
      <div v-else class="card p-6 text-center text-slate-400 font-semibold">
        <div class="text-5xl mb-2">🎡</div>
        <p>Putar rodanya dulu untuk<br />mendapatkan tantanganmu!</p>
      </div>
    </div>
  </div>

  <!-- Langkah 3: Tulis pantun -->
  <div v-if="tantanganTerpilih" class="grid lg:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
    <div class="card p-5 bg-amber-50/70">
      <p class="font-display font-bold text-slate-700 mb-3">3️⃣ Gagasan & Pesan</p>
      <label class="block text-xs font-bold text-slate-500 mb-1">GAGASAN (ide utama)</label>
      <textarea v-model="gagasan" rows="2" class="input-cute mb-3" maxlength="300"
        placeholder="Tuliskan ide utamamu..."></textarea>
      <label class="block text-xs font-bold text-slate-500 mb-1">PESAN</label>
      <textarea v-model="pesan" rows="2" class="input-cute" maxlength="300"
        placeholder="Pesan yang ingin disampaikan..."></textarea>
      <div class="mt-3 rounded-2xl bg-sky-50 border border-sky-200 p-3">
        <p class="text-xs font-bold text-sky-600">🎯 TANTANGANMU</p>
        <p class="text-sm font-bold text-sky-800">{{ tantanganTerpilih.judul }}</p>
      </div>
    </div>

    <div class="card p-5">
      <p class="font-display font-bold text-slate-700 mb-3">📝 Pantun Keduamu</p>
      <div class="space-y-3">
        <div>
          <label class="text-xs font-bold text-sky-600">Sampiran</label>
          <input v-model="baris[0]" class="input-cute !py-2.5" placeholder="Baris 1 (sampiran)..." maxlength="120" />
          <input v-model="baris[1]" class="input-cute !py-2.5 mt-2" placeholder="Baris 2 (sampiran)..." maxlength="120" />
        </div>
        <div>
          <label class="text-xs font-bold text-emerald-600">Isi</label>
          <input v-model="baris[2]" class="input-cute !py-2.5" placeholder="Baris 3 (isi)..." maxlength="120" />
          <input v-model="baris[3]" class="input-cute !py-2.5 mt-2" placeholder="Baris 4 (isi)..." maxlength="120" />
        </div>
      </div>
      <button class="btn-primary w-full mt-4" :disabled="!bisaSimpan || menyimpan" @click="simpan">
        {{ menyimpan ? 'Menyimpan...' : '💾 Simpan Pantun' }}
      </button>
      <p v-if="error" class="text-rose-500 text-sm font-bold mt-2">{{ error }}</p>
      <p v-if="tersimpan" class="text-emerald-600 font-bold text-sm mt-2 text-center">🎉 Pantun keduamu tersimpan! Lanjut ke Evaluate ya!</p>
    </div>

    <div class="card p-5">
      <button @click="tampilKamus = !tampilKamus" class="w-full flex items-center justify-between text-left">
        <span class="font-display font-bold text-slate-700">📖 Kamus Kata <span class="text-xs font-semibold text-slate-400">(opsional)</span></span>
        <span class="text-xl">{{ tampilKamus ? '▲' : '▼' }}</span>
      </button>
      <p v-if="!tampilKamus" class="text-xs font-semibold text-slate-500 mt-1">
        Klik untuk melihat pilihan rima sebagai bantuan menyusun pantunmu.
      </p>
      <div v-if="tampilKamus" class="mt-4 grid gap-4">
        <div v-for="panel in rimaPanels" :key="panel.key"
          class="border-2 rounded-2xl p-4" :class="panel.key === 'A' ? 'border-sky-200 bg-sky-50/50' : 'border-emerald-200 bg-emerald-50/50'">
          <p class="font-display font-bold mb-1 text-sm" :class="panel.key === 'A' ? 'text-sky-700' : 'text-emerald-700'">
            {{ panel.title }}
          </p>
          <div class="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1 mb-3">
            <button v-for="s in rhymeSuffixes" :key="s" @click="rimaPilihan[panel.key].suffix = s"
              class="pill !text-xs border-2 transition"
              :class="rimaPilihan[panel.key].suffix === s
                ? (panel.key === 'A' ? 'bg-sky-500 text-white border-sky-500' : 'bg-emerald-500 text-white border-emerald-500')
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'">
              {{ s }}
            </button>
          </div>
          <div v-if="rimaPilihan[panel.key].suffix" class="space-y-2 max-h-48 overflow-y-auto pr-1">
            <div v-for="(label, kat) in kategoriLabel" :key="kat">
              <p class="text-xs font-bold text-slate-400 mb-1">{{ label }}</p>
              <div class="flex flex-wrap gap-1.5">
                <button v-for="k in (rhymeWords[rimaPilihan[panel.key].suffix]?.[kat] || [])" :key="k"
                  @click="pakaiKata(k)"
                  class="pill bg-white text-slate-700 border border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 transition !text-xs">
                  {{ k }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="text-center mt-8 flex justify-center gap-3">
    <NuxtLink to="/limar/elaborate" class="btn-soft">← Elaborate</NuxtLink>
    <NuxtLink to="/limar/evaluate" class="btn-primary text-lg" :class="{ 'opacity-50 pointer-events-none': !tersimpan }">Lanjut ke Evaluate →</NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { fenomena5e, type Fenomena } from '~/data/konten'
import { rhymeSuffixes, rhymeWords, kategoriLabel } from '~/data/kotak'
import type { SpinSegment } from '~/components/SpinWheel.vue'

definePageMeta({ layout: 'app', middleware: 'auth' })

const { namaLengkap, siswaId, karyaKedua } = useSession()
const supabase = useSupabase()
const sync = useSync()
const sfx = useSound()

const tantangan: (SpinSegment & { judul: string; deskripsi: string })[] = [
  { label: 'Jangan di baris 3', judul: 'Gunakan kata "Jangan" pada baris ke-3', deskripsi: 'Baris ketiga pantunmu harus mengandung kata "Jangan".' },
  { label: 'Nama kota', judul: 'Gunakan nama kota pada baris ke-1 atau ke-2', deskripsi: 'Sisipkan nama sebuah kota di baris pertama atau kedua (sampiran).' },
  { label: 'Tanya di baris 3', judul: 'Buat baris ke-3 berupa kalimat tanya', deskripsi: 'Baris ketiga pantunmu harus berbentuk pertanyaan (diakhiri tanda tanya).' },
  { label: 'Jika di baris 3', judul: 'Gunakan kata "Jika" pada baris ke-3', deskripsi: 'Baris ketiga pantunmu harus mengandung kata "Jika".' },
  { label: 'Nama hewan', judul: 'Gunakan nama hewan pada baris ke-1 atau ke-2', deskripsi: 'Sisipkan nama seekor hewan di baris pertama atau kedua (sampiran).' },
  { label: 'Ajakan di baris 4', judul: 'Akhiri baris ke-4 dengan kalimat ajakan', deskripsi: 'Baris keempat pantunmu harus berupa ajakan (misalnya diawali "Mari" atau "Ayo").' },
]

const fenomenaDipilih = ref<Fenomena | null>(null)
const tantanganTerpilih = ref<(typeof tantangan)[number] | null>(null)
const gagasan = ref('')
const pesan = ref('')
const baris = ref<string[]>(['', '', '', ''])
const menyimpan = ref(false)
const tersimpan = ref(false)
const error = ref('')
const tampilKamus = ref(false)

const rimaPanels = [
  { key: 'A' as const, title: '🅰️ Rima A — Baris 1 & 3' },
  { key: 'B' as const, title: '🅱️ Rima B — Baris 2 & 4' },
]
const rimaPilihan = ref({ A: { suffix: '' }, B: { suffix: '' } })

const bisaSimpan = computed(() =>
  fenomenaDipilih.value && tantanganTerpilih.value &&
  gagasan.value.trim() && pesan.value.trim() &&
  baris.value.every(b => b.trim())
)

function terimaTantangan(seg: SpinSegment) {
  tantanganTerpilih.value = seg as (typeof tantangan)[number]
}

function pakaiKata(kata: string) {
  for (let i = 3; i >= 0; i--) {
    if (!baris.value[i].trim()) {
      baris.value[i] = (baris.value[i] ? baris.value[i] + ' ' : '') + kata
      return
    }
  }
  baris.value[3] = baris.value[3] + ' ' + kata
}

async function simpan() {
  if (!bisaSimpan.value) return
  menyimpan.value = true
  error.value = ''
  const payload = {
    siswa_id: siswaId.value || null,
    app: '5e',
    fenomena_id: fenomenaDipilih.value!.id,
    pola_id: null,
    baris1: baris.value[0].trim(),
    baris2: baris.value[1].trim(),
    baris3: baris.value[2].trim(),
    baris4: baris.value[3].trim(),
    rima_dipilih: [] as string[]
    // tantangan/gagasan/pesan disimpan di sesi lokal; kolom DB belum ada (lihat supabase/migrasi)
  }
  let id = 'lokal-' + Date.now().toString(36)
  if (supabase) {
    const res = await sync.tulisTertunda('karya', 'insert', payload)
    if (res.ok && res.id) {
      id = res.id
    } else if (!res.ok && !res.queued) {
      console.error(res.error)
      error.value = 'Gagal menyimpan ke database, tapi kamu bisa lanjut.'
    }
  }
  karyaKedua.value = {
    id,
    nama: namaLengkap.value,
    app: '5e',
    fenomena: fenomenaDipilih.value!.nama,
    fenomenaIcon: fenomenaDipilih.value!.icon ?? '🌱',
    pola: 'Tantangan: ' + tantanganTerpilih.value!.judul,
    rima: [],
    gagasan: gagasan.value.trim(),
    pesan: pesan.value.trim(),
    baris: baris.value.map(b => b.trim()),
    tanggal: new Date()
  }
  menyimpan.value = false
  tersimpan.value = true
  sfx.success()
}
</script>
