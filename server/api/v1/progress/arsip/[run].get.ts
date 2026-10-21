import { useServiceDb } from '../../../../utils/db'
import { getSessionUser } from '../../../../utils/session'

/**
 * GET /api/v1/progress/arsip/:run
 * Isi satu putaran arsip (baca-saja) milik siswa yang login.
 */
export default defineEventHandler(async (event) => {
  const user = await getSessionUser(event)
  if (!user) throw createError({ statusCode: 401, message: 'Belum login.' })

  const run = Number(getRouterParam(event, 'run'))
  if (!Number.isInteger(run) || run < 1) throw createError({ statusCode: 400, message: 'Nomor putaran tidak valid.' })

  const db = useServiceDb()
  const { data, error } = await db
    .from('stage_progress_archive')
    .select('phenomenon_id, stage_id, response_payload, archived_at')
    .eq('user_id', user.id)
    .eq('run_no', run)
  if (error) throw createError({ statusCode: 503, message: 'Fitur arsip belum aktif di server.' })
  if (!data?.length) throw createError({ statusCode: 404, message: 'Arsip putaran ini tidak ditemukan.' })

  return { data: { run_no: run, archived_at: data[0].archived_at, items: data } }
})
