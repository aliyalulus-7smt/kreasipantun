import { randomBytes } from 'node:crypto'
import { useServiceDb } from '../../../utils/db'
import { getSessionUser } from '../../../utils/session'

function kodeAcak(): string {
  return randomBytes(4).toString('hex').slice(0, 6).toUpperCase().replace(/[^A-Z0-9]/g, 'X')
}

/** Guru membuat kelas baru -> dapat kode 6 karakter. */
export default defineEventHandler(async (event) => {
  const user = await getSessionUser(event)
  if (!user || user.role !== 'guru') throw createError({ statusCode: 403, message: 'Hanya guru.' })

  const body = await readBody(event)
  const nama = String(body.nama || '').trim()
  if (nama.length < 2) throw createError({ statusCode: 422, message: 'Nama kelas min. 2 karakter.' })

  const db = useServiceDb()
  for (let i = 0; i < 5; i++) {
    const kode = kodeAcak()
    const { data, error } = await db.from('classes')
      .insert({ guru_id: user.id, nama, kode })
      .select('id, nama, kode, created_at').single()
    if (!error) return { data: { kelas: data } }
  }
  throw createError({ statusCode: 500, message: 'Gagal membuat kode unik, coba lagi.' })
})
