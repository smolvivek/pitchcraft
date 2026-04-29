import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthProfile } from '@/lib/auth/getAuthProfile'

// GET — fetch a specific version's full snapshot data (owner only)
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; versionId: string }> }
) {
  try {
    const { id: pitchId, versionId } = await params
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await getAuthProfile(supabase, user.id)
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Verify ownership via pitch
    const { data: pitch } = await supabase
      .from('pitches')
      .select('id')
      .eq('id', pitchId)
      .eq('user_id', profile.id)
      .is('deleted_at', null)
      .single()

    if (!pitch) {
      return NextResponse.json({ error: 'Pitch not found' }, { status: 404 })
    }

    const { data: version, error } = await supabase
      .from('pitch_versions')
      .select('id, version_number, created_at, data')
      .eq('id', versionId)
      .eq('pitch_id', pitchId)
      .single()

    if (error || !version) {
      return NextResponse.json({ error: 'Version not found' }, { status: 404 })
    }

    return NextResponse.json({ version })
  } catch (error) {
    console.error('Get version error:', error)
    return NextResponse.json({ error: 'Failed to fetch version' }, { status: 500 })
  }
}
