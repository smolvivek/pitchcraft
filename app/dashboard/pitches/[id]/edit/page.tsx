'use client'

import { useState, useEffect, useCallback, useMemo, use, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { TextInput, Textarea, SelectInput } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { PDFUpload } from '@/components/ui/PDFUpload'
import { Sidebar } from '@/components/layout/Sidebar'
import { SectionTransition } from '@/components/ui/SectionTransition'
import { OPTIONAL_SECTIONS, CUSTOM_SECTION_KEYS } from '@/lib/sections'
import type { SidebarSection } from '@/components/layout/Sidebar'
import type { BudgetRange, PitchStatus, PitchSection, FlowBeat } from '@/lib/types/pitch'

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

  // Funding state
  const [fundingEnabled, setFundingEnabled] = useState(false)
  const [fundingGoal, setFundingGoal] = useState('')
  const [fundingDescription, setFundingDescription] = useState('')
  const [fundingEndDate, setFundingEndDate] = useState('')
  const [fundingLoading, setFundingLoading] = useState(false)
  const [fundingTotalRaised, setFundingTotalRaised] = useState(0)

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

  const handleCreateShareLink = async () => {
    setSharingLoading(true)
    try {
      const res = await fetch(`/api/pitches/${pitchId}/share`, { method: 'POST' })
      if (res.ok) {
        setShareUrl(`${window.location.origin}/p/${pitchId}`)
      }
    } catch {
      setErrors((prev) => ({ ...prev, share: 'Failed to create share link' }))
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
        setFundingGoal(String(data.funding.funding_goal))
        setFundingDescription(data.funding.description || '')
        setFundingEndDate(data.funding.end_date?.split('T')[0] || '')
        setFundingTotalRaised(data.totalRaised || 0)
      }
    } catch {
      // Silently fail
    }
  }, [pitchId])

  useEffect(() => {
    fetchFunding()
  }, [fetchFunding])

  const handleEnableFunding = async () => {
    const goal = parseInt(fundingGoal, 10)
    if (!goal || goal < 1) {
      setErrors((prev) => ({ ...prev, funding: 'Enter a valid funding goal' }))
      return
    }
    setFundingLoading(true)
    try {
      const res = await fetch(`/api/pitches/${pitchId}/funding`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          funding_goal: goal,
          description: fundingDescription || null,
          end_date: fundingEndDate || null,
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
    const goal = parseInt(fundingGoal, 10)
    if (!goal || goal < 1) {
      setErrors((prev) => ({ ...prev, funding: 'Enter a valid funding goal' }))
      return
    }
    setFundingLoading(true)
    try {
      await fetch(`/api/pitches/${pitchId}/funding`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          funding_goal: goal,
          description: fundingDescription || null,
          end_date: fundingEndDate || null,
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
      console.error(err)
      setErrors({ general: 'Failed to save project' })
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
            <div className="bg-white border border-border rounded-[4px] p-[32px]">
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
                    <div className="flex flex-col gap-[12px]">
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
                      <div>
                        <Button
                          variant="tertiary"
                          type="button"
                          onClick={handleRevokeShareLink}
                          disabled={sharingLoading}
                        >
                          {sharingLoading ? 'Revoking...' : 'Revoke link'}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="secondary"
                      type="button"
                      onClick={handleCreateShareLink}
                      disabled={sharingLoading}
                    >
                      {sharingLoading ? 'Creating...' : 'Share project'}
                    </Button>
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
                          Raised: {'\u20B9'}{fundingTotalRaised.toLocaleString()} of {'\u20B9'}{parseInt(fundingGoal || '0', 10).toLocaleString()}
                        </p>
                      )}
                      <TextInput
                        label="Goal amount (INR)"
                        value={fundingGoal}
                        onChange={(e) => setFundingGoal(e.target.value)}
                        placeholder="50000"
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
                        label="Goal amount (INR)"
                        value={fundingGoal}
                        onChange={(e) => setFundingGoal(e.target.value)}
                        placeholder="50000"
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

      {/* Flow section has beats instead of plain content */}
      {sectionKey === 'flow' ? (
        <Textarea
          label="Flow Notes"
          value={state.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          helpText="Beat descriptions, character arc labels, captions"
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
