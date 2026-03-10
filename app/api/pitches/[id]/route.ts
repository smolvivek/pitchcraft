import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const SLUG_RESERVED = new Set([
  'api', 'dashboard', 'p', 'pricing', 'login', 'signup', 'auth', 'admin', 'public', 'static',
])

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

// PATCH — update the slug for a pitch (Pro/Studio only)
export async function PATCH(
  request: NextRequest,
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

    const { data: profile } = await admin
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Verify ownership
    const { data: pitch } = await admin
      .from('pitches')
      .select('id')
      .eq('id', pitchId)
      .eq('user_id', profile.id)
      .is('deleted_at', null)
      .single()

    if (!pitch) {
      return NextResponse.json({ error: 'Pitch not found' }, { status: 404 })
    }

    // Tier check — Pro and Studio only
    const { data: subscription } = await admin
      .from('subscriptions')
      .select('tier')
      .eq('user_id', user.id)
      .in('status', ['active', 'trialing'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    const tier = subscription?.tier ?? 'free'
    if (tier === 'free') {
      return NextResponse.json({ error: 'Custom slugs require Pro or Studio', upgrade: true }, { status: 403 })
    }

    const body = await request.json()
    const { slug } = body

    // null clears the slug
    if (slug !== null) {
      if (typeof slug !== 'string' || slug.length < 3 || slug.length > 60) {
        return NextResponse.json({ error: 'Slug must be 3–60 characters' }, { status: 422 })
      }
      if (!SLUG_REGEX.test(slug)) {
        return NextResponse.json({ error: 'Slug may only contain lowercase letters, numbers, and hyphens (no leading or trailing hyphens)' }, { status: 422 })
      }
      if (SLUG_RESERVED.has(slug)) {
        return NextResponse.json({ error: 'That slug is reserved' }, { status: 422 })
      }

      // Uniqueness check
      const { data: existing } = await admin
        .from('pitches')
        .select('id')
        .eq('slug', slug)
        .neq('id', pitchId)
        .is('deleted_at', null)
        .maybeSingle()

      if (existing) {
        return NextResponse.json({ error: 'Slug already taken' }, { status: 409 })
      }
    }

    const { error: updateError } = await admin
      .from('pitches')
      .update({ slug: slug ?? null })
      .eq('id', pitchId)

    if (updateError) {
      console.error('Slug update error:', updateError)
      return NextResponse.json({ error: 'Failed to update slug' }, { status: 500 })
    }

    return NextResponse.json({ pitch: { id: pitchId, slug: slug ?? null } })
  } catch (error) {
    console.error('Patch pitch error:', error)
    return NextResponse.json({ error: 'Failed to update pitch' }, { status: 500 })
  }
}

// DELETE — soft-delete a pitch owned by the authenticated user
export async function DELETE(
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

    const { data: pitch } = await admin
      .from('pitches')
      .select('id')
      .eq('id', pitchId)
      .eq('user_id', profile.id)
      .is('deleted_at', null)
      .single()

    if (!pitch) {
      return NextResponse.json({ error: 'Pitch not found' }, { status: 404 })
    }

    const { error: deleteError } = await admin
      .from('pitches')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', pitchId)

    if (deleteError) {
      console.error('Delete pitch error:', deleteError)
      return NextResponse.json({ error: 'Failed to delete pitch' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete pitch error:', error)
    return NextResponse.json({ error: 'Failed to delete pitch' }, { status: 500 })
  }
}
