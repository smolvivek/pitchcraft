import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Resolves an auth UID to a public.users profile row.
 * Returns null if the profile doesn't exist.
 * @param client - any Supabase client
 * @param authId - auth.users.id
 */
export async function getAuthProfile(
  client: SupabaseClient,
  authId: string
): Promise<{ id: string } | null> {
  const { data } = await client
    .from('users')
    .select('id')
    .eq('auth_id', authId)
    .single()

  return data ?? null
}
