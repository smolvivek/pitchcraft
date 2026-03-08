import { createClient } from '@/lib/supabase/server'
import { Nav } from '@/components/layout/Nav'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/layout/DashboardShell'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

const TIER_LABELS: Record<string, string> = {
  free: 'Free',
  pro: 'Pro',
  studio: 'Studio',
}

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('id, name, email')
    .eq('auth_id', user.id)
    .single()

  if (!profile) redirect('/login')

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('tier, status, current_period_end, cancel_at_period_end')
    .eq('user_id', user.id)
    .single()

  let tier = subscription?.tier ?? 'free'
  const isExpiredCancelled =
    subscription?.status === 'cancelled' &&
    subscription?.current_period_end &&
    new Date(subscription.current_period_end) < new Date()

  if (isExpiredCancelled) tier = 'free'

  const isPastDue = subscription?.status === 'past_due'

  const isPaid = tier === 'pro' || tier === 'studio'
  const periodEnd = subscription?.current_period_end
    ? new Date(subscription.current_period_end).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  const isCancelledButActive =
    subscription?.status === 'cancelled' && !isExpiredCancelled

  return (
    <>
      <Nav user={profile} tier={tier} />
      <DashboardShell>
        <div className="max-w-[640px] mx-auto px-[24px] py-[40px]">
          <h1 className="font-[var(--font-heading)] text-[32px] font-bold leading-[40px] text-text-primary mb-[4px]">
            Account
          </h1>
          <p className="text-[14px] leading-[20px] text-text-secondary mb-[40px]">
            {profile.email}
          </p>

          {/* Past due warning */}
          {isPastDue && (
            <div className="mb-[16px] p-[16px] border-l-2 border-error bg-surface">
              <p className="text-[14px] leading-[20px] text-error">
                Your last payment failed. Please update your billing details to keep Pro access.
              </p>
            </div>
          )}

          {/* Plan */}
          <section className="bg-surface border border-border rounded-[4px] p-[24px] mb-[16px]">
            <h2 className="font-[var(--font-heading)] text-[16px] font-semibold leading-[24px] text-text-primary mb-[16px]">
              Current plan
            </h2>

            <div className="flex items-center justify-between mb-[16px]">
              <div>
                <span className="font-[var(--font-heading)] text-[24px] font-semibold text-text-primary">
                  {TIER_LABELS[tier] ?? tier}
                </span>
                {isPaid && (
                  <span className="ml-[8px] font-[var(--font-mono)] text-[11px] leading-[16px] px-[6px] py-[2px] rounded-[2px] bg-pop/10 text-pop">
                    Active
                  </span>
                )}
                {isCancelledButActive && (
                  <span className="ml-[8px] font-[var(--font-mono)] text-[11px] leading-[16px] px-[6px] py-[2px] rounded-[2px] bg-surface border border-border text-text-secondary">
                    Cancelled
                  </span>
                )}
              </div>
              {!isPaid && (
                <Link href="/pricing">
                  <Button variant="primary">Upgrade</Button>
                </Link>
              )}
            </div>

            {isPaid && periodEnd && !isCancelledButActive && (
              <p className="font-[var(--font-mono)] text-[13px] leading-[20px] text-text-secondary">
                Renews {periodEnd}
              </p>
            )}

            {isCancelledButActive && periodEnd && (
              <p className="font-[var(--font-mono)] text-[13px] leading-[20px] text-text-secondary">
                Access continues until {periodEnd}
              </p>
            )}

            {tier === 'free' && !isPaid && (
              <p className="font-[var(--font-mono)] text-[13px] leading-[20px] text-text-secondary">
                1 project · Public links only · No AI
              </p>
            )}
          </section>

          {/* Cancellation */}
          {isPaid && !isCancelledButActive && (
            <section className="bg-surface border border-border rounded-[4px] p-[24px] mb-[16px]">
              <h2 className="font-[var(--font-heading)] text-[16px] font-semibold leading-[24px] text-text-primary mb-[8px]">
                Cancel subscription
              </h2>
              <p className="text-[14px] leading-[20px] text-text-secondary mb-[16px]">
                To cancel, email us at{' '}
                <a
                  href="mailto:support@pitchcraft.app?subject=Cancel subscription"
                  className="text-link hover:underline"
                >
                  support@pitchcraft.app
                </a>
                {' '}with &quot;Cancel subscription&quot; in the subject line. You&apos;ll keep access until the end of your billing period.
              </p>
            </section>
          )}

          {/* Plan features summary */}
          <section className="bg-surface border border-border rounded-[4px] p-[24px]">
            <h2 className="font-[var(--font-heading)] text-[16px] font-semibold leading-[24px] text-text-primary mb-[16px]">
              What&apos;s included
            </h2>
            {tier === 'free' && (
              <ul className="font-[var(--font-mono)] text-[13px] leading-[20px] text-text-secondary flex flex-col gap-[8px]">
                <li>1 project</li>
                <li>All pitch sections</li>
                <li>Public share link</li>
                <li>8% funding commission</li>
              </ul>
            )}
            {tier === 'pro' && (
              <ul className="font-[var(--font-mono)] text-[13px] leading-[20px] text-text-secondary flex flex-col gap-[8px]">
                <li>Unlimited projects</li>
                <li>Private + password-protected links</li>
                <li>AI text (15/day) + images (5/day)</li>
                <li>3 custom sections</li>
                <li>Unlimited version history</li>
                <li>5% funding commission</li>
                <li>2 collaborators</li>
                <li>PDF export</li>
              </ul>
            )}
            {tier === 'studio' && (
              <ul className="font-[var(--font-mono)] text-[13px] leading-[20px] text-text-secondary flex flex-col gap-[8px]">
                <li>Everything in Pro</li>
                <li>Unlimited AI text</li>
                <li>15 AI images/day</li>
                <li>3% funding commission</li>
                <li>5 collaborators</li>
                <li>Detailed analytics</li>
                <li>Branded PDF export</li>
              </ul>
            )}
          </section>
        </div>
      </DashboardShell>
    </>
  )
}
