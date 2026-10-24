import { useServiceDb } from '../../../utils/db'
import { getSessionUser } from '../../../utils/session'
import { cekPantunBenar } from '../../../../utils/validatePantun'

/** GET /api/v1/works — daftar karya privat (pemilik / guru kelasnya). */
export default defineEventHandler(async (event) => {
  const user = await getSessionUser(event)
  if (!user) throw createError({ statusCode: 401, message: 'Belum login.' })

  const q = getQuery(event)
  const limit = Math.min(Math.max(Number(q.limit) || 20, 1), 100)
  const phenomenon = String(q.phenomenon_id || '')
  const db = useServiceDb()

  let query = db.from('works')
    .select('id, user_id, phenomenon_id, judul, larik1, larik2, larik3, larik4, is_final, created_at, updated_at, users!inner(nama_lengkap)')
    .order('updated_at', { ascending: false })
    .limit(limit)
  if (phenomenon) query = query.eq('phenomenon_id', phenomenon)

  if (user.role === 'siswa') {
    query = query.eq('user_id', user.id)
  } else if (user.role === 'guru') {
    // Hanya siswa di kelas guru ini
    const { data: kelasSaya } = await db.from('classes').select('id').eq('guru_id', user.id)
    const ids = (kelasSaya || []).map(k => k.id)
    if (!ids.length) return { data: { items: [], next_cursor: null, has_more: false } }
    const { data: anggota } = await db.from('class_members').select('user_id').in('class_id', ids)
    const uids = (anggota || []).map(a => a.user_id)
    if (!uids.length) return { data: { items: [], next_cursor: null, has_more: false } }
    query = query.in('user_id', uids)
  } else {
    throw createError({ statusCode: 403, message: 'Super admin tidak membaca isi karya.' })
  }

  const { data, error } = await query
  if (error) throw createError({ statusCode: 500, message: 'Gagal memuat karya.' })
  // Hanya karya yang benar yang ditampilkan — di /karya maupun panel
  // guru (keduanya memakai endpoint ini). Karya lama yang tidak valid
  // disembunyikan, bukan dihapus.
  const items = (data || []).filter(w => cekPantunBenar([w.larik1, w.larik2, w.larik3, w.larik4]).valid)
  return { data: { items, next_cursor: null, has_more: false } }
})
