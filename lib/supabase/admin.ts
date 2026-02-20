import { createClient } from '@supabase/supabase-js'

/**
 * Service-role Supabase client — bypasses RLS.
 * Use ONLY on the server for operations that serve anonymous visitors
 * (e.g. generating signed URLs for shared pitch media).
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL')
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
