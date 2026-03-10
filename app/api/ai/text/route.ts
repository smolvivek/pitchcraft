import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { refineText, draftText } from '@/lib/ai/text'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check subscription tier — free users cannot use AI
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('tier, status, current_period_end')
      .eq('user_id', user.id)
      .single()

    let tier = subscription?.tier ?? 'free'
    if (
      subscription?.status === 'cancelled' &&
      subscription?.current_period_end &&
      new Date(subscription.current_period_end) < new Date()
    ) {
      tier = 'free'
    }

    if (tier === 'free') {
      return NextResponse.json(
        { error: 'AI text assist is a Pro feature. Upgrade at /pricing to unlock.', upgrade: true },
        { status: 403 }
      )
    }

    // Daily limits: Pro = 15, Studio = unlimited (9999)
    const TEXT_DAILY_LIMIT = tier === 'studio' ? 9999 : 15

    const body = await request.json()
    const { mode, text, brief, fieldName, context } = body as {
      mode: 'refine' | 'draft'
      text?: string
      brief?: string
      fieldName: string
      context?: { projectName?: string; genre?: string; format?: string; logline?: string }
    }

    if (!fieldName) {
      return NextResponse.json({ error: 'fieldName is required' }, { status: 400 })
    }

    if (mode === 'refine' && (!text || !text.trim())) {
      return NextResponse.json({ error: 'Text is required for refine mode' }, { status: 400 })
    }

    if (mode === 'refine' && text && text.length > 5000) {
      return NextResponse.json({ error: 'Text exceeds maximum length of 5000 characters' }, { status: 400 })
    }

    if (mode === 'draft' && (!brief || !brief.trim())) {
      return NextResponse.json({ error: 'Brief is required for draft mode' }, { status: 400 })
    }

    if (mode === 'draft' && brief && brief.length > 1000) {
      return NextResponse.json({ error: 'Brief exceeds maximum length of 1000 characters' }, { status: 400 })
    }

    if (fieldName.length > 100) {
      return NextResponse.json({ error: 'Invalid fieldName' }, { status: 400 })
    }

    // Rate limiting — atomic check+increment via RPC to prevent TOCTOU race
    const today = new Date().toISOString().split('T')[0]

    const { data: allowed, error: rpcError } = await supabase
      .rpc('try_increment_ai_usage', {
        p_user_id: user.id,
        p_date: today,
        p_field: 'text_count',
        p_limit: TEXT_DAILY_LIMIT,
      })

    if (rpcError) {
      console.error('AI usage RPC error:', rpcError)
      return NextResponse.json({ error: 'Usage tracking error' }, { status: 500 })
    }

    if (!allowed) {
      return NextResponse.json(
        { error: `Daily limit reached (${TEXT_DAILY_LIMIT} text assists per day)` },
        { status: 429 }
      )
    }

    const ctx = context || {}
    let result: string

    if (mode === 'refine') {
      result = await refineText(text!, fieldName, ctx)
    } else {
      result = await draftText(brief!, fieldName, ctx)
    }

    return NextResponse.json({ suggestion: result })
  } catch (error) {
    console.error('AI text error:', error)
    return NextResponse.json({ error: 'AI text assist failed' }, { status: 500 })
  }
}
