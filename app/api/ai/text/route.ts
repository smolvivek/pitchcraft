import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { refineText, draftText } from '@/lib/ai/text'

const TEXT_DAILY_LIMIT = 50

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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

    if (mode === 'draft' && (!brief || !brief.trim())) {
      return NextResponse.json({ error: 'Brief is required for draft mode' }, { status: 400 })
    }

    // Rate limiting
    const today = new Date().toISOString().split('T')[0]

    const { data: usage } = await supabase
      .from('ai_usage')
      .select('text_count')
      .eq('user_id', user.id)
      .eq('usage_date', today)
      .single()

    if (usage && usage.text_count >= TEXT_DAILY_LIMIT) {
      return NextResponse.json(
        { error: `Daily limit reached (${TEXT_DAILY_LIMIT} text assists per day)` },
        { status: 429 }
      )
    }

    // Increment usage
    if (usage) {
      await supabase
        .from('ai_usage')
        .update({ text_count: usage.text_count + 1 })
        .eq('user_id', user.id)
        .eq('usage_date', today)
    } else {
      await supabase.from('ai_usage').insert({
        user_id: user.id,
        usage_date: today,
        text_count: 1,
        image_count: 0,
      })
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
