import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateImage } from '@/lib/ai/image'
import { getUserTier } from '@/lib/subscriptions/getTier'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check subscription tier — free users cannot use AI
    const tier = await getUserTier(supabase, user.id)

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

    // Rate limiting — atomic check+increment via RPC to prevent TOCTOU race
    const today = new Date().toISOString().split('T')[0]

    const { data: allowed, error: rpcError } = await supabase
      .rpc('try_increment_ai_usage', {
        p_user_id: user.id,
        p_date: today,
        p_field: 'image_count',
        p_limit: IMAGE_DAILY_LIMIT,
      })

    if (rpcError) {
      console.error('AI usage RPC error:', rpcError)
      return NextResponse.json({ error: 'Usage tracking error' }, { status: 500 })
    }

    if (!allowed) {
      return NextResponse.json(
        { error: `Daily limit reached (${IMAGE_DAILY_LIMIT} image generations per day)` },
        { status: 429 }
      )
    }

    const result = await generateImage(prompt, fieldName, context || {})

    return NextResponse.json({ url: result.url })
  } catch (error) {
    console.error('AI image error:', error)
    return NextResponse.json({ error: 'Image generation failed' }, { status: 500 })
  }
}
