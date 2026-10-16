<template>
  <div class="mb-6">
    <span class="pill bg-emerald-100 text-emerald-700">ENGAGE — Kenali Fenomena</span>
    <span class="float-right pill bg-amber-100 text-amber-700">3 dari 3</span>
  </div>

  <div class="text-center mb-6">
    <h1 class="page-title">🧩 Pasangkan dengan Tepat!</h1>
    <p class="page-sub">Seret (atau ketuk) setiap pesan dan pantun ke gambar fenomena yang sesuai.</p>
  </div>

  <!-- Pilihan pesan & pantun -->
  <div class="max-w-4xl mx-auto mb-6">
    <p class="font-display font-bold text-slate-700 mb-3 text-center">🎯 Pilihan Pesan & Pantun</p>
    <div class="grid md:grid-cols-2 gap-3">
      <div v-for="item in pilihan" :key="item.uid"
        draggable="true"
        @dragstart="mulaiSeret($event, item.uid)"
        @click="ketukItem(item.uid)"
        class="rounded-xl px-4 py-3 font-bold text-sm cursor-grab active:cursor-grabbing transition border-2 select-none"
        :class="[
          item.terpasang ? 'opacity-40 border-slate-200 bg-slate-50 text-slate-400' : 'hover:scale-[1.02] border-slate-200 bg-white shadow-sm',
          itemDipilih === item.uid ? '!border-emerald-400 !bg-emerald-50 !ring-4 !ring-emerald-100' : ''
        ]">
        <span class="pill mr-2" :class="item.jenis === 'pesan' ? 'bg-amber-100 text-amber-700' : 'bg-violet-100 text-violet-700'">
          {{ item.jenis === 'pesan' ? '💡 Pesan' : '📜 Pantun' }}
        </span>
        <span v-if="item.jenis === 'pesan'">{{ item.teks }}</span>
        <span v-else class="italic">{{ item.baris.join(' / ') }}</span>
      </div>
    </div>
    <p v-if="itemDipilih" class="text-center text-emerald-600 text-sm font-bold mt-2">
      👆 Sekarang ketuk kotak tujuan di bawah gambar yang sesuai
    </p>
  </div>

  <!-- Gambar fenomena + slot -->
  <div class="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto items-start">
    <div v-for="g in gambar" :key="g.id" class="card p-5">
      <p class="font-display font-bold text-slate-700 mb-3 text-center">Gambar {{ g.id }}</p>
      <img :src="g.src" :alt="'Gambar fenomena ' + g.id" loading="lazy"
        class="rounded-2xl w-full aspect-[4/3] object-cover mb-4" />

      <!-- Slot pesan -->
      <div @dragover.prevent @drop="jatuhkan($event, g.id, 'pesan')" @click="ketukSlot(g.id, 'pesan')"
        class="rounded-xl border-2 border-dashed p-3 mb-3 min-h-[76px] transition cursor-pointer"
        :class="slotTerisi(g.id, 'pesan') ? '!border-solid border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-slate-50 hover:border-amber-300'">
        <p class="text-xs font-extrabold text-slate-400 mb-1">💡 PESAN</p>
        <p v-if="slotTerisi(g.id, 'pesan')" class="text-sm font-bold text-slate-700">{{ teksSlot(g.id, 'pesan') }}</p>
        <p v-else class="text-sm font-semibold text-slate-300">Taruh pesan di sini</p>
      </div>

      <!-- Slot pantun -->
      <div @dragover.prevent @drop="jatuhkan($event, g.id, 'pantun')" @click="ketukSlot(g.id, 'pantun')"
        class="rounded-xl border-2 border-dashed p-3 min-h-[76px] transition cursor-pointer"
        :class="slotTerisi(g.id, 'pantun') ? '!border-solid border-violet-300 bg-violet-50' : 'border-slate-200 bg-slate-50 hover:border-amber-300'">
        <p class="text-xs font-extrabold text-slate-400 mb-1">📜 PANTUN</p>
        <p v-if="slotTerisi(g.id, 'pantun')" class="text-sm font-bold text-slate-700 italic">{{ teksSlot(g.id, 'pantun') }}</p>
        <p v-else class="text-sm font-semibold text-slate-300">Taruh pantun di sini</p>
      </div>
    </div>
  </div>

  <div class="text-center mt-6">
    <button v-if="!sudahPeriksa" class="btn-primary text-lg" :disabled="!lengkap" @click="periksa">
      🔍 Periksa Jawaban
    </button>
    <div v-else class="max-w-2xl mx-auto">
      <div class="card p-6" :class="semuaBenar ? 'bg-emerald-50' : 'bg-amber-50'">
        <p class="font-display text-2xl font-extrabold" :class="semuaBenar ? 'text-emerald-600' : 'text-amber-600'">
          {{ semuaBenar ? '🎉 Hebat! Semua benar!' : '💪 Belum tepat semua, cek kunci jawabannya!' }}
        </p>
        <p class="font-bold text-slate-600 mt-1">Skor: {{ skor }} / 4</p>
      </div>
      <div class="card mt-4 p-5 text-left">
        <p class="font-display font-bold text-slate-700 mb-2">🔑 Kunci Jawaban</p>
        <ul class="text-sm font-semibold text-slate-600 space-y-1.5">
          <li>✅ Gambar 1 → pesan tentang menghormati perbedaan + pantun pepaya/paman.</li>
          <li>✅ Gambar 2 → pesan tentang tidak menyakiti perasaan + pantun Medan/roti.</li>
        </ul>
      </div>
      <button class="btn-soft mt-4" @click="ulangi">🔄 Ulangi</button>
    </div>
  </div>

  <div class="text-center mt-8 flex justify-center gap-3">
    <NuxtLink to="/limar/engage-tanggapan" class="btn-soft">← Sebelumnya</NuxtLink>
    <NuxtLink to="/limar/explore-fenomena" class="btn-primary text-lg">Lanjut →</NuxtLink>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'app', middleware: 'auth' })

interface ItemPilihan {
  uid: string
  jenis: 'pesan' | 'pantun'
  untukGambar: string
  teks?: string
  baris?: string[]
  terpasang: boolean
}

const gambar = [
  { id: '1', src: '/img/engage-gambar-1.png' },
  { id: '2', src: '/img/engage-gambar-2.png' },
]

function acak<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const pilihan = ref<ItemPilihan[]>(acak<ItemPilihan>([
  {
    uid: 'pesan-1', jenis: 'pesan', untukGambar: '1', terpasang: false,
    teks: 'Perbedaan suku, budaya, dan latar belakang bukan penghalang untuk berteman. Kita harus saling menghormati agar tercipta kerukunan.'
  },
  {
    uid: 'pesan-2', jenis: 'pesan', untukGambar: '2', terpasang: false,
    teks: 'Perkataan dan tindakan kita dapat menyakiti perasaan orang lain. Mari ciptakan lingkungan sekolah yang aman dan saling menghormati.'
  },
  {
    uid: 'pantun-1', jenis: 'pantun', untukGambar: '1', terpasang: false,
    baris: ['Pergi ke pasar membeli pepaya', 'Pulang melewati rumah paman', 'Walau berbeda suku dan budaya', 'Kita tetap hidup dalam kerukunan']
  },
  {
    uid: 'pantun-2', jenis: 'pantun', untukGambar: '2', terpasang: false,
    baris: ['Pergi berlibur ke Kota Medan', 'Jangan lupa membeli roti', 'Jangan menghina atau merendahkan', 'Agar tak ada yang tersakiti']
  },
]))

// penempatan: { [gambarId]: { pesan: uid|null, pantun: uid|null } }
const penempatan = ref<Record<string, { pesan: string | null; pantun: string | null }>>({
  '1': { pesan: null, pantun: null },
  '2': { pesan: null, pantun: null },
})

const itemDipilih = ref<string | null>(null)
const sudahPeriksa = ref(false)
const skor = ref(0)
const sfx = useSound()

function cariItem(uid: string) {
  return pilihan.value.find(i => i.uid === uid)
}

function pasang(uid: string, gambarId: string) {
  const item = cariItem(uid)
  if (!item || item.terpasang || sudahPeriksa.value) return
  // kembalikan isi slot lama bila ada
  const slotLama = penempatan.value[gambarId][item.jenis]
  if (slotLama) {
    const lama = cariItem(slotLama)
    if (lama) lama.terpasang = false
  }
  penempatan.value[gambarId][item.jenis] = uid
  item.terpasang = true
  itemDipilih.value = null
  sfx.pop()
}

function mulaiSeret(ev: DragEvent, uid: string) {
  ev.dataTransfer?.setData('text/plain', uid)
}

function jatuhkan(ev: DragEvent, gambarId: string, jenis: 'pesan' | 'pantun') {
  ev.preventDefault()
  const uid = ev.dataTransfer?.getData('text/plain')
  if (!uid) return
  const item = cariItem(uid)
  if (item && item.jenis === jenis) pasang(uid, gambarId)
}

function ketukItem(uid: string) {
  if (sudahPeriksa.value) return
  const item = cariItem(uid)
  if (!item || item.terpasang) return
  itemDipilih.value = itemDipilih.value === uid ? null : uid
  sfx.click()
}

function ketukSlot(gambarId: string, jenis: 'pesan' | 'pantun') {
  if (sudahPeriksa.value || !itemDipilih.value) return
  const item = cariItem(itemDipilih.value)
  if (item && item.jenis === jenis) pasang(item.uid, gambarId)
}

function slotTerisi(gambarId: string, jenis: 'pesan' | 'pantun') {
  return !!penempatan.value[gambarId][jenis]
}

function teksSlot(gambarId: string, jenis: 'pesan' | 'pantun') {
  const uid = penempatan.value[gambarId][jenis]
  const item = uid ? cariItem(uid) : undefined
  if (!item) return ''
  return item.jenis === 'pesan' ? (item.teks ?? '') : (item.baris ?? []).join(' / ')
}

const lengkap = computed(() =>
  gambar.every(g => penempatan.value[g.id].pesan && penempatan.value[g.id].pantun)
)

const semuaBenar = computed(() => skor.value === 4)

function periksa() {
  let s = 0
  for (const g of gambar) {
    for (const jenis of ['pesan', 'pantun'] as const) {
      const uid = penempatan.value[g.id][jenis]
      const item = uid ? cariItem(uid) : undefined
      if (item && item.untukGambar === g.id) s++
    }
  }
  skor.value = s
  sudahPeriksa.value = true
  semuaBenar.value ? sfx.success() : sfx.error()
}

function ulangi() {
  for (const item of pilihan.value) item.terpasang = false
  penempatan.value = { '1': { pesan: null, pantun: null }, '2': { pesan: null, pantun: null } }
  itemDipilih.value = null
  sudahPeriksa.value = false
  skor.value = 0
  pilihan.value = acak(pilihan.value)
}
</script>
