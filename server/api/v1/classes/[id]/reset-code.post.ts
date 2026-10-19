import { randomBytes } from 'node:crypto'
import { useServiceDb } from '../../../../utils/db'
import { getSessionUser } from '../../../../utils/session'

/** Reset kode kelas: kode lama tidak berlaku untuk pendaftar baru. */
export default defineEventHandler(async (event) => {
  const user = await getSessionUser(event)
  if (!user || user.role !== 'guru') throw createError({ statusCode: 403, message: 'Hanya guru.' })

  const id = getRouterParam(event, 'id')
  const db = useServiceDb()
  const { data: kelas } = await db.from('classes').select('id').eq('id', id).eq('guru_id', user.id).maybeSingle()
  if (!kelas) throw createError({ statusCode: 404, message: 'Kelas tidak ditemukan.' })

  for (let i = 0; i < 5; i++) {
    const kode = randomBytes(4).toString('hex').slice(0, 6).toUpperCase()
    const { data, error } = await db.from('classes').update({ kode }).eq('id', id).select('kode').single()
    if (!error) return { data: { kode: data.kode } }
  }
  throw createError({ statusCode: 500, message: 'Gagal membuat kode baru.' })
})
