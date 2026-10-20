<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-10">
    <div class="card max-w-md w-full p-8 text-center">
      <p class="text-5xl mb-3">📦</p>
      <h1 class="font-display text-3xl font-extrabold text-slate-800">
        Selamat Datang di<br /><span class="text-emerald-600">Kreasi Pantun</span>
      </h1>
      <p class="mt-2 inline-block bg-amber-100 text-amber-800 font-bold text-sm rounded-full px-4 py-1.5">
        Ciptakan pantunmu dengan berKREASI!
      </p>

      <div class="flex gap-2 mt-6 mb-5">
        <button @click="mode = 'masuk'" :class="['flex-1 pill !py-2.5 font-bold transition', mode === 'masuk' ? '!bg-emerald-500 !text-white' : 'bg-slate-100']">Masuk</button>
        <button @click="mode = 'daftar'" :class="['flex-1 pill !py-2.5 font-bold transition', mode === 'daftar' ? '!bg-emerald-500 !text-white' : 'bg-slate-100']">Daftar</button>
      </div>

      <!-- MASUK -->
      <form v-if="mode === 'masuk'" @submit.prevent="masuk" class="text-left space-y-3.5">
        <div>
          <label class="block font-bold text-slate-700 mb-1.5 text-sm">Username</label>
          <input v-model="username" class="input-cute" placeholder="username kamu" autocomplete="username" />
        </div>
        <div>
          <label class="block font-bold text-slate-700 mb-1.5 text-sm">Password</label>
          <input v-model="password" type="password" class="input-cute" placeholder="••••••" autocomplete="current-password" />
        </div>
        <p v-if="error" class="text-rose-500 text-sm font-bold">{{ error }}</p>
        <button class="btn-primary w-full" :disabled="loading || !username || !password">
          {{ loading ? 'Memeriksa...' : 'Masuk 🚀' }}
        </button>
      </form>

      <!-- DAFTAR -->
      <div v-else class="text-left">
        <div class="flex gap-2 mb-4">
          <button @click="peran = 'siswa'" :class="['flex-1 pill !py-2 text-sm font-bold', peran === 'siswa' ? '!bg-sky-500 !text-white' : 'bg-slate-100']">🎒 Siswa</button>
          <button @click="peran = 'guru'" :class="['flex-1 pill !py-2 text-sm font-bold', peran === 'guru' ? '!bg-sky-500 !text-white' : 'bg-slate-100']">👩🏫 Guru</button>
        </div>
        <form @submit.prevent="daftar" class="space-y-3.5">
          <div v-if="peran === 'siswa'">
            <label class="block font-bold text-slate-700 mb-1.5 text-sm">Kode Kelas <span class="text-rose-500">*</span></label>
            <input v-model="kode" class="input-cute uppercase" placeholder="Contoh: A1B2C3" maxlength="6" />
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1.5 text-sm">Nama Lengkap <span class="text-rose-500">*</span></label>
            <input v-model="nama" class="input-cute" placeholder="Nama lengkap" />
          </div>
          <div v-if="peran === 'siswa'">
            <label class="block font-bold text-slate-700 mb-1.5 text-sm">No. Absen</label>
            <input v-model="noAbsen" class="input-cute" placeholder="Nomor absen" />
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1.5 text-sm">Username <span class="text-rose-500">*</span></label>
            <input v-model="username" class="input-cute" placeholder="min. 3 karakter" autocomplete="username" />
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1.5 text-sm">Password <span class="text-rose-500">*</span></label>
            <input v-model="password" type="password" class="input-cute" placeholder="min. 6 karakter" autocomplete="new-password" />
          </div>
          <p v-if="error" class="text-rose-500 text-sm font-bold">{{ error }}</p>
          <button class="btn-primary w-full" :disabled="loading">
            {{ loading ? 'Mendaftar...' : 'Daftar ✨' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'app' })

const { user, login, registerGuru, registerSiswa } = useAuth()
const mode = ref<'masuk' | 'daftar'>('masuk')
const peran = ref<'siswa' | 'guru'>('siswa')
const username = ref('')
const password = ref('')
const nama = ref('')
const noAbsen = ref('')
const kode = ref('')
const error = ref('')
const loading = ref(false)

// Kalau sudah login, langsung ke fenomena
onMounted(async () => {
  const { me } = useAuth()
  const u = await me()
  if (u) await navigateTo(u.role === 'guru' ? '/guru' : '/beranda', { replace: true })
})

async function masuk() {
  error.value = ''; loading.value = true
  try {
    const u = await login(username.value, password.value)
    await navigateTo(u.role === 'guru' ? '/guru' : '/beranda')
  } catch (e: any) {
    error.value = e?.data?.message || e?.message || 'Gagal masuk.'
  } finally { loading.value = false }
}

async function daftar() {
  error.value = ''; loading.value = true
  try {
    const u = peran.value === 'guru'
      ? await registerGuru(nama.value, username.value, password.value)
      : await registerSiswa({ kode_kelas: kode.value, nama_lengkap: nama.value, no_absen: noAbsen.value, username: username.value, password: password.value })
    await navigateTo(u.role === 'guru' ? '/guru' : '/beranda')
  } catch (e: any) {
    error.value = e?.data?.message || e?.message || 'Gagal mendaftar.'
  } finally { loading.value = false }
}
</script>
