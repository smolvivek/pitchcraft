import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getDodo } from '@/lib/dodo/client'

const TIER_PRODUCT_IDS: Record<string, Record<string, string | undefined>> = {
  pro: {
    monthly: process.env.DODO_PRODUCT_ID_PRO,
    annual: process.env.DODO_PRODUCT_ID_PRO_ANNUAL,
  },
  studio: {
    monthly: process.env.DODO_PRODUCT_ID_STUDIO,
    annual: process.env.DODO_PRODUCT_ID_STUDIO_ANNUAL,
  },
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { tier, billing_period = 'monthly' } = body as { tier: string; billing_period?: string }

    if (tier !== 'pro' && tier !== 'studio') {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })
    }

    if (billing_period !== 'monthly' && billing_period !== 'annual') {
      return NextResponse.json({ error: 'Invalid billing_period' }, { status: 400 })
    }

    const productId = TIER_PRODUCT_IDS[tier][billing_period]
    if (!productId) {
      return NextResponse.json({ error: `DODO_PRODUCT_ID_${tier.toUpperCase()}${billing_period === 'annual' ? '_ANNUAL' : ''} is not configured` }, { status: 500 })
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

    const dodo = getDodo()
    const session = await dodo.checkoutSessions.create({
      product_cart: [{ product_id: productId, quantity: 1 }],
      metadata: {
        user_id: user.id,
        tier,
        billing_period,
      },
      return_url: `${siteUrl}/dashboard?upgraded=true`,
    })

    return NextResponse.json({ url: session.checkout_url })
  } catch (error) {
    console.error('Subscription checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
