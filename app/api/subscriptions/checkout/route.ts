import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getDodo } from '@/lib/dodo/client'

const TIER_PRODUCT_IDS: Record<string, string | undefined> = {
  pro: process.env.DODO_PRODUCT_ID_PRO,
  studio: process.env.DODO_PRODUCT_ID_STUDIO,
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { tier } = body as { tier: string }

    if (tier !== 'pro' && tier !== 'studio') {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })
    }

    const productId = TIER_PRODUCT_IDS[tier]
    if (!productId) {
      return NextResponse.json({ error: `DODO_PRODUCT_ID_${tier.toUpperCase()} is not configured` }, { status: 500 })
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

    const dodo = getDodo()
    const session = await dodo.checkoutSessions.create({
      product_cart: [{ product_id: productId, quantity: 1 }],
      metadata: {
        user_id: user.id,
        tier,
      },
      return_url: `${siteUrl}/dashboard?upgraded=true`,
    })

    return NextResponse.json({ url: session.checkout_url })
  } catch (error) {
    console.error('Subscription checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
