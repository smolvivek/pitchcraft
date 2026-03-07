import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: pitchId } = await params

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const admin = createAdminClient()

    // Verify ownership
    const { data: profile } = await admin
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const { data: original } = await admin
      .from('pitches')
      .select('*')
      .eq('id', pitchId)
      .eq('user_id', profile.id)
      .is('deleted_at', null)
      .single()

    if (!original) {
      return NextResponse.json({ error: 'Pitch not found' }, { status: 404 })
    }

    // Enforce free tier pitch limit
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

    // Duplicate pitch — reset status and version
    const { data: copy, error: copyError } = await admin
      .from('pitches')
      .insert({
        user_id: profile.id,
        project_name: `Copy of ${original.project_name}`,
        logline: original.logline,
        synopsis: original.synopsis,
        genre: original.genre,
        vision: original.vision,
        cast_and_characters: original.cast_and_characters,
        budget_range: original.budget_range,
        status: 'looking',
        team: original.team,
        current_version: 1,
      })
      .select()
      .single()

    if (copyError || !copy) {
      return NextResponse.json({ error: 'Failed to duplicate pitch' }, { status: 500 })
    }

    // Duplicate pitch_sections (optional sections — text only, no media)
    const { data: sections } = await admin
      .from('pitch_sections')
      .select('section_name, data, order_index')
      .eq('pitch_id', pitchId)

    if (sections && sections.length > 0) {
      await admin.from('pitch_sections').insert(
        sections.map((s) => ({
          pitch_id: copy.id,
          section_name: s.section_name,
          data: s.data,
          order_index: s.order_index,
        }))
      )
    }

    return NextResponse.json({ id: copy.id })
  } catch (error) {
    console.error('Duplicate pitch error:', error)
    return NextResponse.json({ error: 'Failed to duplicate pitch' }, { status: 500 })
  }
}
