import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Pitch, PitchSection, MediaRecord, BudgetRange, PitchStatus, FlowBeat } from '@/lib/types/pitch'
import { OPTIONAL_SECTIONS } from '@/lib/sections'
import { PitchViewLayout } from '@/components/pitch-view/PitchViewLayout'
import { PitchViewTopBar } from '@/components/pitch-view/PitchViewTopBar'
import { PitchViewHero } from '@/components/pitch-view/PitchViewHero'
import { PitchViewMetadata } from '@/components/pitch-view/PitchViewMetadata'
import { PitchViewSection } from '@/components/pitch-view/PitchViewSection'
import { PitchViewCards } from '@/components/pitch-view/PitchViewCards'
import { PitchViewFooter } from '@/components/pitch-view/PitchViewFooter'
import { PitchViewFunding } from '@/components/pitch-view/PitchViewFunding'
import { PitchViewPasswordWrapper } from '@/components/pitch-view/PitchViewPasswordWrapper'
import { PitchViewFlow } from '@/components/pitch-view/PitchViewFlow'

interface PageProps {
  params: Promise<{ id: string }>
}

type ShareLinkInfo = {
  visibility: string
  hasPassword: boolean
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
        .createSignedUrl(m.storage_path, 3600)
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
  const { id } = await params

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
      ...(posterMedia && { images: [{ url: posterMedia.signedUrl }] }),
    },
    twitter: {
      card: posterMedia ? 'summary_large_image' : 'summary',
      title: pitch.project_name,
      description: pitch.logline,
      ...(posterMedia && { images: [posterMedia.signedUrl] }),
    },
  }
}

export default async function PitchViewPage({ params }: PageProps) {
  const { id } = await params

  const linkInfo = await getShareLinkInfo(id)
  if (!linkInfo) notFound()

  // Private links are not viewable without authentication
  if (linkInfo.visibility === 'private') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-[24px]">
        <div className="bg-surface border border-border rounded-[4px] p-[32px] max-w-[400px] w-full text-center">
          <h1 className="font-[var(--font-heading)] text-[24px] font-semibold leading-[32px] tracking-[-0.02em] text-text-primary mb-[8px]">
            Private project
          </h1>
          <p className="font-[var(--font-body)] text-[14px] leading-[20px] text-text-secondary">
            This project is not publicly available.
          </p>
          <p className="font-[var(--font-mono)] text-[11px] leading-[16px] text-text-disabled mt-[24px]">
            Pitchcraft
          </p>
        </div>
      </div>
    )
  }

  const data = await fetchPitchData(id)
  if (!data) notFound()

  const { pitch, sections, media } = data
  const castItems = parseCardItems(pitch.cast_and_characters)
  const teamItems = parseCardItems(pitch.team)

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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkJsonLd) }}
      />
      <PitchViewTopBar version={pitch.current_version} />

      <div className="animate-fade-up opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: delay() }}>
        <PitchViewHero
          projectName={pitch.project_name}
          logline={pitch.logline}
          posterUrl={posterMedia?.signedUrl}
        />
      </div>

      <div className="animate-fade-up-subtle opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: delay() }}>
        <PitchViewMetadata
          genre={pitch.genre}
          status={pitch.status as PitchStatus}
          budgetRange={pitch.budget_range as BudgetRange}
        />
      </div>

      <div className="animate-fade-up-subtle opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: delay() }}>
        <PitchViewSection title="Synopsis" content={pitch.synopsis} />
      </div>

      <div className="animate-fade-up-subtle opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: delay() }}>
        <PitchViewSection
          title="Director's Vision"
          content={pitch.vision}
          images={mediaBySectionMap.get('vision')?.map((m) => ({ url: m.signedUrl, caption: m.caption }))}
        />
      </div>

      <div className="animate-fade-up-subtle opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: delay() }}>
        {castItems.length > 0 ? (
          <PitchViewCards title="Cast & Characters" items={castItems} />
        ) : (
          <PitchViewSection title="Cast & Characters" content={pitch.cast_and_characters} />
        )}
      </div>

      <div className="animate-fade-up-subtle opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: delay() }}>
        {teamItems.length > 0 ? (
          <PitchViewCards title="Key Team" items={teamItems} />
        ) : (
          <PitchViewSection title="Key Team" content={pitch.team} />
        )}
      </div>

      {sections.map((section) => {
        const title = section.data.title || sectionLabels.get(section.section_name) || section.section_name
        const sectionMedia = mediaBySectionMap.get(section.section_name)

        // Flow section renders as horizontal-scroll experience
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
              content={section.data.content}
              images={sectionMedia?.map((m) => ({ url: m.signedUrl, caption: m.caption }))}
              videoUrl={section.data.videoUrl}
            />
          </div>
        )
      })}

      <PitchViewFunding pitchId={pitch.id} projectName={pitch.project_name} />
      <PitchViewFooter />
    </PitchViewLayout>
  )

  // Password-protected: wrap content in password gate
  if (linkInfo.hasPassword) {
    return (
      <PitchViewPasswordWrapper pitchId={id}>
        {pitchContent}
      </PitchViewPasswordWrapper>
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
