'use client'

import { useState, type FormEvent, type ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { TextInput, Textarea } from '@/components/ui/Input'
import { BudgetSegments } from '@/components/ui/BudgetSegments'
import { StatusRadio } from '@/components/ui/StatusRadio'
import { CharacterCounter } from '@/components/ui/CharacterCounter'
import type { BudgetRange, PitchStatus, CastMember, TeamMember } from '@/lib/types/pitch'

type SectionKey = 'project' | 'logline' | 'synopsis' | 'genre' | 'vision' | 'cast' | 'budget' | 'team'

interface Section {
  key: SectionKey
  number: string
  title: string
  description: string
}

const sections: Section[] = [
  {
    key: 'project',
    number: '01',
    title: 'Project Name',
    description: 'What is your project called?',
  },
  {
    key: 'logline',
    number: '02',
    title: 'Logline',
    description: 'One sentence. The idea distilled to its essence.',
  },
  {
    key: 'synopsis',
    number: '03',
    title: 'Synopsis',
    description: 'The heart of your project. What is the story, the concept, the idea? Why should someone care?',
  },
  {
    key: 'genre',
    number: '04',
    title: 'Genre & Format',
    description: 'What kind of project is this? What format will it take?',
  },
  {
    key: 'vision',
    number: '05',
    title: 'Director Vision',
    description: 'Why this project, why you. Tone, style, aesthetic.',
  },
  {
    key: 'cast',
    number: '06',
    title: 'Cast & Characters',
    description: 'Key characters and their roles in the story.',
  },
  {
    key: 'budget',
    number: '07',
    title: 'Budget & Status',
    description: 'Budget range and production status.',
  },
  {
    key: 'team',
    number: '08',
    title: 'Key Team',
    description: 'Director, producer, writer, and other key creative leads.',
  },
]

export default function CreatePitchPage() {
  const router = useRouter()
  const [currentSection, setCurrentSection] = useState<SectionKey>('project')
  const [completedSections, setCompletedSections] = useState<Set<SectionKey>>(new Set())

  // Form state
  const [projectName, setProjectName] = useState('')
  const [logline, setLogline] = useState('')
  const [synopsis, setSynopsis] = useState('')
  const [genre, setGenre] = useState('')
  const [format, setFormat] = useState('')
  const [vision, setVision] = useState('')
  const [castMembers, setCastMembers] = useState<CastMember[]>([
    { id: '1', name: '', role: '', description: '' },
  ])
  const [budgetRange, setBudgetRange] = useState<BudgetRange | ''>('')
  const [status, setStatus] = useState<PitchStatus>('development')
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: '1', name: '', role: '', bio: '' },
  ])

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  // Helper functions
  const getSectionIndex = (key: SectionKey) => sections.findIndex((s) => s.key === key)
  const getCurrentSectionIndex = () => getSectionIndex(currentSection)

  const goToSection = (key: SectionKey) => {
    setCurrentSection(key)
    setErrors({})
  }

  const goToNextSection = () => {
    const currentIndex = getCurrentSectionIndex()
    if (currentIndex < sections.length - 1) {
      setCurrentSection(sections[currentIndex + 1].key)
      setErrors({})
    }
  }

  const goToPreviousSection = () => {
    const currentIndex = getCurrentSectionIndex()
    if (currentIndex > 0) {
      setCurrentSection(sections[currentIndex - 1].key)
      setErrors({})
    }
  }

  const markSectionComplete = (key: SectionKey) => {
    setCompletedSections((prev) => new Set([...prev, key]))
  }

  // Cast & Team helpers
  const addCastMember = () => {
    setCastMembers([...castMembers, { id: Date.now().toString(), name: '', role: '', description: '' }])
  }

  const removeCastMember = (id: string) => {
    if (castMembers.length > 1) {
      setCastMembers(castMembers.filter((m) => m.id !== id))
    }
  }

  const updateCastMember = (id: string, field: keyof CastMember, value: string) => {
    setCastMembers(castMembers.map((m) => (m.id === id ? { ...m, [field]: value } : m)))
  }

  const addTeamMember = () => {
    setTeamMembers([...teamMembers, { id: Date.now().toString(), name: '', role: '', bio: '' }])
  }

  const removeTeamMember = (id: string) => {
    if (teamMembers.length > 1) {
      setTeamMembers(teamMembers.filter((m) => m.id !== id))
    }
  }

  const updateTeamMember = (id: string, field: keyof TeamMember, value: string) => {
    setTeamMembers(teamMembers.map((m) => (m.id === id ? { ...m, [field]: value } : m)))
  }

  // Word count helper
  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter((word) => word.length > 0).length
  }

  // Validation
  const validateCurrentSection = (): boolean => {
    const newErrors: Record<string, string> = {}

    switch (currentSection) {
      case 'project':
        if (!projectName.trim()) newErrors.projectName = 'Project name is required'
        if (projectName.length > 100) newErrors.projectName = 'Max 100 characters'
        break
      case 'logline':
        if (!logline.trim()) newErrors.logline = 'Logline is required'
        if (logline.length > 500) newErrors.logline = 'Max 500 characters'
        break
      case 'synopsis':
        if (!synopsis.trim()) newErrors.synopsis = 'Synopsis is required'
        break
      case 'genre':
        if (!genre.trim()) newErrors.genre = 'Genre is required'
        if (!format.trim()) newErrors.format = 'Format is required'
        break
      case 'vision':
        if (!vision.trim()) newErrors.vision = "Director's vision is required"
        break
      case 'cast':
        const validCast = castMembers.filter((m) => m.name.trim() && m.role.trim())
        if (validCast.length === 0) newErrors.cast = 'At least one cast member with name and role is required'
        break
      case 'budget':
        if (!budgetRange) newErrors.budgetRange = 'Budget range is required'
        break
      case 'team':
        const validTeam = teamMembers.filter((m) => m.name.trim() && m.role.trim())
        if (validTeam.length === 0) newErrors.team = 'At least one team member with name and role is required'
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleContinue = () => {
    if (validateCurrentSection()) {
      markSectionComplete(currentSection)
      goToNextSection()
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validateCurrentSection()) return

    setLoading(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data: profile } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', user.id)
        .single()

      if (!profile) throw new Error('Profile not found')

      // Prepare cast and team as JSONB
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

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      console.error(err)
      setErrors({ general: 'Failed to create project' })
    } finally {
      setLoading(false)
    }
  }

  const currentSectionData = sections.find((s) => s.key === currentSection)!
  const progress = `${completedSections.size}/8 COMPLETE`

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-[240px] bg-surface border-r border-border flex flex-col">
        {/* Section list */}
        <nav className="flex-1 py-[32px]">
          {sections.map((section) => {
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
                  ${
                    isActive
                      ? 'border-accent-visual bg-white/50'
                      : 'border-transparent hover:bg-white/30'
                  }
                `}
              >
                <div className="flex items-center gap-[12px]">
                  <span
                    className={`
                      font-[var(--font-mono)] text-[24px] leading-[32px] font-medium
                      ${isActive ? 'text-accent-visual' : 'text-text-secondary'}
                    `}
                  >
                    {section.number}
                  </span>
                  <div className="flex-1">
                    <div
                      className={`
                        font-[var(--font-mono)] text-[11px] leading-[16px] uppercase tracking-[0.08em]
                        ${isActive ? 'font-semibold text-text-primary' : 'text-text-secondary'}
                      `}
                    >
                      {section.title.toUpperCase()}
                    </div>
                  </div>
                  {isComplete && !isActive && (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="text-[#388E3C]"
                    >
                      <path
                        d="M13.5 4.5L6 12L2.5 8.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray="24"
                        strokeDashoffset="0"
                        className="animate-draw-check"
                      />
                    </svg>
                  )}
                </div>
              </button>
            )
          })}
        </nav>

        {/* Progress indicator */}
        <div className="px-[24px] py-[24px] border-t border-border">
          <div className="font-[var(--font-mono)] text-[11px] leading-[16px] tracking-[0.05em] text-text-secondary mb-[8px]">
            {progress}
          </div>
          <div className="w-full h-[3px] bg-border rounded-full overflow-visible">
            <div
              className="h-full bg-accent-visual transition-all duration-[500ms]"
              style={{
                width: `${(completedSections.size / 8) * 100}%`,
                transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' // Spring with overshoot
              }}
            />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-[240px] flex-1">
        <div className="max-w-[800px] mx-auto px-[40px] py-[64px]">
          {/* Metadata header */}
          <div className="font-[var(--font-mono)] text-[13px] leading-[20px] text-text-secondary mb-[48px]">
            NEW PITCH / DRAFT / v1.0
          </div>

          {/* Section content */}
          <form onSubmit={handleSubmit}>
            {/* Section number */}
            <div className="font-[var(--font-mono)] text-[13px] leading-[20px] text-text-secondary mb-[8px]">
              {currentSectionData.number}
            </div>

            {/* Section title */}
            <h1 className="font-[var(--font-heading)] text-[32px] font-semibold leading-[40px] text-text-primary mb-[16px] tracking-[-0.02em]">
              {currentSectionData.title}
            </h1>

            {/* Section description */}
            <p className="text-[14px] leading-[20px] text-text-secondary mb-[32px]">
              {currentSectionData.description}
            </p>

            {/* Section fields */}
            <div className="mb-[48px]">
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
                </div>
              )}

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
                </div>
              )}

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
                </div>
              )}

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
            </div>

            {/* Error message */}
            {errors.general && (
              <p className="text-[14px] leading-[20px] text-error mb-[24px]">{errors.general}</p>
            )}

            {/* Navigation buttons */}
            <div className="flex gap-[12px]">
              {currentSectionData.key !== 'team' ? (
                <>
                  {getCurrentSectionIndex() > 0 && (
                    <Button variant="secondary" type="button" onClick={goToPreviousSection}>
                      Previous
                    </Button>
                  )}
                  <Button variant="primary" type="button" onClick={handleContinue}>
                    Save & Continue
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="secondary" type="button" onClick={goToPreviousSection}>
                    Previous
                  </Button>
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Project'}
                  </Button>
                </>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
