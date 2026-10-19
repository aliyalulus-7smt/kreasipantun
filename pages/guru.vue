<template>
  <div class="mb-6 flex items-center justify-between">
    <div>
      <h1 class="page-title">👩🏫 Dashboard Guru</h1>
      <p class="page-sub">Halo, {{ user?.nama_lengkap }}! Pantau progres siswamu di sini.</p>
    </div>
    <button class="btn-soft !px-4 !py-2 text-sm" @click="keluar">Keluar</button>
  </div>

  <!-- Kelola kelas -->
  <div class="card p-5 mb-6 max-w-4xl mx-auto">
    <div class="flex items-center justify-between mb-4">
      <p class="font-display font-bold text-slate-700">🏫 Kelasku</p>
      <button class="btn-primary !px-4 !py-2 text-sm" @click="tampilBuat = !tampilBuat">+ Buat Kelas</button>
    </div>
    <div v-if="tampilBuat" class="flex gap-2 mb-4">
      <input v-model="namaKelas" class="input-cute" placeholder="Nama kelas, contoh: VII-A" />
      <button class="btn-primary !px-5" :disabled="!namaKelas.trim() || membuat" @click="buatKelas">Buat</button>
    </div>
    <div v-if="!daftarKelas.length" class="text-center text-slate-400 font-semibold py-4">
      Belum ada kelas. Buat kelas dulu untuk mendapatkan kode.
    </div>
    <div v-for="k in daftarKelas" :key="k.kelas.id" class="border-2 border-slate-100 rounded-2xl p-4 mb-3">
      <div class="flex items-center justify-between flex-wrap gap-2">
        <div>
          <p class="font-display font-bold text-slate-700">{{ k.kelas.nama }}</p>
          <p class="text-sm font-bold text-slate-500">Kode: <span class="font-mono text-lg text-emerald-600 tracking-widest">{{ k.kelas.kode }}</span></p>
          <p class="text-xs font-semibold text-slate-400">{{ k.siswa.length }} siswa</p>
        </div>
        <div class="flex gap-2">
          <button class="btn-soft !px-3 !py-1.5 text-xs" @click="salinKode(k.kelas.kode)">📋 Salin Kode</button>
          <button class="btn-soft !px-3 !py-1.5 text-xs" @click="resetKode(k.kelas.id)">🔄 Reset</button>
          <button class="btn-soft !px-3 !py-1.5 text-xs" @click="kelasAktif = kelasAktif === k.kelas.id ? '' : k.kelas.id">
            {{ kelasAktif === k.kelas.id ? 'Tutup' : 'Lihat Siswa' }}
          </button>
        </div>
      </div>

      <!-- Daftar siswa -->
      <div v-if="kelasAktif === k.kelas.id" class="mt-4 space-y-2.5">
        <div v-if="!k.siswa.length" class="text-sm text-slate-400 font-semibold">Belum ada siswa.</div>
        <div v-for="s in k.siswa" :key="s.id" class="bg-slate-50 rounded-xl p-3.5">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <div>
              <p class="font-bold text-slate-700 text-sm">{{ s.nama_lengkap }}</p>
              <p class="text-xs font-semibold text-slate-400">@{{ s.username }} · No. {{ s.no_absen || '—' }}</p>
            </div>
            <span :class="['pill !px-3 !py-1 text-xs font-bold', warnaRekom(rekom(s).k)]">{{ rekom(s).label }}</span>
          </div>
          <div class="mt-2.5">
            <div class="flex justify-between text-xs font-bold text-slate-400 mb-1">
              <span>Progres: {{ totalTahap(s) }}/40 tahap</span>
              <span>{{ persen(s) }}%</span>
            </div>
            <div class="h-2 rounded-full bg-slate-200 overflow-hidden">
              <div class="h-full bg-emerald-400 rounded-full transition-all" :style="{ width: persen(s) + '%' }" />
            </div>
          </div>
          <p class="text-xs font-semibold text-slate-500 mt-2">💡 {{ rekom(s).alasan }}</p>
          <div class="flex gap-2 mt-2.5">
            <button class="btn-soft !px-3 !py-1.5 text-xs" @click="lihatKarya(s)">🖼️ Karya</button>
            <button class="btn-soft !px-3 !py-1.5 text-xs" @click="siswaDinilai = s">⭐ Nilai</button>
          </div>
          <!-- Karya siswa -->
          <div v-if="karyaTampil[s.id]" class="mt-3 space-y-2">
            <div v-for="w in karyaTampil[s.id]" :key="w.id" class="bg-white rounded-xl p-3 border border-slate-100">
              <p class="text-xs font-bold text-sky-600 mb-1">{{ namaFenomena(w.phenomenon_id) }}</p>
              <p v-for="i in 4" :key="i" class="font-display text-sm font-semibold text-slate-700">{{ w['larik' + i] }}</p>
            </div>
            <p v-if="!karyaTampil[s.id].length" class="text-xs text-slate-400 font-semibold">Belum ada karya.</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal penilaian -->
  <div v-if="siswaDinilai" class="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" @click.self="siswaDinilai = null">
    <div class="card p-6 max-w-md w-full">
      <p class="font-display font-bold text-slate-700 mb-1">⭐ Nilai {{ siswaDinilai.nama_lengkap }}</p>
      <p class="text-xs font-semibold text-slate-400 mb-4">Penilaian tersimpan terpisah, tidak mengubah karya siswa.</p>
      <label class="block text-xs font-bold text-slate-600 mb-1">Fenomena</label>
      <select v-model="formFenomena" class="input-cute mb-3">
        <option v-for="f in FENOMENA" :key="f.id" :value="f.id">{{ f.icon }} {{ f.nama }}</option>
      </select>
      <label class="block text-xs font-bold text-slate-600 mb-1">Nilai</label>
      <input v-model="formNilai" class="input-cute mb-3" placeholder="Contoh: 85 / A / Baik Sekali" />
      <label class="block text-xs font-bold text-slate-600 mb-1">Komentar</label>
      <textarea v-model="formKomentar" rows="3" class="input-cute mb-4" placeholder="Masukan untuk siswa..." />
      <div class="flex gap-2">
        <button class="btn-soft flex-1" @click="siswaDinilai = null">Batal</button>
        <button class="btn-primary flex-1" :disabled="menyimpan" @click="kirimNilai">Simpan</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FENOMENA } from '~/data/fenomena'

definePageMeta({ layout: 'app', middleware: 'auth-bff' })

const { user, logout } = useAuth()
const daftarKelas = ref<any[]>([])
const kelasAktif = ref('')
const tampilBuat = ref(false)
const namaKelas = ref('')
const membuat = ref(false)
const siswaDinilai = ref<any>(null)
const formFenomena = ref(FENOMENA[0].id)
const formNilai = ref('')
const formKomentar = ref('')
const menyimpan = ref(false)
const karyaTampil = ref<Record<string, any[]>>({})

onMounted(muat)

async function muat() {
  try {
    const r = await $fetch<{ data: { kelas: any[] } }>('/api/v1/guru/siswa')
    daftarKelas.value = r.data.kelas
  } catch {}
}

function totalTahap(s: any): number {
  return new Set((s.progres || []).map((p: any) => `${p.phenomenon_id}:${p.stage_id}`)).size
}
function persen(s: any): number { return Math.round(totalTahap(s) / 40 * 100) }
function namaFenomena(id: string) { return FENOMENA.find(f => f.id === id)?.nama || id }

/** Rekomendasi rule-based (bukan AI). */
function rekom(s: any): { k: string; label: string; alasan: string } {
  const t = totalTahap(s)
  if (t === 0) return { k: 'kosong', label: 'Belum mulai', alasan: 'Siswa belum mengerjakan tahap apa pun.' }
  if (t < 10) return { k: 'awal', label: 'Baru mulai', alasan: `Baru ${t}/40 tahap. Ajak eksplorasi fenomena yang menarik.` }
  if (t < 30) return { k: 'jalan', label: 'Sedang berkembang', alasan: `${t}/40 tahap selesai. Pantau konsistensi.` }
  return { k: 'siap', label: 'Siap pengayaan', alasan: `${t}/40 tahap selesai. Pertimbangkan tantangan lanjutan.` }
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
  alert(`Kode ${kode} disalin! Bagikan ke siswa.`)
}
async function lihatKarya(s: any) {
  if (karyaTampil.value[s.id]) { delete karyaTampil.value[s.id]; return }
  try {
    // Guru melihat karya via endpoint works (difilter server ke kelasnya)
    const r = await $fetch<{ data: { items: any[] } }>('/api/v1/works?limit=100')
    karyaTampil.value[s.id] = (r.data.items || []).filter((w: any) => w.user_id === s.id)
  } catch { karyaTampil.value[s.id] = [] }
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
