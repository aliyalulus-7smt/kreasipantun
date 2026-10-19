import { useServiceDb } from '../../../utils/db'
import { getSessionUser } from '../../../utils/session'

/**
 * POST /api/v1/sync/pull
 * Body: { cursor: string|null, limit?: number }
 * Cursor opaque: base64 dari server_updated_at terakhir.
 */
export default defineEventHandler(async (event) => {
  const user = await getSessionUser(event)
  if (!user) throw createError({ statusCode: 401, message: 'Belum login.' })

  const body = await readBody(event)
  const limit = Math.min(Math.max(Number(body.limit) || 100, 1), 500)
  let since: string | null = null
  if (body.cursor) {
    try { since = Buffer.from(String(body.cursor), 'base64').toString('utf8') }
    catch { throw createError({ statusCode: 422, message: 'Cursor tidak valid.' }) }
  }

  const db = useServiceDb()
  let q = db.from('stage_progress')
    .select('id, phenomenon_id, stage_id, version, content_version, response_payload, context, server_updated_at')
    .eq('user_id', user.id)
    .order('server_updated_at', { ascending: true })
    .limit(limit + 1)
  if (since) q = q.gt('server_updated_at', since)
  const { data, error } = await q
  if (error) throw createError({ statusCode: 500, message: 'Gagal menarik data.' })

  const hasMore = (data?.length || 0) > limit
  const rows = (data || []).slice(0, limit)
  const changes = rows.map(r => ({
    change_id: r.id,
    record_id: r.id,
    entity_type: 'stage_progress',
    phenomenon_id: r.phenomenon_id,
    stage_id: r.stage_id,
    version: r.version,
    content_version: r.content_version,
    response_payload: r.response_payload,
    context: r.context,
    server_updated_at: r.server_updated_at,
  }))
  const nextCursor = rows.length
    ? Buffer.from(rows[rows.length - 1].server_updated_at).toString('base64')
    : null

  return { data: { changes, next_cursor: nextCursor, has_more: hasMore } }
})
