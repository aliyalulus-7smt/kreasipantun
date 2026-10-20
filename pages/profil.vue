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

onMounted(() => { void muat() })

async function keluar() { await logout() }
</script>
