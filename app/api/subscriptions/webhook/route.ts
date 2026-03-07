import { NextRequest, NextResponse } from 'next/server'
import { getDodo } from '@/lib/dodo/client'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Webhooks } from 'dodopayments/resources/webhooks/webhooks'

export const runtime = 'nodejs'

// Map DodoPayments subscription status → our status
function mapStatus(dodoStatus: string): string {
  switch (dodoStatus) {
    case 'active': return 'active'
    case 'cancelled': return 'cancelled'
    case 'on_hold': return 'past_due'
    case 'failed': return 'past_due'
    default: return 'active'
  }
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headers = Object.fromEntries(request.headers.entries())

  const webhookSecret = process.env.DODO_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('Missing DODO_WEBHOOK_SECRET')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }

  let event: Webhooks.UnwrapWebhookEvent
  try {
    const dodo = getDodo()
    event = dodo.webhooks.unwrap(body, { headers, key: webhookSecret })
  } catch (err) {
    console.error('Dodo webhook verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const subscriptionEvents = new Set([
    'subscription.active',
    'subscription.renewed',
    'subscription.cancelled',
    'subscription.failed',
    'subscription.on_hold',
    'subscription.expired',
    'subscription.plan_changed',
  ])

  if (!subscriptionEvents.has(event.type)) {
    return NextResponse.json({ received: true })
  }

  // All subscription events carry a Subscription in data
  const sub = (event as { data: { subscription_id: string; metadata: Record<string, string>; status: string; next_billing_date?: string; cancel_at_next_billing_date?: boolean; customer?: { customer_id?: string } } }).data

  const userId = sub.metadata?.user_id
  const tier = sub.metadata?.tier as 'pro' | 'studio' | undefined

  if (!userId || !tier) {
    console.error('Dodo webhook: missing user_id or tier in metadata', sub.metadata)
    return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
  }

  const supabase = createAdminClient()

  // Only revoke tier on expiry, not on cancellation.
  // Cancelled users keep their tier until current_period_end (access until what they paid for).
  // On expiry, DodoPayments fires subscription.expired — that's when we revert to free.
  const isExpired = event.type === 'subscription.expired'
  const effectiveTier = isExpired ? 'free' : tier

  await supabase
    .from('subscriptions')
    .upsert(
      {
        user_id: userId,
        tier: effectiveTier,
        dodo_subscription_id: sub.subscription_id,
        dodo_customer_id: sub.customer?.customer_id ?? null,
        status: mapStatus(sub.status),
        current_period_end: sub.next_billing_date ?? null,
        cancel_at_period_end: sub.cancel_at_next_billing_date ?? false,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    )

  return NextResponse.json({ received: true })
}
