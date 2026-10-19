import { randomBytes, createHash } from 'node:crypto'
import { useServiceDb } from './db'

export const SESSION_COOKIE = '__Host-kp_session'
const SESSION_TTL_DAYS = 30

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

/** Buat sesi baru, kembalikan token opaque untuk cookie. */
export async function createSession(userId: string): Promise<string> {
  const token = randomBytes(32).toString('hex')
  const db = useServiceDb()
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 86400_000).toISOString()
  const { error } = await db.from('sessions').insert({
    user_id: userId,
    token_hash: hashToken(token),
    expires_at: expiresAt,
  })
  if (error) throw createError({ statusCode: 500, message: 'Gagal membuat sesi' })
  return token
}

/** Ambil user dari cookie sesi. Null bila tidak valid/kedaluwarsa. */
export async function getSessionUser(event: any) {
  const token = getCookie(event, SESSION_COOKIE)
  if (!token) return null
  const db = useServiceDb()
  const { data: sess } = await db.from('sessions')
    .select('id, user_id, expires_at')
    .eq('token_hash', hashToken(token))
    .gt('expires_at', new Date().toISOString())
    .maybeSingle()
  if (!sess) return null
  const { data: user } = await db.from('users')
    .select('id, username, role, nama_lengkap, no_absen')
    .eq('id', sess.user_id)
    .maybeSingle()
  return user
}

/** Hapus sesi (logout). */
export async function destroySession(event: any) {
  const token = getCookie(event, SESSION_COOKIE)
  if (token) {
    const db = useServiceDb()
    await db.from('sessions').delete().eq('token_hash', hashToken(token))
  }
  deleteCookie(event, SESSION_COOKIE)
}

export function setSessionCookie(event: any, token: string) {
  setCookie(event, SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_TTL_DAYS * 86400,
  })
}
