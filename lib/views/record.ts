import crypto from 'crypto'
import { createAdminClient } from '@/lib/supabase/admin'
import { getUserTier } from '@/lib/subscriptions/getTier'
import { sendViewNotification } from '@/lib/email/client'

const NOTIFICATION_COOLDOWN_MS = 60 * 60 * 1000 // 1 hour

function hashIpDay(ip: string): string {
  const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
  return crypto.createHash('sha256').update(`${ip}:${today}`).digest('hex')
}

/**
 * Records a pitch view and (if owner is Pro/Studio) sends a view notification.
 * Fire-and-forget — never throws, never blocks page render.
 */
export async function recordView({
  pitchId,
  ownerUserId,
  ip,
  country,
  isOwner,
}: {
  pitchId: string
  ownerUserId: string
  ip: string
  country: string | null
  isOwner: boolean
}): Promise<void> {
  try {
    // Don't count owner's own views
    if (isOwner) return

    const admin = createAdminClient()

    // Only record views for private or password-protected pitches (CONSTRAINTS.md §4)
    const { data: shareLink } = await admin
      .from('share_links')
      .select('visibility, password_hash')
      .eq('pitch_id', pitchId)
      .is('deleted_at', null)
      .maybeSingle()

    const isPrivateOrProtected =
      shareLink?.visibility === 'private' || !!shareLink?.password_hash
    if (!isPrivateOrProtected) return

    const ipDayHash = hashIpDay(ip)

    // Dedup: if this ip+day has already been recorded for this pitch, skip
    const { count } = await admin
      .from('pitch_views')
      .select('id', { count: 'exact', head: true })
      .eq('pitch_id', pitchId)
      .eq('ip_day_hash', ipDayHash)

    const isUniqueView = (count ?? 0) === 0

    // Always insert (even dupes) for total view count; use ip_day_hash for unique count
    await admin.from('pitch_views').insert({ pitch_id: pitchId, ip_day_hash: ipDayHash })

    // Notifications only for unique views
    if (!isUniqueView) return

    // Resolve auth_id for tier check — subscriptions.user_id → auth.users.id,
    // but pitch.user_id → public.users.id. Fetch both email and auth_id in one query.
    const { data: ownerProfile } = await admin
      .from('users')
      .select('auth_id, email')
      .eq('id', ownerUserId)
      .single()
    if (!ownerProfile?.auth_id || !ownerProfile.email) return

    const tier = await getUserTier(admin, ownerProfile.auth_id)
    if (tier === 'free') return

    // Rate-limit via DB — survives cold starts on serverless.
    const { data: pitchMeta } = await admin
      .from('pitches')
      .select('project_name, last_view_notification_at')
      .eq('id', pitchId)
      .single()

    const lastSentAt = pitchMeta?.last_view_notification_at
      ? new Date(pitchMeta.last_view_notification_at).getTime()
      : 0
    if (Date.now() - lastSentAt < NOTIFICATION_COOLDOWN_MS) return

    await admin
      .from('pitches')
      .update({ last_view_notification_at: new Date().toISOString() })
      .eq('id', pitchId)

    sendViewNotification({
      to: ownerProfile.email,
      projectName: pitchMeta?.project_name ?? 'Your project',
      country: country ?? null,
      pitchEditUrl: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pitchcraft.app'}/dashboard/pitches/${pitchId}/edit`,
    }).catch((err) => console.error('View notification email failed:', err))
  } catch (err) {
    // Never let view tracking crash the page
    console.error('recordView error (non-fatal):', err)
  }
}
