<template>
  <div class="relative flex flex-col items-center px-1 py-2">
    <!-- Blob warna lembut di latar (dekoratif, ala referensi Stitch) -->
    <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      <div class="absolute -top-10 -left-10 w-64 h-64 rounded-full bg-[#FB923C]/15 blur-3xl" />
      <div class="absolute top-1/2 -right-16 w-72 h-72 rounded-full bg-[#8B5CF6]/10 blur-3xl" />
      <div class="absolute -bottom-10 left-1/4 w-60 h-60 rounded-full bg-[#A3E635]/15 blur-2xl" />
    </div>

    <div class="relative z-10 w-full max-w-md flex flex-col pb-8">
      <!-- Brand & sapaan -->
      <div class="flex flex-col items-center text-center mt-2 mb-5">
        <div class="relative w-24 h-24 mb-3 flex items-center justify-center">
          <div class="absolute inset-0 bg-psky-light/20 rounded-full blur-xl scale-110" aria-hidden="true" />
          <div class="relative z-10 w-24 h-24 bg-white rounded-2xl shadow-md flex flex-col items-center justify-center gap-0.5">
            <span class="text-4xl leading-none" aria-hidden="true">🪶</span>
            <span class="font-display font-extrabold text-[11px] text-primary leading-none">Kreasi Pantun</span>
          </div>
        </div>
        <h1 class="font-display font-extrabold text-[28px] leading-9 text-ink tracking-tight px-2">
          Selamat Datang di
          <span class="rainbow-teks">Kreasi Pantun</span>
          <span aria-hidden="true"> 🪶✨</span>
        </h1>
        <p class="mt-1.5">
          <span class="bg-[#FEF3C7] text-[#92400E] font-bold text-sm px-1">Ciptakan pantunmu dengan berKREASI!</span>
        </p>
      </div>

      <!-- Kartu form -->
      <div class="w-full bg-white rounded-2xl shadow-xl p-5 mb-5">
        <!-- Tab tersegmen -->
        <div class="grid grid-cols-2 p-1 bg-con rounded-xl mb-6">
          <button type="button" @click="mode = 'masuk'"
            class="py-2.5 rounded-lg font-display font-bold text-sm transition-all duration-200 flex items-center justify-center gap-1.5"
            :class="mode === 'masuk' ? 'bg-psky text-white shadow-sm' : 'text-muted hover:text-ink'">
            <span class="material-symbols-outlined text-[18px]" aria-hidden="true">login</span> Masuk
          </button>
          <button type="button" @click="mode = 'daftar'"
            class="py-2.5 rounded-lg font-display font-bold text-sm transition-all duration-200 flex items-center justify-center gap-1.5"
            :class="mode === 'daftar' ? 'bg-psky text-white shadow-sm' : 'text-muted hover:text-ink'">
            <span class="material-symbols-outlined text-[18px]" aria-hidden="true">person_add</span> Daftar
          </button>
        </div>

        <!-- MASUK -->
        <form v-if="mode === 'masuk'" @submit.prevent="masuk" class="flex flex-col gap-4">
          <div class="flex flex-col gap-1.5">
            <label class="font-bold text-sm text-ink" for="ms-username">Username <span class="text-[#BC0B3B]">*</span></label>
            <div class="relative flex items-center">
              <span class="material-symbols-outlined absolute left-3.5 text-psky pointer-events-none text-[20px]" aria-hidden="true">sentiment_very_satisfied</span>
              <input id="ms-username" v-model="username" placeholder="username kamu" autocomplete="username"
                class="w-full h-12 pl-11 pr-4 bg-conlow rounded-xl font-semibold text-ink placeholder:text-muted placeholder:font-medium focus:bg-white focus:outline-none focus:shadow-md transition-all" />
            </div>
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="font-bold text-sm text-ink" for="ms-password">Password <span class="text-[#BC0B3B]">*</span></label>
            <div class="relative flex items-center">
              <span class="material-symbols-outlined absolute left-3.5 text-muted pointer-events-none text-[20px]" aria-hidden="true">lock</span>
              <input id="ms-password" v-model="password" :type="tampilSandi ? 'text' : 'password'" placeholder="••••••" autocomplete="current-password"
                class="w-full h-12 pl-11 pr-12 bg-conlow rounded-xl font-semibold text-ink placeholder:text-muted placeholder:font-medium focus:bg-white focus:outline-none focus:shadow-md transition-all" />
              <button type="button" @click="tampilSandi = !tampilSandi" aria-label="Tampilkan atau sembunyikan kata sandi"
                class="absolute right-2.5 p-2 rounded-lg text-muted hover:text-primary transition-colors flex items-center justify-center active:scale-95">
                <span class="material-symbols-outlined text-[20px]" aria-hidden="true">{{ tampilSandi ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
          </div>
          <p v-if="error" class="text-rose-500 text-sm font-bold">{{ error }}</p>
          <button type="submit" :disabled="loading || !username || !password"
            class="w-full h-14 mt-1 rounded-xl bg-gradient-to-r from-psky to-psky-light text-white font-display font-bold text-base shadow-lg shadow-psky/25 flex items-center justify-center gap-2 transition-all hover:brightness-105 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none">
            {{ loading ? 'Memeriksa...' : 'Masuk 🚀' }}
          </button>
        </form>

        <!-- DAFTAR -->
        <div v-else>
          <div class="grid grid-cols-2 p-1 bg-con rounded-xl mb-5">
            <button type="button" @click="peran = 'siswa'"
              class="py-2 rounded-lg font-display font-bold text-sm transition-all flex items-center justify-center gap-1.5"
              :class="peran === 'siswa' ? 'bg-white text-primary shadow-sm' : 'text-muted hover:text-ink'">
              <span class="material-symbols-outlined text-[18px]" aria-hidden="true">backpack</span> Siswa
            </button>
            <button type="button" @click="peran = 'guru'"
              class="py-2 rounded-lg font-display font-bold text-sm transition-all flex items-center justify-center gap-1.5"
              :class="peran === 'guru' ? 'bg-white text-primary shadow-sm' : 'text-muted hover:text-ink'">
              <span class="material-symbols-outlined text-[18px]" aria-hidden="true">cast_for_education</span> Guru
            </button>
          </div>
          <form @submit.prevent="daftar" class="flex flex-col gap-4">
            <div v-if="peran === 'siswa'" class="flex flex-col gap-1.5">
              <div class="flex items-center justify-between">
                <label class="font-bold text-sm text-ink" for="df-kode">Kode Kelas <span class="text-[#BC0B3B]">*</span></label>
                <span class="text-xs font-bold text-[#B45309] bg-[#FB923C]/15 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span class="material-symbols-outlined text-[14px]" aria-hidden="true">group</span> 6 Huruf
                </span>
              </div>
              <div class="relative flex items-center">
                <span class="material-symbols-outlined absolute left-3.5 text-[#FB923C] pointer-events-none text-[20px]" aria-hidden="true">school</span>
                <input id="df-kode" v-model="kode" placeholder="Contoh: A1B2C3" maxlength="6"
                  class="w-full h-12 pl-11 pr-4 bg-conlow rounded-xl font-display font-bold tracking-widest uppercase text-ink placeholder:text-[#BEC8D2] focus:bg-white focus:outline-none focus:shadow-md transition-all" />
              </div>
              <p class="text-[13px] font-medium text-muted flex items-center gap-1 mt-0.5">
                <span class="material-symbols-outlined text-[16px] text-[#34D399]" aria-hidden="true">info</span>
                Masukkan 6 huruf kode dari gurumu di papan tulis
              </p>
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="font-bold text-sm text-ink" for="df-nama">Nama Lengkap <span class="text-[#BC0B3B]">*</span></label>
              <div class="relative flex items-center">
                <span class="material-symbols-outlined absolute left-3.5 text-muted pointer-events-none text-[20px]" aria-hidden="true">badge</span>
                <input id="df-nama" v-model="nama" placeholder="Nama lengkap"
                  class="w-full h-12 pl-11 pr-4 bg-conlow rounded-xl font-semibold text-ink placeholder:text-muted placeholder:font-medium focus:bg-white focus:outline-none focus:shadow-md transition-all" />
              </div>
            </div>
            <div v-if="peran === 'siswa'" class="flex flex-col gap-1.5">
              <label class="font-bold text-sm text-ink" for="df-absen">No. Absen</label>
              <div class="relative flex items-center">
                <span class="material-symbols-outlined absolute left-3.5 text-muted pointer-events-none text-[20px]" aria-hidden="true">format_list_numbered</span>
                <input id="df-absen" v-model="noAbsen" placeholder="Nomor absen"
                  class="w-full h-12 pl-11 pr-4 bg-conlow rounded-xl font-semibold text-ink placeholder:text-muted placeholder:font-medium focus:bg-white focus:outline-none focus:shadow-md transition-all" />
              </div>
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="font-bold text-sm text-ink" for="df-username">Username <span class="text-[#BC0B3B]">*</span></label>
              <div class="relative flex items-center">
                <span class="material-symbols-outlined absolute left-3.5 text-psky pointer-events-none text-[20px]" aria-hidden="true">sentiment_very_satisfied</span>
                <input id="df-username" v-model="username" placeholder="min. 3 karakter" autocomplete="username"
                  class="w-full h-12 pl-11 pr-4 bg-conlow rounded-xl font-semibold text-ink placeholder:text-muted placeholder:font-medium focus:bg-white focus:outline-none focus:shadow-md transition-all" />
              </div>
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="font-bold text-sm text-ink" for="df-password">Password <span class="text-[#BC0B3B]">*</span></label>
              <div class="relative flex items-center">
                <span class="material-symbols-outlined absolute left-3.5 text-muted pointer-events-none text-[20px]" aria-hidden="true">lock</span>
                <input id="df-password" v-model="password" :type="tampilSandi ? 'text' : 'password'" placeholder="min. 6 karakter" autocomplete="new-password"
                  class="w-full h-12 pl-11 pr-12 bg-conlow rounded-xl font-semibold text-ink placeholder:text-muted placeholder:font-medium focus:bg-white focus:outline-none focus:shadow-md transition-all" />
                <button type="button" @click="tampilSandi = !tampilSandi" aria-label="Tampilkan atau sembunyikan kata sandi"
                  class="absolute right-2.5 p-2 rounded-lg text-muted hover:text-primary transition-colors flex items-center justify-center active:scale-95">
                  <span class="material-symbols-outlined text-[20px]" aria-hidden="true">{{ tampilSandi ? 'visibility_off' : 'visibility' }}</span>
                </button>
              </div>
            </div>
            <p v-if="error" class="text-rose-500 text-sm font-bold">{{ error }}</p>
            <button type="submit" :disabled="loading"
              class="w-full h-14 mt-1 rounded-xl bg-gradient-to-r from-psky to-psky-light text-white font-display font-bold text-base shadow-lg shadow-psky/25 flex items-center justify-center gap-2 transition-all hover:brightness-105 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none">
              {{ loading ? 'Mendaftar...' : 'Daftar ✨' }}
            </button>
          </form>
        </div>
      </div>

      <!-- Tautan portal guru -->
      <div class="flex justify-center mb-6">
        <button type="button" @click="kePortalGuru"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white shadow-sm text-[13px] font-bold text-ink hover:text-primary transition-colors">
          <span class="material-symbols-outlined text-[18px] text-[#FB923C]" aria-hidden="true">cast_for_education</span>
          <span class="font-semibold">Guru atau Pengajar?</span>
          <span class="text-primary font-bold">Masuk ke Portal Guru →</span>
        </button>
      </div>

      <!-- Pratinjau aturan bermain -->
      <div class="bg-white rounded-2xl p-4 shadow-sm mb-4">
        <div class="flex items-center gap-2 mb-2">
          <div class="w-7 h-7 rounded-lg bg-[#A3E635]/20 flex items-center justify-center text-[#006C49]">
            <span class="material-symbols-outlined text-[18px]" aria-hidden="true">verified</span>
          </div>
          <h2 class="font-display font-bold text-lg text-ink">Belajar Pantun Seperti Bermain Game!</h2>
        </div>
        <p class="text-[13px] font-medium text-muted mb-3 leading-relaxed">
          Selesaikan 5 tahap seru: Kenali Fenomena, Eksplorasi Fenomena, Ekspresikan Pengetahuan, Asah Kreativitas, dan Evaluasi bait pantunmu.
        </p>
        <div class="grid grid-cols-2 gap-2">
          <div class="flex items-center gap-2 p-2.5 rounded-xl bg-conlow">
            <div class="w-6 h-6 rounded-md bg-psky/20 text-psky flex items-center justify-center font-display font-bold text-xs shrink-0">A</div>
            <div class="flex flex-col min-w-0">
              <span class="text-xs font-bold text-ink leading-tight">8 - 12 Suku Kata</span>
              <span class="text-[13px] font-medium text-muted leading-tight">Tiap baris pas ritmenya</span>
            </div>
          </div>
          <div class="flex items-center gap-2 p-2.5 rounded-xl bg-conlow">
            <div class="w-6 h-6 rounded-md bg-[#8B5CF6]/20 text-[#8B5CF6] flex items-center justify-center font-display font-bold text-xs shrink-0">B</div>
            <div class="flex flex-col min-w-0">
              <span class="text-xs font-bold text-ink leading-tight">Pola Rima A-B-A-B</span>
              <span class="text-[13px] font-medium text-muted leading-tight">Sampiran &amp; isi berpadu</span>
            </div>
          </div>
        </div>
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
const tampilSandi = ref(false)

/** Tautan portal guru pada referensi = pintu pendaftaran guru aplikasi ini. */
function kePortalGuru() {
  mode.value = 'daftar'
  peran.value = 'guru'
}

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

<style scoped>
.rainbow-teks {
  background: linear-gradient(90deg, #0EA5E9, #10B981, #F59E0B, #EC4899, #8B5CF6, #0EA5E9);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: pelangi 4s ease infinite;
}
@keyframes pelangi {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@media (prefers-reduced-motion: reduce) {
  .rainbow-teks { animation: none; }
}
</style>
