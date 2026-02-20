import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET — public funding info for a shared pitch (no auth required)
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ pitchId: string }> }
) {
  try {
    const { pitchId } = await params
    const supabase = createAdminClient()

    // Verify share link is active
    const { data: shareLink } = await supabase
      .from('share_links')
      .select('id')
      .eq('pitch_id', pitchId)
      .eq('visibility', 'public')
      .is('deleted_at', null)
      .single()

    if (!shareLink) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    // Fetch funding
    const { data: funding } = await supabase
      .from('funding')
      .select('id, funding_goal, description, end_date')
      .eq('pitch_id', pitchId)
      .single()

    if (!funding) {
      return NextResponse.json({ funding: null })
    }

    // Fetch total raised
    const { data: donations } = await supabase
      .from('donations')
      .select('amount')
      .eq('funding_id', funding.id)

    const totalRaised = donations
      ? donations.reduce((sum: number, d: { amount: number }) => sum + d.amount, 0)
      : 0

    const donorCount = donations?.length ?? 0

    return NextResponse.json({
      funding: {
        id: funding.id,
        funding_goal: funding.funding_goal,
        description: funding.description,
        end_date: funding.end_date,
        total_raised: totalRaised,
        donor_count: donorCount,
      },
    })
  } catch (error) {
    console.error('Public funding error:', error)
    return NextResponse.json({ error: 'Failed to fetch funding' }, { status: 500 })
  }
}
