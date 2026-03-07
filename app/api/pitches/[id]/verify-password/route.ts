import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { createAdminClient } from '@/lib/supabase/admin'

function makeAccessToken(pitchId: string): string {
  const secret = process.env.PITCH_ACCESS_SECRET ?? 'dev-insecure-secret'
  return crypto.createHmac('sha256', secret).update(pitchId).digest('hex')
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: pitchId } = await params
    const supabase = createAdminClient()

    const body = await request.json()
    const { password } = body

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 })
    }

    // Reject obviously too-long passwords before hitting the DB or bcrypt
    if (password.length > 128) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
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

    const match = await bcrypt.compare(password, shareLink.password_hash)

    if (!match) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
    }

    const response = NextResponse.json({ verified: true })
    response.cookies.set(`pitch_access_${pitchId}`, makeAccessToken(pitchId), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400, // 24 hours
      path: `/p/${pitchId}`,
    })
    return response
  } catch (error) {
    console.error('Verify password error:', error)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
