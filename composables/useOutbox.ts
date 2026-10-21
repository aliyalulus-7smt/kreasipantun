/**
 * Outbox sinkronisasi BFF (Fase B2).
 * - Simpan perubahan lokal dulu (localStorage, tahan tutup aplikasi)
 * - Dorong ke POST /api/v1/sync/push saat online (UUID stabil untuk retry)
 * - Tarik via POST /api/v1/sync/pull dengan cursor opaque
 * - Konflik 409: simpan kedua versi, tandai perlu resolusi
 */
import { randomUUID } from '~/utils/uuid'

export interface OpOutbox {
  operation_id: string
  type: 'stage_progress.upsert'
  phenomenon_id: string
  stage_id: string
  content_version: string
  base_version: number
  response_payload: Record<string, unknown>
  context?: Record<string, unknown>
  resolves_conflict_id?: string
  percobaan: number
  dibuat: number
}

export type StatusSinkron = 'sinkron' | 'menyimpan' | 'menunggu' | 'gagal' | 'konflik'

const KUNCI = 'kp-outbox-v2'
const KUNCI_CURSOR = 'kp-cursor-v2'
const KUNCI_VERSI = 'kp-versi-v2'

/** Peta versi server terakhir yang dikenal per "fenomena:tahap" (dari pull/ack push). */
export function catatVersiServer(phenomenonId: string, stageId: string, version: number) {
  if (!import.meta.client || typeof version !== 'number') return
  try {
    const peta = JSON.parse(localStorage.getItem(KUNCI_VERSI) || '{}')
    peta[`${phenomenonId}:${stageId}`] = version
    localStorage.setItem(KUNCI_VERSI, JSON.stringify(peta))
  } catch {}
}
export function versiServerDikenal(phenomenonId: string, stageId: string): number | null {
  if (!import.meta.client) return null
  try {
    const peta = JSON.parse(localStorage.getItem(KUNCI_VERSI) || '{}')
    const v = peta[`${phenomenonId}:${stageId}`]
    return typeof v === 'number' ? v : null
  } catch { return null }
}

/** Payload tersimpan lokal (antrean belum tersinkron) untuk satu tahap, bila ada. */
export function bacaPayloadLokal(phenomenonId: string, stageId: string): Record<string, unknown> | null {
  if (!import.meta.client) return null
  try {
    const ops = JSON.parse(localStorage.getItem(KUNCI) || '[]') as OpOutbox[]
    const op = ops.find(o => o.phenomenon_id === phenomenonId && o.stage_id === stageId)
    return op?.response_payload || null
  } catch { return null }
}

function bacaOutbox(): OpOutbox[] {
  if (!import.meta.client) return []
  try { return JSON.parse(localStorage.getItem(KUNCI) || '[]') } catch { return [] }
}
function tulisOutbox(ops: OpOutbox[]) {
  if (!import.meta.client) return
  try { localStorage.setItem(KUNCI, JSON.stringify(ops)) } catch {}
}

export function useOutbox() {
  const status = useState<StatusSinkron>('kp-status-sinkron', () => 'sinkron')
  const konflik = useState<any[]>('kp-konflik', () => [])
  const sedang = useState('kp-sync-jalan', () => false)

  /** Antrekan perubahan lokal (langsung tersimpan di perangkat). */
  function antrekan(input: Omit<OpOutbox, 'operation_id' | 'percobaan' | 'dibuat' | 'type' | 'base_version'> & { base_version?: number }) {
    const ops = bacaOutbox()
    // Satu snapshot per phenomenon:stage (ganti yang lama, pertahankan operation_id untuk retry aman)
    const idx = ops.findIndex(o => o.phenomenon_id === input.phenomenon_id && o.stage_id === input.stage_id)
    const op: OpOutbox = {
      ...input,
      operation_id: idx >= 0 ? ops[idx].operation_id : randomUUID(),
      type: 'stage_progress.upsert',
      // base_version WAJIB versi server terakhir yang dikenal (kontrak wire);
      // 0 hanya untuk record yang belum pernah ada di server.
      base_version: versiServerDikenal(input.phenomenon_id, input.stage_id) ?? input.base_version ?? 0,
      percobaan: 0, dibuat: Date.now(),
    }
    if (idx >= 0) ops[idx] = op; else ops.push(op)
    tulisOutbox(ops)
    status.value = 'menunggu'
    void sinkron()
    return op
  }

  /** Dorong antrean ke server. */
  async function sinkron() {
    if (!import.meta.client || sedang.value || !navigator.onLine) return
    const ops = bacaOutbox()
    if (!ops.length) { status.value = 'sinkron'; return }
    sedang.value = true
    status.value = 'menyimpan'
    try {
      const r = await $fetch<{ data: { acknowledged: { operation_id: string; version?: number }[] } }>('/api/v1/sync/push', {
        method: 'POST',
        // Segarkan type & base_version saat kirim: menyembuhkan antrean lama
        // yang tersimpan sebelum perbaikan kontrak wire ini.
        body: { device_id: idPerangkat(), operations: ops.map(({ percobaan, dibuat, ...o }) => ({
          ...o,
          type: 'stage_progress.upsert' as const,
          base_version: versiServerDikenal(o.phenomenon_id, o.stage_id) ?? o.base_version ?? 0,
        })) },
      })
      const ack = new Set(r.data.acknowledged.map(a => a.operation_id))
      for (const a of r.data.acknowledged) {
        const opAsal = ops.find(o => o.operation_id === a.operation_id)
        if (opAsal && typeof a.version === 'number') catatVersiServer(opAsal.phenomenon_id, opAsal.stage_id, a.version)
      }
      tulisOutbox(ops.filter(o => !ack.has(o.operation_id)))
      status.value = bacaOutbox().length ? 'menunggu' : 'sinkron'
      await tarik()
    } catch (e: any) {
      if (e?.statusCode === 409 || e?.data?.error?.code === 'VERSION_CONFLICT') {
        status.value = 'konflik'
        const c = e?.data?.error?.conflict || e?.data?.data?.error?.conflict
        if (c) konflik.value = [...konflik.value.filter(k => k.conflict_id !== c.conflict_id), c]
      } else if (e?.statusCode === 401) {
        status.value = 'gagal'
      } else {
        status.value = navigator.onLine ? 'gagal' : 'menunggu'
      }
    } finally {
      sedang.value = false
    }
  }

  /** Tarik perubahan dari server. */
  async function tarik() {
    if (!import.meta.client || !navigator.onLine) return
    try {
      const cursor = localStorage.getItem(KUNCI_CURSOR)
      const r = await $fetch<{ data: { changes: any[]; next_cursor: string | null; has_more: boolean } }>('/api/v1/sync/pull', {
        method: 'POST', body: { cursor, limit: 100 },
      })
      for (const ch of r.data.changes) {
        if (ch.phenomenon_id && ch.stage_id) catatVersiServer(ch.phenomenon_id, ch.stage_id, ch.version)
        window.dispatchEvent(new CustomEvent('kp-remote-change', { detail: ch }))
      }
      if (r.data.next_cursor) localStorage.setItem(KUNCI_CURSOR, r.data.next_cursor)
      if (r.data.has_more) await tarik()
    } catch {}
  }

  function idPerangkat(): string {
    if (!import.meta.client) return 'ssr'
    let id = localStorage.getItem('kp-device-id')
    if (!id) { id = randomUUID(); localStorage.setItem('kp-device-id', id) }
    return id
  }

  if (import.meta.client) {
    window.addEventListener('online', () => void sinkron())
    document.addEventListener('visibilitychange', () => { if (!document.hidden) void sinkron() })
  }

  return { status, konflik, antrekan, sinkron, tarik }
}
