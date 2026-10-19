/** Auth via BFF (/api/v1/auth). Session cookie opaque diurus browser. */

export interface BffUser {
  id: string
  username: string
  role: 'super_admin' | 'guru' | 'siswa'
  nama_lengkap: string
  no_absen?: string | null
}

export function useAuth() {
  const user = useState<BffUser | null>('bff-user', () => null)
  const siap = useState('bff-auth-siap', () => false)

  async function me(): Promise<BffUser | null> {
    try {
      const r = await $fetch<{ data: { user: BffUser } }>('/api/v1/auth/me')
      user.value = r.data.user
    } catch {
      user.value = null
    }
    siap.value = true
    return user.value
  }

  async function login(username: string, password: string) {
    const r = await $fetch<{ data: { user: BffUser } }>('/api/v1/auth/login', {
      method: 'POST', body: { username, password },
    })
    user.value = r.data.user
    return user.value
  }

  async function registerGuru(nama_lengkap: string, username: string, password: string) {
    const r = await $fetch<{ data: { user: BffUser } }>('/api/v1/auth/register-guru', {
      method: 'POST', body: { nama_lengkap, username, password },
    })
    user.value = r.data.user
    return user.value
  }

  async function registerSiswa(input: { kode_kelas: string; nama_lengkap: string; no_absen: string; username: string; password: string }) {
    const r = await $fetch<{ data: { user: BffUser } }>('/api/v1/auth/register-siswa', {
      method: 'POST', body: input,
    })
    user.value = r.data.user
    return user.value
  }

  async function logout() {
    try { await $fetch('/api/v1/auth/logout', { method: 'POST' }) } catch {}
    user.value = null
    if (import.meta.client) {
      // Bersihkan cache lokal milik akun ini
      try { localStorage.removeItem('kp-outbox') } catch {}
    }
    await navigateTo('/')
  }

  return { user, siap, me, login, registerGuru, registerSiswa, logout }
}
