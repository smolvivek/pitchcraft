import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@/lib/supabase/server'

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
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

    const { data: pitch } = await supabase
      .from('pitches')
      .select('id')
      .eq('id', pitchId)
      .is('deleted_at', null)
      .single()

    if (!pitch) {
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

    const { data: shareLink, error: insertError } = await supabase
      .from('share_links')
      .insert({
        pitch_id: pitchId,
        visibility,
        password_hash: password ? hashPassword(password) : null,
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

    const body = await request.json()
    const update: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (body.visibility !== undefined) {
      update.visibility = body.visibility
    }

    if (body.password !== undefined) {
      update.password_hash = body.password ? hashPassword(body.password) : null
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
