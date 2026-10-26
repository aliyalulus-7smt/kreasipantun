/**
 * Progres siswa dari sumber nyata:
 * - Server: POST /api/v1/sync/pull (stage_progress milik siswa)
 * - Perangkat: outbox lokal kp-outbox-v2 (perubahan belum tersinkron)
 * Status dibedakan jujur: 'tersinkron' hanya untuk data yang sudah
 * dikonfirmasi server; antrean lokal berstatus 'menunggu' (online)
 * atau 'perangkat' (offline).
 */
import { FENOMENA, DAFTAR_TAHAP } from '~/data/fenomena'
import { catatVersiServer } from '~/composables/useOutbox'

export type StatusAktivitas = 'tersinkron' | 'menunggu' | 'perangkat'

export interface AktivitasTerbaru {
  key: string
  phenomenon_id: string
  stage_id: string
  waktu: number
  status: StatusAktivitas
}

export function useProgresSiswa() {
  const selesai = useState<Record<string, boolean>>('kp-tahap-selesai', () => ({}))
  const aktivitas = useState<AktivitasTerbaru[]>('kp-aktivitas', () => [])
  const memuat = useState('kp-progres-memuat', () => false)
  const galat = useState('kp-progres-galat', () => false)
  const pernahMuat = useState('kp-progres-pernah', () => false)

  async function muat() {
    if (!import.meta.client) return
    memuat.value = true
    galat.value = false
    const peta = new Map<string, AktivitasTerbaru>()
    try {
      const r = await $fetch<{ data: { changes: any[] } }>('/api/v1/sync/pull', {
        method: 'POST', body: { limit: 500 },
      })
      for (const c of r.data.changes || []) {
        const key = `${c.phenomenon_id}:${c.stage_id}`
        catatVersiServer(c.phenomenon_id, c.stage_id, c.version)
        peta.set(key, {
          key, phenomenon_id: c.phenomenon_id, stage_id: c.stage_id,
          waktu: new Date(c.server_updated_at).getTime() || Date.now(),
          status: 'tersinkron',
        })
      }
    } catch {
      // Server tak terjangkau: tetap tampilkan data lokal bila ada.
      galat.value = navigator.onLine
    }
    // Antrean lokal menimpa versi server (lebih baru & belum terkonfirmasi)
    try {
      const ops = JSON.parse(localStorage.getItem('kp-outbox-v2') || '[]') as any[]
      for (const o of ops) {
        const key = `${o.phenomenon_id}:${o.stage_id}`
        peta.set(key, {
          key, phenomenon_id: o.phenomenon_id, stage_id: o.stage_id,
          waktu: o.dibuat || Date.now(),
          status: navigator.onLine ? 'menunggu' : 'perangkat',
        })
      }
    } catch {}

    const map: Record<string, boolean> = {}
    peta.forEach((_, k) => { map[k] = true })
    selesai.value = map
    aktivitas.value = [...peta.values()].sort((a, b) => b.waktu - a.waktu)
    pernahMuat.value = true
    memuat.value = false
  }

  const progresFenomena = (fid: string) =>
    DAFTAR_TAHAP.filter(t => selesai.value[`${fid}:${t.id}`]).length

  /**
   * Saklar mode demo (sementara, untuk demo ke dosen): bila env
   * NUXT_PUBLIC_DEMO_BEBAS=true, semua kunci urutan dibuka — semua fenomena
   * dan semua tahap bisa dibuka tanpa menyelesaikan yang sebelumnya.
   * Default mati: nilai env apa pun selain 'true' berarti kunci berlaku
   * normal. Mengunci lagi cukup deploy ulang TANPA env ini (tanpa ubah kode).
   * Nilai diterima sebagai string ('true' dari env) maupun boolean.
   */
  const demoBebas = (() => {
    const v = useRuntimeConfig().public.demoBebas
    return v === true || v === 'true'
  })()

  /**
   * Aturan urutan wajib (revisi 21 Okt 2026): fenomena dikerjakan berurutan
   * dari nomor 1 (Bijak Berteknologi) sampai 8 (Hidup Sehat); fenomena
   * berikutnya hanya terbuka bila SEMUA tahap fenomena sebelumnya selesai.
   * Di dalam fenomena, tahap juga berurutan: tahap berikutnya hanya terbuka
   * bila tahap sebelumnya selesai.
   */
  const fenomenaTerbuka = (fid: string) => {
    if (demoBebas) return true
    const idx = FENOMENA.findIndex(f => f.id === fid)
    if (idx <= 0) return idx === 0
    return progresFenomena(FENOMENA[idx - 1].id) === DAFTAR_TAHAP.length
  }

  const tahapTerbuka = (fid: string, tahapId: string) => {
    if (demoBebas) return true
    if (!fenomenaTerbuka(fid)) return false
    const idx = DAFTAR_TAHAP.findIndex(t => t.id === tahapId)
    if (idx <= 0) return idx === 0
    return !!selesai.value[`${fid}:${DAFTAR_TAHAP[idx - 1].id}`]
  }

  const totalTahap = computed(() => Object.keys(selesai.value).length)
  const fenomenaSelesai = computed(() =>
    FENOMENA.filter(f => progresFenomena(f.id) === DAFTAR_TAHAP.length).length)

  /** Aktivitas paling akhir (untuk kartu Lanjutkan Belajar). */
  const terakhir = computed<AktivitasTerbaru | null>(() => aktivitas.value[0] || null)

  /** Tahap tujuan "Lanjutkan": tahap belum selesai pertama pada fenomena terakhir. */
  function tahapLanjut(fid: string): string | null {
    const belum = DAFTAR_TAHAP.find(t => !selesai.value[`${fid}:${t.id}`])
    return belum ? belum.id : null
  }

  return {
    selesai, aktivitas, memuat, galat, pernahMuat, muat,
    progresFenomena, totalTahap, fenomenaSelesai, terakhir, tahapLanjut,
    fenomenaTerbuka, tahapTerbuka,
  }
}
