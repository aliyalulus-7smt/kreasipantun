<template>
  <header class="sticky top-0 z-40 bg-[#fff9ef]/85 backdrop-blur border-b border-amber-100/70">
    <div class="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
      <NuxtLink to="/beranda" class="flex items-center gap-2.5 min-w-0">
        <span class="text-3xl leading-none" aria-hidden="true">🪶</span>
        <span class="min-w-0">
          <span class="block font-display font-extrabold text-lg leading-tight text-[#123c2b]">
            Kreasi <span class="text-[#1663b8]">Pantun</span>
          </span>
          <span class="hidden sm:block text-[11px] font-bold text-slate-500 leading-tight truncate">
            Belajar, Berkarya, dan Ekspresikan Diri dengan Pantun
          </span>
        </span>
      </NuxtLink>

      <div class="flex items-center gap-2 shrink-0">
        <!-- Status sinkronisasi nyata dari outbox BFF -->
        <button @click="sinkronManual" :title="judulStatus" aria-label="Status sinkronisasi"
          class="h-10 px-3 rounded-full flex items-center gap-1.5 text-xs font-display font-extrabold shadow-sm transition active:scale-95"
          :class="kelasStatus">
          <span v-if="status === 'menyimpan'" class="animate-spin inline-block">🔄</span>
          <span v-else-if="!daring">📴</span>
          <span v-else-if="status === 'menunggu'">⏳</span>
          <span v-else-if="status === 'gagal' || status === 'konflik'">⚠️</span>
          <span v-else>🟢</span>
          <span class="hidden sm:inline">{{ labelStatus }}</span>
        </button>
        <NuxtLink to="/profil" class="flex items-center gap-2 rounded-full bg-white border border-slate-200 pl-1 pr-3 py-1 shadow-sm active:scale-95 transition" aria-label="Profil saya">
          <span class="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 text-white font-display font-extrabold flex items-center justify-center">
            {{ inisial }}
          </span>
          <span class="text-sm font-bold text-slate-700 max-w-[110px] truncate">{{ namaDepan }}</span>
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const { user } = useAuth()
const { status, sinkron } = useOutbox()
const daring = ref(true)

onMounted(() => {
  daring.value = navigator.onLine
  const on = () => { daring.value = true }
  const off = () => { daring.value = false }
  window.addEventListener('online', on)
  window.addEventListener('offline', off)
  onUnmounted(() => { window.removeEventListener('online', on); window.removeEventListener('offline', off) })
})

const nama = computed(() => user.value?.nama_lengkap || 'Teman')
const namaDepan = computed(() => nama.value.split(' ')[0])
const inisial = computed(() => nama.value.charAt(0).toUpperCase() || '👤')

const labelStatus = computed(() => {
  if (!daring.value) return 'Offline'
  return { sinkron: 'Tersinkron', menyimpan: 'Menyinkron', menunggu: 'Menunggu', gagal: 'Gagal', konflik: 'Konflik' }[status.value]
})
const judulStatus = computed(() => {
  if (!daring.value) return 'Offline — perubahan tersimpan di perangkat'
  return {
    sinkron: 'Semua perubahan sudah tersinkron ke server',
    menyimpan: 'Sedang menyinkronkan...',
    menunggu: 'Ada perubahan menunggu sinkronisasi — klik untuk sinkronkan',
    gagal: 'Sinkronisasi gagal — klik untuk coba lagi',
    konflik: 'Ada konflik perubahan — klik untuk mencoba sinkron lagi',
  }[status.value]
})
const kelasStatus = computed(() => {
  if (!daring.value) return 'bg-orange-100 text-orange-700'
  return {
    sinkron: 'bg-emerald-100 text-emerald-700',
    menyimpan: 'bg-sky-100 text-sky-700',
    menunggu: 'bg-amber-100 text-amber-700',
    gagal: 'bg-rose-100 text-rose-700',
    konflik: 'bg-rose-100 text-rose-700',
  }[status.value]
})

function sinkronManual() {
  if (daring.value) void sinkron()
}
</script>
