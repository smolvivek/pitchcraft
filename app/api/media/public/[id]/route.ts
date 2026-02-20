import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = createAdminClient()

    // Fetch media record — only if the pitch has an active public share link
    const { data: media, error: fetchError } = await supabase
      .from('media')
      .select('storage_path, pitch_id')
      .eq('id', id)
      .single()

    if (fetchError || !media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 })
    }

    // Verify the pitch has an active public share link
    const { data: shareLink } = await supabase
      .from('share_links')
      .select('id')
      .eq('pitch_id', media.pitch_id)
      .eq('visibility', 'public')
      .is('deleted_at', null)
      .single()

    if (!shareLink) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
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
    console.error('Public media URL error:', error)
    return NextResponse.json({ error: 'Failed to generate URL' }, { status: 500 })
  }
}
