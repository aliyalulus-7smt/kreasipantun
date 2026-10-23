<template>
  <div class="min-h-screen bg-[#FFFBF3] flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-white text-slate-800 border-r border-slate-200/80 flex-col hidden md:flex shrink-0 min-h-screen sticky top-0 h-screen">
      <div class="p-6 flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm shrink-0">
          <span class="material-symbols-outlined text-2xl" aria-hidden="true">auto_stories</span>
        </div>
        <div>
          <p class="font-display text-lg font-extrabold tracking-tight text-primary leading-tight">Kreasi Pantun</p>
          <p class="text-xs text-slate-400">Panel Guru</p>
        </div>
      </div>
      <nav class="flex-1 px-3 space-y-1">
        <button v-for="m in menu" :key="m.id" @click="tab = m.id"
          :class="['w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold transition flex items-center gap-3',
            tab === m.id ? 'bg-pfixed text-primary' : 'text-slate-500 hover:bg-panel']">
          <span class="material-symbols-outlined text-[20px] w-5 text-center" aria-hidden="true">{{ m.icon }}</span>{{ m.label }}
        </button>
      </nav>
      <div class="p-4 border-t border-slate-100">
        <p class="text-sm font-bold truncate">{{ user?.nama_lengkap }}</p>
        <p class="text-xs text-slate-400">@{{ user?.username }}</p>
        <button @click="keluar" class="mt-3 w-full text-left px-4 py-2 rounded-lg text-sm font-semibold text-slate-500 hover:bg-panel transition flex items-center gap-2">
          <span class="material-symbols-outlined text-[18px]" aria-hidden="true">logout</span> Keluar
        </button>
      </div>
    </aside>

    <!-- Mobile top bar -->
    <div class="md:hidden fixed top-0 inset-x-0 z-40 bg-white/95 backdrop-blur text-ink px-4 py-3 shadow-[0_1px_8px_rgba(31,42,55,0.06)]">
      <div class="flex items-center justify-between mb-2.5">
        <p class="font-extrabold">Kreasi Pantun <span class="text-slate-400 font-bold text-xs">· Panel Guru</span></p>
        <button @click="keluar" class="px-3 py-1.5 rounded-full text-xs font-bold bg-panel text-primary active:scale-95 transition inline-flex items-center gap-1"><span class="material-symbols-outlined text-[14px]" aria-hidden="true">logout</span> Keluar</button>
      </div>
      <div class="flex gap-1">
        <button v-for="m in menu" :key="m.id" @click="tab = m.id"
          :class="['flex-1 px-3 py-1.5 rounded-lg text-xs font-bold', tab === m.id ? 'bg-psky text-white' : 'text-slate-500 bg-panel']">{{ m.label }}</button>
      </div>
    </div>

    <!-- Main -->
    <main class="flex-1 min-w-0 p-4 md:p-8 pt-32 md:pt-8 max-w-6xl mx-auto w-full">
      <!-- ===== OVERVIEW ===== -->
      <div v-if="tab === 'dash'">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="font-display text-2xl font-extrabold text-ink">Dashboard</h1>
            <p class="text-sm text-slate-500">{{ tanggalHariIni }}</p>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div v-for="(s, i) in stats" :key="s.label" class="bg-white rounded-[20px] p-5 shadow-[0_8px_24px_rgba(31,42,55,0.06)]">
            <div class="flex items-start justify-between gap-2">
              <div>
                <p class="text-xs font-bold text-slate-400 uppercase tracking-wide">{{ s.label }}</p>
                <p class="text-3xl font-extrabold text-slate-900 mt-1">{{ s.nilai }}</p>
                <p class="text-xs text-slate-400 mt-1">{{ s.sub }}</p>
              </div>
              <span class="w-10 h-10 rounded-xl bg-con flex items-center justify-center text-primary shrink-0">
                <span class="material-symbols-outlined text-[20px]" aria-hidden="true">{{ ikonStat[i] }}</span>
              </span>
            </div>
          </div>
        </div>

        <div class="grid lg:grid-cols-2 gap-4 mb-6">
          <!-- Progres per fenomena -->
          <div class="bg-white rounded-[20px] p-5 shadow-[0_8px_24px_rgba(31,42,55,0.06)]">
            <p class="font-bold text-slate-800 mb-1">Progres per Fenomena</p>
            <p class="text-xs text-slate-400 mb-4">Rata-rata tahap selesai per siswa (%)</p>
            <div class="space-y-3">
              <div v-for="f in progresFenomena" :key="f.id">
                <div class="flex justify-between text-xs font-semibold mb-1">
                  <span class="text-slate-600">{{ f.nama }}</span>
                  <span class="text-slate-400">{{ f.persen }}%</span>
                </div>
                <div class="h-2 rounded-full bg-convariant overflow-hidden">
                  <div class="h-full rounded-full transition-all" :style="{ width: f.persen + '%', backgroundColor: f.hex }" />
                </div>
              </div>
            </div>
          </div>
          <!-- Distribusi rekomendasi -->
          <div class="bg-white rounded-[20px] p-5 shadow-[0_8px_24px_rgba(31,42,55,0.06)]">
            <p class="font-bold text-slate-800 mb-1">Kategori Siswa</p>
            <p class="text-xs text-slate-400 mb-4">Berdasarkan progres pengerjaan</p>
            <div class="space-y-3">
              <div v-for="k in distribusi" :key="k.label" class="flex items-center gap-3">
                <span :class="['w-3 h-3 rounded-full', k.warna]"></span>
                <span class="text-sm font-semibold text-slate-600 flex-1">{{ k.label }}</span>
                <span class="text-sm font-extrabold text-slate-900">{{ k.jumlah }}</span>
              </div>
            </div>
            <div class="mt-4 pt-4 border-t border-slate-100">
              <p class="text-xs text-slate-400 leading-relaxed">Kategori dihitung otomatis dari jumlah tahap yang dikerjakan. Bukan penilaian akademik final.</p>
            </div>
          </div>
        </div>

        <!-- Kelas ringkas -->
        <div class="bg-white rounded-[20px] p-5 shadow-[0_8px_24px_rgba(31,42,55,0.06)]">
          <div class="flex items-center justify-between mb-4">
            <p class="font-bold text-slate-800">Kelas Saya</p>
            <button @click="tab = 'kelas'" class="text-sm font-bold text-primary hover:underline">Kelola →</button>
          </div>
          <div v-if="!daftarKelas.length" class="text-sm text-slate-400">Belum ada kelas.</div>
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div v-for="k in daftarKelas" :key="k.kelas.id" class="border border-convariant/60 bg-conlow rounded-[20px] p-4">
              <p class="font-bold text-slate-800">{{ k.kelas.nama }}</p>
              <p class="text-xs text-slate-400 mt-0.5">{{ k.siswa.length }} siswa · {{ rataKelas(k) }}% rata-rata</p>
              <p class="font-mono text-lg font-bold text-primary tracking-widest mt-2">{{ k.kelas.kode }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== KELAS ===== -->
      <div v-if="tab === 'kelas'">
        <div class="flex items-center justify-between mb-6">
          <h1 class="font-display text-2xl font-extrabold text-ink">Kelas</h1>
          <button @click="tampilBuat = !tampilBuat" class="bg-psky text-white px-4 py-2 rounded-full text-sm font-display font-bold hover:brightness-105 transition shadow-lg shadow-sky-200">+ Buat Kelas</button>
        </div>
        <div v-if="tampilBuat" class="bg-white rounded-[20px] p-5 shadow-[0_8px_24px_rgba(31,42,55,0.06)] mb-4 flex gap-2">
          <input v-model="namaKelas" class="flex-1 bg-conlow rounded-xl px-4 py-2.5 text-sm font-semibold placeholder:text-muted placeholder:font-medium focus:bg-white focus:outline-none focus:shadow-md transition" placeholder="Nama kelas, contoh: VII-A" />
          <button @click="buatKelas" :disabled="!namaKelas.trim() || membuat" class="bg-psky text-white px-5 rounded-full text-sm font-display font-bold hover:brightness-105 disabled:opacity-40 shadow-lg shadow-sky-200">Buat</button>
        </div>
        <div class="bg-white rounded-[20px] shadow-[0_8px_24px_rgba(31,42,55,0.06)] overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-conlow text-slate-500 text-xs uppercase">
              <tr>
                <th class="text-left px-5 py-3 font-bold">Kelas</th>
                <th class="text-left px-5 py-3 font-bold">Kode</th>
                <th class="text-left px-5 py-3 font-bold">Siswa</th>
                <th class="text-left px-5 py-3 font-bold">Rata-rata</th>
                <th class="text-right px-5 py-3 font-bold">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="k in daftarKelas" :key="k.kelas.id" class="hover:bg-conlow/60">
                <td class="px-5 py-3.5 font-bold text-slate-800">{{ k.kelas.nama }}</td>
                <td class="px-5 py-3.5"><span class="font-mono font-bold text-primary tracking-widest">{{ k.kelas.kode }}</span></td>
                <td class="px-5 py-3.5 text-slate-600">{{ k.siswa.length }}</td>
                <td class="px-5 py-3.5 text-slate-600">{{ rataKelas(k) }}%</td>
                <td class="px-5 py-3.5 text-right space-x-2">
                  <button @click="salinKode(k.kelas.kode)" class="text-xs font-bold text-slate-500 hover:text-primary">Salin</button>
                  <button @click="resetKode(k.kelas.id)" class="text-xs font-bold text-slate-500 hover:text-amber-600">Reset</button>
                </td>
              </tr>
              <tr v-if="!daftarKelas.length"><td colspan="5" class="px-5 py-8 text-center text-slate-400">Belum ada kelas.</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ===== SISWA ===== -->
      <div v-if="tab === 'siswa'">
        <h1 class="font-display text-2xl font-extrabold text-ink mb-6">Siswa</h1>
        <div class="bg-white rounded-[20px] p-4 shadow-[0_8px_24px_rgba(31,42,55,0.06)] mb-4 flex flex-wrap gap-3">
          <input v-model="cari" class="flex-1 min-w-[200px] bg-conlow rounded-xl px-4 py-2.5 text-sm font-semibold placeholder:text-muted placeholder:font-medium focus:bg-white focus:outline-none focus:shadow-md transition" placeholder="Cari nama atau username..." />
          <select v-model="filterKelas" class="bg-conlow rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 focus:bg-white focus:outline-none focus:shadow-md transition">
            <option value="">Semua kelas</option>
            <option v-for="k in daftarKelas" :key="k.kelas.id" :value="k.kelas.id">{{ k.kelas.nama }}</option>
          </select>
        </div>
        <div class="bg-white rounded-[20px] shadow-[0_8px_24px_rgba(31,42,55,0.06)] overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-sm min-w-[640px]">
              <thead class="bg-conlow text-slate-500 text-xs uppercase">
                <tr>
                  <th class="text-left px-5 py-3 font-bold">Siswa</th>
                  <th class="text-left px-5 py-3 font-bold">Kelas</th>
                  <th class="text-left px-5 py-3 font-bold">Progres</th>
                  <th class="text-left px-5 py-3 font-bold">Kategori</th>
                  <th class="text-right px-5 py-3 font-bold">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="s in siswaTampil" :key="s.id" class="hover:bg-conlow/60">
                  <td class="px-5 py-3.5">
                    <p class="font-bold text-slate-800">{{ s.nama_lengkap }}</p>
                    <p class="text-xs text-slate-400">@{{ s.username }} · No. {{ s.no_absen || '—' }}</p>
                  </td>
                  <td class="px-5 py-3.5 text-slate-600">{{ s.namaKelas }}</td>
                  <td class="px-5 py-3.5">
                    <div class="flex items-center gap-2">
                      <div class="w-24 h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div class="h-full bg-psky rounded-full" :style="{ width: persen(s) + '%' }" />
                      </div>
                      <span class="text-xs font-bold text-slate-500">{{ totalTahap(s) }}/40</span>
                    </div>
                  </td>
                  <td class="px-5 py-3.5"><span :class="['text-xs font-bold px-2.5 py-1 rounded-full', warnaRekom(rekom(s).k)]">{{ rekom(s).label }}</span></td>
                  <td class="px-5 py-3.5 text-right space-x-2 whitespace-nowrap">
                    <button @click="lihatKarya(s)" class="text-xs font-bold text-slate-500 hover:text-primary">Karya</button>
                    <button @click="siswaDinilai = s" class="text-xs font-bold text-slate-500 hover:text-primary">Nilai</button>
                  </td>
                </tr>
                <tr v-if="!siswaTampil.length"><td colspan="5" class="px-5 py-8 text-center text-slate-400">Tidak ada siswa.</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Karya tampil inline -->
        <div v-if="karyaAktif" class="bg-white rounded-[20px] p-5 shadow-[0_8px_24px_rgba(31,42,55,0.06)] mt-4">
          <div class="flex items-center justify-between mb-3">
            <p class="font-bold text-slate-800">Karya — {{ karyaAktif.nama }}</p>
            <button @click="karyaAktif = null" class="text-xs font-bold text-slate-400">Tutup ✕</button>
          </div>
          <div v-if="!karyaAktif.list.length" class="text-sm text-slate-400">Belum ada karya.</div>
          <div class="grid md:grid-cols-2 gap-3">
            <div v-for="w in karyaAktif.list" :key="w.id" class="border border-convariant/50 rounded-xl p-4 bg-conlow">
              <p class="text-xs font-bold text-primary mb-2">{{ namaFenomena(w.phenomenon_id) }}</p>
              <p v-for="i in 4" :key="i" class="font-display font-semibold text-sm" :class="i <= 2 ? 'italic text-slate-600' : 'font-bold text-primary'">{{ w['larik' + i] }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal penilaian -->
    <div v-if="siswaDinilai" class="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50" @click.self="siswaDinilai = null">
      <div class="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
        <p class="font-extrabold text-slate-900 mb-1">Penilaian — {{ siswaDinilai.nama_lengkap }}</p>
        <p class="text-xs text-slate-400 mb-4">Tersimpan terpisah, tidak mengubah karya siswa.</p>
        <label class="block text-xs font-bold text-slate-500 mb-1">Fenomena</label>
        <select v-model="formFenomena" class="w-full bg-conlow rounded-xl px-3 py-2.5 text-sm font-semibold focus:bg-white focus:outline-none focus:shadow-md transition mb-3">
          <option v-for="f in FENOMENA" :key="f.id" :value="f.id">{{ f.nama }}</option>
        </select>
        <label class="block text-xs font-bold text-slate-500 mb-1">Nilai</label>
        <input v-model="formNilai" class="w-full bg-conlow rounded-xl px-3 py-2.5 text-sm font-semibold focus:bg-white focus:outline-none focus:shadow-md transition mb-3" placeholder="Contoh: 85 / Baik Sekali" />
        <label class="block text-xs font-bold text-slate-500 mb-1">Komentar</label>
        <textarea v-model="formKomentar" rows="3" class="w-full bg-conlow rounded-xl px-3 py-2.5 text-sm font-semibold placeholder:text-muted placeholder:font-medium focus:bg-white focus:outline-none focus:shadow-md transition mb-4" placeholder="Masukan untuk siswa..." />
        <div class="flex gap-2">
          <button @click="siswaDinilai = null" class="flex-1 border border-slate-200 rounded-lg py-2.5 text-sm font-bold text-slate-600">Batal</button>
          <button @click="kirimNilai" :disabled="menyimpan" class="flex-1 bg-psky text-white rounded-full py-2.5 text-sm font-display font-bold hover:brightness-105">Simpan</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FENOMENA } from '~/data/fenomena'
import { HEX_FENOMENA } from '~/utils/fenomena-ui'

definePageMeta({ layout: 'app', middleware: 'auth-bff' })

const { user, logout } = useAuth()
const menu = [
  { id: 'dash', label: 'Dashboard', icon: 'dashboard' },
  { id: 'kelas', label: 'Kelas', icon: 'school' },
  { id: 'siswa', label: 'Siswa', icon: 'group' },
]
const ikonStat = ['group', 'school', 'trending_up', 'stars']
const tab = ref('dash')
const daftarKelas = ref<any[]>([])
const tampilBuat = ref(false)
const namaKelas = ref('')
const membuat = ref(false)
const cari = ref('')
const filterKelas = ref('')
const siswaDinilai = ref<any>(null)
const formFenomena = ref(FENOMENA[0].id)
const formNilai = ref('')
const formKomentar = ref('')
const menyimpan = ref(false)
const karyaAktif = ref<any>(null)

const tanggalHariIni = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

onMounted(muat)

async function muat() {
  try {
    const r = await $fetch<{ data: { kelas: any[] } }>('/api/v1/guru/siswa')
    daftarKelas.value = r.data.kelas.map(k => ({
      ...k,
      siswa: k.siswa.map((s: any) => ({ ...s, namaKelas: k.kelas.nama, kelasId: k.kelas.id })),
    }))
  } catch {}
}

const semuaSiswa = computed(() => daftarKelas.value.flatMap(k => k.siswa))
const siswaTampil = computed(() => semuaSiswa.value.filter(s => {
  const c = (s.nama_lengkap + s.username).toLowerCase().includes(cari.value.toLowerCase())
  const k = !filterKelas.value || s.kelasId === filterKelas.value
  return c && k
}))

const stats = computed(() => {
  const n = semuaSiswa.value.length
  const avg = n ? Math.round(semuaSiswa.value.reduce((a, s) => a + persen(s), 0) / n) : 0
  return [
    { label: 'Total Siswa', nilai: n, sub: `${daftarKelas.value.length} kelas` },
    { label: 'Total Kelas', nilai: daftarKelas.value.length, sub: 'kelas aktif' },
    { label: 'Rata-rata Progres', nilai: avg + '%', sub: 'dari 40 tahap' },
    { label: 'Siap Pengayaan', nilai: semuaSiswa.value.filter(s => rekom(s).k === 'siap').length, sub: 'siswa' },
  ]
})

const progresFenomena = computed(() => FENOMENA.map(f => {
  const vals = semuaSiswa.value.map(s => new Set((s.progres || []).filter((p: any) => p.phenomenon_id === f.id).map((p: any) => p.stage_id)).size)
  const avg = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length / 5 * 100) : 0
  return { id: f.id, nama: f.nama, persen: avg, hex: HEX_FENOMENA[f.warna] || '#0EA5E9' }
}))

const distribusi = computed(() => {
  const hit: Record<string, number> = { kosong: 0, awal: 0, jalan: 0, siap: 0 }
  semuaSiswa.value.forEach(s => hit[rekom(s).k]++)
  return [
    { label: 'Belum mulai', jumlah: hit.kosong, warna: 'bg-slate-300' },
    { label: 'Baru mulai', jumlah: hit.awal, warna: 'bg-amber-400' },
    { label: 'Sedang berkembang', jumlah: hit.jalan, warna: 'bg-sky-400' },
    { label: 'Siap pengayaan', jumlah: hit.siap, warna: 'bg-emerald-400' },
  ]
})

function totalTahap(s: any): number {
  return new Set((s.progres || []).map((p: any) => `${p.phenomenon_id}:${p.stage_id}`)).size
}
function persen(s: any): number { return Math.round(totalTahap(s) / 40 * 100) }
function rataKelas(k: any): number {
  if (!k.siswa.length) return 0
  return Math.round(k.siswa.reduce((a: number, s: any) => a + persen(s), 0) / k.siswa.length)
}
function namaFenomena(id: string) { return FENOMENA.find(f => f.id === id)?.nama || id }
function rekom(s: any): { k: string; label: string } {
  const t = totalTahap(s)
  if (t === 0) return { k: 'kosong', label: 'Belum mulai' }
  if (t < 10) return { k: 'awal', label: 'Baru mulai' }
  if (t < 30) return { k: 'jalan', label: 'Berkembang' }
  return { k: 'siap', label: 'Siap pengayaan' }
}
function warnaRekom(k: string) {
  return { kosong: 'bg-slate-100 text-slate-500', awal: 'bg-amber-100 text-amber-700', jalan: 'bg-sky-100 text-sky-700', siap: 'bg-emerald-100 text-emerald-700' }[k]
}

async function buatKelas() {
  membuat.value = true
  try {
    await $fetch('/api/v1/classes', { method: 'POST', body: { nama: namaKelas.value.trim() } })
    namaKelas.value = ''; tampilBuat.value = false
    await muat()
  } catch {} finally { membuat.value = false }
}
async function resetKode(id: string) {
  if (!confirm('Reset kode? Kode lama tidak bisa dipakai pendaftar baru.')) return
  try { await $fetch(`/api/v1/classes/${id}/reset-code`, { method: 'POST' }); await muat() } catch {}
}
function salinKode(kode: string) {
  navigator.clipboard?.writeText(kode)
  alert(`Kode ${kode} disalin!`)
}
async function lihatKarya(s: any) {
  try {
    const r = await $fetch<{ data: { items: any[] } }>('/api/v1/works?limit=100')
    karyaAktif.value = { nama: s.nama_lengkap, list: (r.data.items || []).filter((w: any) => w.user_id === s.id) }
  } catch { karyaAktif.value = { nama: s.nama_lengkap, list: [] } }
}
async function kirimNilai() {
  menyimpan.value = true
  try {
    await $fetch('/api/v1/guru/evaluasi', {
      method: 'POST',
      body: { user_id: siswaDinilai.value.id, phenomenon_id: formFenomena.value, nilai: formNilai.value, komentar: formKomentar.value },
    })
    siswaDinilai.value = null; formNilai.value = ''; formKomentar.value = ''
    alert('Penilaian tersimpan.')
  } catch {} finally { menyimpan.value = false }
}
async function keluar() { await logout() }
</script>
