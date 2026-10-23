<template>
  <div class="min-h-screen flex flex-col">
    <!-- Tawaran install PWA -->
    <InstallBanner />
    <div class="flex-1 flex items-center justify-center px-4 py-10">
    <div class="card max-w-md w-full p-8 md:p-10 text-center relative overflow-hidden">
      <div class="relative w-[72px] h-[72px] mx-auto mb-4">
        <div class="w-full h-full rounded-3xl bg-con flex items-center justify-center text-primary">
          <span class="material-symbols-outlined text-[40px]" aria-hidden="true">school</span>
        </div>
        <span class="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-white" aria-hidden="true">
          <span class="material-symbols-outlined text-[14px]">check</span>
        </span>
      </div>
      <h1 class="font-display text-3xl font-extrabold text-slate-800">
        Dashboard <span class="text-primary">Guru</span>
      </h1>
      <p class="text-slate-500 font-semibold mt-3 mb-6">
        Masukkan kode guru untuk melihat karya dan progres siswa.
        Kode = tanggal hari ini (DDMMYYYY).
      </p>

      <form @submit.prevent="masuk" class="text-left space-y-4">
        <div>
          <label class="block font-bold text-slate-700 mb-1.5">Kode Guru</label>
          <input v-model="kode" type="password" class="w-full h-12 bg-conlow rounded-xl px-4 text-center font-display font-bold tracking-[0.3em] placeholder:text-muted focus:bg-white focus:outline-none focus:shadow-md transition" placeholder="••••••" autocomplete="off" />
        </div>
        <p v-if="error" class="text-rose-500 text-sm font-bold">{{ error }}</p>
        <button type="submit" class="btn-primary w-full !mt-6">Masuk 🔑</button>
      </form>

      <NuxtLink to="/" class="inline-flex items-center gap-1 mt-5 text-sm font-display font-bold text-primary">
        <span class="material-symbols-outlined text-[18px]" aria-hidden="true">keyboard_backspace</span> Kembali ke halaman siswa
      </NuxtLink>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const { guruAuthed, save, logout } = useSession()
const kode = ref('')
const error = ref('')

// Kode guru = tanggal hari ini (DDMMYYYY), ganti otomatis tiap hari.
// Contoh: 3 Okt 2026 -> "03102026". Dihitung dari tanggal di perangkat.
// Env NUXT_PUBLIC_GURU_CODE (bila diisi) tetap diterima sebagai kode cadangan.
function kodeHariIni() {
  const d = new Date()
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${dd}${mm}${d.getFullYear()}`
}

function masuk() {
  const config = useRuntimeConfig()
  const diterima = [kodeHariIni(), (config.public.guruCode as string) || ''].filter(Boolean)
  if (diterima.includes(kode.value.trim())) {
    // Mode saling eksklusif: login guru membersihkan sesi siswa (perangkat bersama)
    logout()
    guruAuthed.value = true
    save()
    navigateTo('/guru/dashboard')
  } else {
    error.value = 'Kode salah. Kode guru adalah tanggal hari ini (contoh: 03102026).'
  }
}
</script>
