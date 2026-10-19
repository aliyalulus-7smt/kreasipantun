import { useServiceDb } from '../../../utils/db'
import { getSessionUser } from '../../../utils/session'

/** GET /api/v1/guru/siswa — daftar siswa + progres per kelas milik guru. */
export default defineEventHandler(async (event) => {
  const user = await getSessionUser(event)
  if (!user || user.role !== 'guru') throw createError({ statusCode: 403, message: 'Hanya guru.' })

  const db = useServiceDb()
  const { data: kelasList } = await db.from('classes').select('id, nama, kode').eq('guru_id', user.id)

  const hasil: any[] = []
  for (const k of kelasList || []) {
    const { data: anggota } = await db.from('class_members')
      .select('user_id, joined_at, users!inner(id, username, nama_lengkap, no_absen)')
      .eq('class_id', k.id)
    const uids = (anggota || []).map(a => a.user_id)
    let progres: any[] = []
    if (uids.length) {
      const { data } = await db.from('stage_progress')
        .select('user_id, phenomenon_id, stage_id, version, server_updated_at')
        .in('user_id', uids)
      progres = data || []
    }
    hasil.push({
      kelas: k,
      siswa: (anggota || []).map(a => ({
        ...(a.users as any),
        progres: progres.filter(p => p.user_id === a.user_id),
      })),
    })
  }
  return { data: { kelas: hasil } }
})
