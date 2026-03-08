import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('tier, status, current_period_end, cancel_at_period_end')
      .eq('user_id', user.id)
      .single()

    // No subscription row = free tier
    if (!subscription) {
      return NextResponse.json({ tier: 'free', status: 'active' })
    }

    // Cancelled subscriptions that have passed their period end revert to free
    if (
      subscription.status === 'cancelled' &&
      subscription.current_period_end &&
      new Date(subscription.current_period_end) < new Date()
    ) {
      return NextResponse.json({ tier: 'free', status: 'cancelled' })
    }

    return NextResponse.json({
      tier: subscription.tier,
      status: subscription.status,
      current_period_end: subscription.current_period_end,
      cancel_at_period_end: subscription.cancel_at_period_end,
    })
  } catch (error) {
    console.error('Subscription status error:', error)
    return NextResponse.json({ error: 'Failed to fetch subscription' }, { status: 500 })
  }
}
