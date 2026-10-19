import { useServiceDb } from '../../../utils/db'
import { getSessionUser } from '../../../utils/session'

const MAX_PAYLOAD = 10 * 1024 // 10 KiB UTF-8

/**
 * POST /api/v1/sync/push
 * Body: { device_id, operations: [{ operation_id, type, phenomenon_id, stage_id,
 *   content_version, base_version, response_payload, context?, resolves_conflict_id? }] }
 */
export default defineEventHandler(async (event) => {
  const user = await getSessionUser(event)
  if (!user) throw createError({ statusCode: 401, message: 'Belum login.' })

  const body = await readBody(event)
  const ops = Array.isArray(body.operations) ? body.operations : []
  if (!ops.length) return { data: { acknowledged: [] } }

  // Validasi: tidak boleh ada pasangan (phenomenon_id, stage_id) ganda dalam satu batch
  const pasangan = new Set<string>()
  for (const op of ops) {
    if (op.type !== 'stage_progress.upsert') {
      throw createError({ statusCode: 422, message: 'Tipe operasi tidak dikenal.' })
    }
    const key = `${op.phenomenon_id}::${op.stage_id}`
    if (pasangan.has(key)) {
      throw createError({ statusCode: 422, message: 'INVALID_REQUEST: pasangan fenomena-tahap ganda dalam satu batch.' })
    }
    pasangan.add(key)
    const payloadStr = JSON.stringify(op.response_payload ?? {})
    if (new TextEncoder().encode(payloadStr).length > MAX_PAYLOAD) {
      throw createError({ statusCode: 413, message: 'Payload melebihi 10 KiB.' })
    }
    // Larangan field akademik/demo dari klien
    for (const f of ['done', 'is_demo', 'skor', 'score']) {
      if (op.response_payload && f in op.response_payload) {
        throw createError({ statusCode: 422, message: `Field ${f} tidak boleh dikirim klien.` })
      }
    }
  }

  const db = useServiceDb()
  const acknowledged: any[] = []

  for (const op of ops) {
    // Ambil record saat ini
    const { data: cur } = await db.from('stage_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('phenomenon_id', op.phenomenon_id)
      .eq('stage_id', op.stage_id)
      .maybeSingle()

    if (!cur) {
      // Baru: insert version 1
      const { data: ins, error } = await db.from('stage_progress').insert({
        user_id: user.id,
        phenomenon_id: op.phenomenon_id,
        stage_id: op.stage_id,
        content_version: op.content_version || 'v1',
        version: 1,
        response_payload: op.response_payload ?? {},
        context: op.context ?? null,
      }).select('id, version, server_updated_at').single()
      if (error) throw createError({ statusCode: 500, message: 'Gagal menyimpan.' })
      acknowledged.push({ operation_id: op.operation_id, record_id: ins.id, version: 1, server_updated_at: ins.server_updated_at, outcome: 'applied' })
      continue
    }

    // base_version harus cocok, kecuali resolusi konflik
    if (op.resolves_conflict_id) {
      const { data: c } = await db.from('sync_conflicts').select('*').eq('id', op.resolves_conflict_id).eq('resolved', false).maybeSingle()
      if (!c || c.progress_id !== cur.id) throw createError({ statusCode: 422, message: 'Konflik tidak valid.' })
      await db.from('sync_conflicts').update({ resolved: true }).eq('id', c.id)
    } else if ((op.base_version ?? 0) !== cur.version) {
      // 409 VERSION_CONFLICT — simpan kedua versi
      const { data: c } = await db.from('sync_conflicts').insert({
        progress_id: cur.id,
        base_version: op.base_version ?? 0,
        current_version: cur.version,
        current_payload: cur.response_payload,
        incoming_payload: op.response_payload ?? {},
      }).select('id').single()
      throw createError({
        statusCode: 409,
        message: 'VERSION_CONFLICT',
        data: {
          error: {
            code: 'VERSION_CONFLICT',
            conflict: {
              conflict_id: c.id,
              record_id: cur.id,
              current_version: cur.version,
              current_response_payload: cur.response_payload,
              current_context: cur.context,
              current_updated_at: cur.server_updated_at,
            },
          },
        },
      })
    }

    const { data: upd, error } = await db.from('stage_progress').update({
      version: cur.version + 1,
      response_payload: op.response_payload ?? {},
      context: op.context ?? cur.context,
      content_version: op.content_version || cur.content_version,
      server_updated_at: new Date().toISOString(),
    }).eq('id', cur.id).select('version, server_updated_at').single()
    if (error) throw createError({ statusCode: 500, message: 'Gagal menyimpan.' })
    acknowledged.push({ operation_id: op.operation_id, record_id: cur.id, version: upd.version, server_updated_at: upd.server_updated_at, outcome: 'applied' })
  }

  return { data: { acknowledged } }
})
