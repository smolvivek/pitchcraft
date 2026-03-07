import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

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
