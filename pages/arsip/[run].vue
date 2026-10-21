<!-- Detail arsip satu putaran (baca-saja): jawaban lama siswa per fenomena/tahap. -->
<template>
  <div class="space-y-5 max-w-2xl mx-auto">
    <NuxtLink to="/profil" class="text-sm font-bold text-slate-400">‹ Kembali ke Profil</NuxtLink>
    <h1 class="kp-section-title flex items-center gap-2"><span aria-hidden="true">🗂️</span> Arsip Putaran {{ runNo }}</h1>
    <p v-if="arsip" class="text-sm font-semibold text-slate-400 -mt-3">Diarsipkan {{ formatTanggal(arsip.archived_at) }} · {{ arsip.items.length }} tahap tersimpan</p>

    <p v-if="memuat" class="text-center font-bold text-slate-400 py-10">Memuat arsip…</p>
    <p v-else-if="galat" class="text-center font-bold text-rose-500 py-10">{{ galat }}</p>

    <template v-else-if="arsip">
      <section v-for="grup in grupFenomena" :key="grup.fenomena.id" class="kp-card p-5">
        <p class="font-display font-bold text-slate-700 mb-3">{{ grup.fenomena.ikon }} {{ grup.fenomena.nama }}</p>
        <div class="space-y-4">
          <div v-for="b in grup.baris" :key="b.tahap.id" class="border-t border-slate-100 pt-3 first:border-0 first:pt-0">
            <p class="text-xs font-bold text-slate-400 mb-1.5">{{ b.tahap.nama }}</p>
            <div class="space-y-1">
              <p v-for="(teks, i) in b.ringkasan" :key="i" class="text-sm font-semibold text-slate-600 whitespace-pre-line">{{ teks }}</p>
              <p v-if="!b.ringkasan.length" class="text-sm font-semibold text-slate-300">(tidak ada data)</p>
            </div>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { FENOMENA, DAFTAR_TAHAP, cariFenomena } from '~/data/fenomena'

definePageMeta({ layout: 'siswa', middleware: 'auth-bff' })

const route = useRoute()
const runNo = computed(() => Number(route.params.run))
const arsip = ref<{ archived_at: string; items: any[] } | null>(null)
const memuat = ref(true)
const galat = ref('')

function formatTanggal(iso: string) {
  try { return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) } catch { return '' }
}

/** Ubah payload tersimpan menjadi baris-baris ringkasan yang bisa dibaca siswa. */
function ringkas(fid: string, stageId: string, payload: Record<string, any>): string[] {
  if (!payload) return []
  const konten: any = (cariFenomena(fid) as any)?.tahap?.[stageId]?.data || {}
  const keluar: string[] = []
  if (stageId === 'kenali') {
    if (payload.tanggapan) keluar.push(`💬 ${payload.tanggapan}`)
    return keluar
  }
  if (stageId === 'asah') {
    if (Array.isArray(payload.baris)) keluar.push(payload.baris.map((b: string) => `• ${b}`).join('\n'))
    if (payload.tantangan) keluar.push(`🎯 ${payload.tantangan}`)
    return keluar
  }
  if (stageId === 'evaluasi') {
    for (const it of payload.checklist || []) keluar.push(`${it.ya ? '✓' : '✗'} ${it.item}${it.otomatis ? ' (otomatis)' : ''}`)
    if (payload.refleksi) keluar.push(`💭 ${payload.refleksi}`)
    return keluar
  }
  // eksplorasi & ekspresikan
  const jawaban = payload.jawaban || {}
  if (Array.isArray(konten.pernyataan)) {
    konten.pernyataan.forEach((p: any, i: number) => {
      if (jawaban[i] !== undefined) keluar.push(`${jawaban[i] === p.benar ? '✓' : '✗'} "${p.teks}" → dijawab ${jawaban[i] ? 'Benar' : 'Salah'}`)
    })
  }
  const soalList = konten.soal || konten.situasi || (konten.pantun && konten.pilihan ? [{ pantun: konten.pantun, pilihan: konten.pilihan, kunci: konten.kunci, tanya: konten.tanya }] : [])
  soalList.forEach((s: any, si: number) => {
    if (jawaban[si] !== undefined) {
      const pilih = s.pilihan?.[jawaban[si]]
      keluar.push(`${jawaban[si] === s.kunci ? '✓' : '✗'} ${s.teks || s.tanya || 'Soal'} → ${pilih ?? jawaban[si]}`)
    }
  })
  if (Array.isArray(konten.larik)) {
    konten.larik.forEach((l: any, i: number) => {
      if (jawaban[i] !== undefined) keluar.push(`• "${l.teks}" → ${jawaban[i]}`)
    })
  }
  if (payload.penempatan && Array.isArray(konten.item)) {
    konten.item.forEach((it: any, i: number) => {
      if (payload.penempatan[i]) keluar.push(`• ${it.teks} → ${payload.penempatan[i]}`)
    })
  }
  if (Array.isArray(payload.urutan) && payload.urutan.length) {
    keluar.push('Urutan larik:\n' + payload.urutan.map((b: string, i: number) => `${i + 1}. ${b}`).join('\n'))
  }
  if (Array.isArray(payload.pasangan) && payload.pasangan.length) {
    for (const pr of payload.pasangan) keluar.push(`🪢 ${pr[0]} = ${pr[1]}`)
  }
  if (konten.pilihan && stageId === 'ekspresikan' && jawaban[0] !== undefined && konten.pilihan[jawaban[0]]?.isi) {
    keluar.push('Isi pilihan:\n' + konten.pilihan[jawaban[0]].isi.map((b: string) => `• ${b}`).join('\n'))
  }
  return keluar
}

const grupFenomena = computed(() => {
  if (!arsip.value) return []
  return FENOMENA.map(f => {
    const items = arsip.value!.items.filter((x: any) => x.phenomenon_id === f.id)
    if (!items.length) return null
    const baris = DAFTAR_TAHAP.map(t => {
      const item = items.find((x: any) => x.stage_id === t.id)
      if (!item) return null
      return { tahap: t, ringkasan: ringkas(f.id, t.id, item.response_payload || {}) }
    }).filter(Boolean)
    return { fenomena: f, baris }
  }).filter(Boolean) as { fenomena: any; baris: any[] }[]
})

onMounted(async () => {
  try {
    const r = await $fetch<{ data: any }>(`/api/v1/progress/arsip/${runNo.value}`)
    arsip.value = r.data
  } catch (e: any) {
    galat.value = e?.data?.message || 'Arsip tidak bisa dimuat.'
  } finally { memuat.value = false }
})
</script>
