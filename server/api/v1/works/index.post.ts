import { useServiceDb } from '../../../utils/db'
import { getSessionUser } from '../../../utils/session'

/** POST /api/v1/works — siswa menyimpan karya pantun. */
export default defineEventHandler(async (event) => {
  const user = await getSessionUser(event)
  if (!user || user.role !== 'siswa') throw createError({ statusCode: 403, message: 'Hanya siswa.' })

  const body = await readBody(event)
  const larik = [1, 2, 3, 4].map(i => String(body[`larik${i}`] || '').trim())
  if (larik.some(l => !l)) throw createError({ statusCode: 422, message: 'Lengkapi keempat larik.' })
  const phenomenon = String(body.phenomenon_id || '').trim()
  if (!phenomenon) throw createError({ statusCode: 422, message: 'Fenomena wajib diisi.' })

  const db = useServiceDb()
  const { data, error } = await db.from('works').insert({
    user_id: user.id,
    phenomenon_id: phenomenon,
    judul: String(body.judul || '').trim() || null,
    larik1: larik[0], larik2: larik[1], larik3: larik[2], larik4: larik[3],
    is_final: Boolean(body.is_final),
  }).select('id, created_at').single()
  if (error) throw createError({ statusCode: 500, message: 'Gagal menyimpan karya.' })
  return { data: { work: data } }
})
