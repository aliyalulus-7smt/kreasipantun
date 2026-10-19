import { useServiceDb } from '../../../utils/db'
import { getSessionUser } from '../../../utils/session'

/** Daftar kelas milik guru + jumlah siswa. */
export default defineEventHandler(async (event) => {
  const user = await getSessionUser(event)
  if (!user || user.role !== 'guru') throw createError({ statusCode: 403, message: 'Hanya guru.' })

  const db = useServiceDb()
  const { data } = await db.from('classes')
    .select('id, nama, kode, created_at, class_members(count)')
    .eq('guru_id', user.id)
    .order('created_at', { ascending: false })
  return { data: { kelas: data || [] } }
})
