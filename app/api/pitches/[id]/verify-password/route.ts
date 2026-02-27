import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: pitchId } = await params
    const supabase = createAdminClient()

    const body = await request.json()
    const { password } = body

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 })
    }

    const { data: shareLink } = await supabase
      .from('share_links')
      .select('password_hash')
      .eq('pitch_id', pitchId)
      .is('deleted_at', null)
      .single()

    if (!shareLink || !shareLink.password_hash) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const inputHash = crypto.createHash('sha256').update(password).digest('hex')

    if (inputHash !== shareLink.password_hash) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
    }

    return NextResponse.json({ verified: true })
  } catch (error) {
    console.error('Verify password error:', error)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
