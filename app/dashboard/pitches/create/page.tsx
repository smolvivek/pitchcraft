'use client'

import { useState, useRef, useEffect, useCallback, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { TextInput, Textarea } from '@/components/ui/Input'
import { BudgetSegments } from '@/components/ui/BudgetSegments'
import { StatusRadio } from '@/components/ui/StatusRadio'
import { CharacterCounter } from '@/components/ui/CharacterCounter'
import { validateImageFile } from '@/lib/utils/fileValidation'
import { SectionTransition } from '@/components/ui/SectionTransition'
import { AITextAssist } from '@/components/ui/AITextAssist'
import { AIImageGenerate } from '@/components/ui/AIImageGenerate'
import { OPTIONAL_SECTIONS, CUSTOM_SECTION_KEYS } from '@/lib/sections'
import type { BudgetRange, PitchStatus, CastMember, TeamMember } from '@/lib/types/pitch'

/* ─── Types ─── */
type RequiredSectionKey =
  | 'project'
  | 'logline'
  | 'synopsis'
  | 'genre'
  | 'vision'
  | 'cast'
  | 'budget'
  | 'team'

type SectionKey = RequiredSectionKey | string

interface Section {
  key: SectionKey
  number: string
  title: string
  description: string
  required: boolean
}

const REQUIRED_SECTIONS: Section[] = [
  {
    key: 'project',
    number: '01',
    title: 'Project Name',
    description: "What's your project called?",
    required: true,
  },
  {
    key: 'logline',
    number: '02',
    title: 'Logline',
    description: 'One sentence. The idea distilled to its essence.',
    required: true,
  },
  {
    key: 'synopsis',
    number: '03',
    title: 'Synopsis',
    description: "The heart of your project. What's the story, the concept, the idea? Why should someone care?",
    required: true,
  },
  {
    key: 'genre',
    number: '04',
    title: 'Genre & Format',
    description: 'What kind of project is this? What format will it take?',
    required: true,
  },
  {
    key: 'vision',
    number: '05',
    title: "Director's Vision",
    description: 'Why this project, why you. Tone, style, aesthetic. What are you trying to say?',
    required: true,
  },
  {
    key: 'cast',
    number: '06',
    title: 'Cast & Characters',
    description: "Key characters and their roles in the story. Who's in it? Who are they playing?",
    required: true,
  },
  {
    key: 'budget',
    number: '07',
    title: 'Budget & Status',
    description: 'How much will it cost? Where are you in production?',
    required: true,
  },
  {
    key: 'team',
    number: '08',
    title: 'Key Team',
    description: "Director, producer, writer, and other key creative leads. Who's making this with you?",
    required: true,
  },
]

const ALL_SECTIONS: Section[] = [
  ...REQUIRED_SECTIONS,
  ...OPTIONAL_SECTIONS.map((def, i) => ({
    key: def.key,
    number: String(9 + i).padStart(2, '0'),
    title: def.label,
    description: def.description,
    required: false,
  })),
  ...CUSTOM_SECTION_KEYS.map((key, i) => ({
    key,
    number: String(25 + i).padStart(2, '0'),
    title: `Custom Section ${i + 1}`,
    description: 'Your own section. Name it anything.',
    required: false,
  })),
]

/* ─── Inline image drop zone (works without pitchId) ─── */
function InlineImageUpload({
  files,
  onAdd,
  onRemove,
  maxFiles = 5,
  label,
}: {
  files: File[]
  onAdd: (newFiles: File[]) => void
  onRemove: (index: number) => void
  maxFiles?: number
  label?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return
      setError(null)

      const incoming = Array.from(fileList)
      if (files.length + incoming.length > maxFiles) {
        setError(`Max ${maxFiles} images`)
        return
      }

      const valid: File[] = []
      for (const f of incoming) {
        const result = validateImageFile(f)
        if (!result.valid) {
          setError(result.message || 'Invalid file')
          return
        }
        valid.push(f)
      }
      onAdd(valid)
    },
    [files.length, maxFiles, onAdd]
  )

  return (
    <div className="flex flex-col gap-[12px]">
      {label && (
        <label className="block font-[var(--font-body)] text-[14px] font-medium leading-[20px] text-text-primary">
          {label}
        </label>
      )}

      {/* Thumbnails */}
      {files.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-[8px]">
          {files.map((file, i) => (
            <div key={i} className="relative aspect-square bg-surface rounded-[4px] overflow-hidden border border-border group">
              <img
                src={URL.createObjectURL(file)}
                alt=""
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="absolute top-[4px] right-[4px] w-[22px] h-[22px] bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error hover:text-white"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M8 2L2 8M2 2L8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      {files.length < maxFiles && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragEnter={(e) => { e.preventDefault(); setDragActive(true) }}
          onDragLeave={(e) => { e.preventDefault(); setDragActive(false) }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            setDragActive(false)
            handleFiles(e.dataTransfer.files)
          }}
          className={`
            border-2 border-dashed rounded-[4px] px-[20px] py-[24px] cursor-pointer
            transition-colors duration-[200ms] text-center
            ${dragActive ? 'border-pop bg-pop/5' : 'border-border bg-surface/50 hover:bg-surface'}
          `}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => { handleFiles(e.target.files); e.target.value = '' }}
            className="hidden"
          />
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="mx-auto mb-[6px] text-text-secondary">
            <path d="M14 19V9M14 9L10 13M14 9L18 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="3" y="3" width="22" height="22" rx="4" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <p className="text-[13px] leading-[18px] text-text-secondary">
            Drop images or click to upload
          </p>
          <p className="text-[11px] leading-[16px] text-text-disabled mt-[2px]">
            JPG, PNG, WebP — max 10MB
          </p>
        </div>
      )}

      {error && (
        <p className="text-[13px] leading-[18px] text-error">{error}</p>
      )}
    </div>
  )
}

/* ─── Single image upload (poster) ─── */
function PosterUpload({
  file,
  onSelect,
  onRemove,
}: {
  file: File | null
  onSelect: (f: File) => void
  onRemove: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = useCallback(
    (f: File | undefined) => {
      if (!f) return
      setError(null)
      const result = validateImageFile(f)
      if (!result.valid) {
        setError(result.message || 'Invalid file')
        return
      }
      onSelect(f)
    },
    [onSelect]
  )

  return (
    <div>
      <label className="block font-[var(--font-body)] text-[14px] font-medium leading-[20px] text-text-primary mb-[12px]">
        Project Poster / Image
      </label>
      <p className="text-[13px] leading-[18px] text-text-secondary mb-[12px]">
        Your film poster, project cover, or key visual.
      </p>

      {file ? (
        <div className="relative inline-block">
          <div className="w-[180px] aspect-[2/3] rounded-[4px] overflow-hidden border border-border bg-surface">
            <img
              src={URL.createObjectURL(file)}
              alt="Project poster preview"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-[6px] right-[6px] w-[24px] h-[24px] bg-white/90 rounded-full flex items-center justify-center hover:bg-error hover:text-white transition-colors"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M8 2L2 8M2 2L8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragEnter={(e) => { e.preventDefault(); setDragActive(true) }}
          onDragLeave={(e) => { e.preventDefault(); setDragActive(false) }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            setDragActive(false)
            handleFile(e.dataTransfer.files?.[0])
          }}
          className={`
            w-[180px] aspect-[2/3] rounded-[4px] cursor-pointer
            border-2 border-dashed flex flex-col items-center justify-center
            transition-colors duration-[200ms]
            ${dragActive ? 'border-pop bg-pop/5' : 'border-border bg-surface/50 hover:bg-surface'}
          `}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = '' }}
            className="hidden"
          />
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="mb-[8px] text-text-secondary">
            <path d="M16 22V10M16 10L11 15M16 10L21 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="4" y="4" width="24" height="24" rx="4" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <p className="text-[12px] leading-[16px] text-text-secondary text-center px-[8px]">
            Upload poster
          </p>
        </div>
      )}

      {error && (
        <p className="text-[13px] leading-[18px] text-error mt-[8px]">{error}</p>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   CREATE PAGE
   ═══════════════════════════════════════════════════════ */
export default function CreatePitchPage() {
  const router = useRouter()
  const [currentSection, setCurrentSection] = useState<SectionKey>('project')
  const [completedSections, setCompletedSections] = useState<Set<SectionKey>>(new Set())

  // ─── Form state ───
  const [projectName, setProjectName] = useState('')
  const [posterFile, setPosterFile] = useState<File | null>(null)
  const [logline, setLogline] = useState('')
  const [synopsis, setSynopsis] = useState('')
  const [genre, setGenre] = useState('')
  const [format, setFormat] = useState('')
  const [vision, setVision] = useState('')
  const [visionImages, setVisionImages] = useState<File[]>([])
  const [castMembers, setCastMembers] = useState<CastMember[]>([
    { id: '1', name: '', role: '', description: '' },
  ])
  const [budgetRange, setBudgetRange] = useState<BudgetRange | ''>('')
  const [status, setStatus] = useState<PitchStatus>('development')
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: '1', name: '', role: '', bio: '' },
  ])

  // ─── Optional sections content ───
  const [optionalContent, setOptionalContent] = useState<Record<string, { content: string; videoUrl: string; title?: string }>>(
    {}
  )
  const [optionalImages, setOptionalImages] = useState<Record<string, File[]>>({})

  const updateOptionalContent = (key: string, field: string, value: string) => {
    setOptionalContent((prev) => ({
      ...prev,
      [key]: { ...prev[key], content: prev[key]?.content || '', videoUrl: prev[key]?.videoUrl || '', [field]: value },
    }))
  }

  const [moreOpen, setMoreOpen] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  // ─── Helpers ───
  const getSectionIndex = (key: string) => ALL_SECTIONS.findIndex((s) => s.key === key)
  const getCurrentSectionIndex = () => getSectionIndex(currentSection)
  const isRequiredSection = (key: string): key is RequiredSectionKey => REQUIRED_SECTIONS.some((s) => s.key === key)
  const isOnOptionalSection = !isRequiredSection(currentSection)
  const isLastSection = getCurrentSectionIndex() === ALL_SECTIONS.length - 1
  const isFirstSection = getCurrentSectionIndex() === 0

  const goToSection = (key: SectionKey) => {
    setCurrentSection(key)
    setErrors({})
    // Auto-expand "More" if navigating to an optional section
    if (!REQUIRED_SECTIONS.some((s) => s.key === key)) {
      setMoreOpen(true)
    }
  }

  const goToNextSection = () => {
    const idx = getCurrentSectionIndex()
    if (idx < ALL_SECTIONS.length - 1) {
      setCurrentSection(ALL_SECTIONS[idx + 1].key)
      setErrors({})
    }
  }

  const goToPreviousSection = () => {
    const idx = getCurrentSectionIndex()
    if (idx > 0) {
      setCurrentSection(ALL_SECTIONS[idx - 1].key)
      setErrors({})
    }
  }

  const markSectionComplete = (key: SectionKey) => {
    setCompletedSections((prev) => new Set([...prev, key]))
  }

  // Cast helpers
  const addCastMember = () => {
    setCastMembers([...castMembers, { id: Date.now().toString(), name: '', role: '', description: '' }])
  }
  const removeCastMember = (id: string) => {
    if (castMembers.length > 1) setCastMembers(castMembers.filter((m) => m.id !== id))
  }
  const updateCastMember = (id: string, field: keyof CastMember, value: string) => {
    setCastMembers(castMembers.map((m) => (m.id === id ? { ...m, [field]: value } : m)))
  }

  // Team helpers
  const addTeamMember = () => {
    setTeamMembers([...teamMembers, { id: Date.now().toString(), name: '', role: '', bio: '' }])
  }
  const removeTeamMember = (id: string) => {
    if (teamMembers.length > 1) setTeamMembers(teamMembers.filter((m) => m.id !== id))
  }
  const updateTeamMember = (id: string, field: keyof TeamMember, value: string) => {
    setTeamMembers(teamMembers.map((m) => (m.id === id ? { ...m, [field]: value } : m)))
  }

  const getWordCount = (text: string) => text.trim().split(/\s+/).filter((w) => w.length > 0).length

  // AI context shared across all AI assist components
  const aiContext = {
    projectName: projectName || undefined,
    genre: genre || undefined,
    format: format || undefined,
    logline: logline || undefined,
  }

  // ─── Validation ───
  const validateCurrentSection = (): boolean => {
    const err: Record<string, string> = {}

    switch (currentSection) {
      case 'project':
        if (!projectName.trim()) err.projectName = 'Project name is required'
        if (projectName.length > 100) err.projectName = 'Max 100 characters'
        break
      case 'logline':
        if (!logline.trim()) err.logline = 'Logline is required'
        if (logline.length > 500) err.logline = 'Max 500 characters'
        break
      case 'synopsis':
        if (!synopsis.trim()) err.synopsis = 'Synopsis is required'
        break
      case 'genre':
        if (!genre.trim()) err.genre = 'Genre is required'
        if (!format.trim()) err.format = 'Format is required'
        break
      case 'vision':
        if (!vision.trim()) err.vision = "Director's vision is required"
        break
      case 'cast': {
        const validCast = castMembers.filter((m) => m.name.trim() && m.role.trim())
        if (validCast.length === 0) err.cast = 'At least one cast member with name and role'
        break
      }
      case 'budget':
        if (!budgetRange) err.budgetRange = 'Budget range is required'
        break
      case 'team': {
        const validTeam = teamMembers.filter((m) => m.name.trim() && m.role.trim())
        if (validTeam.length === 0) err.team = 'At least one team member with name and role'
        break
      }
    }

    setErrors(err)
    return Object.keys(err).length === 0
  }

  const handleContinue = () => {
    if (isRequiredSection(currentSection)) {
      if (validateCurrentSection()) {
        markSectionComplete(currentSection)
        goToNextSection()
      }
    } else {
      markSectionComplete(currentSection)
      goToNextSection()
    }
  }

  // ─── Upload pending files after pitch creation ───
  const uploadPendingFiles = async (pitchId: string) => {
    const uploads: Promise<void>[] = []

    // Poster
    if (posterFile) {
      const fd = new FormData()
      fd.append('file', posterFile)
      fd.append('pitchId', pitchId)
      fd.append('sectionName', 'poster')
      uploads.push(
        fetch('/api/media/upload', { method: 'POST', body: fd }).then((r) => {
          if (!r.ok) console.error('Poster upload failed')
        })
      )
    }

    // Vision reference images
    for (const file of visionImages) {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('pitchId', pitchId)
      fd.append('sectionName', 'vision')
      uploads.push(
        fetch('/api/media/upload', { method: 'POST', body: fd }).then((r) => {
          if (!r.ok) console.error('Vision image upload failed')
        })
      )
    }

    if (uploads.length > 0) {
      await Promise.allSettled(uploads)
    }
  }

  // ─── Submit ───
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validateCurrentSection()) return

    setLoading(true)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data: profile } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', user.id)
        .single()

      if (!profile) throw new Error('Profile not found')

      const validCast = castMembers.filter((m) => m.name.trim() && m.role.trim())
      const validTeam = teamMembers.filter((m) => m.name.trim() && m.role.trim())

      const { data: pitch, error: pitchError } = await supabase
        .from('pitches')
        .insert({
          user_id: profile.id,
          project_name: projectName,
          logline,
          synopsis,
          genre: `${genre} / ${format}`,
          vision,
          cast_and_characters: JSON.stringify(validCast),
          budget_range: budgetRange,
          status,
          team: JSON.stringify(validTeam),
        })
        .select()
        .single()

      if (pitchError) throw pitchError

      // Upload any pending files (poster, vision images)
      await uploadPendingFiles(pitch.id)

      // Save optional sections (all sections beyond the 8 required)
      const optionalSectionDefs = ALL_SECTIONS.filter((s) => !s.required)
      const sectionsToInsert: { pitch_id: string; section_name: string; data: Record<string, unknown>; order_index: number }[] = []
      optionalSectionDefs.forEach((def, index) => {
        const content = optionalContent[def.key]
        const images = optionalImages[def.key]
        if (!content?.content?.trim() && !content?.videoUrl?.trim() && !images?.length) return

        const data: Record<string, unknown> = {}
        if (content?.content?.trim()) data.content = content.content
        if (content?.videoUrl?.trim()) data.videoUrl = content.videoUrl
        if (content?.title) data.title = content.title

        sectionsToInsert.push({
          pitch_id: pitch.id,
          section_name: def.key,
          data,
          order_index: index + 1,
        })

        // Upload optional section images
        if (images?.length) {
          for (const file of images) {
            const fd = new FormData()
            fd.append('file', file)
            fd.append('pitchId', pitch.id)
            fd.append('sectionName', def.key)
            fetch('/api/media/upload', { method: 'POST', body: fd })
          }
        }
      })

      if (sectionsToInsert.length > 0) {
        await supabase.from('pitch_sections').insert(sectionsToInsert)
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      console.error(err)
      setErrors({ general: 'Failed to create project' })
    } finally {
      setLoading(false)
    }
  }

  // Current section data — unified lookup
  const currentSectionData = ALL_SECTIONS.find((s) => s.key === currentSection)
  const currentOptionalDef = OPTIONAL_SECTIONS.find((d) => d.key === currentSection)
  const isCustom = CUSTOM_SECTION_KEYS.includes(currentSection as typeof CUSTOM_SECTION_KEYS[number])

  const currentSectionNumber = currentSectionData?.number || '01'

  const currentSectionTitle = isCustom
    ? (optionalContent[currentSection]?.title || currentSectionData?.title || 'Custom Section')
    : (currentSectionData?.title || 'Section')

  const currentSectionDescription = currentSectionData?.description || ''

  const requiredComplete = REQUIRED_SECTIONS.filter((s) => completedSections.has(s.key)).length
  const progress = `${requiredComplete}/${REQUIRED_SECTIONS.length} REQUIRED`

  return (
    <div className="min-h-screen bg-background flex relative overflow-hidden">
      {/* ─── Sidebar ─── */}
      <aside className="fixed left-0 top-0 h-screen w-[240px] bg-surface border-r border-border flex flex-col z-10">
        <nav className="flex-1 py-[32px] overflow-y-auto">
          {/* Required sections (01–08) */}
          {REQUIRED_SECTIONS.map((section, sectionIndex) => {
            const isActive = section.key === currentSection
            const isComplete = completedSections.has(section.key)

            return (
              <button
                key={section.key}
                type="button"
                onClick={() => goToSection(section.key)}
                className={`
                  w-full px-[24px] py-[12px] text-left
                  border-l-[3px] transition-all duration-[200ms] ease-out
                  animate-fade-up opacity-0 [animation-fill-mode:forwards]
                  ${isActive ? 'border-pop bg-white/50' : 'border-transparent hover:bg-white/30'}
                `}
                style={{ animationDelay: `${sectionIndex * 60}ms` }}
              >
                <div className="flex items-center gap-[12px]">
                  <span
                    className={`font-[var(--font-mono)] text-[24px] leading-[32px] font-medium ${isActive ? 'text-pop' : 'text-text-secondary'}`}
                  >
                    {section.number}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-[4px]">
                      <span
                        className={`font-[var(--font-mono)] text-[11px] leading-[16px] uppercase tracking-[0.08em] ${isActive ? 'font-semibold text-text-primary' : 'text-text-secondary'}`}
                      >
                        {section.title.toUpperCase()}
                      </span>
                      <span className="text-error text-[11px] leading-[16px]">*</span>
                    </div>
                  </div>
                  {isComplete && !isActive && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[#388E3C]">
                      <path
                        d="M13.5 4.5L6 12L2.5 8.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </button>
            )
          })}

          {/* More — disclosure toggle for optional sections (09–27) */}
          <div className="mt-[8px]">
            <div className="mx-[24px] border-t border-border" />
            <button
              type="button"
              onClick={() => setMoreOpen(!moreOpen)}
              className="w-full flex items-center justify-between px-[24px] py-[12px] text-[13px] leading-[20px] text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            >
              <span className="font-[var(--font-mono)] uppercase tracking-wider">More</span>
              <svg
                width="12" height="12" viewBox="0 0 12 12" fill="none"
                className={`transition-transform duration-[200ms] ${moreOpen ? 'rotate-180' : ''}`}
              >
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {moreOpen && ALL_SECTIONS.filter((s) => !s.required).map((section) => {
              const isActive = section.key === currentSection
              const isComplete = completedSections.has(section.key)
              const isCustomKey = CUSTOM_SECTION_KEYS.includes(section.key as typeof CUSTOM_SECTION_KEYS[number])
              const displayTitle = isCustomKey
                ? (optionalContent[section.key]?.title || section.title)
                : section.title

              return (
                <button
                  key={section.key}
                  type="button"
                  onClick={() => goToSection(section.key)}
                  className={`
                    w-full px-[24px] py-[12px] text-left
                    border-l-[3px] transition-all duration-[200ms] ease-out
                    ${isActive ? 'border-pop bg-white/50' : 'border-transparent hover:bg-white/30'}
                  `}
                >
                  <div className="flex items-center gap-[12px]">
                    <span
                      className={`font-[var(--font-mono)] text-[24px] leading-[32px] font-medium ${isActive ? 'text-pop' : 'text-text-secondary'}`}
                    >
                      {section.number}
                    </span>
                    <div className="flex-1">
                      <span
                        className={`font-[var(--font-mono)] text-[11px] leading-[16px] uppercase tracking-[0.08em] ${isActive ? 'font-semibold text-text-primary' : 'text-text-secondary'}`}
                      >
                        {displayTitle.toUpperCase()}
                      </span>
                    </div>
                    {isComplete && !isActive && (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[#388E3C]">
                        <path
                          d="M13.5 4.5L6 12L2.5 8.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </nav>

        {/* Progress */}
        <div className="px-[24px] py-[24px] border-t border-border">
          <div className="font-[var(--font-mono)] text-[11px] leading-[16px] tracking-[0.05em] text-text-secondary mb-[8px]">
            {progress}
          </div>
          <div className="w-full h-[3px] bg-border rounded-full overflow-visible">
            <div
              className="h-full bg-pop transition-all duration-[500ms]"
              style={{
                width: `${(requiredComplete / REQUIRED_SECTIONS.length) * 100}%`,
                transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            />
          </div>
        </div>
      </aside>

      {/* ─── Main content ─── */}
      <main className="ml-[240px] flex-1">
        <div className="max-w-[800px] mx-auto px-[40px] py-[64px]">
          {/* Metadata header */}
          <div className="font-[var(--font-mono)] text-[13px] leading-[20px] text-text-secondary mb-[48px]">
            NEW PROJECT / DRAFT / v1.0
          </div>

          <form onSubmit={handleSubmit}>
            <SectionTransition sectionNumber={currentSectionNumber} sectionKey={currentSection}>
            {/* Section number */}
            <div className="font-[var(--font-mono)] text-[13px] leading-[20px] text-text-secondary mb-[8px]">
              {currentSectionNumber}
            </div>

            {/* Section title */}
            <h1 className="font-[var(--font-heading)] text-[32px] font-semibold leading-[40px] text-text-primary mb-[16px] tracking-[-0.02em]">
              {currentSectionTitle}
            </h1>

            {/* Section description */}
            {currentSectionDescription && (
              <p className="text-[14px] leading-[20px] text-text-secondary mb-[32px]">
                {currentSectionDescription}
              </p>
            )}

            {/* ─── Section fields ─── */}
            <div className="mb-[48px]">
              {/* 01 — Project Name + Poster */}
              {currentSection === 'project' && (
                <div className="flex flex-col gap-[32px]">
                  <div>
                    <TextInput
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      error={errors.projectName}
                      placeholder="Enter project name"
                      className="text-[18px] leading-[28px]"
                    />
                    <CharacterCounter current={projectName.length} max={100} />
                  </div>

                  <PosterUpload
                    file={posterFile}
                    onSelect={setPosterFile}
                    onRemove={() => setPosterFile(null)}
                  />
                  <AIImageGenerate
                    fieldName="Project poster concept"
                    onAccept={(file) => setPosterFile(file)}
                    maxReached={posterFile !== null}
                    context={aiContext}
                  />
                </div>
              )}

              {/* 02 — Logline */}
              {currentSection === 'logline' && (
                <div>
                  <Textarea
                    value={logline}
                    onChange={(e) => setLogline(e.target.value)}
                    error={errors.logline}
                    placeholder="One sentence that captures your entire project"
                    className="min-h-[120px]"
                  />
                  <CharacterCounter current={logline.length} max={500} />
                  <AITextAssist
                    fieldName="Logline"
                    currentText={logline}
                    onAccept={setLogline}
                    context={aiContext}
                  />
                </div>
              )}

              {/* 03 — Synopsis */}
              {currentSection === 'synopsis' && (
                <div>
                  <Textarea
                    value={synopsis}
                    onChange={(e) => setSynopsis(e.target.value)}
                    error={errors.synopsis}
                    placeholder="The story, the concept, the heart of your project"
                    className="min-h-[240px]"
                  />
                  <CharacterCounter current={getWordCount(synopsis)} type="words" />
                  <AITextAssist
                    fieldName="Synopsis"
                    currentText={synopsis}
                    onAccept={setSynopsis}
                    context={aiContext}
                  />
                </div>
              )}

              {/* 04 — Genre & Format */}
              {currentSection === 'genre' && (
                <div className="flex flex-col gap-[16px]">
                  <TextInput
                    label="Genre"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    error={errors.genre}
                    placeholder="e.g., Drama, Thriller, Documentary"
                  />
                  <TextInput
                    label="Format"
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    error={errors.format}
                    placeholder="e.g., Feature Film, Short Film, Series"
                  />
                </div>
              )}

              {/* 05 — Director's Vision + Reference Images */}
              {currentSection === 'vision' && (
                <div className="flex flex-col gap-[24px]">
                  <div>
                    <Textarea
                      value={vision}
                      onChange={(e) => setVision(e.target.value)}
                      error={errors.vision}
                      placeholder="Why this project? Why you? What's the tone, style, aesthetic?"
                      className="min-h-[200px]"
                    />
                    <CharacterCounter current={getWordCount(vision)} type="words" />
                    <AITextAssist
                      fieldName="Director's Vision"
                      currentText={vision}
                      onAccept={setVision}
                      context={aiContext}
                    />
                  </div>

                  <InlineImageUpload
                    files={visionImages}
                    onAdd={(newFiles) => setVisionImages((prev) => [...prev, ...newFiles])}
                    onRemove={(i) => setVisionImages((prev) => prev.filter((_, idx) => idx !== i))}
                    maxFiles={5}
                    label="Reference Images (optional)"
                  />
                  <AIImageGenerate
                    fieldName="Director's Vision references"
                    onAccept={(file) => setVisionImages((prev) => [...prev, file])}
                    maxReached={visionImages.length >= 5}
                    context={aiContext}
                  />
                </div>
              )}

              {/* 06 — Cast & Characters */}
              {currentSection === 'cast' && (
                <div className="flex flex-col gap-[24px]">
                  {castMembers.map((member, index) => (
                    <div
                      key={member.id}
                      className="border border-border rounded-[4px] p-[20px] bg-white"
                    >
                      <div className="flex items-center justify-between mb-[16px]">
                        <span className="font-[var(--font-mono)] text-[12px] text-text-secondary">
                          CHARACTER {index + 1}
                        </span>
                        {castMembers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeCastMember(member.id)}
                            className="text-[12px] text-error hover:underline"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="flex flex-col gap-[12px]">
                        <div className="grid grid-cols-2 gap-[12px]">
                          <TextInput
                            value={member.name}
                            onChange={(e) => updateCastMember(member.id, 'name', e.target.value)}
                            placeholder="Actor/Character name"
                          />
                          <TextInput
                            value={member.role}
                            onChange={(e) => updateCastMember(member.id, 'role', e.target.value)}
                            placeholder="Role"
                          />
                        </div>
                        <Textarea
                          value={member.description || ''}
                          onChange={(e) => updateCastMember(member.id, 'description', e.target.value)}
                          placeholder="Brief description (optional)"
                          className="min-h-[80px]"
                        />
                        <AITextAssist
                          fieldName={`Cast character description (${member.name || `Character ${index + 1}`})`}
                          currentText={member.description || ''}
                          onAccept={(text) => updateCastMember(member.id, 'description', text)}
                          context={aiContext}
                        />
                      </div>
                    </div>
                  ))}
                  <Button type="button" variant="secondary" onClick={addCastMember}>
                    + Add another cast member
                  </Button>
                  {errors.cast && (
                    <p className="text-[14px] leading-[20px] text-error">{errors.cast}</p>
                  )}
                </div>
              )}

              {/* 07 — Budget & Status */}
              {currentSection === 'budget' && (
                <div className="flex flex-col gap-[32px]">
                  <div>
                    <label className="block font-[var(--font-body)] text-[14px] font-medium leading-[20px] text-text-primary mb-[12px]">
                      Budget Range
                    </label>
                    <BudgetSegments value={budgetRange} onChange={setBudgetRange} error={errors.budgetRange} />
                  </div>
                  <div>
                    <label className="block font-[var(--font-body)] text-[14px] font-medium leading-[20px] text-text-primary mb-[12px]">
                      Production Status
                    </label>
                    <StatusRadio value={status} onChange={setStatus} />
                  </div>
                </div>
              )}

              {/* 08 — Key Team */}
              {currentSection === 'team' && (
                <div className="flex flex-col gap-[24px]">
                  {teamMembers.map((member, index) => (
                    <div
                      key={member.id}
                      className="border border-border rounded-[4px] p-[20px] bg-white"
                    >
                      <div className="flex items-center justify-between mb-[16px]">
                        <span className="font-[var(--font-mono)] text-[12px] text-text-secondary">
                          TEAM MEMBER {index + 1}
                        </span>
                        {teamMembers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTeamMember(member.id)}
                            className="text-[12px] text-error hover:underline"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="flex flex-col gap-[12px]">
                        <div className="grid grid-cols-2 gap-[12px]">
                          <TextInput
                            value={member.name}
                            onChange={(e) => updateTeamMember(member.id, 'name', e.target.value)}
                            placeholder="Name"
                          />
                          <TextInput
                            value={member.role}
                            onChange={(e) => updateTeamMember(member.id, 'role', e.target.value)}
                            placeholder="Role"
                          />
                        </div>
                        <Textarea
                          value={member.bio || ''}
                          onChange={(e) => updateTeamMember(member.id, 'bio', e.target.value)}
                          placeholder="Brief bio or credits (optional)"
                          className="min-h-[80px]"
                        />
                        <AITextAssist
                          fieldName={`Team member bio (${member.name || `Member ${index + 1}`})`}
                          currentText={member.bio || ''}
                          onAccept={(text) => updateTeamMember(member.id, 'bio', text)}
                          context={aiContext}
                        />
                      </div>
                    </div>
                  ))}
                  <Button type="button" variant="secondary" onClick={addTeamMember}>
                    + Add another team member
                  </Button>
                  {errors.team && (
                    <p className="text-[14px] leading-[20px] text-error">{errors.team}</p>
                  )}
                </div>
              )}

              {/* ═══ Optional sections (09–24) ═══ */}
              {isOnOptionalSection && currentOptionalDef && !isCustom && (
                <div className="flex flex-col gap-[16px]">
                  <div>
                    <Textarea
                      label={currentOptionalDef.label}
                      value={optionalContent[currentSection]?.content || ''}
                      onChange={(e) => updateOptionalContent(currentSection, 'content', e.target.value)}
                      placeholder={`Add your ${currentOptionalDef.label.toLowerCase()} notes...`}
                      className="min-h-[160px]"
                    />
                    <AITextAssist
                      fieldName={currentOptionalDef.label}
                      currentText={optionalContent[currentSection]?.content || ''}
                      onAccept={(text) => updateOptionalContent(currentSection, 'content', text)}
                      context={aiContext}
                    />
                  </div>

                  {currentOptionalDef.hasImages && (
                    <>
                      <InlineImageUpload
                        files={optionalImages[currentSection] || []}
                        onAdd={(newFiles) => setOptionalImages((prev) => ({
                          ...prev,
                          [currentSection]: [...(prev[currentSection] || []), ...newFiles],
                        }))}
                        onRemove={(i) => setOptionalImages((prev) => ({
                          ...prev,
                          [currentSection]: (prev[currentSection] || []).filter((_, idx) => idx !== i),
                        }))}
                        maxFiles={10}
                        label="Reference Images"
                      />
                      <AIImageGenerate
                        fieldName={`${currentOptionalDef.label} references`}
                        onAccept={(file) => setOptionalImages((prev) => ({
                          ...prev,
                          [currentSection]: [...(prev[currentSection] || []), file],
                        }))}
                        maxReached={(optionalImages[currentSection] || []).length >= 10}
                        context={aiContext}
                      />
                    </>
                  )}

                  <TextInput
                    label="Video / Reference Link"
                    value={optionalContent[currentSection]?.videoUrl || ''}
                    onChange={(e) => updateOptionalContent(currentSection, 'videoUrl', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              )}

              {/* ═══ Custom sections (25–27) ═══ */}
              {isOnOptionalSection && isCustom && (
                <div className="flex flex-col gap-[16px]">
                  <TextInput
                    label="Section Title"
                    value={optionalContent[currentSection]?.title || ''}
                    onChange={(e) => updateOptionalContent(currentSection, 'title', e.target.value)}
                    placeholder="Name your section"
                  />
                  <div>
                    <Textarea
                      label="Content"
                      value={optionalContent[currentSection]?.content || ''}
                      onChange={(e) => updateOptionalContent(currentSection, 'content', e.target.value)}
                      placeholder="What do you want to say?"
                      className="min-h-[160px]"
                    />
                    <AITextAssist
                      fieldName={optionalContent[currentSection]?.title || 'Custom Section'}
                      currentText={optionalContent[currentSection]?.content || ''}
                      onAccept={(text) => updateOptionalContent(currentSection, 'content', text)}
                      context={aiContext}
                    />
                  </div>
                  <TextInput
                    label="Video / Reference Link"
                    value={optionalContent[currentSection]?.videoUrl || ''}
                    onChange={(e) => updateOptionalContent(currentSection, 'videoUrl', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              )}
            </div>
            </SectionTransition>

            {/* Error message */}
            {errors.general && (
              <p className="text-[14px] leading-[20px] text-error mb-[24px]">{errors.general}</p>
            )}

            {/* Navigation buttons */}
            <div className="flex gap-[12px]">
              {!isFirstSection && (
                <Button variant="secondary" type="button" onClick={goToPreviousSection}>
                  Previous
                </Button>
              )}
              {!isLastSection && (
                <Button variant="primary" type="button" onClick={handleContinue}>
                  Save & Continue
                </Button>
              )}
              {(isLastSection || requiredComplete >= REQUIRED_SECTIONS.length) && (
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Project'}
                </Button>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
