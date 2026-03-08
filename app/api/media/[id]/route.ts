import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch media record
    const { data: media, error: fetchError } = await supabase
      .from('media')
      .select('*, pitches!inner(user_id)')
      .eq('id', id)
      .single()

    if (fetchError || !media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 })
    }

    // Verify ownership via pitch user_id
    const { data: profile } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single()

    if (!profile || media.pitches.user_id !== profile.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('pitch-assets')
      .remove([media.storage_path])

    if (storageError) {
      console.error('Storage delete error:', storageError)
      // Continue anyway to delete DB record
    }

    // Delete media record
    const { error: deleteError } = await supabase
      .from('media')
      .delete()
      .eq('id', id)

    if (deleteError) {
      return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { caption } = body

    if (typeof caption !== 'undefined' && caption !== null && typeof caption !== 'string') {
      return NextResponse.json({ error: 'Invalid caption' }, { status: 400 })
    }

    if (typeof caption === 'string' && caption.length > 500) {
      return NextResponse.json({ error: 'Caption exceeds 500 characters' }, { status: 400 })
    }

    // Verify ownership before updating
    const { data: mediaRecord } = await supabase
      .from('media')
      .select('id, pitches!inner(user_id)')
      .eq('id', id)
      .single()

    const { data: profile } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single()

    if (!profile || !mediaRecord || (mediaRecord.pitches as unknown as { user_id: string }).user_id !== profile.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { data: media, error: updateError } = await supabase
      .from('media')
      .update({ caption: caption ?? null, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (updateError || !media) {
      return NextResponse.json({ error: 'Failed to update caption' }, { status: 500 })
    }

    return NextResponse.json({ media })
  } catch (error) {
    console.error('Caption update error:', error)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Auth check — this endpoint is owner-only (public media uses /api/media/public/[id])
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch media with ownership check via pitch join
    const { data: media, error: fetchError } = await supabase
      .from('media')
      .select('storage_path, pitches!inner(user_id)')
      .eq('id', id)
      .single()

    if (fetchError || !media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 })
    }

    const { data: profile } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single()

    if (!profile || (media.pitches as unknown as { user_id: string }).user_id !== profile.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Generate signed URL (1 hour expiry)
    const { data: urlData, error: urlError } = await supabase.storage
      .from('pitch-assets')
      .createSignedUrl(media.storage_path, 3600)

    if (urlError || !urlData) {
      return NextResponse.json({ error: 'Failed to generate URL' }, { status: 500 })
    }

    return NextResponse.json({ url: urlData.signedUrl })
  } catch (error) {
    console.error('URL generation error:', error)
    return NextResponse.json({ error: 'Failed to generate URL' }, { status: 500 })
  }
}
