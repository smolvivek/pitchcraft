'use client'

import { useState, useEffect, useCallback, useMemo, use, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { TextInput, Textarea, SelectInput } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { FlowBeatEditor } from '@/components/ui/FlowBeatEditor'
import { PDFUpload } from '@/components/ui/PDFUpload'
import { Sidebar } from '@/components/layout/Sidebar'
import { SectionTransition } from '@/components/ui/SectionTransition'
import { OPTIONAL_SECTIONS, CUSTOM_SECTION_KEYS } from '@/lib/sections'
import type { SidebarSection } from '@/components/layout/Sidebar'
import type { BudgetRange, PitchStatus, PitchSection, FlowBeat, StretchGoal, FundingReward } from '@/lib/types/pitch'

/* ─── Required section keys (sidebar navigation) ─── */
type RequiredSectionKey =
  | 'logline'
  | 'synopsis'
  | 'genre'
  | 'vision'
  | 'cast'
  | 'budget'
  | 'status'
  | 'team'

const REQUIRED_SECTIONS: { key: RequiredSectionKey; label: string }[] = [
  { key: 'logline', label: 'Logline' },
  { key: 'synopsis', label: 'Synopsis' },
  { key: 'genre', label: 'Genre & Format' },
  { key: 'vision', label: "Director's Vision" },
  { key: 'cast', label: 'Cast & Characters' },
  { key: 'budget', label: 'Budget Range' },
  { key: 'status', label: 'Production Status' },
  { key: 'team', label: 'Key Team' },
]

/* ─── Optional section state ─── */
interface OptionalSectionState {
  enabled: boolean
  content: string
  mediaIds: string[]
  videoUrl: string
  title?: string
  beats?: FlowBeat[]
  mediaId?: string | null
}

function defaultSectionState(): OptionalSectionState {
  return {
    enabled: false,
    content: '',
    mediaIds: [],
    videoUrl: '',
  }
}

/* ─── All toggleable keys (optional + custom) ─── */
const ALL_TOGGLEABLE_KEYS = [
  ...OPTIONAL_SECTIONS.map((s) => s.key),
  ...CUSTOM_SECTION_KEYS,
]

const budgetOptions = [
  { value: 'under-5k', label: 'Under $5K' },
  { value: '5k-50k', label: '$5K–$50K' },
  { value: '50k-250k', label: '$50K–$250K' },
  { value: '250k-1m', label: '$250K–$1M' },
  { value: '1m-plus', label: '$1M+' },
]

const statusOptions = [
  { value: 'development', label: 'Development' },
  { value: 'production', label: 'Production' },
  { value: 'completed', label: 'Completed' },
]

export default function EditPitchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: pitchId } = use(params)
  const router = useRouter()

  // Active section for sidebar navigation
  const [activeSection, setActiveSection] = useState<string>('logline')

  // 8 Required fields
  const [logline, setLogline] = useState('')
  const [synopsis, setSynopsis] = useState('')
  const [genre, setGenre] = useState('')
  const [vision, setVision] = useState('')
  const [castAndCharacters, setCastAndCharacters] = useState('')
  const [budgetRange, setBudgetRange] = useState<BudgetRange | ''>('')
  const [pitchStatus, setPitchStatus] = useState<PitchStatus>('development')
  const [team, setTeam] = useState('')

  // Optional sections — single data-driven map
  const [sections, setSections] = useState<Record<string, OptionalSectionState>>(() => {
    const initial: Record<string, OptionalSectionState> = {}
    for (const key of ALL_TOGGLEABLE_KEYS) {
      initial[key] = defaultSectionState()
    }
    return initial
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Share link state
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [sharingLoading, setSharingLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [shareVisibility, setShareVisibility] = useState<'public' | 'private'>('public')
  const [sharePassword, setSharePassword] = useState('')
  const [shareHasPassword, setShareHasPassword] = useState(false)

  // Version history state
  const [versions, setVersions] = useState<{ id: string; version_number: number; created_at: string }[]>([])
  const [currentVersion, setCurrentVersion] = useState(1)

  // Funding state
  const [fundingEnabled, setFundingEnabled] = useState(false)
  const [fundingGoal, setFundingGoal] = useState('')
  const [fundingDescription, setFundingDescription] = useState('')
  const [fundingEndDate, setFundingEndDate] = useState('')
  const [fundingLoading, setFundingLoading] = useState(false)
  const [fundingTotalRaised, setFundingTotalRaised] = useState(0)
  const [stretchGoals, setStretchGoals] = useState<StretchGoal[]>([])
  const [rewards, setRewards] = useState<FundingReward[]>([])

  // Helper to update a single section
  const updateSection = (key: string, update: Partial<OptionalSectionState>) => {
    setSections((prev) => ({
      ...prev,
      [key]: { ...prev[key], ...update },
    }))
  }

  // Enabled optional keys in definition order
  const enabledOptionalKeys = useMemo(() => {
    return ALL_TOGGLEABLE_KEYS.filter((key) => sections[key]?.enabled)
  }, [sections])

  const enabledKeysSet = useMemo(() => new Set(enabledOptionalKeys), [enabledOptionalKeys])

  // Custom section labels for sidebar
  const customSectionLabels = useMemo(() => {
    const labels: Record<string, string> = {}
    for (const key of CUSTOM_SECTION_KEYS) {
      if (sections[key]?.title) {
        labels[key] = sections[key].title!
      }
    }
    return labels
  }, [sections])

  // Build sidebar sections
  const requiredSidebarSections: SidebarSection[] = REQUIRED_SECTIONS.map((s) => ({
    id: s.key,
    label: s.label,
    completed: isRequiredFieldFilled(s.key),
  }))

  const optionalSidebarSections: SidebarSection[] = enabledOptionalKeys.map((key) => {
    const def = OPTIONAL_SECTIONS.find((d) => d.key === key)
    const customIdx = CUSTOM_SECTION_KEYS.indexOf(key as typeof CUSTOM_SECTION_KEYS[number])
    const label = def
      ? def.label
      : sections[key]?.title || `Custom Section ${customIdx + 1}`
    return {
      id: key,
      label,
      completed: !!(sections[key]?.content?.trim() || sections[key]?.mediaIds?.length || sections[key]?.beats?.length || sections[key]?.mediaId),
    }
  })

  function isRequiredFieldFilled(key: RequiredSectionKey): boolean {
    switch (key) {
      case 'logline': return !!logline.trim()
      case 'synopsis': return !!synopsis.trim()
      case 'genre': return !!genre.trim()
      case 'vision': return !!vision.trim()
      case 'cast': return !!castAndCharacters.trim()
      case 'budget': return !!budgetRange
      case 'status': return !!pitchStatus
      case 'team': return !!team.trim()
    }
  }

  // Toggle a section on/off
  const handleToggleSection = (key: string) => {
    const current = sections[key]
    if (current?.enabled) {
      updateSection(key, { enabled: false })
      // If the disabled section was active, go back to first required
      if (activeSection === key) {
        setActiveSection('logline')
      }
    } else {
      updateSection(key, { enabled: true })
    }
  }

  // ─── Fetch pitch on load ───
  useEffect(() => {
    const fetchPitch = async () => {
      const supabase = createClient()

      const { data: pitch, error: pitchError } = await supabase
        .from('pitches')
        .select('*')
        .eq('id', pitchId)
        .single()

      if (pitchError || !pitch) {
        router.push('/dashboard')
        return
      }

      const { data: fetchedSections } = await supabase
        .from('pitch_sections')
        .select('*')
        .eq('pitch_id', pitchId)

      // Populate required fields
      setCurrentVersion(pitch.current_version ?? 1)
      setLogline(pitch.logline)
      setSynopsis(pitch.synopsis)
      setGenre(pitch.genre)
      setVision(pitch.vision)
      setCastAndCharacters(pitch.cast_and_characters)
      setBudgetRange(pitch.budget_range)
      setPitchStatus(pitch.status)
      setTeam(pitch.team)

      // Populate optional sections from DB
      if (fetchedSections) {
        setSections((prev) => {
          const next = { ...prev }
          fetchedSections.forEach((section: PitchSection) => {
            const key = section.section_name
            if (!(key in next)) {
              next[key] = defaultSectionState()
            }
            next[key] = {
              ...next[key],
              enabled: true,
              content: section.data.content || '',
              mediaIds: section.data.mediaIds || [],
              videoUrl: section.data.videoUrl || '',
              title: section.data.title,
              beats: section.data.beats,
              mediaId: section.data.mediaId,
            }
          })
          return next
        })
      }
    }

    fetchPitch()
  }, [pitchId, router])

  // ─── Share link ───
  const fetchShareLink = useCallback(async () => {
    try {
      const res = await fetch(`/api/pitches/${pitchId}/share`)
      const data = await res.json()
      if (data.shareLink) {
        setShareUrl(`${window.location.origin}/p/${pitchId}`)
        setShareVisibility(data.shareLink.visibility || 'public')
        setShareHasPassword(!!data.shareLink.password_hash)
      } else {
        setShareUrl(null)
      }
    } catch {
      // Silently fail — share UI just shows "not shared"
    }
  }, [pitchId])

  useEffect(() => {
    fetchShareLink()
  }, [fetchShareLink])

  // ─── Version history ───
  const fetchVersions = useCallback(async () => {
    try {
      const res = await fetch(`/api/pitches/${pitchId}/versions`)
      const data = await res.json()
      if (data.versions) setVersions(data.versions)
    } catch {
      // Silently fail
    }
  }, [pitchId])

  useEffect(() => {
    fetchVersions()
  }, [fetchVersions])

  const handleCreateShareLink = async () => {
    setSharingLoading(true)
    try {
      const res = await fetch(`/api/pitches/${pitchId}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visibility: shareVisibility,
          password: sharePassword || null,
        }),
      })
      if (res.ok) {
        setShareUrl(`${window.location.origin}/p/${pitchId}`)
        setShareHasPassword(!!sharePassword)
        setSharePassword('')
      }
    } catch {
      setErrors((prev) => ({ ...prev, share: 'Failed to create share link' }))
    } finally {
      setSharingLoading(false)
    }
  }

  const handleUpdateShareLink = async () => {
    setSharingLoading(true)
    try {
      const res = await fetch(`/api/pitches/${pitchId}/share`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visibility: shareVisibility,
          ...(sharePassword && { password: sharePassword }),
        }),
      })
      if (res.ok) {
        if (sharePassword) setShareHasPassword(true)
        setSharePassword('')
      }
    } catch {
      setErrors((prev) => ({ ...prev, share: 'Failed to update share link' }))
    } finally {
      setSharingLoading(false)
    }
  }

  const handleRemovePassword = async () => {
    setSharingLoading(true)
    try {
      await fetch(`/api/pitches/${pitchId}/share`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: '' }),
      })
      setShareHasPassword(false)
    } catch {
      setErrors((prev) => ({ ...prev, share: 'Failed to remove password' }))
    } finally {
      setSharingLoading(false)
    }
  }

  const handleRevokeShareLink = async () => {
    setSharingLoading(true)
    try {
      const res = await fetch(`/api/pitches/${pitchId}/share`, { method: 'DELETE' })
      if (res.ok) {
        setShareUrl(null)
      }
    } catch {
      setErrors((prev) => ({ ...prev, share: 'Failed to revoke share link' }))
    } finally {
      setSharingLoading(false)
    }
  }

  const handleCopyLink = async () => {
    if (!shareUrl) return
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  // ─── Funding ───
  const fetchFunding = useCallback(async () => {
    try {
      const res = await fetch(`/api/pitches/${pitchId}/funding`)
      const data = await res.json()
      if (data.funding) {
        setFundingEnabled(true)
        setFundingGoal(String(data.funding.funding_goal / 100))
        setFundingDescription(data.funding.description || '')
        setFundingEndDate(data.funding.end_date?.split('T')[0] || '')
        setFundingTotalRaised(data.totalRaised || 0) // cents
        setStretchGoals((data.funding.stretch_goals || []).map((g: StretchGoal) => ({ ...g, amount: g.amount / 100 })))
        setRewards((data.funding.rewards || []).map((r: FundingReward) => ({ ...r, amount: r.amount / 100 })))
      }
    } catch {
      // Silently fail
    }
  }, [pitchId])

  useEffect(() => {
    fetchFunding()
  }, [fetchFunding])

  const handleEnableFunding = async () => {
    const goalDollars = parseFloat(fundingGoal)
    if (!goalDollars || goalDollars < 1) {
      setErrors((prev) => ({ ...prev, funding: 'Enter a valid funding goal' }))
      return
    }
    setFundingLoading(true)
    try {
      const res = await fetch(`/api/pitches/${pitchId}/funding`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          funding_goal: Math.round(goalDollars * 100),
          description: fundingDescription || null,
          end_date: fundingEndDate || null,
          stretch_goals: stretchGoals.map((g) => ({ ...g, amount: Math.round(g.amount * 100) })),
          rewards: rewards.map((r) => ({ ...r, amount: Math.round(r.amount * 100) })),
        }),
      })
      if (res.ok) {
        setFundingEnabled(true)
        setErrors((prev) => { const { funding: _, ...rest } = prev; return rest })
      }
    } catch {
      setErrors((prev) => ({ ...prev, funding: 'Failed to enable funding' }))
    } finally {
      setFundingLoading(false)
    }
  }

  const handleUpdateFunding = async () => {
    const goalDollars = parseFloat(fundingGoal)
    if (!goalDollars || goalDollars < 1) {
      setErrors((prev) => ({ ...prev, funding: 'Enter a valid funding goal' }))
      return
    }
    setFundingLoading(true)
    try {
      await fetch(`/api/pitches/${pitchId}/funding`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          funding_goal: Math.round(goalDollars * 100),
          description: fundingDescription || null,
          end_date: fundingEndDate || null,
          stretch_goals: stretchGoals.map((g) => ({ ...g, amount: Math.round(g.amount * 100) })),
          rewards: rewards.map((r) => ({ ...r, amount: Math.round(r.amount * 100) })),
        }),
      })
      setErrors((prev) => { const { funding: _, ...rest } = prev; return rest })
    } catch {
      setErrors((prev) => ({ ...prev, funding: 'Failed to update funding' }))
    } finally {
      setFundingLoading(false)
    }
  }

  const handleDisableFunding = async () => {
    setFundingLoading(true)
    try {
      const res = await fetch(`/api/pitches/${pitchId}/funding`, { method: 'DELETE' })
      if (res.ok) {
        setFundingEnabled(false)
        setFundingGoal('')
        setFundingDescription('')
        setFundingEndDate('')
        setFundingTotalRaised(0)
      }
    } catch {
      setErrors((prev) => ({ ...prev, funding: 'Failed to disable funding' }))
    } finally {
      setFundingLoading(false)
    }
  }

  // ─── Submit ───
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrors({})

    const newErrors: Record<string, string> = {}
    if (!logline.trim()) newErrors.logline = 'Logline is required'
    if (logline.length > 500) newErrors.logline = 'Max 500 characters'
    if (!synopsis.trim()) newErrors.synopsis = 'Synopsis is required'
    if (!genre.trim()) newErrors.genre = 'Genre is required'
    if (!vision.trim()) newErrors.vision = 'Vision is required'
    if (!castAndCharacters.trim()) newErrors.castAndCharacters = 'Cast & Characters is required'
    if (!budgetRange) newErrors.budgetRange = 'Budget range is required'
    if (!pitchStatus) newErrors.status = 'Status is required'
    if (!team.trim()) newErrors.team = 'Team is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      // Navigate to the first section with an error
      const errorKeys = Object.keys(newErrors)
      const firstErrorSection = REQUIRED_SECTIONS.find((s) => {
        if (s.key === 'cast' && errorKeys.includes('castAndCharacters')) return true
        if (s.key === 'budget' && errorKeys.includes('budgetRange')) return true
        return errorKeys.includes(s.key)
      })
      if (firstErrorSection) setActiveSection(firstErrorSection.key)
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()

      // Snapshot current version before saving
      const { data: currentPitch } = await supabase
        .from('pitches')
        .select('*')
        .eq('id', pitchId)
        .single()

      if (currentPitch) {
        const { data: existingSections } = await supabase
          .from('pitch_sections')
          .select('*')
          .eq('pitch_id', pitchId)

        await supabase
          .from('pitch_versions')
          .insert({
            pitch_id: pitchId,
            version_number: currentPitch.current_version,
            data: {
              pitch: currentPitch,
              sections: existingSections ?? [],
            },
          })
      }

      const nextVersion = (currentPitch?.current_version ?? 0) + 1

      const { error: pitchError } = await supabase
        .from('pitches')
        .update({
          logline,
          synopsis,
          genre,
          vision,
          cast_and_characters: castAndCharacters,
          budget_range: budgetRange,
          status: pitchStatus,
          team,
          current_version: nextVersion,
          updated_at: new Date().toISOString(),
        })
        .eq('id', pitchId)

      if (pitchError) throw pitchError

      // Delete all existing sections
      await supabase
        .from('pitch_sections')
        .delete()
        .eq('pitch_id', pitchId)

      // Build insert array from sections map
      const sectionsToInsert: {
        pitch_id: string
        section_name: string
        data: Record<string, unknown>
        order_index: number
      }[] = []

      enabledOptionalKeys.forEach((key, index) => {
        const s = sections[key]
        if (!s) return

        const hasContent = s.content?.trim()
        const hasMedia = s.mediaIds?.length > 0
        const hasBeats = s.beats && s.beats.length > 0
        const hasDoc = !!s.mediaId
        const hasVideo = !!s.videoUrl?.trim()

        if (!hasContent && !hasMedia && !hasBeats && !hasDoc && !hasVideo) return

        const data: Record<string, unknown> = {}
        if (hasContent) data.content = s.content
        if (hasMedia) data.mediaIds = s.mediaIds
        if (hasBeats) data.beats = s.beats
        if (hasDoc) data.mediaId = s.mediaId
        if (hasVideo) data.videoUrl = s.videoUrl
        if (s.title) data.title = s.title

        sectionsToInsert.push({
          pitch_id: pitchId,
          section_name: key,
          data,
          order_index: index + 1,
        })
      })

      if (sectionsToInsert.length > 0) {
        const { error: sectionsError } = await supabase
          .from('pitch_sections')
          .insert(sectionsToInsert)

        if (sectionsError) throw sectionsError
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      console.error('Save project error:', err)
      const message = err instanceof Error ? err.message : String(err)
      setErrors({ general: `Failed to save project: ${message}` })
    } finally {
      setLoading(false)
    }
  }

  // ─── Delete ───
  const handleDelete = async () => {
    setDeleting(true)

    try {
      const supabase = createClient()
      await supabase
        .from('pitches')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', pitchId)

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      console.error(err)
      setErrors({ general: 'Failed to delete project' })
    } finally {
      setDeleting(false)
      setDeleteModalOpen(false)
    }
  }

  // ─── Determine what to render based on active section ───
  const isRequiredSection = REQUIRED_SECTIONS.some((s) => s.key === activeSection)
  const optionalDef = OPTIONAL_SECTIONS.find((d) => d.key === activeSection)
  const isCustomSection = CUSTOM_SECTION_KEYS.includes(activeSection as typeof CUSTOM_SECTION_KEYS[number])
  const currentSectionState = sections[activeSection]

  // Compute section number for A24 transition
  const activeSectionNumber = (() => {
    const reqIdx = REQUIRED_SECTIONS.findIndex((s) => s.key === activeSection)
    if (reqIdx !== -1) return String(reqIdx + 1).padStart(2, '0')
    const optIdx = enabledOptionalKeys.indexOf(activeSection)
    if (optIdx !== -1) return String(REQUIRED_SECTIONS.length + optIdx + 1).padStart(2, '0')
    return '01'
  })()

  return (
    <>
      <div className="min-h-screen bg-background flex">
        {/* ─── Sidebar ─── */}
        <Sidebar
          sections={requiredSidebarSections}
          optionalSections={optionalSidebarSections}
          activeId={activeSection}
          onSelect={setActiveSection}
          allOptionalDefs={OPTIONAL_SECTIONS}
          enabledKeys={enabledKeysSet}
          onToggleSection={handleToggleSection}
          customSectionLabels={customSectionLabels}
          className="fixed left-0 top-0 h-screen z-10"
        />

        {/* ─── Main content ─── */}
        <main className="ml-[240px] flex-1">
          <div className="max-w-[800px] mx-auto px-[40px] py-[40px]">
            <div className="bg-surface border border-border rounded-[4px] p-[32px]">
              <h1 className="font-[var(--font-heading)] text-[24px] font-semibold leading-[32px] text-text-primary mb-[32px]">
                Edit Project
              </h1>

              <form onSubmit={handleSubmit}>
                <SectionTransition sectionNumber={activeSectionNumber} sectionKey={activeSection}>
                {/* ═══ Required sections ═══ */}

                {activeSection === 'logline' && (
                  <div className="flex flex-col gap-[16px]">
                    <TextInput
                      label="Logline"
                      value={logline}
                      onChange={(e) => setLogline(e.target.value)}
                      error={errors.logline}
                      helpText="One-sentence pitch (max 500 characters)"
                      required
                    />
                  </div>
                )}

                {activeSection === 'synopsis' && (
                  <div className="flex flex-col gap-[16px]">
                    <Textarea
                      label="Synopsis"
                      value={synopsis}
                      onChange={(e) => setSynopsis(e.target.value)}
                      error={errors.synopsis}
                      helpText="2–5 paragraphs"
                      required
                    />
                  </div>
                )}

                {activeSection === 'genre' && (
                  <div className="flex flex-col gap-[16px]">
                    <TextInput
                      label="Genre & Format"
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      error={errors.genre}
                      helpText="e.g., Drama / Feature Film"
                      required
                    />
                  </div>
                )}

                {activeSection === 'vision' && (
                  <div className="flex flex-col gap-[16px]">
                    <Textarea
                      label="Director's Vision"
                      value={vision}
                      onChange={(e) => setVision(e.target.value)}
                      error={errors.vision}
                      helpText="Why this project, why you"
                      required
                    />
                  </div>
                )}

                {activeSection === 'cast' && (
                  <div className="flex flex-col gap-[16px]">
                    <Textarea
                      label="Cast & Characters"
                      value={castAndCharacters}
                      onChange={(e) => setCastAndCharacters(e.target.value)}
                      error={errors.castAndCharacters}
                      helpText="Key characters and roles"
                      required
                    />
                  </div>
                )}

                {activeSection === 'budget' && (
                  <div className="flex flex-col gap-[16px]">
                    <SelectInput
                      label="Budget Range"
                      value={budgetRange}
                      onChange={(e) => setBudgetRange(e.target.value as BudgetRange)}
                      options={budgetOptions}
                      error={errors.budgetRange}
                      required
                    />
                  </div>
                )}

                {activeSection === 'status' && (
                  <div className="flex flex-col gap-[16px]">
                    <SelectInput
                      label="Production Status"
                      value={pitchStatus}
                      onChange={(e) => setPitchStatus(e.target.value as PitchStatus)}
                      options={statusOptions}
                      error={errors.status}
                      required
                    />
                  </div>
                )}

                {activeSection === 'team' && (
                  <div className="flex flex-col gap-[16px]">
                    <Textarea
                      label="Key Team"
                      value={team}
                      onChange={(e) => setTeam(e.target.value)}
                      error={errors.team}
                      helpText="Director, producer, writer, etc."
                      required
                    />
                  </div>
                )}

                {/* ═══ Optional sections (from OPTIONAL_SECTIONS config) ═══ */}
                {optionalDef && currentSectionState?.enabled && (
                  <OptionalSectionContent
                    sectionKey={optionalDef.key}
                    def={optionalDef}
                    state={currentSectionState}
                    pitchId={pitchId}
                    onUpdate={(update) => updateSection(optionalDef.key, update)}
                  />
                )}

                {/* ═══ Custom sections ═══ */}
                {isCustomSection && currentSectionState?.enabled && (
                  <div className="flex flex-col gap-[16px]">
                    <TextInput
                      label="Section Title"
                      value={currentSectionState.title || ''}
                      onChange={(e) => updateSection(activeSection, { title: e.target.value })}
                      placeholder="Name your section"
                    />
                    <Textarea
                      label="Content"
                      value={currentSectionState.content}
                      onChange={(e) => updateSection(activeSection, { content: e.target.value })}
                    />
                    <TextInput
                      label="Video / Reference Link"
                      value={currentSectionState.videoUrl}
                      onChange={(e) => updateSection(activeSection, { videoUrl: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                )}

                </SectionTransition>

                {/* Error message */}
                {errors.general && (
                  <p className="text-[14px] leading-[20px] text-error mt-[16px]">{errors.general}</p>
                )}

                {/* Actions */}
                <div className="flex gap-[12px] pt-[24px] mt-[24px] border-t border-border">
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save'}
                  </Button>
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => router.push('/dashboard')}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>

                {/* Share */}
                <div className="border-t border-border pt-[24px] mt-[16px]">
                  <h2 className="font-[var(--font-heading)] text-[18px] font-semibold leading-[28px] text-text-primary mb-[16px]">
                    Share
                  </h2>
                  {shareUrl ? (
                    <div className="flex flex-col gap-[16px]">
                      {/* Link display + copy */}
                      <div className="flex items-center gap-[8px]">
                        <input
                          type="text"
                          readOnly
                          value={shareUrl}
                          className="flex-1 bg-surface border border-border rounded-[4px] px-[12px] py-[8px] font-[var(--font-mono)] text-[13px] text-text-secondary"
                        />
                        <Button
                          variant="secondary"
                          type="button"
                          onClick={handleCopyLink}
                          disabled={sharingLoading}
                        >
                          {copied ? 'Copied' : 'Copy link'}
                        </Button>
                      </div>

                      {/* Visibility */}
                      <div className="flex flex-col gap-[8px]">
                        <label className="font-[var(--font-body)] text-[14px] font-medium text-text-primary">
                          Visibility
                        </label>
                        <div className="flex gap-[12px]">
                          <label className="flex items-center gap-[6px] cursor-pointer">
                            <input
                              type="radio"
                              name="share-visibility"
                              value="public"
                              checked={shareVisibility === 'public'}
                              onChange={() => setShareVisibility('public')}
                              className="accent-btn"
                            />
                            <span className="font-[var(--font-body)] text-[14px] text-text-primary">Public</span>
                          </label>
                          <label className="flex items-center gap-[6px] cursor-pointer">
                            <input
                              type="radio"
                              name="share-visibility"
                              value="private"
                              checked={shareVisibility === 'private'}
                              onChange={() => setShareVisibility('private')}
                              className="accent-btn"
                            />
                            <span className="font-[var(--font-body)] text-[14px] text-text-primary">Private</span>
                          </label>
                        </div>
                      </div>

                      {/* Password */}
                      {shareVisibility === 'public' && (
                        <div className="flex flex-col gap-[8px]">
                          {shareHasPassword ? (
                            <div className="flex items-center gap-[8px]">
                              <span className="font-[var(--font-mono)] text-[13px] text-text-secondary">
                                Password-protected
                              </span>
                              <Button
                                variant="tertiary"
                                type="button"
                                onClick={handleRemovePassword}
                                disabled={sharingLoading}
                              >
                                Remove password
                              </Button>
                            </div>
                          ) : (
                            <TextInput
                              label="Password (optional)"
                              value={sharePassword}
                              onChange={(e) => setSharePassword(e.target.value)}
                              type="password"
                              placeholder="Leave blank for open access"
                            />
                          )}
                        </div>
                      )}

                      {errors.share && (
                        <p className="text-[14px] leading-[20px] text-error">{errors.share}</p>
                      )}

                      {/* Update + Revoke */}
                      <div className="flex gap-[12px]">
                        <Button
                          variant="secondary"
                          type="button"
                          onClick={handleUpdateShareLink}
                          disabled={sharingLoading}
                        >
                          {sharingLoading ? 'Updating...' : 'Update sharing'}
                        </Button>
                        <Button
                          variant="tertiary"
                          type="button"
                          onClick={handleRevokeShareLink}
                          disabled={sharingLoading}
                        >
                          Revoke link
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-[16px]">
                      {/* Visibility before creation */}
                      <div className="flex flex-col gap-[8px]">
                        <label className="font-[var(--font-body)] text-[14px] font-medium text-text-primary">
                          Visibility
                        </label>
                        <div className="flex gap-[12px]">
                          <label className="flex items-center gap-[6px] cursor-pointer">
                            <input
                              type="radio"
                              name="share-visibility"
                              value="public"
                              checked={shareVisibility === 'public'}
                              onChange={() => setShareVisibility('public')}
                              className="accent-btn"
                            />
                            <span className="font-[var(--font-body)] text-[14px] text-text-primary">Public</span>
                          </label>
                          <label className="flex items-center gap-[6px] cursor-pointer">
                            <input
                              type="radio"
                              name="share-visibility"
                              value="private"
                              checked={shareVisibility === 'private'}
                              onChange={() => setShareVisibility('private')}
                              className="accent-btn"
                            />
                            <span className="font-[var(--font-body)] text-[14px] text-text-primary">Private</span>
                          </label>
                        </div>
                      </div>

                      {/* Password option (only for public) */}
                      {shareVisibility === 'public' && (
                        <TextInput
                          label="Password (optional)"
                          value={sharePassword}
                          onChange={(e) => setSharePassword(e.target.value)}
                          type="password"
                          placeholder="Leave blank for open access"
                        />
                      )}

                      {errors.share && (
                        <p className="text-[14px] leading-[20px] text-error">{errors.share}</p>
                      )}

                      <Button
                        variant="secondary"
                        type="button"
                        onClick={handleCreateShareLink}
                        disabled={sharingLoading}
                      >
                        {sharingLoading ? 'Creating...' : 'Share project'}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Funding */}
                <div className="border-t border-border pt-[24px] mt-[16px]">
                  <h2 className="font-[var(--font-heading)] text-[18px] font-semibold leading-[28px] text-text-primary mb-[16px]">
                    Funding
                  </h2>
                  {fundingEnabled ? (
                    <div className="flex flex-col gap-[12px]">
                      {fundingTotalRaised > 0 && (
                        <p className="font-[var(--font-mono)] text-[13px] text-text-secondary">
                          Raised: ${(fundingTotalRaised / 100).toLocaleString()} of ${parseFloat(fundingGoal || '0').toLocaleString()}
                        </p>
                      )}
                      <TextInput
                        label="Goal amount (USD)"
                        value={fundingGoal}
                        onChange={(e) => setFundingGoal(e.target.value)}
                        placeholder="5000"
                      />
                      <Textarea
                        label="Why support this project?"
                        value={fundingDescription}
                        onChange={(e) => setFundingDescription(e.target.value)}
                        helpText="Shown to potential supporters"
                      />
                      <TextInput
                        label="End date (optional)"
                        value={fundingEndDate}
                        onChange={(e) => setFundingEndDate(e.target.value)}
                        placeholder="YYYY-MM-DD"
                      />

                      {/* Stretch Goals */}
                      <StretchGoalsEditor goals={stretchGoals} onChange={setStretchGoals} />

                      {/* Rewards */}
                      <RewardsEditor rewards={rewards} onChange={setRewards} />

                      {errors.funding && (
                        <p className="text-[14px] leading-[20px] text-error">{errors.funding}</p>
                      )}
                      <div className="flex gap-[12px]">
                        <Button
                          variant="secondary"
                          type="button"
                          onClick={handleUpdateFunding}
                          disabled={fundingLoading}
                        >
                          {fundingLoading ? 'Saving...' : 'Update funding'}
                        </Button>
                        <Button
                          variant="tertiary"
                          type="button"
                          onClick={handleDisableFunding}
                          disabled={fundingLoading}
                        >
                          Disable funding
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-[12px]">
                      <TextInput
                        label="Goal amount (USD)"
                        value={fundingGoal}
                        onChange={(e) => setFundingGoal(e.target.value)}
                        placeholder="5000"
                      />
                      <Textarea
                        label="Why support this project?"
                        value={fundingDescription}
                        onChange={(e) => setFundingDescription(e.target.value)}
                        helpText="Shown to potential supporters"
                      />
                      <TextInput
                        label="End date (optional)"
                        value={fundingEndDate}
                        onChange={(e) => setFundingEndDate(e.target.value)}
                        placeholder="YYYY-MM-DD"
                      />

                      {/* Stretch Goals */}
                      <StretchGoalsEditor goals={stretchGoals} onChange={setStretchGoals} />

                      {/* Rewards */}
                      <RewardsEditor rewards={rewards} onChange={setRewards} />

                      {errors.funding && (
                        <p className="text-[14px] leading-[20px] text-error">{errors.funding}</p>
                      )}
                      <Button
                        variant="secondary"
                        type="button"
                        onClick={handleEnableFunding}
                        disabled={fundingLoading}
                      >
                        {fundingLoading ? 'Enabling...' : 'Enable funding'}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Version History */}
                <div className="border-t border-border pt-[24px] mt-[16px]">
                  <h2 className="font-[var(--font-heading)] text-[18px] font-semibold leading-[28px] text-text-primary mb-[8px]">
                    Versions
                  </h2>
                  <p className="font-[var(--font-mono)] text-[13px] leading-[20px] text-text-secondary mb-[16px]">
                    Current: v{currentVersion}
                  </p>
                  {versions.length > 0 ? (
                    <div className="flex flex-col gap-[8px]">
                      {versions.map((v) => (
                        <div
                          key={v.id}
                          className="flex items-center justify-between py-[8px] px-[12px] bg-surface rounded-[4px]"
                        >
                          <span className="font-[var(--font-mono)] text-[13px] text-text-primary">
                            v{v.version_number}
                          </span>
                          <span className="font-[var(--font-mono)] text-[13px] text-text-secondary">
                            {new Date(v.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[14px] leading-[20px] text-text-secondary">
                      No previous versions. Versions are created each time you save.
                    </p>
                  )}
                </div>

                {/* Delete */}
                <div className="border-t border-border pt-[24px] mt-[16px]">
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => setDeleteModalOpen(true)}
                    disabled={loading}
                    className="text-error hover:bg-error/10"
                  >
                    Delete project
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete project?"
      >
        <p className="text-[14px] leading-[20px] text-text-secondary mb-[24px]">
          This action can&apos;t be undone.
        </p>
        <div className="flex gap-[12px]">
          <Button
            variant="primary"
            onClick={handleDelete}
            disabled={deleting}
            className="bg-error hover:bg-error/90"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
          <Button
            variant="secondary"
            onClick={() => setDeleteModalOpen(false)}
            disabled={deleting}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  )
}

/* ─── Optional section content renderer ─── */
function OptionalSectionContent({
  sectionKey,
  def,
  state,
  pitchId,
  onUpdate,
}: {
  sectionKey: string
  def: { key: string; label: string; description: string; hasImages: boolean; hasPDF: boolean }
  state: OptionalSectionState
  pitchId: string
  onUpdate: (update: Partial<OptionalSectionState>) => void
}) {
  return (
    <div className="flex flex-col gap-[16px]">
      <p className="text-[13px] leading-[18px] text-text-secondary">{def.description}</p>

      {/* Flow section has a beat editor */}
      {sectionKey === 'flow' ? (
        <FlowBeatEditor
          pitchId={pitchId}
          beats={state.beats ?? []}
          onUpdate={(beats) => onUpdate({ beats })}
        />
      ) : (
        <Textarea
          label={def.label}
          value={state.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
        />
      )}

      {/* PDF upload for script_documents */}
      {def.hasPDF && (
        <PDFUpload
          pitchId={pitchId}
          sectionName="companion_documents"
          existingMedia={null}
          onUploadComplete={(mediaId) => onUpdate({ mediaId })}
          onDeleteComplete={() => onUpdate({ mediaId: null })}
        />
      )}

      {/* Image upload for sections that support it */}
      {def.hasImages && (
        <ImageUpload
          pitchId={pitchId}
          sectionName={sectionKey}
          maxFiles={10}
          existingMedia={[]}
          onUploadComplete={(mediaIds) => onUpdate({ mediaIds })}
          onDeleteComplete={(mediaId) =>
            onUpdate({ mediaIds: state.mediaIds.filter((id) => id !== mediaId) })
          }
        />
      )}

      {/* Video / Reference Link — every optional section gets this */}
      <TextInput
        label="Video / Reference Link"
        value={state.videoUrl}
        onChange={(e) => onUpdate({ videoUrl: e.target.value })}
        placeholder="https://..."
      />
    </div>
  )
}

/* ─── Stretch Goals Editor ─── */
function StretchGoalsEditor({
  goals,
  onChange,
}: {
  goals: StretchGoal[]
  onChange: (goals: StretchGoal[]) => void
}) {
  const addGoal = () => onChange([...goals, { amount: 0, description: '' }])
  const removeGoal = (i: number) => onChange(goals.filter((_, idx) => idx !== i))
  const updateGoal = (i: number, update: Partial<StretchGoal>) =>
    onChange(goals.map((g, idx) => (idx === i ? { ...g, ...update } : g)))

  return (
    <div className="flex flex-col gap-[8px]">
      <label className="font-[var(--font-body)] text-[14px] font-medium text-text-primary">
        Stretch Goals (optional)
      </label>
      {goals.map((goal, i) => (
        <div key={i} className="flex items-start gap-[8px]">
          <TextInput
            label=""
            value={goal.amount ? String(goal.amount) : ''}
            onChange={(e) => updateGoal(i, { amount: parseInt(e.target.value, 10) || 0 })}
            placeholder="Amount"
          />
          <TextInput
            label=""
            value={goal.description}
            onChange={(e) => updateGoal(i, { description: e.target.value })}
            placeholder="What unlocks at this amount"
          />
          <Button variant="tertiary" type="button" onClick={() => removeGoal(i)} className="text-error mt-[4px]">
            Remove
          </Button>
        </div>
      ))}
      <Button variant="tertiary" type="button" onClick={addGoal}>
        Add stretch goal
      </Button>
    </div>
  )
}

/* ─── Rewards Editor ─── */
function RewardsEditor({
  rewards,
  onChange,
}: {
  rewards: FundingReward[]
  onChange: (rewards: FundingReward[]) => void
}) {
  const addReward = () => onChange([...rewards, { amount: 0, title: '', description: '' }])
  const removeReward = (i: number) => onChange(rewards.filter((_, idx) => idx !== i))
  const updateReward = (i: number, update: Partial<FundingReward>) =>
    onChange(rewards.map((r, idx) => (idx === i ? { ...r, ...update } : r)))

  return (
    <div className="flex flex-col gap-[8px]">
      <label className="font-[var(--font-body)] text-[14px] font-medium text-text-primary">
        Rewards (optional)
      </label>
      {rewards.map((reward, i) => (
        <div key={i} className="flex flex-col gap-[4px] p-[8px] bg-surface rounded-[4px]">
          <div className="flex gap-[8px]">
            <TextInput
              label=""
              value={reward.amount ? String(reward.amount) : ''}
              onChange={(e) => updateReward(i, { amount: parseInt(e.target.value, 10) || 0 })}
              placeholder="Min amount (USD)"
            />
            <TextInput
              label=""
              value={reward.title}
              onChange={(e) => updateReward(i, { title: e.target.value })}
              placeholder="Reward title"
            />
          </div>
          <TextInput
            label=""
            value={reward.description}
            onChange={(e) => updateReward(i, { description: e.target.value })}
            placeholder="What the supporter gets"
          />
          <Button variant="tertiary" type="button" onClick={() => removeReward(i)} className="text-error self-start">
            Remove
          </Button>
        </div>
      ))}
      <Button variant="tertiary" type="button" onClick={addReward}>
        Add reward
      </Button>
    </div>
  )
}
