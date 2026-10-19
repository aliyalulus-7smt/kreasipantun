import { useServiceDb } from '../../../utils/db'
import { getSessionUser } from '../../../utils/session'

/** POST /api/v1/guru/evaluasi — guru menilai fenomena siswa (tidak mengubah karya). */
export default defineEventHandler(async (event) => {
  const user = await getSessionUser(event)
  if (!user || user.role !== 'guru') throw createError({ statusCode: 403, message: 'Hanya guru.' })

  const body = await readBody(event)
  const siswaId = String(body.user_id || '')
  const phenomenon = String(body.phenomenon_id || '')
  const nilai = String(body.nilai || '').trim()
  const komentar = String(body.komentar || '').trim()
  if (!siswaId || !phenomenon) throw createError({ statusCode: 422, message: 'Data tidak lengkap.' })

  const db = useServiceDb()

  // Pastikan siswa ini di kelas guru tersebut
  const { data: kelasSaya } = await db.from('classes').select('id').eq('guru_id', user.id)
  const ids = (kelasSaya || []).map(k => k.id)
  const { data: rel } = await db.from('class_members').select('id').eq('user_id', siswaId).in('class_id', ids).maybeSingle()
  if (!rel) throw createError({ statusCode: 403, message: 'Bukan siswa kelasmu.' })

  const { data, error } = await db.from('evaluations').insert({
    user_id: siswaId,
    guru_id: user.id,
    phenomenon_id: phenomenon,
    nilai: nilai || null,
    komentar: komentar || null,
  }).select('id, created_at').single()
  if (error) throw createError({ statusCode: 500, message: 'Gagal menyimpan penilaian.' })
  return { data: { evaluasi: data } }
})
