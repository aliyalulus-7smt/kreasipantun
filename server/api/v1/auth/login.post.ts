import { useServiceDb } from '../../../utils/db'
import { verifyPassword } from '../../../utils/password'
import { createSession, setSessionCookie } from '../../../utils/session'

/** Login username + password (semua role). */
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const username = String(body.username || '').trim().toLowerCase()
  const password = String(body.password || '')
  if (!username || !password) throw createError({ statusCode: 422, message: 'Isi username dan password.' })

  const db = useServiceDb()
  const { data: user } = await db.from('users').select('*').eq('username', username).maybeSingle()
  // Pesan generik agar tidak membocorkan username mana yang ada
  if (!user || !(await verifyPassword(password, user.password_hash))) {
    throw createError({ statusCode: 401, message: 'Username atau password salah.' })
  }

  const token = await createSession(user.id)
  setSessionCookie(event, token)
  const { password_hash: _, ...safe } = user
  return { data: { user: safe } }
})
