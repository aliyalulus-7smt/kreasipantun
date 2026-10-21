import { useServiceDb } from '../../../utils/db'
import { getSessionUser } from '../../../utils/session'

/**
 * POST /api/v1/progress/reset
 * Arsipkan seluruh progres aktif siswa sebagai satu "putaran" baru,
 * lalu kosongkan progres aktif agar siswa bisa mengulang dari awal.
 * Progres lama TIDAK dihapus — tersimpan di stage_progress_archive.
 */
export default defineEventHandler(async (event) => {
  const user = await getSessionUser(event)
  if (!user) throw createError({ statusCode: 401, message: 'Belum login.' })

  const db = useServiceDb()
  const { data: aktif, error } = await db
    .from('stage_progress')
    .select('phenomenon_id, stage_id, content_version, response_payload, context, version')
    .eq('user_id', user.id)
  if (error) throw createError({ statusCode: 500, message: 'Gagal membaca progres.' })
  if (!aktif?.length) throw createError({ statusCode: 400, message: 'Belum ada progres untuk diarsipkan.' })

  const { data: arsipAda, error: errArsip } = await db
    .from('stage_progress_archive')
    .select('run_no')
    .eq('user_id', user.id)
    .order('run_no', { ascending: false })
    .limit(1)
  if (errArsip) throw createError({ statusCode: 503, message: 'Fitur arsip belum aktif di server.' })

  const runNo = (arsipAda?.[0]?.run_no || 0) + 1
  const baris = aktif.map(r => ({
    user_id: user.id, run_no: runNo,
    phenomenon_id: r.phenomenon_id, stage_id: r.stage_id,
    content_version: r.content_version, response_payload: r.response_payload,
    context: r.context, version: r.version,
  }))
  const { error: errIns } = await db.from('stage_progress_archive').insert(baris)
  if (errIns) throw createError({ statusCode: 503, message: 'Fitur arsip belum aktif di server.' })

  const { error: errDel } = await db.from('stage_progress').delete().eq('user_id', user.id)
  if (errDel) throw createError({ statusCode: 500, message: 'Gagal mengosongkan progres.' })

  return { data: { run_no: runNo, jumlah: baris.length } }
})
