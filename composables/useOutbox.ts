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
  function antrekan(input: Omit<OpOutbox, 'operation_id' | 'percobaan' | 'dibuat'>) {
    const ops = bacaOutbox()
    // Satu snapshot per phenomenon:stage (ganti yang lama, pertahankan operation_id untuk retry aman)
    const idx = ops.findIndex(o => o.phenomenon_id === input.phenomenon_id && o.stage_id === input.stage_id)
    const op: OpOutbox = {
      operation_id: idx >= 0 ? ops[idx].operation_id : randomUUID(),
      percobaan: 0, dibuat: Date.now(), ...input,
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
      const r = await $fetch<{ data: { acknowledged: { operation_id: string }[] } }>('/api/v1/sync/push', {
        method: 'POST',
        body: { device_id: idPerangkat(), operations: ops.map(({ percobaan, dibuat, ...o }) => o) },
      })
      const ack = new Set(r.data.acknowledged.map(a => a.operation_id))
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
