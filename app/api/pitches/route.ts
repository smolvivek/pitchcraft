import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// POST — create a new pitch, with server-side tier enforcement
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const admin = createAdminClient()

    const { data: profile } = await admin
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Enforce free tier pitch limit server-side
    const { data: subscription } = await admin
      .from('subscriptions')
      .select('tier, status, current_period_end')
      .eq('user_id', user.id)
      .single()

    let tier = subscription?.tier ?? 'free'
    if (
      subscription?.status === 'cancelled' &&
      subscription?.current_period_end &&
      new Date(subscription.current_period_end) < new Date()
    ) {
      tier = 'free'
    }

    if (tier === 'free') {
      const { count } = await admin
        .from('pitches')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', profile.id)
        .is('deleted_at', null)

      if (count !== null && count >= 1) {
        return NextResponse.json(
          { error: 'Free accounts are limited to 1 pitch. Upgrade to Pro for unlimited pitches.', upgrade: true },
          { status: 403 }
        )
      }
    }

    const body = await request.json()
    const {
      project_name,
      logline,
      synopsis,
      genre,
      vision,
      cast_and_characters,
      budget_range,
      status: pitchStatus,
      team,
    } = body

    if (!project_name?.trim() || !logline?.trim()) {
      return NextResponse.json({ error: 'Project name and logline are required' }, { status: 400 })
    }

    const { data: pitch, error: pitchError } = await admin
      .from('pitches')
      .insert({
        user_id: profile.id,
        project_name,
        logline,
        synopsis,
        genre,
        vision,
        cast_and_characters,
        budget_range,
        status: pitchStatus,
        team,
      })
      .select()
      .single()

    if (pitchError || !pitch) {
      console.error('Create pitch error:', pitchError)
      return NextResponse.json({ error: 'Failed to create pitch' }, { status: 500 })
    }

    return NextResponse.json({ id: pitch.id })
  } catch (error) {
    console.error('Create pitch error:', error)
    return NextResponse.json({ error: 'Failed to create pitch' }, { status: 500 })
  }
}
