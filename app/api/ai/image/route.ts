import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateImage } from '@/lib/ai/image'

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
        { error: 'AI image generation is a Pro feature. Upgrade at /pricing to unlock.', upgrade: true },
        { status: 403 }
      )
    }

    // Daily limits: Pro = 5, Studio = 15
    const IMAGE_DAILY_LIMIT = tier === 'studio' ? 15 : 5

    const body = await request.json()
    const { prompt, fieldName, context } = body as {
      prompt: string
      fieldName: string
      context?: { projectName?: string; genre?: string; format?: string; logline?: string }
    }

    if (!prompt?.trim()) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    if (prompt.length > 1000) {
      return NextResponse.json({ error: 'Prompt exceeds maximum length of 1000 characters' }, { status: 400 })
    }

    if (!fieldName) {
      return NextResponse.json({ error: 'fieldName is required' }, { status: 400 })
    }

    if (fieldName.length > 100) {
      return NextResponse.json({ error: 'Invalid fieldName' }, { status: 400 })
    }

    // Rate limiting
    const today = new Date().toISOString().split('T')[0]

    const { data: usage } = await supabase
      .from('ai_usage')
      .select('image_count')
      .eq('user_id', user.id)
      .eq('usage_date', today)
      .single()

    if (usage && usage.image_count >= IMAGE_DAILY_LIMIT) {
      return NextResponse.json(
        { error: `Daily limit reached (${IMAGE_DAILY_LIMIT} image generations per day)` },
        { status: 429 }
      )
    }

    // Increment usage
    if (usage) {
      await supabase
        .from('ai_usage')
        .update({ image_count: usage.image_count + 1 })
        .eq('user_id', user.id)
        .eq('usage_date', today)
    } else {
      await supabase.from('ai_usage').insert({
        user_id: user.id,
        usage_date: today,
        text_count: 0,
        image_count: 1,
      })
    }

    const result = await generateImage(prompt, fieldName, context || {})

    return NextResponse.json({ url: result.url })
  } catch (error) {
    console.error('AI image error:', error)
    return NextResponse.json({ error: 'Image generation failed' }, { status: 500 })
  }
}
