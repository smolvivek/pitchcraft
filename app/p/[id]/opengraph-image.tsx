import { ImageResponse } from 'next/og'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'
export const alt = 'Pitch Preview'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: pitch } = await supabase
    .from('pitches')
    .select('project_name, logline, genre')
    .eq('id', id)
    .single()

  const projectName = pitch?.project_name ?? 'Pitchcraft'
  const logline = pitch?.logline ?? ''
  const genre = pitch?.genre ?? ''

  return new ImageResponse(
    (
      <div
        style={{
          background: '#0A0A0A',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '64px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Genre label */}
        {genre && (
          <div style={{ display: 'flex', marginBottom: '20px' }}>
            <span style={{ color: '#555555', fontSize: '14px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {genre}
            </span>
          </div>
        )}

        {/* Project name */}
        <h1
          style={{
            color: '#F5F5F5',
            fontSize: projectName.length > 30 ? '56px' : '72px',
            fontWeight: 700,
            lineHeight: 1.05,
            margin: 0,
            marginBottom: '24px',
            maxWidth: '1000px',
          }}
        >
          {projectName}
        </h1>

        {/* Logline */}
        {logline && (
          <p
            style={{
              color: '#999999',
              fontSize: '22px',
              lineHeight: 1.5,
              margin: 0,
              maxWidth: '860px',
            }}
          >
            {logline.length > 160 ? logline.slice(0, 160) + '…' : logline}
          </p>
        )}

        {/* Pitchcraft branding */}
        <div
          style={{
            position: 'absolute',
            top: '48px',
            right: '64px',
            color: '#333333',
            fontSize: '14px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Pitchcraft
        </div>

        {/* Orange accent bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: '#FF6300',
          }}
        />
      </div>
    ),
    { ...size }
  )
}
