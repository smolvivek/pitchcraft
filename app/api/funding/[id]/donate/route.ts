import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getRazorpay } from '@/lib/razorpay/client'

// POST — create a Razorpay order for a donation
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

    if (!amount || amount < 100) {
      return NextResponse.json({ error: 'Minimum donation is 100 (paise / cents)' }, { status: 400 })
    }
    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    // Create Razorpay order
    const razorpay = getRazorpay()
    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      notes: {
        funding_id: fundingId,
        donor_name: name,
        donor_email: email,
        message: message || '',
      },
    })

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    })
  } catch (error) {
    console.error('Create donation order error:', error)
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 })
  }
}
