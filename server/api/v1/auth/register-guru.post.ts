import { useServiceDb } from '../../../utils/db'
import { hashPassword } from '../../../utils/password'
import { createSession, setSessionCookie } from '../../../utils/session'

/** Register guru mandiri (tanpa approval). */
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const username = String(body.username || '').trim().toLowerCase()
  const password = String(body.password || '')
  const nama = String(body.nama_lengkap || '').trim()

  if (username.length < 3 || password.length < 6 || nama.length < 2) {
    throw createError({ statusCode: 422, message: 'Username min. 3, password min. 6, nama min. 2 karakter.' })
  }

  const db = useServiceDb()
  const { data: ada } = await db.from('users').select('id').eq('username', username).maybeSingle()
  if (ada) throw createError({ statusCode: 422, message: 'Username sudah dipakai.' })

  const { data: user, error } = await db.from('users').insert({
    username,
    password_hash: await hashPassword(password),
    role: 'guru',
    nama_lengkap: nama,
  }).select('id, username, role, nama_lengkap').single()
  if (error) throw createError({ statusCode: 500, message: 'Gagal mendaftar.' })

  const token = await createSession(user.id)
  setSessionCookie(event, token)
  return { data: { user } }
})
