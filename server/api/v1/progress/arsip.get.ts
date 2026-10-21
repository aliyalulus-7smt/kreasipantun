import { useServiceDb } from '../../../utils/db'
import { getSessionUser } from '../../../utils/session'

/**
 * GET /api/v1/progress/arsip
 * Daftar putaran (arsip progres) milik siswa yang login.
 */
export default defineEventHandler(async (event) => {
  const user = await getSessionUser(event)
  if (!user) throw createError({ statusCode: 401, message: 'Belum login.' })

  const db = useServiceDb()
  const { data, error } = await db
    .from('stage_progress_archive')
    .select('run_no, archived_at, phenomenon_id, stage_id')
    .eq('user_id', user.id)
    .order('run_no', { ascending: false })
  if (error) return { data: { runs: [] } } // tabel belum ada → belum ada arsip

  const perRun = new Map<number, { run_no: number; archived_at: string; jumlah_tahap: number }>()
  for (const r of data || []) {
    const ada = perRun.get(r.run_no)
    if (ada) ada.jumlah_tahap += 1
    else perRun.set(r.run_no, { run_no: r.run_no, archived_at: r.archived_at, jumlah_tahap: 1 })
  }
  return { data: { runs: [...perRun.values()] } }
})
