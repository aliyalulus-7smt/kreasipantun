import { useServiceDb } from '../../../utils/db'
import { hashPassword } from '../../../utils/password'
import { createSession, setSessionCookie } from '../../../utils/session'

/** Register siswa: kode kelas + nama + no.absen + username + password. */
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const kode = String(body.kode_kelas || '').trim().toUpperCase()
  const username = String(body.username || '').trim().toLowerCase()
  const password = String(body.password || '')
  const nama = String(body.nama_lengkap || '').trim()
  const noAbsen = String(body.no_absen || '').trim()

  if (!/^[A-Za-z0-9]{6}$/.test(kode)) throw createError({ statusCode: 422, message: 'Kode kelas tidak valid.' })
  if (username.length < 3 || password.length < 6 || nama.length < 2) {
    throw createError({ statusCode: 422, message: 'Username min. 3, password min. 6, nama min. 2 karakter.' })
  }

  const db = useServiceDb()

  // Kode -> kelas
  const { data: kelas } = await db.from('classes').select('id').eq('kode', kode).maybeSingle()
  if (!kelas) throw createError({ statusCode: 422, message: 'Kode kelas salah atau sudah tidak berlaku.' })

  // Username unik global
  const { data: adaUser } = await db.from('users').select('id').eq('username', username).maybeSingle()
  if (adaUser) throw createError({ statusCode: 422, message: 'Username sudah dipakai.' })

  // Nama + no.absen unik dalam kelas
  if (noAbsen) {
    const { data: duplikat } = await db.from('users')
      .select('id, class_members!inner(class_id)')
      .eq('nama_lengkap', nama)
      .eq('no_absen', noAbsen)
      .eq('class_members.class_id', kelas.id)
      .maybeSingle()
    if (duplikat) throw createError({ statusCode: 422, message: 'Nama dan no. absen sudah terdaftar di kelas ini.' })
  }

  const { data: user, error } = await db.from('users').insert({
    username,
    password_hash: await hashPassword(password),
    role: 'siswa',
    nama_lengkap: nama,
    no_absen: noAbsen || null,
  }).select('id, username, role, nama_lengkap, no_absen').single()
  if (error) throw createError({ statusCode: 500, message: 'Gagal mendaftar.' })

  const { error: errMember } = await db.from('class_members').insert({
    class_id: kelas.id,
    user_id: user.id,
  })
  if (errMember) {
    await db.from('users').delete().eq('id', user.id)
    throw createError({ statusCode: 500, message: 'Gagal menghubungkan ke kelas.' })
  }

  const token = await createSession(user.id)
  setSessionCookie(event, token)
  return { data: { user } }
})
