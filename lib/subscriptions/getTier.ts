import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Returns the effective subscription tier for a user.
 * Handles cancelled subscriptions that are past their period end.
 * Accepts either a user client or admin client.
 * @param client - any Supabase client
 * @param userId - auth UID (auth.users.id)
 */
export async function getUserTier(
  client: SupabaseClient,
  userId: string
): Promise<'free' | 'pro' | 'studio'> {
  const { data: subscription } = await client
    .from('subscriptions')
    .select('tier, status, current_period_end')
    .eq('user_id', userId)
    .single()

  if (!subscription) return 'free'

  if (
    subscription.status === 'cancelled' &&
    subscription.current_period_end &&
    new Date(subscription.current_period_end) < new Date()
  ) {
    return 'free'
  }

  return (subscription.tier as 'free' | 'pro' | 'studio') ?? 'free'
}
