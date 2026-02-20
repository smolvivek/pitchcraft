import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Pitch, PitchSection, MediaRecord, BudgetRange, PitchStatus } from '@/lib/types/pitch'
import { OPTIONAL_SECTIONS } from '@/lib/sections'
import { PitchViewLayout } from '@/components/pitch-view/PitchViewLayout'
import { PitchViewTopBar } from '@/components/pitch-view/PitchViewTopBar'
import { PitchViewHero } from '@/components/pitch-view/PitchViewHero'
import { PitchViewMetadata } from '@/components/pitch-view/PitchViewMetadata'
import { PitchViewSection } from '@/components/pitch-view/PitchViewSection'
import { PitchViewCards } from '@/components/pitch-view/PitchViewCards'
import { PitchViewFooter } from '@/components/pitch-view/PitchViewFooter'
import { PitchViewFunding } from '@/components/pitch-view/PitchViewFunding'

interface PageProps {
  params: Promise<{ id: string }>
}

async function fetchSharedPitch(pitchId: string) {
  const supabase = createAdminClient()

  // Verify active public share link exists
  const { data: shareLink } = await supabase
    .from('share_links')
    .select('id')
    .eq('pitch_id', pitchId)
    .eq('visibility', 'public')
    .is('deleted_at', null)
    .single()

  if (!shareLink) return null

  // Fetch pitch
  const { data: pitch } = await supabase
    .from('pitches')
    .select('*')
    .eq('id', pitchId)
    .is('deleted_at', null)
    .single()

  if (!pitch) return null

  // Fetch sections ordered by order_index
  const { data: sections } = await supabase
    .from('pitch_sections')
    .select('*')
    .eq('pitch_id', pitchId)
    .order('order_index', { ascending: true })

  // Fetch all media for this pitch
  const { data: media } = await supabase
    .from('media')
    .select('*')
    .eq('pitch_id', pitchId)
    .order('order_index', { ascending: true })

  // Generate signed URLs for all media in parallel
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
  const data = await fetchSharedPitch(id)

  if (!data) {
    return { title: 'Not Found' }
  }

  const { pitch } = data

  // Find a poster image (first media with section_name 'poster' or first image)
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
  const data = await fetchSharedPitch(id)

  if (!data) {
    notFound()
  }

  const { pitch, sections, media } = data

  // Parse cast and team — stored as plain text, try JSON parse for structured data
  const castItems = parseCardItems(pitch.cast_and_characters)
  const teamItems = parseCardItems(pitch.team)

  // Build a map of media by section
  const mediaBySectionMap = new Map<string, typeof media>()
  for (const m of media) {
    const key = m.section_name ?? '__none__'
    if (!mediaBySectionMap.has(key)) mediaBySectionMap.set(key, [])
    mediaBySectionMap.get(key)!.push(m)
  }

  // Find poster (first image media without section, or section 'poster')
  const posterMedia = media.find(
    (m) => m.section_name === 'poster' || (!m.section_name && m.file_type === 'image')
  )

  // Map section keys to labels
  const sectionLabels = new Map<string, string>()
  for (const def of OPTIONAL_SECTIONS) {
    sectionLabels.set(def.key, def.label)
  }

  // Build JSON-LD structured data
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

  // Add team members as contributors
  if (teamItems.length > 0) {
    creativeWorkJsonLd.contributor = teamItems.map((t) => ({
      '@type': 'Person',
      name: t.name,
      jobTitle: t.role,
    }))
  }

  // Add cast as characters
  if (castItems.length > 0) {
    creativeWorkJsonLd.character = castItems.map((c) => ({
      '@type': 'Person',
      name: c.name,
      description: c.detail ?? c.role,
    }))
  }

  return (
    <PitchViewLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkJsonLd) }}
      />
      <PitchViewTopBar version={pitch.current_version} />

      <PitchViewHero
        projectName={pitch.project_name}
        logline={pitch.logline}
        posterUrl={posterMedia?.signedUrl}
      />

      <PitchViewMetadata
        genre={pitch.genre}
        status={pitch.status as PitchStatus}
        budgetRange={pitch.budget_range as BudgetRange}
      />

      {/* Synopsis */}
      <PitchViewSection
        title="Synopsis"
        content={pitch.synopsis}
      />

      {/* Director's Vision */}
      <PitchViewSection
        title="Director's Vision"
        content={pitch.vision}
        imageUrls={mediaBySectionMap.get('vision')?.map((m) => m.signedUrl)}
      />

      {/* Cast & Characters */}
      {castItems.length > 0 ? (
        <PitchViewCards title="Cast & Characters" items={castItems} />
      ) : (
        <PitchViewSection
          title="Cast & Characters"
          content={pitch.cast_and_characters}
        />
      )}

      {/* Key Team */}
      {teamItems.length > 0 ? (
        <PitchViewCards title="Key Team" items={teamItems} />
      ) : (
        <PitchViewSection
          title="Key Team"
          content={pitch.team}
        />
      )}

      {/* Optional sections in order */}
      {sections.map((section) => {
        const title = section.data.title || sectionLabels.get(section.section_name) || section.section_name
        const sectionMedia = mediaBySectionMap.get(section.section_name)

        return (
          <PitchViewSection
            key={section.id}
            title={title}
            content={section.data.content}
            imageUrls={sectionMedia?.map((m) => m.signedUrl)}
          />
        )
      })}

      <PitchViewFunding pitchId={pitch.id} projectName={pitch.project_name} />

      <PitchViewFooter />
    </PitchViewLayout>
  )
}

/**
 * Try to parse card items from text. Supports:
 * - JSON array of {name, role, description/bio}
 * - Plain text (falls back to empty array — renders as text section instead)
 */
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
