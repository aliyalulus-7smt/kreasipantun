<template>
  <div class="space-y-5 max-w-2xl mx-auto">
    <h1 class="kp-section-title flex items-center gap-2"><span aria-hidden="true">👤</span> Profil Saya</h1>

    <section class="kp-card p-5 md:p-6">
      <div class="flex items-center gap-4">
        <span class="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 text-white font-display font-extrabold text-3xl flex items-center justify-center shrink-0">
          {{ inisial }}
        </span>
        <div class="min-w-0">
          <p class="font-display font-extrabold text-xl text-slate-800 truncate">{{ user?.nama_lengkap }}</p>
          <p class="text-sm font-bold text-slate-400">@{{ user?.username }}</p>
          <p v-if="user?.no_absen" class="text-sm font-semibold text-slate-500 mt-0.5">No. Absen {{ user.no_absen }}</p>
        </div>
      </div>
    </section>

    <RingkasanProgres :fenomena-selesai="fenomenaSelesai" :total-tahap="totalTahap" />

    <section v-if="daftarArsip.length" class="kp-card p-5">
      <p class="font-display font-bold text-slate-700 mb-1">📚 Arsip Progresku</p>
      <p class="text-xs font-semibold text-slate-400 mb-2">Putaran-putaran sebelumnya yang sudah diarsipkan — buka untuk mengecek ulang jawaban lamamu.</p>
      <NuxtLink v-for="r in daftarArsip" :key="r.run_no" :to="`/arsip/${r.run_no}`"
        class="flex items-center justify-between py-2 font-bold text-slate-700 border-t border-slate-50 first:border-0">
        <span class="flex items-center gap-3"><span aria-hidden="true">🗂️</span> Putaran {{ r.run_no }}</span>
        <span class="text-xs font-bold text-slate-400">{{ r.jumlah_tahap }} tahap · {{ formatTanggal(r.archived_at) }} ›</span>
      </NuxtLink>
    </section>

    <section v-if="totalTahap >= 40" class="kp-card p-5">
      <p class="font-display font-bold text-slate-700">🔁 Ulangi dari Awal</p>
      <p class="text-sm font-semibold text-slate-500 mt-1">
        Kamu sudah menuntaskan semua fenomena 🎉 Ingin mengulang dari awal? Progresmu yang sekarang
        <b>tidak dihapus</b> — diarsipkan sebagai putaran dan bisa dicek lagi kapan pun di Arsip Progresku.
      </p>
      <template v-if="!konfirmasiReset">
        <button class="btn-primary w-full mt-3" @click="konfirmasiReset = true">🔁 Arsipkan & Ulangi dari Awal</button>
      </template>
      <template v-else>
        <p class="text-sm font-bold text-amber-600 mt-3">Yakin? Progres aktif akan dikosongkan (arsipnya tetap aman).</p>
        <div class="flex gap-2 mt-2">
          <button class="btn-primary flex-1" :disabled="memprosesReset" @click="jalankanReset">{{ memprosesReset ? 'Memproses…' : 'Ya, Ulangi' }}</button>
          <button class="btn-soft flex-1" :disabled="memprosesReset" @click="konfirmasiReset = false">Batal</button>
        </div>
      </template>
      <p v-if="pesanReset" class="text-sm font-bold mt-2" :class="pesanReset.ok ? 'text-emerald-600' : 'text-rose-500'">{{ pesanReset.teks }}</p>
    </section>

    <section class="kp-card p-5">
      <NuxtLink to="/karya" class="flex items-center justify-between py-2 font-bold text-slate-700">
        <span class="flex items-center gap-3"><span aria-hidden="true">📖</span> Karya Saya</span>
        <span class="text-slate-300" aria-hidden="true">›</span>
      </NuxtLink>
      <div class="border-t border-slate-50" />
      <NuxtLink to="/fenomena" class="flex items-center justify-between py-2 font-bold text-slate-700">
        <span class="flex items-center gap-3"><span aria-hidden="true">🧩</span> Semua Fenomena</span>
        <span class="text-slate-300" aria-hidden="true">›</span>
      </NuxtLink>
    </section>

    <button @click="keluar" class="kp-card w-full p-4 font-display font-bold text-rose-600 flex items-center justify-center gap-2 active:scale-[0.98] transition">
      🚪 Keluar dari Akun
    </button>
  </div>
</template>

<script setup lang="ts">
import RingkasanProgres from '~/components/siswa/RingkasanProgres.vue'

definePageMeta({ layout: 'siswa', middleware: 'auth-bff' })

const { user, logout } = useAuth()
const { muat, totalTahap, fenomenaSelesai } = useProgresSiswa()

const inisial = computed(() => (user.value?.nama_lengkap || '👤').charAt(0).toUpperCase())

// ── Arsip putaran & ulangi dari awal ────────────────────────────────
const daftarArsip = ref<{ run_no: number; archived_at: string; jumlah_tahap: number }[]>([])
const konfirmasiReset = ref(false)
const memprosesReset = ref(false)
const pesanReset = ref<{ ok: boolean; teks: string } | null>(null)

function formatTanggal(iso: string) {
  try { return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) } catch { return '' }
}
async function muatArsip() {
  try {
    const r = await $fetch<{ data: { runs: any[] } }>('/api/v1/progress/arsip')
    daftarArsip.value = r.data.runs || []
  } catch { daftarArsip.value = [] }
}
async function jalankanReset() {
  memprosesReset.value = true
  pesanReset.value = null
  try {
    const r = await $fetch<{ data: { run_no: number } }>('/api/v1/progress/reset', { method: 'POST' })
    // Buang sisa lokal putaran lama agar tidak menyusup ke putaran baru.
    localStorage.removeItem('kp-outbox-v2')
    localStorage.removeItem('kp-versi-v2')
    konfirmasiReset.value = false
    pesanReset.value = { ok: true, teks: `Progresmu diarsipkan sebagai Putaran ${r.data.run_no}. Selamat mengulang dari awal!` }
    await muat()
    await muatArsip()
    setTimeout(() => { void navigateTo('/beranda') }, 1400)
  } catch (e: any) {
    pesanReset.value = { ok: false, teks: e?.data?.message || 'Gagal memproses. Coba lagi sebentar lagi.' }
  } finally { memprosesReset.value = false }
}

onMounted(() => { void muat(); void muatArsip() })

async function keluar() { await logout() }
</script>
