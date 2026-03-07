import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getRazorpay } from '@/lib/razorpay/client'
import { sendDonorConfirmation, sendCreatorDonationAlert } from '@/lib/email/client'
import crypto from 'crypto'

// POST — verify Razorpay signature and record donation
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: fundingId } = await params

    const body = await request.json()
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      name,
      email,
      message,
      amount,
      currency,
    } = body as {
      razorpay_order_id: string
      razorpay_payment_id: string
      razorpay_signature: string
      name: string
      email: string
      message?: string
      amount: number
      currency: string
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment fields' }, { status: 400 })
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET
    if (!keySecret) {
      return NextResponse.json({ error: 'Payment verification not configured' }, { status: 500 })
    }

    // Verify HMAC-SHA256 signature
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
    }

    // Fetch the actual order from Razorpay to get the verified amount.
    // Never trust the client-supplied amount — use what Razorpay actually charged.
    const razorpay = getRazorpay()
    const order = await razorpay.orders.fetch(razorpay_order_id)
    const verifiedAmount = typeof order.amount === 'string' ? parseInt(order.amount, 10) : Number(order.amount)
    const verifiedCurrency = order.currency ?? currency ?? 'USD'

    const supabase = createAdminClient()

    // Prevent duplicate recording
    const { data: existing } = await supabase
      .from('donations')
      .select('id')
      .eq('razorpay_payment_id', razorpay_payment_id)
      .single()

    if (existing) {
      return NextResponse.json({ success: true })
    }

    // Fetch funding + pitch + creator info for emails
    const { data: funding } = await supabase
      .from('funding')
      .select('id, pitch_id')
      .eq('id', fundingId)
      .single()

    if (!funding) {
      return NextResponse.json({ error: 'Funding not found' }, { status: 404 })
    }

    const { data: pitch } = await supabase
      .from('pitches')
      .select('project_name, users(name, email)')
      .eq('id', funding.pitch_id)
      .single()

    const creator = (pitch?.users as unknown) as { name: string; email: string } | null

    // Record donation using Razorpay-verified amount (not client-supplied)
    const { error: insertError } = await supabase
      .from('donations')
      .insert({
        funding_id: fundingId,
        amount: verifiedAmount,
        name: name ?? 'Anonymous',
        email: email ?? '',
        message: message ?? null,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      })

    if (insertError) {
      console.error('Record donation error:', insertError)
      return NextResponse.json({ error: 'Failed to record donation' }, { status: 500 })
    }

    // Send emails — fire and forget, don't fail the response if email fails
    const projectName = (pitch as unknown as { project_name?: string })?.project_name ?? 'this project'

    Promise.allSettled([
      email
        ? sendDonorConfirmation({
            to: email,
            donorName: name ?? 'Supporter',
            projectName,
            amount: verifiedAmount,
            currency: verifiedCurrency,
            paymentId: razorpay_payment_id,
          })
        : Promise.resolve(),
      creator?.email
        ? sendCreatorDonationAlert({
            to: creator.email,
            creatorName: creator.name,
            projectName,
            donorName: name ?? 'Anonymous',
            amount: verifiedAmount,
            currency: verifiedCurrency,
            message,
            paymentId: razorpay_payment_id,
          })
        : Promise.resolve(),
    ]).catch((err) => console.error('Email send error:', err))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Verify donation error:', error)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
