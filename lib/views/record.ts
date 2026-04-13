import crypto from 'crypto'
import { createAdminClient } from '@/lib/supabase/admin'
import { getUserTier } from '@/lib/subscriptions/getTier'
import { sendViewNotification } from '@/lib/email/client'

// Rate-limit notifications: at most one email per pitch per hour.
// Stored in memory — resets on cold start, which is acceptable for this use case.
const notificationSentAt = new Map<string, number>()
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

    // Only notify for private or password-protected pitches (CONSTRAINTS.md §4)
    const { data: shareLink } = await admin
      .from('share_links')
      .select('visibility, password_hash')
      .eq('pitch_id', pitchId)
      .is('deleted_at', null)
      .maybeSingle()

    const isPrivateOrProtected =
      shareLink?.visibility === 'private' || !!shareLink?.password_hash
    if (!isPrivateOrProtected) return

    // Check if owner is Pro or Studio
    const tier = await getUserTier(admin, ownerUserId)
    if (tier === 'free') return

    // Rate-limit: one notification per pitch per hour
    const lastSent = notificationSentAt.get(pitchId) ?? 0
    if (Date.now() - lastSent < NOTIFICATION_COOLDOWN_MS) return
    notificationSentAt.set(pitchId, Date.now())

    // Fetch owner email + pitch name
    const [{ data: owner }, { data: pitch }] = await Promise.all([
      admin.from('users').select('email').eq('id', ownerUserId).single(),
      admin.from('pitches').select('title, project_name').eq('id', pitchId).single(),
    ])

    if (!owner?.email) return

    const projectName = (pitch as { title?: string; project_name?: string } | null)?.title
      ?? (pitch as { project_name?: string } | null)?.project_name
      ?? 'Your project'

    sendViewNotification({
      to: owner.email,
      projectName,
      country: country ?? null,
      pitchEditUrl: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pitchcraft.app'}/dashboard/pitches/${pitchId}/edit`,
    }).catch((err) => console.error('View notification email failed:', err))
  } catch (err) {
    // Never let view tracking crash the page
    console.error('recordView error (non-fatal):', err)
  }
}
