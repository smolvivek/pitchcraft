import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET — fetch funding for a pitch (authenticated owner)
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

    const { data: funding } = await supabase
      .from('funding')
      .select('*')
      .eq('pitch_id', pitchId)
      .single()

    // Also fetch total raised
    let totalRaised = 0
    if (funding) {
      const { data: donations } = await supabase
        .from('donations')
        .select('amount')
        .eq('funding_id', funding.id)

      if (donations) {
        totalRaised = donations.reduce((sum: number, d: { amount: number }) => sum + d.amount, 0)
      }
    }

    return NextResponse.json({ funding: funding ?? null, totalRaised })
  } catch (error) {
    console.error('Get funding error:', error)
    return NextResponse.json({ error: 'Failed to fetch funding' }, { status: 500 })
  }
}

// POST — enable funding on a pitch
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

    const body = await request.json()
    const { funding_goal, description, end_date } = body

    if (!funding_goal || funding_goal < 1) {
      return NextResponse.json({ error: 'Funding goal is required' }, { status: 400 })
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

    // Check for existing funding
    const { data: existing } = await supabase
      .from('funding')
      .select('id')
      .eq('pitch_id', pitchId)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Funding already enabled' }, { status: 409 })
    }

    const { data: funding, error: insertError } = await supabase
      .from('funding')
      .insert({
        pitch_id: pitchId,
        funding_goal,
        description: description || null,
        end_date: end_date || null,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Insert funding error:', insertError)
      return NextResponse.json({ error: 'Failed to enable funding' }, { status: 500 })
    }

    return NextResponse.json({ funding })
  } catch (error) {
    console.error('Create funding error:', error)
    return NextResponse.json({ error: 'Failed to enable funding' }, { status: 500 })
  }
}

// PATCH — update funding settings
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
    const { funding_goal, description, end_date } = body

    const { data: funding, error: updateError } = await supabase
      .from('funding')
      .update({
        ...(funding_goal !== undefined && { funding_goal }),
        ...(description !== undefined && { description }),
        ...(end_date !== undefined && { end_date }),
        updated_at: new Date().toISOString(),
      })
      .eq('pitch_id', pitchId)
      .select()
      .single()

    if (updateError) {
      console.error('Update funding error:', updateError)
      return NextResponse.json({ error: 'Failed to update funding' }, { status: 500 })
    }

    return NextResponse.json({ funding })
  } catch (error) {
    console.error('Update funding error:', error)
    return NextResponse.json({ error: 'Failed to update funding' }, { status: 500 })
  }
}

// DELETE — disable funding
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

    const { error: deleteError } = await supabase
      .from('funding')
      .delete()
      .eq('pitch_id', pitchId)

    if (deleteError) {
      console.error('Delete funding error:', deleteError)
      return NextResponse.json({ error: 'Failed to disable funding' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete funding error:', error)
    return NextResponse.json({ error: 'Failed to disable funding' }, { status: 500 })
  }
}
