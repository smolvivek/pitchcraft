import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe/client'
import { createAdminClient } from '@/lib/supabase/admin'
import type Stripe from 'stripe'

// Stripe sends raw body — disable Next.js body parsing
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('Missing STRIPE_WEBHOOK_SECRET')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }

  let event: Stripe.Event
  try {
    const stripe = getStripe()
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    if (session.payment_status === 'paid') {
      const metadata = session.metadata ?? {}
      const fundingId = metadata.funding_id
      const donorName = metadata.donor_name
      const donorEmail = metadata.donor_email
      const message = metadata.message || null

      if (!fundingId) {
        console.error('Webhook: missing funding_id in metadata')
        return NextResponse.json({ error: 'Missing funding_id' }, { status: 400 })
      }

      const supabase = createAdminClient()

      const { error: insertError } = await supabase
        .from('donations')
        .insert({
          funding_id: fundingId,
          amount: session.amount_total ?? 0,
          name: donorName ?? 'Anonymous',
          email: donorEmail ?? session.customer_email ?? '',
          message,
          stripe_session_id: session.id,
          stripe_payment_intent: typeof session.payment_intent === 'string'
            ? session.payment_intent
            : null,
        })

      if (insertError) {
        console.error('Record donation error:', insertError)
        return NextResponse.json({ error: 'Failed to record donation' }, { status: 500 })
      }
    }
  }

  return NextResponse.json({ received: true })
}
