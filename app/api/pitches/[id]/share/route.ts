import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getUserTier } from '@/lib/subscriptions/getTier'

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

async function verifyOwnership(pitchId: string, userId: string): Promise<boolean> {
  const admin = createAdminClient()
  const { data: pitch } = await admin.from('pitches').select('user_id').eq('id', pitchId).is('deleted_at', null).single()
  const { data: profile } = await admin.from('users').select('id').eq('auth_id', userId).single()
  return !!(pitch && profile && pitch.user_id === profile.id)
}

// GET — fetch the active share link for a pitch
export async function GET(
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

    if (!await verifyOwnership(pitchId, user.id)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { data: shareLink } = await supabase
      .from('share_links')
      .select('*')
      .eq('pitch_id', pitchId)
      .is('deleted_at', null)
      .single()

    return NextResponse.json({ shareLink: shareLink ?? null })
  } catch (error) {
    console.error('Get share link error:', error)
    return NextResponse.json({ error: 'Failed to fetch share link' }, { status: 500 })
  }
}

// POST — create a share link with visibility and optional password
export async function POST(
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

    if (!await verifyOwnership(pitchId, user.id)) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const { data: existing } = await supabase
      .from('share_links')
      .select('id')
      .eq('pitch_id', pitchId)
      .is('deleted_at', null)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Share link already exists' }, { status: 409 })
    }

    const body = await request.json().catch(() => ({}))
    const visibility = body.visibility || 'public'
    const password = body.password || null

    // Private and password-protected links require Pro or Studio
    if (visibility !== 'public') {
      const admin = createAdminClient()
      const tier = await getUserTier(admin, user.id)
      if (tier === 'free') {
        return NextResponse.json({ error: 'Private and password-protected links require Pro', upgrade: true }, { status: 403 })
      }
    }

    const { data: shareLink, error: insertError } = await supabase
      .from('share_links')
      .insert({
        pitch_id: pitchId,
        visibility,
        password_hash: password ? await hashPassword(password) : null,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Insert share link error:', insertError)
      return NextResponse.json({ error: 'Failed to create share link' }, { status: 500 })
    }

    return NextResponse.json({ shareLink })
  } catch (error) {
    console.error('Create share link error:', error)
    return NextResponse.json({ error: 'Failed to create share link' }, { status: 500 })
  }
}

// PATCH — update visibility or password
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

    if (!await verifyOwnership(pitchId, user.id)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await request.json()

    // Changing to private/password requires Pro or Studio
    if (body.visibility !== undefined && body.visibility !== 'public') {
      const admin = createAdminClient()
      const tier = await getUserTier(admin, user.id)
      if (tier === 'free') {
        return NextResponse.json({ error: 'Private and password-protected links require Pro', upgrade: true }, { status: 403 })
      }
    }

    const update: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (body.visibility !== undefined) {
      update.visibility = body.visibility
    }

    if (body.password !== undefined) {
      update.password_hash = body.password ? await hashPassword(body.password) : null
    }

    const { data: shareLink, error: updateError } = await supabase
      .from('share_links')
      .update(update)
      .eq('pitch_id', pitchId)
      .is('deleted_at', null)
      .select()
      .single()

    if (updateError) {
      console.error('Update share link error:', updateError)
      return NextResponse.json({ error: 'Failed to update share link' }, { status: 500 })
    }

    return NextResponse.json({ shareLink })
  } catch (error) {
    console.error('Update share link error:', error)
    return NextResponse.json({ error: 'Failed to update share link' }, { status: 500 })
  }
}

// DELETE — revoke (soft-delete) the active share link
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

    if (!await verifyOwnership(pitchId, user.id)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { error: updateError } = await supabase
      .from('share_links')
      .update({ deleted_at: new Date().toISOString() })
      .eq('pitch_id', pitchId)
      .is('deleted_at', null)

    if (updateError) {
      console.error('Revoke share link error:', updateError)
      return NextResponse.json({ error: 'Failed to revoke share link' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Revoke share link error:', error)
    return NextResponse.json({ error: 'Failed to revoke share link' }, { status: 500 })
  }
}
