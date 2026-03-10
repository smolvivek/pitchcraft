import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getRazorpay } from '@/lib/razorpay/client'

const COMMISSION_RATES: Record<string, number> = {
  free: 0.08,
  pro: 0.05,
  studio: 0.03,
}

// POST — create a Razorpay order for a donation
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: fundingId } = await params
    const supabase = createAdminClient()

    // Verify funding exists
    const { data: funding } = await supabase
      .from('funding')
      .select('id, pitch_id, funding_goal, end_date')
      .eq('id', fundingId)
      .single()

    if (!funding) {
      return NextResponse.json({ error: 'Funding not found' }, { status: 404 })
    }

    // Check share link is active (public or password-protected pitches both accept donations)
    const { data: shareLink } = await supabase
      .from('share_links')
      .select('id')
      .eq('pitch_id', funding.pitch_id)
      .in('visibility', ['public', 'password'])
      .is('deleted_at', null)
      .single()

    if (!shareLink) {
      return NextResponse.json({ error: 'Project is not publicly shared' }, { status: 403 })
    }

    if (funding.end_date && new Date(funding.end_date) < new Date()) {
      return NextResponse.json({ error: 'Funding campaign has ended' }, { status: 400 })
    }

    const body = await request.json()
    const { amount, name, email, message } = body as {
      amount: number
      name: string
      email: string
      message?: string
    }

    // amount in cents (USD). Minimum $1 = 100 cents, maximum $10,000 = 1,000,000 cents
    if (!amount || amount < 100) {
      return NextResponse.json({ error: 'Minimum donation is $1' }, { status: 400 })
    }
    if (amount > 1_000_000) {
      return NextResponse.json({ error: 'Maximum donation is $10,000' }, { status: 400 })
    }
    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    // Fetch creator's subscription tier for commission calculation
    const { data: pitch } = await supabase
      .from('pitches')
      .select('user_id, project_name, users(id, email, razorpay_account_id)')
      .eq('id', funding.pitch_id)
      .single()

    const creator = (pitch?.users as unknown) as { id: string; email: string; razorpay_account_id: string | null } | null

    // Get creator's subscription tier
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('tier, status, current_period_end')
      .eq('user_id', pitch?.user_id)
      .single()

    let tier = subscription?.tier ?? 'free'
    // Treat expired/cancelled subscriptions as free
    if (
      subscription?.status === 'cancelled' &&
      subscription?.current_period_end &&
      new Date(subscription.current_period_end) < new Date()
    ) {
      tier = 'free'
    }

    const commissionRate = COMMISSION_RATES[tier] ?? COMMISSION_RATES.free
    const commissionAmount = Math.round(amount * commissionRate)
    const creatorAmount = amount - commissionAmount

    const razorpay = getRazorpay()

    // Build order — include Route transfer if creator has a linked account
    const orderParams: Parameters<typeof razorpay.orders.create>[0] = {
      amount,
      currency: 'USD',
      notes: {
        funding_id: fundingId,
        donor_name: name,
        donor_email: email,
        message: message ?? '',
        creator_amount: String(creatorAmount),
        commission_amount: String(commissionAmount),
        tier,
      },
    }

    if (creator?.razorpay_account_id) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(orderParams as any).transfers = [
        {
          account: creator.razorpay_account_id,
          amount: creatorAmount,
          currency: 'USD',
          notes: {
            project: (pitch as unknown as { project_name?: string })?.project_name ?? '',
          },
        },
      ]
    }

    const order = await razorpay.orders.create(orderParams)

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    if (!keyId) {
      console.error('NEXT_PUBLIC_RAZORPAY_KEY_ID is not set')
      return NextResponse.json({ error: 'Payment not configured' }, { status: 500 })
    }

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: keyId,
      creator_amount: creatorAmount,
      commission_amount: commissionAmount,
      commission_rate: commissionRate,
    })
  } catch (error) {
    console.error('Create donation order error:', error)
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 })
  }
}
