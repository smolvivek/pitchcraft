export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer, type DocumentProps } from '@react-pdf/renderer'
import React, { type ReactElement, type JSXElementConstructor } from 'react'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getUserTier } from '@/lib/subscriptions/getTier'
import { getAuthProfile } from '@/lib/auth/getAuthProfile'
import { rateLimit } from '@/lib/ratelimit'
import { PitchPDF } from '@/components/pdf/PitchPDF'
import type { Pitch, PitchSection } from '@/lib/types/pitch'

const PDF_MAX_PER_HOUR = 20
const PDF_WINDOW_MS = 60 * 60 * 1000

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

    const admin = createAdminClient()

    const profile = await getAuthProfile(admin, user.id)
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Tier check — Pro and Studio only
    const tier = await getUserTier(admin, user.id)
    if (tier === 'free') {
      return NextResponse.json({ error: 'PDF export requires Pro or Studio', upgrade: true }, { status: 403 })
    }

    // Rate limit — PDF rendering is CPU-heavy
    const rl = await rateLimit(`rl:pdf:${user.id}`, PDF_MAX_PER_HOUR, PDF_WINDOW_MS)
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many PDF exports. Try again later.' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfterSeconds) } }
      )
    }

    // Ownership check
    const { data: pitch } = await admin
      .from('pitches')
      .select('*')
      .eq('id', pitchId)
      .eq('user_id', profile.id)
      .is('deleted_at', null)
      .single()

    if (!pitch) {
      return NextResponse.json({ error: 'Pitch not found' }, { status: 404 })
    }

    const { data: sections } = await admin
      .from('pitch_sections')
      .select('*')
      .eq('pitch_id', pitchId)
      .order('order_index', { ascending: true })

    const element = React.createElement(PitchPDF, {
      pitch: pitch as Pitch,
      sections: (sections ?? []) as PitchSection[],
    }) as ReactElement<DocumentProps, string | JSXElementConstructor<unknown>>

    const buffer = await renderToBuffer(element)

    const projectName = (pitch as { title?: string; project_name?: string }).title
      ?? (pitch as { project_name?: string }).project_name
      ?? 'pitch'

    const safeName = projectName.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 60)

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${safeName}.pdf"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('PDF generation error:', error)
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 })
  }
}
