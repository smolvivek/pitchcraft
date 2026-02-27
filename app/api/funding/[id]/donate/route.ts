import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStripe } from '@/lib/stripe/client'

// POST — create a Stripe Checkout session for a donation
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: fundingId } = await params
    const supabase = createAdminClient()

    // Verify funding exists and pitch has an active share link
    const { data: funding } = await supabase
      .from('funding')
      .select('id, pitch_id, funding_goal, end_date')
      .eq('id', fundingId)
      .single()

    if (!funding) {
      return NextResponse.json({ error: 'Funding not found' }, { status: 404 })
    }

    // Check share link is active
    const { data: shareLink } = await supabase
      .from('share_links')
      .select('id')
      .eq('pitch_id', funding.pitch_id)
      .eq('visibility', 'public')
      .is('deleted_at', null)
      .single()

    if (!shareLink) {
      return NextResponse.json({ error: 'Project is not shared' }, { status: 403 })
    }

    // Check if funding has expired
    if (funding.end_date && new Date(funding.end_date) < new Date()) {
      return NextResponse.json({ error: 'Funding campaign has ended' }, { status: 400 })
    }

    const body = await request.json()
    const { amount, name, email, message } = body

    // amount is in cents (e.g., 500 = $5.00)
    if (!amount || amount < 100) {
      return NextResponse.json({ error: 'Minimum donation is $1' }, { status: 400 })
    }
    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
    const pitchUrl = `${siteUrl}/p/${funding.pitch_id}`

    const stripe = getStripe()
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Support this project',
              description: message || undefined,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      customer_email: email,
      metadata: {
        funding_id: fundingId,
        donor_name: name,
        donor_email: email,
        message: message || '',
      },
      success_url: `${pitchUrl}?funded=true`,
      cancel_url: pitchUrl,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Create donation session error:', error)
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 })
  }
}
