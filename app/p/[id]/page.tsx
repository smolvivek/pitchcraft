import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import crypto from 'crypto'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

if (process.env.NODE_ENV === 'production' && !process.env.PITCH_ACCESS_SECRET) {
  throw new Error('PITCH_ACCESS_SECRET must be set in production')
}

function verifyAccessCookie(pitchId: string, token: string): boolean {
  const secret = process.env.PITCH_ACCESS_SECRET ?? 'dev-insecure-secret'
  const expected = crypto.createHmac('sha256', secret).update(pitchId).digest('hex')
  return token === expected
}
import { headers } from 'next/headers'
import { after } from 'next/server'
import type { Pitch, PitchSection, MediaRecord, BudgetRange, FlowBeat } from '@/lib/types/pitch'
import { recordView } from '@/lib/views/record'
import { OPTIONAL_SECTIONS } from '@/lib/sections'
import { PitchViewLayout } from '@/components/pitch-view/PitchViewLayout'
import { PitchViewTopBar } from '@/components/pitch-view/PitchViewTopBar'
import { PitchViewHero } from '@/components/pitch-view/PitchViewHero'
import { PitchViewMetadata } from '@/components/pitch-view/PitchViewMetadata'
import { PitchViewSection } from '@/components/pitch-view/PitchViewSection'
import { PitchViewCards } from '@/components/pitch-view/PitchViewCards'
import { PitchViewFooter } from '@/components/pitch-view/PitchViewFooter'
import { PitchViewFunding } from '@/components/pitch-view/PitchViewFunding'
import { PitchViewPasswordGate } from '@/components/pitch-view/PitchViewPasswordGate'
import { PitchViewFlow } from '@/components/pitch-view/PitchViewFlow'
import { PitchViewCTA } from '@/components/pitch-view/PitchViewCTA'
import { PitchViewOwnerBar } from '@/components/pitch-view/PitchViewOwnerBar'

interface PageProps {
  params: Promise<{ id: string }>
}

type ShareLinkInfo = {
  visibility: string
  hasPassword: boolean
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

async function resolveIdOrSlug(idOrSlug: string): Promise<string | null> {
  if (UUID_REGEX.test(idOrSlug)) return idOrSlug

  const supabase = createAdminClient()
  const { data } = await supabase
    .from('pitches')
    .select('id')
    .eq('slug', idOrSlug)
    .is('deleted_at', null)
    .single()

  return data?.id ?? null
}

async function getShareLinkInfo(pitchId: string): Promise<ShareLinkInfo | null> {
  const supabase = createAdminClient()

  const { data: shareLink } = await supabase
    .from('share_links')
    .select('visibility, password_hash')
    .eq('pitch_id', pitchId)
    .is('deleted_at', null)
    .single()

  if (!shareLink) return null

  return {
    visibility: shareLink.visibility,
    hasPassword: !!shareLink.password_hash,
  }
}

async function fetchPitchData(pitchId: string) {
  const supabase = createAdminClient()

  const { data: pitch } = await supabase
    .from('pitches')
    .select('*')
    .eq('id', pitchId)
    .is('deleted_at', null)
    .single()

  if (!pitch) return null

  const { data: sections } = await supabase
    .from('pitch_sections')
    .select('*')
    .eq('pitch_id', pitchId)
    .order('order_index', { ascending: true })

  const { data: media } = await supabase
    .from('media')
    .select('*')
    .eq('pitch_id', pitchId)
    .order('order_index', { ascending: true })

  const mediaWithUrls: (MediaRecord & { signedUrl: string })[] = []
  if (media && media.length > 0) {
    const urlPromises = media.map(async (m: MediaRecord) => {
      const { data } = await supabase.storage
        .from('pitch-assets')
        .createSignedUrl(m.storage_path, 604800) // 7 days
      return { ...m, signedUrl: data?.signedUrl ?? '' }
    })
    const resolved = await Promise.all(urlPromises)
    mediaWithUrls.push(...resolved.filter((m) => m.signedUrl))
  }

  return {
    pitch: pitch as Pitch,
    sections: (sections ?? []) as PitchSection[],
    media: mediaWithUrls,
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id: rawId } = await params
  const id = await resolveIdOrSlug(rawId)
  if (!id) return { title: 'Not Found' }

  const linkInfo = await getShareLinkInfo(id)
  if (!linkInfo) return { title: 'Not Found' }

  // Private links don't get OG metadata
  if (linkInfo.visibility === 'private') {
    return { title: 'Private Project — Pitchcraft' }
  }

  const data = await fetchPitchData(id)
  if (!data) return { title: 'Not Found' }

  const { pitch } = data
  const posterMedia = data.media.find(
    (m) => m.section_name === 'poster' || m.file_type === 'image'
  )

  return {
    title: `${pitch.project_name} — Pitchcraft`,
    description: pitch.logline,
    openGraph: {
      title: pitch.project_name,
      description: pitch.logline,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: pitch.project_name,
      description: pitch.logline,
    },
  }
}

export default async function PitchViewPage({ params }: PageProps) {
  const { id: rawId } = await params
  const id = await resolveIdOrSlug(rawId)
  if (!id) notFound()

  const linkInfo = await getShareLinkInfo(id)
  if (!linkInfo) notFound()

  // Private links are not viewable without authentication
  if (linkInfo.visibility === 'private') {
    // Check if the logged-in user is the owner of this pitch
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    let isOwner = false
    if (user) {
      const { data: profile } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', user.id)
        .single()
      if (profile) {
        const { data: pitch } = await supabase
          .from('pitches')
          .select('user_id')
          .eq('id', id)
          .single()
        isOwner = pitch?.user_id === profile.id
      }
    }

    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-[24px]">
        <div className="bg-surface border border-border rounded-none p-[32px] max-w-[400px] w-full text-center">
          <h1 className="font-heading text-[24px] font-bold leading-[32px] tracking-[-0.02em] text-text-primary mb-[8px]">
            Private project
          </h1>
          {isOwner ? (
            <>
              <p className="text-[14px] leading-[20px] text-text-secondary mb-[16px]">
                This project is set to private. Only you can see it.
              </p>
              <a
                href={`/dashboard/pitches/${id}/edit`}
                className="font-mono text-[13px] leading-[20px] text-pop hover:text-pop-hover transition-colors"
              >
                Edit project →
              </a>
            </>
          ) : user ? (
            <p className="text-[14px] leading-[20px] text-text-secondary">
              This project is private and not available to view.
            </p>
          ) : (
            <>
              <p className="text-[14px] leading-[20px] text-text-secondary mb-[16px]">
                This project is private.
              </p>
              <a
                href={`/login?redirect=/p/${id}`}
                className="font-mono text-[13px] leading-[20px] text-pop hover:text-pop-hover transition-colors"
              >
                Log in to continue →
              </a>
            </>
          )}
          <p className="font-mono text-[11px] leading-[16px] text-text-disabled mt-[24px]">
            Pitchcraft
          </p>
        </div>
      </div>
    )
  }

  // Password-protected: verify access cookie before fetching any pitch data.
  // If the cookie is absent or invalid, render ONLY the gate — no content in the HTML.
  if (linkInfo.hasPassword) {
    const cookieStore = await cookies()
    const accessCookie = cookieStore.get(`pitch_access_${id}`)
    const isVerified = accessCookie && verifyAccessCookie(id, accessCookie.value)

    if (!isVerified) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center px-[24px]">
          <div className="bg-surface border border-border rounded-none p-[32px] max-w-[400px] w-full">
            <h1 className="font-heading text-[24px] font-bold leading-[32px] tracking-[-0.02em] text-text-primary mb-[8px]">
              This project is password-protected
            </h1>
            <p className="text-[14px] leading-[20px] text-text-secondary mb-[24px]">
              Enter the password to view.
            </p>
            <PitchViewPasswordGate pitchId={id} />
            <p className="font-mono text-[11px] leading-[16px] text-text-disabled mt-[24px]">
              Pitchcraft
            </p>
          </div>
        </div>
      )
    }
  }

  const data = await fetchPitchData(id)
  if (!data) notFound()

  const { pitch, sections, media } = data

  // ─── Owner check (non-critical — silently skip on error) ───
  let isOwner = false
  try {
    const userSupabase = await createClient()
    const { data: { user } } = await userSupabase.auth.getUser()
    if (user) {
      const { data: profile } = await createAdminClient()
        .from('users')
        .select('id')
        .eq('auth_id', user.id)
        .single()
      if (profile?.id === pitch.user_id) {
        isOwner = true
      }
    }
  } catch {
    // owner bar is non-critical — skip silently
  }
  // Record view after response is sent — after() keeps the serverless function alive
  // until the work completes instead of abandoning the promise on stream close.
  const reqHeaders = await headers()
  const ip = reqHeaders.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '0.0.0.0'
  const country = reqHeaders.get('x-vercel-ip-country') ?? null
  after(() => recordView({ pitchId: id, ownerUserId: pitch.user_id, ip, country, isOwner }))

  const castItems = parseCardItems(pitch.cast_and_characters)
  const teamItems = parseCardItems(pitch.team)

  const directorMember = teamItems.find((t) =>
    t.role.toLowerCase().includes('director')
  )

  const mediaBySectionMap = new Map<string, typeof media>()
  const mediaById = new Map<string, string>()
  for (const m of media) {
    mediaById.set(m.id, m.signedUrl)
    const key = m.section_name ?? '__none__'
    if (!mediaBySectionMap.has(key)) mediaBySectionMap.set(key, [])
    mediaBySectionMap.get(key)!.push(m)
  }

  const posterMedia = media.find(
    (m) => m.section_name === 'poster' || (!m.section_name && m.file_type === 'image')
  )

  const sectionLabels = new Map<string, string>()
  for (const def of OPTIONAL_SECTIONS) {
    sectionLabels.set(def.key, def.label)
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pitchcraft.app'
  const creativeWorkJsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: pitch.project_name,
    description: pitch.logline,
    abstract: pitch.synopsis,
    genre: pitch.genre,
    version: pitch.current_version,
    url: `${siteUrl}/p/${pitch.id}`,
    dateCreated: pitch.created_at,
    dateModified: pitch.updated_at,
    ...(posterMedia && { image: posterMedia.signedUrl }),
  }

  if (teamItems.length > 0) {
    creativeWorkJsonLd.contributor = teamItems.map((t) => ({
      '@type': 'Person',
      name: t.name,
      jobTitle: t.role,
    }))
  }

  if (castItems.length > 0) {
    creativeWorkJsonLd.character = castItems.map((c) => ({
      '@type': 'Person',
      name: c.name,
      description: c.detail ?? c.role,
    }))
  }

  let sectionDelay = 0
  const delay = () => {
    sectionDelay++
    return `${sectionDelay * 80}ms`
  }

  const pitchContent = (
    <PitchViewLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkJsonLd).replace(/<\//g, '<\\/') }}
      />
      <PitchViewTopBar
        projectName={pitch.project_name}
        topOffset={isOwner ? 'top-[40px]' : undefined}
        availableSections={{
          synopsis: !!pitch.synopsis?.trim(),
          vision: !!pitch.vision?.trim(),
          cast: castItems.length > 0 || !!pitch.cast_and_characters?.trim(),
          team: teamItems.length > 0 || !!pitch.team?.trim(),
        }}
      />

      <div className="animate-fade-up opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: delay() }}>
        <PitchViewHero
          projectName={pitch.project_name}
          logline={pitch.logline}
          posterUrl={posterMedia?.signedUrl}
          status={pitch.status}
          directorName={directorMember?.name}
        />
      </div>

      <div className="animate-fade-up-subtle opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: delay() }}>
        <PitchViewMetadata
          genre={pitch.genre}
          budgetRange={pitch.budget_range as BudgetRange}
        />
      </div>

      <div className="animate-fade-up-subtle opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: delay() }}>
        <PitchViewSection id="synopsis" title="Synopsis" index={1} content={pitch.synopsis} />
      </div>

      <div className="animate-fade-up-subtle opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: delay() }}>
        <PitchViewSection
          id="vision"
          title="Director's Vision"
          index={2}
          content={pitch.vision}
          images={mediaBySectionMap.get('vision')?.map((m) => ({ url: m.signedUrl, caption: m.caption }))}
        />
      </div>

      <div className="animate-fade-up-subtle opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: delay() }}>
        {castItems.length > 0 ? (
          <PitchViewCards id="cast" title="Cast & Characters" index={3} items={castItems} variant="cast" />
        ) : (
          <PitchViewSection id="cast" title="Cast & Characters" index={3} content={pitch.cast_and_characters} />
        )}
      </div>

      <div className="animate-fade-up-subtle opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: delay() }}>
        {teamItems.length > 0 ? (
          <PitchViewCards id="team" title="Key Team" index={4} items={teamItems} variant="team" />
        ) : (
          <PitchViewSection id="team" title="Key Team" index={4} content={pitch.team} />
        )}
      </div>

      {sections.map((section, optIdx) => {
        const title = section.data.title || sectionLabels.get(section.section_name) || section.section_name
        const sectionMedia = mediaBySectionMap.get(section.section_name)

        const pdfMedia = sectionMedia?.find(
          (m) => m.file_type?.startsWith('application/pdf') || m.storage_path?.endsWith('.pdf')
        )
        const imageMedia = sectionMedia?.filter(
          (m) => !(m.file_type?.startsWith('application/pdf') || m.storage_path?.endsWith('.pdf'))
        )

        if (section.section_name === 'flow' && section.data.beats && section.data.beats.length > 0) {
          const flowBeats = (section.data.beats as FlowBeat[]).map((beat) => ({
            id: beat.id,
            caption: beat.caption,
            arcLabel: beat.arcLabel,
            imageUrls: beat.mediaIds
              .map((mid) => mediaById.get(mid))
              .filter((url): url is string => !!url),
            videoUrl: beat.videoUrl,
            audioUrl: beat.audioUrl,
          }))
          return (
            <div key={section.id} className="animate-fade-up-subtle opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: delay() }}>
              <PitchViewFlow beats={flowBeats} />
            </div>
          )
        }

        return (
          <div key={section.id} className="animate-fade-up-subtle opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: delay() }}>
            <PitchViewSection
              title={title}
              index={5 + optIdx}
              content={section.data.content}
              images={imageMedia?.map((m) => ({ url: m.signedUrl, caption: m.caption }))}
              videoUrl={section.data.videoUrl}
              pdf={pdfMedia ? { url: pdfMedia.signedUrl, label: section.section_name === 'script_documents' ? 'View Screenplay' : 'View PDF' } : null}
            />
          </div>
        )
      })}

      <PitchViewFunding pitchId={pitch.id} projectName={pitch.project_name} />
      <PitchViewCTA projectName={pitch.project_name} />
      <PitchViewFooter projectName={pitch.project_name} />
    </PitchViewLayout>
  )

  if (isOwner) {
    return (
      <>
        <PitchViewOwnerBar pitchId={id} pitchName={pitch.project_name} projectType={pitch.project_type} />
        {pitchContent}
      </>
    )
  }

  return pitchContent
}

function parseCardItems(text: string): { name: string; role: string; detail?: string }[] {
  try {
    const parsed = JSON.parse(text)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((item: Record<string, unknown>) => item.name && item.role)
      .map((item: Record<string, string>) => ({
        name: item.name,
        role: item.role,
        detail: item.description || item.bio,
      }))
  } catch {
    return []
  }
}
