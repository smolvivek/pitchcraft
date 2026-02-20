import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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

    // RLS ensures only the owner can see their share links
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

// POST — create a public share link
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

    // Verify pitch exists and belongs to user (RLS handles this)
    const { data: pitch } = await supabase
      .from('pitches')
      .select('id')
      .eq('id', pitchId)
      .is('deleted_at', null)
      .single()

    if (!pitch) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Check for existing active link
    const { data: existing } = await supabase
      .from('share_links')
      .select('id')
      .eq('pitch_id', pitchId)
      .is('deleted_at', null)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Share link already exists' }, { status: 409 })
    }

    const { data: shareLink, error: insertError } = await supabase
      .from('share_links')
      .insert({
        pitch_id: pitchId,
        visibility: 'public',
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

    // Soft-delete the active share link (RLS ensures ownership)
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
