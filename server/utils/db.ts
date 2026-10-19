import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

/** Supabase client server-side (service_role) untuk BFF. */
export function useServiceDb(): SupabaseClient {
  if (client) return client
  const config = useRuntimeConfig()
  const url = process.env.SUPABASE_URL || config.public.supabaseUrl
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY
  if (!url || !key) {
    throw createError({ statusCode: 503, message: 'Database belum dikonfigurasi' })
  }
  client = createClient(url, key, { auth: { persistSession: false } })
  return client
}
