import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { createAdminClient } from '@/lib/supabase/admin'
import { rateLimit } from '@/lib/ratelimit'

if (process.env.NODE_ENV === 'production' && !process.env.PITCH_ACCESS_SECRET) {
  throw new Error('PITCH_ACCESS_SECRET must be set in production')
}

function makeAccessToken(pitchId: string): string {
  const secret = process.env.PITCH_ACCESS_SECRET ?? 'dev-insecure-secret'
  return crypto.createHmac('sha256', secret).update(pitchId).digest('hex')
}

const MAX_ATTEMPTS = 5
const LOCKOUT_MS = 15 * 60 * 1000

function getIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  )
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: pitchId } = await params

    // Distributed rate limit — backed by Vercel KV when available
    const ip = getIp(request)
    const rlKey = `rl:pw:${ip}:${pitchId}`
    const rl = await rateLimit(rlKey, MAX_ATTEMPTS, LOCKOUT_MS)

    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many attempts. Try again later.' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfterSeconds) } }
      )
    }

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

    // Successful — KV key expires naturally after the window

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
