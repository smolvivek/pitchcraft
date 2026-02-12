import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import crypto from 'crypto'

const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'application/pdf': 'pdf',
}

const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_PDF_SIZE = 50 * 1024 * 1024 // 50MB

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    // @ts-expect-error - FormData.get() exists at runtime but types are inconsistent between Node and DOM
    const file = formData.get('file') as File | null
    // @ts-expect-error - FormData.get() exists at runtime
    const pitchId = formData.get('pitchId') as string | null
    // @ts-expect-error - FormData.get() exists at runtime
    const sectionName = formData.get('sectionName') as string | null

    // Validation
    if (!file || !pitchId || !sectionName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verify user owns pitch
    const { data: pitch, error: pitchError } = await supabase
      .from('pitches')
      .select('id')
      .eq('id', pitchId)
      .single()

    if (pitchError || !pitch) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // File validation (server-side)
    if (!ALLOWED_TYPES[file.type]) {
      return NextResponse.json({ error: 'File type not allowed' }, { status: 400 })
    }

    const MAX_SIZE = file.type === 'application/pdf' ? MAX_PDF_SIZE : MAX_IMAGE_SIZE
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 })
    }

    // Generate random filename
    const ext = ALLOWED_TYPES[file.type]
    const fileName = `${crypto.randomUUID()}.${ext}`
    const storagePath = `${user.id}/${pitchId}/${fileName}`

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('pitch-assets')
      .upload(storagePath, file, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }

    // Insert media record
    const { data: mediaData, error: mediaError } = await supabase
      .from('media')
      .insert({
        pitch_id: pitchId,
        section_name: sectionName,
        storage_path: storagePath,
        file_type: file.type.startsWith('image/') ? 'image' : 'document',
        file_size: file.size,
      })
      .select()
      .single()

    if (mediaError) {
      // Cleanup: delete uploaded file if DB insert fails
      await supabase.storage.from('pitch-assets').remove([storagePath])
      return NextResponse.json({ error: 'Failed to save media record' }, { status: 500 })
    }

    return NextResponse.json({ media: mediaData })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
