'use client'

import { useState, useRef, useEffect, useCallback, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { TextInput, Textarea } from '@/components/ui/Input'
import { BudgetSegments } from '@/components/ui/BudgetSegments'
import { StatusRadio } from '@/components/ui/StatusRadio'
import { CharacterCounter } from '@/components/ui/CharacterCounter'
import { validateImageFile } from '@/lib/utils/fileValidation'
import { SectionTransition } from '@/components/ui/SectionTransition'
import { AITextAssist } from '@/components/ui/AITextAssist'
import { AIImageGenerate } from '@/components/ui/AIImageGenerate'
import { OPTIONAL_SECTIONS, CUSTOM_SECTION_KEYS, PROJECT_TYPE_CONFIG, type ProjectType } from '@/lib/sections'
import type { BudgetRange, PitchStatus, CastMember, TeamMember } from '@/lib/types/pitch'


/* ─── Types ─── */
type RequiredSectionKey =
  | 'project'
  | 'logline'
  | 'synopsis'
  | 'poster'
  | 'genre'
  | 'vision'
  | 'cast'
  | 'budget'
  | 'team'

const GENRE_PRESETS = ['Fiction', 'Thriller', 'Horror', 'Comedy', 'Documentary', 'Romance', 'Action', 'Sci-Fi', 'Animation', 'Experimental']
const FORMAT_PRESETS = ['Feature Film', 'Short Film', 'Web Series', 'Ad Film', 'Documentary', 'Music Video']

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
    key: 'poster',
    number: '04',
    title: 'Poster',
    description: 'Your project cover image — film poster, key visual, or concept art.',
    required: true,
  },
  {
    key: 'genre',
    number: '05',
    title: 'Genre & Format',
    description: 'What kind of project is this? What format will it take?',
    required: true,
  },
  {
    key: 'vision',
    number: '06',
    title: "Director's Vision",
    description: 'Why this project, why you. Tone, style, aesthetic. What are you trying to say?',
    required: true,
  },
  {
    key: 'cast',
    number: '07',
    title: 'Cast & Characters',
    description: "Key characters and their roles in the story. Who's in it? Who are they playing?",
    required: true,
  },
  {
    key: 'budget',
    number: '08',
    title: 'Budget & Status',
    description: 'How much will it cost? Where are you in production?',
    required: true,
  },
  {
    key: 'team',
    number: '09',
    title: 'Key Team',
    description: "Director, producer, writer, and other key creative leads. Who's making this with you?",
    required: true,
  },
]

const ALL_SECTIONS: Section[] = [
  ...REQUIRED_SECTIONS,
  ...OPTIONAL_SECTIONS.map((def, i) => ({
    key: def.key,
    number: String(10 + i).padStart(2, '0'),
    title: def.label,
    description: def.description,
    required: false,
  })),
  ...CUSTOM_SECTION_KEYS.map((key, i) => ({
    key,
    number: String(28 + i).padStart(2, '0'),
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
            <div key={i} className="relative aspect-square bg-surface rounded-none overflow-hidden border border-border group">
              <img
                src={URL.createObjectURL(file)}
                alt=""
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="absolute top-[4px] right-[4px] w-[22px] h-[22px] bg-background/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error hover:text-text-primary"
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
            border-2 border-dashed rounded-none px-[20px] py-[24px] cursor-pointer
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
          <div className="w-[180px] aspect-[2/3] rounded-none overflow-hidden border border-border bg-surface">
            <img
              src={URL.createObjectURL(file)}
              alt="Project poster preview"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-[6px] right-[6px] w-[24px] h-[24px] bg-background/90 rounded-full flex items-center justify-center hover:bg-error hover:text-text-primary transition-colors"
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
            w-[180px] aspect-[2/3] rounded-none cursor-pointer
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
  const [mode, setMode] = useState<'required' | 'add-more' | 'optional'>('required')

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

  // ─── Structured section state ───
  interface LocationEntry { id: string; title: string; description: string; notes: string; availability: string }
  interface VehicleEntry { id: string; name: string; type: string; description: string }
  const [locationEntries, setLocationEntries] = useState<LocationEntry[]>([
    { id: '1', title: '', description: '', notes: '', availability: '' },
  ])
  const [vehicleEntries, setVehicleEntries] = useState<VehicleEntry[]>([
    { id: '1', name: '', type: '', description: '' },
  ])

  // ─── Optional sections content ───
  const [optionalContent, setOptionalContent] = useState<Record<string, { content: string; videoUrl: string; title?: string }>>(
    {}
  )
  const [optionalImages, setOptionalImages] = useState<Record<string, File[]>>({})
  const [optionalPDFs, setOptionalPDFs] = useState<Record<string, File | null>>({})

  const updateOptionalContent = (key: string, field: string, value: string) => {
    setOptionalContent((prev) => ({
      ...prev,
      [key]: { ...prev[key], content: prev[key]?.content || '', videoUrl: prev[key]?.videoUrl || '', [field]: value },
    }))
  }

  const [projectType, setProjectType] = useState<ProjectType | null>(null)
  const [enabledOptionalKeys, setEnabledOptionalKeys] = useState<Set<string>>(new Set())
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  // ─── Draft save (localStorage) — survives session expiry ───
  const DRAFT_KEY = 'pitchcraft_create_draft'
  const [draftRestored, setDraftRestored] = useState(false)

  // Load draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY)
      if (!saved) return
      const draft = JSON.parse(saved)
      if (draft.projectName) setProjectName(draft.projectName)
      if (draft.logline) setLogline(draft.logline)
      if (draft.synopsis) setSynopsis(draft.synopsis)
      if (draft.genre) setGenre(draft.genre)
      if (draft.format) setFormat(draft.format)
      if (draft.vision) setVision(draft.vision)
      if (draft.castMembers?.length) setCastMembers(draft.castMembers)
      if (draft.budgetRange) setBudgetRange(draft.budgetRange)
      if (draft.status) setStatus(draft.status)
      if (draft.teamMembers?.length) setTeamMembers(draft.teamMembers)
      if (draft.optionalContent) setOptionalContent(draft.optionalContent)
      if (draft.currentSection) setCurrentSection(draft.currentSection)
      if (draft.projectType) setProjectType(draft.projectType)
      if (draft.enabledOptionalKeys?.length) setEnabledOptionalKeys(new Set(draft.enabledOptionalKeys))
      setDraftRestored(true)
    } catch {
      // corrupted draft — ignore
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Fetch subscription tier for sidebar custom sections gate
  useEffect(() => {
    fetch('/api/subscriptions/status')
      .then((r) => r.json())
      .then((d) => { if (d.tier) setSubscriptionTier(d.tier) })
      .catch(() => {})
  }, [])

  // Auto-save serializable fields 1s after last change
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify({
          projectName, logline, synopsis, genre, format, vision,
          castMembers, budgetRange, status, teamMembers, optionalContent, currentSection,
          projectType, enabledOptionalKeys: Array.from(enabledOptionalKeys),
        }))
      } catch {
        // quota exceeded or private mode — ignore
      }
    }, 1000)
    return () => clearTimeout(timer)
  }, [projectName, logline, synopsis, genre, format, vision, castMembers, budgetRange, status, teamMembers, optionalContent, currentSection, projectType, enabledOptionalKeys])

  // ─── Helpers ───
  const getSectionIndex = (key: string) => ALL_SECTIONS.findIndex((s) => s.key === key)
  const getCurrentSectionIndex = () => getSectionIndex(currentSection)
  const isRequiredSection = (key: string): key is RequiredSectionKey => REQUIRED_SECTIONS.some((s) => s.key === key)
  const isOnOptionalSection = !isRequiredSection(currentSection)
  const isLastSection = getCurrentSectionIndex() === ALL_SECTIONS.length - 1
  const isFirstSection = getCurrentSectionIndex() === 0
  const isLastRequiredSection = currentSection === REQUIRED_SECTIONS[REQUIRED_SECTIONS.length - 1].key

  const goToSection = (key: SectionKey) => {
    setCurrentSection(key)
    setErrors({})
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

  const handleToggleSection = (key: string) => {
    setEnabledOptionalKeys((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
        if (currentSection === key) {
          setCurrentSection(REQUIRED_SECTIONS[REQUIRED_SECTIONS.length - 1].key)
        }
      } else {
        next.add(key)
        setCurrentSection(key as SectionKey)
      }
      return next
    })
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

  // Location helpers
  const addLocationEntry = () => setLocationEntries([...locationEntries, { id: Date.now().toString(), title: '', description: '', notes: '', availability: '' }])
  const removeLocationEntry = (id: string) => { if (locationEntries.length > 1) setLocationEntries(locationEntries.filter((e) => e.id !== id)) }
  const updateLocationEntry = (id: string, field: string, value: string) => setLocationEntries(locationEntries.map((e) => e.id === id ? { ...e, [field]: value } : e))

  // Vehicle helpers
  const addVehicleEntry = () => setVehicleEntries([...vehicleEntries, { id: Date.now().toString(), name: '', type: '', description: '' }])
  const removeVehicleEntry = (id: string) => { if (vehicleEntries.length > 1) setVehicleEntries(vehicleEntries.filter((e) => e.id !== id)) }
  const updateVehicleEntry = (id: string, field: string, value: string) => setVehicleEntries(vehicleEntries.map((e) => e.id === id ? { ...e, [field]: value } : e))

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
      case 'poster':
        // poster upload is optional — always valid
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
        if (isLastRequiredSection) {
          setMode('add-more')
        } else {
          goToNextSection()
        }
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
      const validCast = castMembers.filter((m) => m.name.trim() && m.role.trim())
      const validTeam = teamMembers.filter((m) => m.name.trim() && m.role.trim())

      // Serialize structured sections into optionalContent
      const enrichedOptionalContent = { ...optionalContent }
      if (locationEntries.some((e) => e.title.trim())) {
        enrichedOptionalContent['locations'] = {
          ...enrichedOptionalContent['locations'],
          content: JSON.stringify(locationEntries.filter((e) => e.title.trim())),
          videoUrl: enrichedOptionalContent['locations']?.videoUrl || '',
        }
      }
      if (vehicleEntries.some((e) => e.name.trim())) {
        enrichedOptionalContent['vehicles'] = {
          ...enrichedOptionalContent['vehicles'],
          content: JSON.stringify(vehicleEntries.filter((e) => e.name.trim())),
          videoUrl: enrichedOptionalContent['vehicles']?.videoUrl || '',
        }
      }

      // Build optional sections payload
      const optionalSectionDefs = ALL_SECTIONS.filter((s) => !s.required)
      const sectionsPayload: { section_name: string; data: Record<string, unknown>; order_index: number }[] = []
      optionalSectionDefs.forEach((def, index) => {
        const content = enrichedOptionalContent[def.key]
        const images = optionalImages[def.key]
        if (!content?.content?.trim() && !content?.videoUrl?.trim() && !images?.length) return

        const data: Record<string, unknown> = {}
        if (content?.content?.trim()) data.content = content.content
        if (content?.videoUrl?.trim()) data.videoUrl = content.videoUrl
        if (content?.title) data.title = content.title

        sectionsPayload.push({
          section_name: def.key,
          data,
          order_index: index + 1,
        })
      })

      // Create pitch via server-side API — enforces tier limits and section inserts server-side
      const res = await fetch('/api/pitches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_name: projectName,
          logline,
          synopsis,
          genre: `${genre} / ${format}`,
          vision,
          cast_and_characters: JSON.stringify(validCast),
          budget_range: budgetRange,
          status,
          team: JSON.stringify(validTeam),
          sections: sectionsPayload,
          project_type: projectType,
        }),
      })

      const result = await res.json()

      if (res.status === 403 && result.upgrade) {
        setErrors({ general: 'Free accounts are limited to 1 pitch. Upgrade to Pro for unlimited pitches.' })
        setLoading(false)
        return
      }

      if (!res.ok) {
        throw new Error(result.error || 'Failed to create project')
      }

      const pitch = { id: result.id }

      // Upload any pending files (poster, vision images)
      await uploadPendingFiles(pitch.id)

      // Upload optional section images and PDFs (fire-and-forget, non-blocking)
      for (const def of ALL_SECTIONS.filter((s) => !s.required)) {
        const images = optionalImages[def.key]
        if (images?.length) {
          for (const file of images) {
            const fd = new FormData()
            fd.append('file', file)
            fd.append('pitchId', pitch.id)
            fd.append('sectionName', def.key)
            fetch('/api/media/upload', { method: 'POST', body: fd })
          }
        }
        const pdf = optionalPDFs[def.key]
        if (pdf) {
          const fd = new FormData()
          fd.append('file', pdf)
          fd.append('pitchId', pitch.id)
          fd.append('sectionName', def.key)
          fetch('/api/media/upload', { method: 'POST', body: fd })
        }
      }

      // Auto-create a public share link so the link is ready immediately
      await fetch(`/api/pitches/${pitch.id}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visibility: 'public' }),
      })

      localStorage.removeItem(DRAFT_KEY)
      router.push(`/p/${pitch.id}`)
      router.refresh()
    } catch (err) {
      console.error('Create project error:', err)
      let message: string
      if (err instanceof Error) {
        message = err.message
      } else if (err && typeof err === 'object' && 'message' in err) {
        message = String((err as { message: string }).message)
      } else {
        message = 'Database tables may not exist yet. Run the SQL migration in Supabase.'
      }
      setErrors({ general: `Failed to create project: ${message}` })
    } finally {
      setLoading(false)
    }
  }

  // ─── Type selection handler ───
  const handleSelectType = (type: ProjectType) => {
    setProjectType(type)
    setEnabledOptionalKeys(new Set(PROJECT_TYPE_CONFIG[type].suggestedOptional))
  }

  // ─── Type-adapted required sections ───
  const typeConfig = projectType ? PROJECT_TYPE_CONFIG[projectType] : PROJECT_TYPE_CONFIG.fiction
  const typedRequiredSections = REQUIRED_SECTIONS.map((s) => {
    if (s.key === 'cast') return { ...s, title: typeConfig.castLabel }
    if (s.key === 'budget' && !typeConfig.includeStatus) return { ...s, title: 'Budget Range', description: 'What is the budget for this project?' }
    return s
  })

  // Current section data — unified lookup
  const currentSectionData = typedRequiredSections.find((s) => s.key === currentSection) ?? ALL_SECTIONS.find((s) => s.key === currentSection)
  const currentOptionalDef = OPTIONAL_SECTIONS.find((d) => d.key === currentSection)
  const isCustom = CUSTOM_SECTION_KEYS.includes(currentSection as typeof CUSTOM_SECTION_KEYS[number])

  const currentSectionNumber = currentSectionData?.number || '01'

  const currentSectionTitle = isCustom
    ? (optionalContent[currentSection]?.title || currentSectionData?.title || 'Custom Section')
    : (currentSectionData?.title || 'Section')

  const currentSectionDescription = currentSectionData?.description || ''

  const requiredComplete = REQUIRED_SECTIONS.filter((s) => completedSections.has(s.key)).length

  // ─── Type selection screen ───
  if (projectType === null) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-[24px] py-[64px]">
        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-disabled mb-[16px]">
          New Project
        </p>
        <h1 className="font-heading italic text-[36px] leading-[44px] text-text-primary text-center mb-[8px]">
          What are you making?
        </h1>
        <p className="text-[14px] leading-[22px] text-text-secondary text-center mb-[48px]">
          We&apos;ll tailor the builder to match.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[12px] w-full max-w-[880px]">
          {(Object.entries(PROJECT_TYPE_CONFIG) as [ProjectType, typeof PROJECT_TYPE_CONFIG[ProjectType]][]).map(([type, config]) => (
            <button
              key={type}
              type="button"
              onClick={() => handleSelectType(type)}
              className="group flex flex-col items-start gap-[12px] bg-surface border border-border hover:border-pop transition-colors duration-150 p-[24px] text-left focus:outline-none focus:border-pop"
            >
              <span className="font-heading italic text-[22px] leading-[28px] text-text-primary group-hover:text-pop transition-colors">
                {config.label}
              </span>
              <span className="font-mono text-[11px] leading-[16px] text-text-secondary">
                {config.description}
              </span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ─── Progress strip (required sections only) ─── */}
      {mode === 'required' && (() => {
        const reqIdx = REQUIRED_SECTIONS.findIndex((s) => s.key === currentSection)
        return (
          <div className="fixed top-0 left-0 right-0 z-20 bg-background border-b border-border px-[32px] h-[48px] flex items-center gap-[20px]">
            <div className="flex items-center gap-[5px]">
              {REQUIRED_SECTIONS.map((_, i) => (
                <div
                  key={i}
                  className={`rounded-full transition-all duration-[200ms] ${
                    i === reqIdx ? 'w-[20px] h-[5px] bg-pop' : i < reqIdx ? 'w-[5px] h-[5px] bg-text-secondary' : 'w-[5px] h-[5px] bg-border'
                  }`}
                />
              ))}
            </div>
            <span className="font-mono text-[11px] leading-[16px] text-text-secondary">
              Step {reqIdx + 1} of {REQUIRED_SECTIONS.length} — {currentSectionTitle}
            </span>
          </div>
        )
      })()}

      {/* ─── Main content ─── */}
      <main className={mode === 'required' ? 'pt-[56px]' : ''}>
        <div className="max-w-[800px] mx-auto px-[40px] py-[64px]">
          {/* Draft restored banner */}
          {draftRestored && (
            <div className="flex items-center justify-between gap-[16px] bg-surface border border-border rounded-none px-[16px] py-[10px] mb-[24px]">
              <span className="font-mono text-[12px] leading-[16px] text-text-secondary">
                Draft restored — your previous work is back.
              </span>
              <button
                type="button"
                onClick={() => { localStorage.removeItem(DRAFT_KEY); window.location.reload() }}
                className="font-mono text-[11px] leading-[16px] text-text-disabled hover:text-error transition-colors shrink-0"
              >
                Discard
              </button>
            </div>
          )}

          {mode === 'required' && (
            <div className="font-mono text-[13px] leading-[20px] text-text-secondary mb-[48px]">
              NEW PROJECT / DRAFT / v1.0
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* ─── Add more screen ─── */}
            {mode === 'add-more' && (
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-disabled mb-[16px]">
                  Almost there
                </p>
                <h1 className="font-heading italic text-[32px] leading-[40px] text-text-primary mb-[8px]">
                  Your project is ready.
                </h1>
                <p className="text-[14px] leading-[22px] text-text-secondary mb-[48px]">
                  Create it now, or add more detail first. You can always edit later.
                </p>
                {typeConfig.suggestedOptional.length > 0 && (
                  <div className="mb-[40px]">
                    <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-text-disabled mb-[16px]">
                      Suggested for your project
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-[10px]">
                      {OPTIONAL_SECTIONS.filter((def) => typeConfig.suggestedOptional.includes(def.key)).map((def) => {
                        const hasContent = !!(optionalContent[def.key]?.content?.trim())
                        return (
                          <button
                            key={def.key}
                            type="button"
                            onClick={() => {
                              setEnabledOptionalKeys((prev) => new Set([...prev, def.key]))
                              setCurrentSection(def.key as SectionKey)
                              setMode('optional')
                            }}
                            className="group flex items-center justify-between gap-[12px] border border-border hover:border-pop transition-colors duration-[150ms] px-[16px] py-[14px] text-left bg-surface"
                          >
                            <div>
                              <span className="font-heading italic text-[16px] leading-[22px] text-text-primary group-hover:text-pop transition-colors block">
                                {def.label}
                              </span>
                              <span className="font-mono text-[11px] leading-[16px] text-text-secondary mt-[2px] block">
                                {def.description}
                              </span>
                            </div>
                            {hasContent ? (
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-pop">
                                <path d="M3 8L6.5 11.5L13 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            ) : (
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-text-disabled group-hover:text-pop transition-colors">
                                <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                              </svg>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {mode !== 'add-more' && (
            <SectionTransition sectionNumber={currentSectionNumber} sectionKey={currentSection}>
            {/* Section number */}
            <div className="font-mono text-[13px] leading-[20px] text-text-secondary mb-[8px]">
              {currentSectionNumber}
            </div>

            {/* Section title */}
            <h1 className="font-heading text-[32px] font-bold leading-[40px] text-text-primary mb-[16px] tracking-[-0.02em]">
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
              {/* 01 — Project Name */}
              {currentSection === 'project' && (
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
              )}

              {/* 04 — Poster */}
              {currentSection === 'poster' && (
                <div className="flex flex-col gap-[32px]">
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

              {/* 05 — Genre & Format */}
              {currentSection === 'genre' && (
                <div className="flex flex-col gap-[32px]">
                  <div className="flex flex-col gap-[12px]">
                    <label className="block font-[var(--font-body)] text-[14px] font-medium leading-[20px] text-text-primary">
                      Genre
                    </label>
                    <div className="flex flex-wrap gap-[8px] mb-[12px]">
                      {GENRE_PRESETS.map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setGenre(g)}
                          className={`px-[12px] py-[6px] rounded-none font-mono text-[12px] leading-[16px] border transition-colors duration-[150ms] ${
                            genre === g
                              ? 'border-pop bg-pop/10 text-pop'
                              : 'border-border bg-surface text-text-secondary hover:border-text-secondary hover:text-text-primary'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                    <TextInput
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      error={errors.genre}
                      placeholder="Or type a custom genre"
                    />
                  </div>
                  <div className="flex flex-col gap-[12px]">
                    <label className="block font-[var(--font-body)] text-[14px] font-medium leading-[20px] text-text-primary">
                      Format
                    </label>
                    <div className="flex flex-wrap gap-[8px] mb-[12px]">
                      {FORMAT_PRESETS.map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setFormat(f)}
                          className={`px-[12px] py-[6px] rounded-none font-mono text-[12px] leading-[16px] border transition-colors duration-[150ms] ${
                            format === f
                              ? 'border-pop bg-pop/10 text-pop'
                              : 'border-border bg-surface text-text-secondary hover:border-text-secondary hover:text-text-primary'
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                    <TextInput
                      value={format}
                      onChange={(e) => setFormat(e.target.value)}
                      error={errors.format}
                      placeholder="Or type a custom format"
                    />
                  </div>
                </div>
              )}

              {/* 06 — Director's Vision */}
              {currentSection === 'vision' && (
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
              )}

              {/* 06 — Cast & Characters */}
              {currentSection === 'cast' && (
                <div className="flex flex-col gap-[24px]">
                  {castMembers.map((member, index) => (
                    <div
                      key={member.id}
                      className="border border-border rounded-none p-[20px] bg-surface"
                    >
                      <div className="flex items-center justify-between mb-[16px]">
                        <span className="font-mono text-[12px] text-text-secondary">
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
                    + Add another {typeConfig.castLabel.toLowerCase().split(' & ')[0].split(' ')[0]}
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
                  {typeConfig.includeStatus && (
                    <div>
                      <label className="block font-[var(--font-body)] text-[14px] font-medium leading-[20px] text-text-primary mb-[12px]">
                        Production Status
                      </label>
                      <StatusRadio value={status} onChange={setStatus} />
                    </div>
                  )}
                </div>
              )}

              {/* 08 — Key Team */}
              {currentSection === 'team' && (
                <div className="flex flex-col gap-[24px]">
                  {teamMembers.map((member, index) => (
                    <div
                      key={member.id}
                      className="border border-border rounded-none p-[20px] bg-surface"
                    >
                      <div className="flex items-center justify-between mb-[16px]">
                        <span className="font-mono text-[12px] text-text-secondary">
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

              {/* ═══ Optional sections ═══ */}

              {/* Locations — structured entries */}
              {currentSection === 'locations' && (
                <div className="flex flex-col gap-[24px]">
                  {locationEntries.map((entry, index) => (
                    <div key={entry.id} className="border border-border rounded-none p-[20px] bg-surface">
                      <div className="flex items-center justify-between mb-[16px]">
                        <span className="font-mono text-[12px] text-text-secondary">LOCATION {index + 1}</span>
                        {locationEntries.length > 1 && (
                          <button type="button" onClick={() => removeLocationEntry(entry.id)} className="text-[12px] text-error hover:underline">Remove</button>
                        )}
                      </div>
                      <div className="flex flex-col gap-[12px]">
                        <TextInput value={entry.title} onChange={(e) => updateLocationEntry(entry.id, 'title', e.target.value)} placeholder="Location name / title" />
                        <Textarea value={entry.description} onChange={(e) => updateLocationEntry(entry.id, 'description', e.target.value)} placeholder="Description" className="min-h-[80px]" />
                        <TextInput value={entry.notes} onChange={(e) => updateLocationEntry(entry.id, 'notes', e.target.value)} placeholder="Notes (permits, access, etc.)" />
                        <TextInput value={entry.availability} onChange={(e) => updateLocationEntry(entry.id, 'availability', e.target.value)} placeholder="Availability" />
                      </div>
                    </div>
                  ))}
                  <Button type="button" variant="secondary" onClick={addLocationEntry}>+ Add another location</Button>
                  {currentOptionalDef?.hasImages && (
                    <InlineImageUpload
                      files={optionalImages[currentSection] || []}
                      onAdd={(newFiles) => setOptionalImages((prev) => ({ ...prev, [currentSection]: [...(prev[currentSection] || []), ...newFiles] }))}
                      onRemove={(i) => setOptionalImages((prev) => ({ ...prev, [currentSection]: (prev[currentSection] || []).filter((_, idx) => idx !== i) }))}
                      maxFiles={10}
                      label="Location Images"
                    />
                  )}
                </div>
              )}

              {/* Vehicles — numbered entries */}
              {currentSection === 'vehicles' && (
                <div className="flex flex-col gap-[24px]">
                  {vehicleEntries.map((entry, index) => (
                    <div key={entry.id} className="border border-border rounded-none p-[20px] bg-surface">
                      <div className="flex items-center justify-between mb-[16px]">
                        <span className="font-mono text-[12px] text-text-secondary">VEHICLE {index + 1}</span>
                        {vehicleEntries.length > 1 && (
                          <button type="button" onClick={() => removeVehicleEntry(entry.id)} className="text-[12px] text-error hover:underline">Remove</button>
                        )}
                      </div>
                      <div className="flex flex-col gap-[12px]">
                        <div className="grid grid-cols-2 gap-[12px]">
                          <TextInput value={entry.name} onChange={(e) => updateVehicleEntry(entry.id, 'name', e.target.value)} placeholder="Vehicle name / make" />
                          <TextInput value={entry.type} onChange={(e) => updateVehicleEntry(entry.id, 'type', e.target.value)} placeholder="Type (car, bike, truck…)" />
                        </div>
                        <Textarea value={entry.description} onChange={(e) => updateVehicleEntry(entry.id, 'description', e.target.value)} placeholder="Notes, handler, condition, etc." className="min-h-[80px]" />
                      </div>
                    </div>
                  ))}
                  <Button type="button" variant="secondary" onClick={addVehicleEntry}>+ Add another vehicle</Button>
                  {currentOptionalDef?.hasImages && (
                    <InlineImageUpload
                      files={optionalImages[currentSection] || []}
                      onAdd={(newFiles) => setOptionalImages((prev) => ({ ...prev, [currentSection]: [...(prev[currentSection] || []), ...newFiles] }))}
                      onRemove={(i) => setOptionalImages((prev) => ({ ...prev, [currentSection]: (prev[currentSection] || []).filter((_, idx) => idx !== i) }))}
                      maxFiles={10}
                      label="Vehicle Images"
                    />
                  )}
                </div>
              )}

              {/* Generic optional sections */}
              {isOnOptionalSection && currentOptionalDef && !isCustom && currentSection !== 'locations' && currentSection !== 'vehicles' && (
                <div className="flex flex-col gap-[16px]">
                  <div>
                    {(() => {
                      const limit = currentOptionalDef.hasPDF ? 5000 : 3000
                      const val = optionalContent[currentSection]?.content || ''
                      return (
                        <>
                          <Textarea
                            label={currentOptionalDef.label}
                            value={val}
                            onChange={(e) => {
                              if (e.target.value.length <= limit) updateOptionalContent(currentSection, 'content', e.target.value)
                            }}
                            placeholder={`Add your ${currentOptionalDef.label.toLowerCase()} notes...`}
                            className="min-h-[160px]"
                          />
                          <CharacterCounter current={val.length} max={limit} />
                        </>
                      )
                    })()}
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
                        label="Images"
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

                  {currentOptionalDef.hasPDF && (
                    <div>
                      <label className="block font-[var(--font-body)] text-[14px] font-medium leading-[20px] text-text-primary mb-[10px]">
                        Upload PDF
                      </label>
                      {optionalPDFs[currentSection] ? (
                        <div className="flex items-center gap-[12px] border border-border rounded-none px-[14px] py-[10px] bg-surface">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-text-secondary flex-shrink-0">
                            <rect x="2" y="1" width="8" height="11" rx="1" stroke="currentColor" strokeWidth="1.2" />
                            <path d="M4.5 4.5H9.5M4.5 6.5H9.5M4.5 8.5H7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                          </svg>
                          <span className="font-mono text-[12px] text-text-secondary flex-1 truncate">
                            {optionalPDFs[currentSection]?.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => setOptionalPDFs((prev) => ({ ...prev, [currentSection]: null }))}
                            className="font-mono text-[11px] text-text-disabled hover:text-error transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <label className="flex items-center gap-[10px] border border-dashed border-border rounded-none px-[14px] py-[10px] cursor-pointer hover:bg-surface transition-colors">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-text-secondary flex-shrink-0">
                            <path d="M7 10V4M7 4L4.5 6.5M7 4L9.5 6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            <rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.2" />
                          </svg>
                          <span className="font-mono text-[12px] text-text-secondary">
                            Choose PDF, FDX, or document
                          </span>
                          <input
                            type="file"
                            accept=".pdf,.fdx,.fountain,.txt,.doc,.docx"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0]
                              if (f) setOptionalPDFs((prev) => ({ ...prev, [currentSection]: f }))
                              e.target.value = ''
                            }}
                          />
                        </label>
                      )}
                    </div>
                  )}
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
            )}

            {/* Error message */}
            {errors.general && (
              <p className="text-[14px] leading-[20px] text-error mb-[24px]">{errors.general}</p>
            )}

            {/* Navigation buttons */}
            <div className="flex gap-[12px]">
              {mode === 'required' && !isFirstSection && (
                <Button variant="secondary" type="button" onClick={goToPreviousSection}>
                  Previous
                </Button>
              )}
              {mode === 'optional' && (
                <Button variant="secondary" type="button" onClick={() => { setMode('add-more'); setErrors({}) }}>
                  ← Back
                </Button>
              )}
              {mode === 'required' && (
                <Button variant="primary" type="button" onClick={handleContinue}>
                  Save & Continue
                </Button>
              )}
              {(mode === 'add-more' || mode === 'optional') && (
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
