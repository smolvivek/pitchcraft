import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getUserTier } from '@/lib/subscriptions/getTier'
import { getAuthProfile } from '@/lib/auth/getAuthProfile'

// POST — create a new pitch, with server-side tier enforcement
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const admin = createAdminClient()

    const profile = await getAuthProfile(admin, user.id)
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Enforce free tier pitch limit server-side
    const tier = await getUserTier(admin, user.id)

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
      project_type,
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
        project_type: project_type ?? null,
      })
      .select()
      .single()

    if (pitchError || !pitch) {
      console.error('Create pitch error:', pitchError)
      return NextResponse.json({ error: 'Failed to create pitch' }, { status: 500 })
    }

    // Insert optional sections server-side if provided
    const sections: { section_name: string; data: Record<string, unknown>; order_index: number }[] =
      Array.isArray(body.sections) ? body.sections : []

    if (sections.length > 0) {
      const { error: sectionsError } = await admin
        .from('pitch_sections')
        .insert(
          sections.map((s) => ({
            pitch_id: pitch.id,
            section_name: s.section_name,
            data: s.data,
            order_index: s.order_index,
          }))
        )

      if (sectionsError) {
        // Rollback: delete the pitch row so we don't leave partial state
        await admin.from('pitches').delete().eq('id', pitch.id)
        console.error('Sections insert error (rolled back pitch):', sectionsError)
        return NextResponse.json({ error: 'Failed to save sections' }, { status: 500 })
      }
    }

    return NextResponse.json({ id: pitch.id })
  } catch (error) {
    console.error('Create pitch error:', error)
    return NextResponse.json({ error: 'Failed to create pitch' }, { status: 500 })
  }
}
