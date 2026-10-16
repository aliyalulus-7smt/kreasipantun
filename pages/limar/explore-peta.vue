<template>
  <div class="mb-6">
    <span class="pill bg-amber-100 text-amber-700">Ekspresikan Gagasan dan Pesan</span>
  </div>

  <div class="text-center mb-6">
    <h1 class="page-title">🗺️ Kembangkan Peta Idenya!</h1>
    <p class="page-sub">Amati gambar fenomena pilihanmu, lalu isi gagasan, pesan, dan kumpulan kata.</p>
  </div>

  <div class="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
    <!-- Gambar fenomena terpilih -->
    <div class="card p-5 text-center">
      <p class="text-xs font-bold text-slate-400 mb-2">Fenomena yang dipilih:</p>
      <img v-if="limarFenomena?.gambar" :src="limarFenomena.gambar" :alt="limarFenomena.nama" loading="lazy"
        class="rounded-2xl w-full aspect-[4/3] object-cover mb-2" />
      <div v-else class="text-6xl mb-2 rounded-2xl bg-slate-50 py-8">{{ limarFenomena?.icon }}</div>
      <p class="font-display font-bold text-lg text-slate-800">{{ limarFenomena?.nama }}</p>
      <p class="text-slate-500 font-semibold text-xs mt-1">{{ limarFenomena?.deskripsi }}</p>
    </div>

    <div class="md:col-span-2 card p-6 space-y-5">
      <div>
        <label class="block font-bold text-slate-700 mb-1.5">
          💡 Gagasan <span class="font-semibold text-slate-400 text-sm">(ide utama yang akan dikembangkan menjadi pantun)</span>
        </label>
        <textarea v-model="gagasan" rows="2" class="input-cute" maxlength="300"
          placeholder="Tuliskan gagasamu di sini..."></textarea>
      </div>
      <div>
        <label class="block font-bold text-slate-700 mb-1.5">
          📜 Pesan <span class="font-semibold text-slate-400 text-sm">(pesan yang ingin disampaikan melalui pantun)</span>
        </label>
        <textarea v-model="pesan" rows="2" class="input-cute" maxlength="300"
          placeholder="Tuliskan pesanmu di sini..."></textarea>
      </div>
      <div>
        <label class="block font-bold text-slate-700 mb-1.5">
          📝 Kumpulan Kata <span class="font-semibold text-slate-400 text-sm">(kata-kata yang berkaitan dengan fenomena, gagasan, dan pesan)</span>
        </label>
        <textarea v-model="kata" rows="2" class="input-cute" maxlength="500"
          placeholder="Contoh: bersih, nyaman, rajin, sekolah..."></textarea>
      </div>
      <div class="flex flex-wrap gap-3">
        <NuxtLink to="/limar/explore-fenomena" class="btn-soft">Kembali</NuxtLink>
        <button class="btn-warm" :disabled="!bisaSimpan || menyimpan" @click="simpan">
          {{ menyimpan ? 'Menyimpan...' : '💾 Simpan Peta Ide' }}
        </button>
        <button v-if="tersimpan" class="btn-primary" @click="lanjut">Lanjut →</button>
      </div>
      <p v-if="error" class="text-rose-500 text-sm font-bold">{{ error }}</p>

      <div v-if="tersimpan" class="bg-emerald-50 rounded-2xl p-4">
        <p class="font-display font-bold text-emerald-700 mb-2">📋 Ringkasan Peta Ide</p>
        <p class="text-sm font-semibold text-slate-600"><b>Fenomena:</b> {{ limarFenomena?.nama }}</p>
        <p class="text-sm font-semibold text-slate-600"><b>Gagasan:</b> {{ gagasan }}</p>
        <p class="text-sm font-semibold text-slate-600"><b>Pesan:</b> {{ pesan }}</p>
        <p class="text-sm font-semibold text-slate-600"><b>Kumpulan kata:</b> {{ kata }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'app', middleware: 'auth' })

const { siswaId, limarFenomena, petaGagasan, petaPesan, petaKata } = useSession()
const supabase = useSupabase()
const sync = useSync()

if (!limarFenomena.value) {
  await navigateTo('/limar/explore-fenomena')
}

const gagasan = ref(petaGagasan.value)
const pesan = ref(petaPesan.value)
const kata = ref(petaKata.value)
const menyimpan = ref(false)
const tersimpan = ref(false)
const error = ref('')

const bisaSimpan = computed(() => gagasan.value.trim() && pesan.value.trim() && kata.value.trim())

const sfx = useSound()

async function simpan() {
  if (!bisaSimpan.value) return
  menyimpan.value = true
  error.value = ''
  petaGagasan.value = gagasan.value.trim()
  petaPesan.value = pesan.value.trim()
  petaKata.value = kata.value.trim()
  if (supabase) {
    // Offline → diantrekan (tempId siswa di-remap saat sinkronisasi)
    const res = await sync.tulisTertunda('peta_ide', 'insert', {
      siswa_id: siswaId.value || null,
      fenomena_id: limarFenomena.value!.id,
      gagasan: petaGagasan.value,
      pesan: petaPesan.value
      // kata_kunci disimpan di sesi lokal; kolom DB belum ada (lihat supabase/migrasi)
    })
    if (!res.ok && !res.queued) {
      console.error(res.error)
      error.value = 'Gagal menyimpan ke database, tapi kamu bisa lanjut.'
    }
  }
  menyimpan.value = false
  tersimpan.value = true
  sfx.success()
}

async function lanjut() {
  await navigateTo('/limar/explain')
}
</script>
