'use client'

import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { TextInput, Textarea, SelectInput } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { PDFUpload } from '@/components/ui/PDFUpload'
import type { BudgetRange, PitchStatus, PitchSection, MediaRecord, FlowBeat } from '@/lib/types/pitch'

export default function EditPitchPage({ params }: { params: { id: string } }) {
  const router = useRouter()

  // 8 Required fields
  const [logline, setLogline] = useState('')
  const [synopsis, setSynopsis] = useState('')
  const [genre, setGenre] = useState('')
  const [vision, setVision] = useState('')
  const [castAndCharacters, setCastAndCharacters] = useState('')
  const [budgetRange, setBudgetRange] = useState<BudgetRange | ''>('')
  const [status, setStatus] = useState<PitchStatus>('development')
  const [team, setTeam] = useState('')

  // 15 Optional sections (enabled state + content)
  const [flowEnabled, setFlowEnabled] = useState(false)
  const [flowContent, setFlowContent] = useState('')

  const [companionDocsEnabled, setCompanionDocsEnabled] = useState(false)
  const [companionDocsContent, setCompanionDocsContent] = useState('')

  const [locationsEnabled, setLocationsEnabled] = useState(false)
  const [locationsContent, setLocationsContent] = useState('')

  const [artDirectionEnabled, setArtDirectionEnabled] = useState(false)
  const [artDirectionContent, setArtDirectionContent] = useState('')

  const [costumesEnabled, setCostumesEnabled] = useState(false)
  const [costumesContent, setCostumesContent] = useState('')

  const [makeupEnabled, setMakeupEnabled] = useState(false)
  const [makeupContent, setMakeupContent] = useState('')

  const [propsEnabled, setPropsEnabled] = useState(false)
  const [propsContent, setPropsContent] = useState('')

  const [vehiclesEnabled, setVehiclesEnabled] = useState(false)
  const [vehiclesContent, setVehiclesContent] = useState('')

  const [stuntsEnabled, setStuntsEnabled] = useState(false)
  const [stuntsContent, setStuntsContent] = useState('')

  const [cameraEnabled, setCameraEnabled] = useState(false)
  const [cameraContent, setCameraContent] = useState('')

  const [soundEnabled, setSoundEnabled] = useState(false)
  const [soundContent, setSoundContent] = useState('')

  const [worldBuildingEnabled, setWorldBuildingEnabled] = useState(false)
  const [worldBuildingContent, setWorldBuildingContent] = useState('')

  const [timelineEnabled, setTimelineEnabled] = useState(false)
  const [timelineContent, setTimelineContent] = useState('')

  const [crewEnabled, setCrewEnabled] = useState(false)
  const [crewContent, setCrewContent] = useState('')

  const [custom1Enabled, setCustom1Enabled] = useState(false)
  const [custom1Title, setCustom1Title] = useState('')
  const [custom1Content, setCustom1Content] = useState('')

  const [custom2Enabled, setCustom2Enabled] = useState(false)
  const [custom2Title, setCustom2Title] = useState('')
  const [custom2Content, setCustom2Content] = useState('')

  const [custom3Enabled, setCustom3Enabled] = useState(false)
  const [custom3Title, setCustom3Title] = useState('')
  const [custom3Content, setCustom3Content] = useState('')

  // Media state for sections
  const [flowBeats, setFlowBeats] = useState<FlowBeat[]>([])
  const [companionDocMediaId, setCompanionDocMediaId] = useState<string | null>(null)
  const [locationsMediaIds, setLocationsMediaIds] = useState<string[]>([])
  const [artDirectionMediaIds, setArtDirectionMediaIds] = useState<string[]>([])
  const [costumesMediaIds, setCostumesMediaIds] = useState<string[]>([])
  const [makeupMediaIds, setMakeupMediaIds] = useState<string[]>([])
  const [propsMediaIds, setPropsMediaIds] = useState<string[]>([])
  const [vehiclesMediaIds, setVehiclesMediaIds] = useState<string[]>([])
  const [stuntsMediaIds, setStuntsMediaIds] = useState<string[]>([])
  const [cameraMediaIds, setCameraMediaIds] = useState<string[]>([])
  const [soundMediaIds, setSoundMediaIds] = useState<string[]>([])

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const budgetOptions = [
    { value: 'under-5k', label: 'Under $5K' },
    { value: '5k-50k', label: '$5K–$50K' },
    { value: '50k-250k', label: '$50K–$250K' },
    { value: '250k-1m', label: '$250K–$1M' },
    { value: '1m-plus', label: '$1M+' },
  ]

  const statusOptions = [
    { value: 'looking', label: 'Looking' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'complete', label: 'Complete' },
  ]

  // Fetch pitch on load
  useEffect(() => {
    const fetchPitch = async () => {
      const supabase = createClient()

      // Fetch pitch
      const { data: pitch, error: pitchError } = await supabase
        .from('pitches')
        .select('*')
        .eq('id', params.id)
        .single()

      if (pitchError || !pitch) {
        router.push('/dashboard')
        return
      }

      // Fetch sections
      const { data: sections } = await supabase
        .from('pitch_sections')
        .select('*')
        .eq('pitch_id', params.id)

      // Populate required fields
      setLogline(pitch.logline)
      setSynopsis(pitch.synopsis)
      setGenre(pitch.genre)
      setVision(pitch.vision)
      setCastAndCharacters(pitch.cast_and_characters)
      setBudgetRange(pitch.budget_range)
      setStatus(pitch.status)
      setTeam(pitch.team)

      // Populate optional sections
      if (sections) {
        sections.forEach((section: PitchSection) => {
          const content = section.data.content || ''
          const title = section.data.title || ''

          switch (section.section_name) {
            case 'flow':
              setFlowEnabled(true)
              setFlowContent(content)
              if (section.data.beats) {
                setFlowBeats(section.data.beats)
              }
              break
            case 'companion_documents':
              setCompanionDocsEnabled(true)
              setCompanionDocsContent(content)
              if (section.data.mediaId) {
                setCompanionDocMediaId(section.data.mediaId)
              }
              break
            case 'locations':
              setLocationsEnabled(true)
              setLocationsContent(content)
              if (section.data.mediaIds) {
                setLocationsMediaIds(section.data.mediaIds)
              }
              break
            case 'art_direction':
              setArtDirectionEnabled(true)
              setArtDirectionContent(content)
              if (section.data.mediaIds) {
                setArtDirectionMediaIds(section.data.mediaIds)
              }
              break
            case 'costumes':
              setCostumesEnabled(true)
              setCostumesContent(content)
              if (section.data.mediaIds) {
                setCostumesMediaIds(section.data.mediaIds)
              }
              break
            case 'makeup':
              setMakeupEnabled(true)
              setMakeupContent(content)
              if (section.data.mediaIds) {
                setMakeupMediaIds(section.data.mediaIds)
              }
              break
            case 'props':
              setPropsEnabled(true)
              setPropsContent(content)
              if (section.data.mediaIds) {
                setPropsMediaIds(section.data.mediaIds)
              }
              break
            case 'vehicles':
              setVehiclesEnabled(true)
              setVehiclesContent(content)
              if (section.data.mediaIds) {
                setVehiclesMediaIds(section.data.mediaIds)
              }
              break
            case 'stunts':
              setStuntsEnabled(true)
              setStuntsContent(content)
              if (section.data.mediaIds) {
                setStuntsMediaIds(section.data.mediaIds)
              }
              break
            case 'camera':
              setCameraEnabled(true)
              setCameraContent(content)
              if (section.data.mediaIds) {
                setCameraMediaIds(section.data.mediaIds)
              }
              break
            case 'sound':
              setSoundEnabled(true)
              setSoundContent(content)
              if (section.data.mediaIds) {
                setSoundMediaIds(section.data.mediaIds)
              }
              break
            case 'world_building':
              setWorldBuildingEnabled(true)
              setWorldBuildingContent(content)
              break
            case 'timeline':
              setTimelineEnabled(true)
              setTimelineContent(content)
              break
            case 'crew_expanded':
              setCrewEnabled(true)
              setCrewContent(content)
              break
            case 'custom_1':
              setCustom1Enabled(true)
              setCustom1Title(title)
              setCustom1Content(content)
              break
            case 'custom_2':
              setCustom2Enabled(true)
              setCustom2Title(title)
              setCustom2Content(content)
              break
            case 'custom_3':
              setCustom3Enabled(true)
              setCustom3Title(title)
              setCustom3Content(content)
              break
          }
        })
      }
    }

    fetchPitch()
  }, [params.id, router])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Client validation (8 required fields)
    const newErrors: Record<string, string> = {}
    if (!logline.trim()) newErrors.logline = 'Logline is required'
    if (logline.length > 500) newErrors.logline = 'Max 500 characters'
    if (!synopsis.trim()) newErrors.synopsis = 'Synopsis is required'
    if (!genre.trim()) newErrors.genre = 'Genre is required'
    if (!vision.trim()) newErrors.vision = 'Vision is required'
    if (!castAndCharacters.trim()) newErrors.castAndCharacters = 'Cast & Characters is required'
    if (!budgetRange) newErrors.budgetRange = 'Budget range is required'
    if (!status) newErrors.status = 'Status is required'
    if (!team.trim()) newErrors.team = 'Team is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()

      // Update pitch (8 required fields)
      const { error: pitchError } = await supabase
        .from('pitches')
        .update({
          logline,
          synopsis,
          genre,
          vision,
          cast_and_characters: castAndCharacters,
          budget_range: budgetRange,
          status,
          team,
          updated_at: new Date().toISOString(),
        })
        .eq('id', params.id)

      if (pitchError) throw pitchError

      // Delete all existing sections
      await supabase
        .from('pitch_sections')
        .delete()
        .eq('pitch_id', params.id)

      // Insert enabled optional sections
      const sectionsToInsert = []

      if (flowEnabled && (flowContent.trim() || flowBeats.length > 0)) {
        sectionsToInsert.push({
          pitch_id: params.id,
          section_name: 'flow',
          data: {
            content: flowContent,
            beats: flowBeats.length > 0 ? flowBeats : undefined,
          },
          order_index: 1
        })
      }

      if (companionDocsEnabled && (companionDocsContent.trim() || companionDocMediaId)) {
        sectionsToInsert.push({
          pitch_id: params.id,
          section_name: 'companion_documents',
          data: {
            content: companionDocsContent,
            mediaId: companionDocMediaId || undefined,
          },
          order_index: 2
        })
      }

      if (locationsEnabled && (locationsContent.trim() || locationsMediaIds.length > 0)) {
        sectionsToInsert.push({
          pitch_id: params.id,
          section_name: 'locations',
          data: {
            content: locationsContent,
            mediaIds: locationsMediaIds.length > 0 ? locationsMediaIds : undefined,
          },
          order_index: 3
        })
      }

      if (artDirectionEnabled && (artDirectionContent.trim() || artDirectionMediaIds.length > 0)) {
        sectionsToInsert.push({
          pitch_id: params.id,
          section_name: 'art_direction',
          data: {
            content: artDirectionContent,
            mediaIds: artDirectionMediaIds.length > 0 ? artDirectionMediaIds : undefined,
          },
          order_index: 4
        })
      }

      if (costumesEnabled && (costumesContent.trim() || costumesMediaIds.length > 0)) {
        sectionsToInsert.push({
          pitch_id: params.id,
          section_name: 'costumes',
          data: {
            content: costumesContent,
            mediaIds: costumesMediaIds.length > 0 ? costumesMediaIds : undefined,
          },
          order_index: 5
        })
      }

      if (makeupEnabled && (makeupContent.trim() || makeupMediaIds.length > 0)) {
        sectionsToInsert.push({
          pitch_id: params.id,
          section_name: 'makeup',
          data: {
            content: makeupContent,
            mediaIds: makeupMediaIds.length > 0 ? makeupMediaIds : undefined,
          },
          order_index: 6
        })
      }

      if (propsEnabled && (propsContent.trim() || propsMediaIds.length > 0)) {
        sectionsToInsert.push({
          pitch_id: params.id,
          section_name: 'props',
          data: {
            content: propsContent,
            mediaIds: propsMediaIds.length > 0 ? propsMediaIds : undefined,
          },
          order_index: 7
        })
      }

      if (vehiclesEnabled && (vehiclesContent.trim() || vehiclesMediaIds.length > 0)) {
        sectionsToInsert.push({
          pitch_id: params.id,
          section_name: 'vehicles',
          data: {
            content: vehiclesContent,
            mediaIds: vehiclesMediaIds.length > 0 ? vehiclesMediaIds : undefined,
          },
          order_index: 8
        })
      }

      if (stuntsEnabled && (stuntsContent.trim() || stuntsMediaIds.length > 0)) {
        sectionsToInsert.push({
          pitch_id: params.id,
          section_name: 'stunts',
          data: {
            content: stuntsContent,
            mediaIds: stuntsMediaIds.length > 0 ? stuntsMediaIds : undefined,
          },
          order_index: 9
        })
      }

      if (cameraEnabled && (cameraContent.trim() || cameraMediaIds.length > 0)) {
        sectionsToInsert.push({
          pitch_id: params.id,
          section_name: 'camera',
          data: {
            content: cameraContent,
            mediaIds: cameraMediaIds.length > 0 ? cameraMediaIds : undefined,
          },
          order_index: 10
        })
      }

      if (soundEnabled && (soundContent.trim() || soundMediaIds.length > 0)) {
        sectionsToInsert.push({
          pitch_id: params.id,
          section_name: 'sound',
          data: {
            content: soundContent,
            mediaIds: soundMediaIds.length > 0 ? soundMediaIds : undefined,
          },
          order_index: 11
        })
      }

      if (worldBuildingEnabled && worldBuildingContent.trim()) {
        sectionsToInsert.push({
          pitch_id: params.id,
          section_name: 'world_building',
          data: { content: worldBuildingContent },
          order_index: 12
        })
      }

      if (timelineEnabled && timelineContent.trim()) {
        sectionsToInsert.push({
          pitch_id: params.id,
          section_name: 'timeline',
          data: { content: timelineContent },
          order_index: 13
        })
      }

      if (crewEnabled && crewContent.trim()) {
        sectionsToInsert.push({
          pitch_id: params.id,
          section_name: 'crew_expanded',
          data: { content: crewContent },
          order_index: 14
        })
      }

      if (custom1Enabled && custom1Content.trim()) {
        sectionsToInsert.push({
          pitch_id: params.id,
          section_name: 'custom_1',
          data: { content: custom1Content, title: custom1Title },
          order_index: 15
        })
      }

      if (custom2Enabled && custom2Content.trim()) {
        sectionsToInsert.push({
          pitch_id: params.id,
          section_name: 'custom_2',
          data: { content: custom2Content, title: custom2Title },
          order_index: 16
        })
      }

      if (custom3Enabled && custom3Content.trim()) {
        sectionsToInsert.push({
          pitch_id: params.id,
          section_name: 'custom_3',
          data: { content: custom3Content, title: custom3Title },
          order_index: 17
        })
      }

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

  const handleDelete = async () => {
    setDeleting(true)

    try {
      const supabase = createClient()
      await supabase
        .from('pitches')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', params.id)

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

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="max-w-[800px] mx-auto px-[24px] py-[40px]">
          <div className="bg-white border border-border rounded-[8px] p-[32px]">
            <h1 className="font-[var(--font-heading)] text-[24px] font-semibold leading-[32px] text-text-primary mb-[32px]">
              Edit Pitch
            </h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-[24px]">
              {/* Core Fields */}
              <div className="flex flex-col gap-[16px]">
                <TextInput
                  label="Logline"
                  value={logline}
                  onChange={(e) => setLogline(e.target.value)}
                  error={errors.logline}
                  helpText="One-sentence pitch (max 500 characters)"
                  required
                />

                <Textarea
                  label="Synopsis"
                  value={synopsis}
                  onChange={(e) => setSynopsis(e.target.value)}
                  error={errors.synopsis}
                  helpText="2–5 paragraphs"
                  required
                />
              </div>

              {/* Format Fields */}
              <div className="flex flex-col gap-[16px]">
                <TextInput
                  label="Genre & Format"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  error={errors.genre}
                  helpText="e.g., Drama / Feature Film"
                  required
                />

                <SelectInput
                  label="Budget Range"
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value as BudgetRange)}
                  options={budgetOptions}
                  error={errors.budgetRange}
                  required
                />

                <SelectInput
                  label="Status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as PitchStatus)}
                  options={statusOptions}
                  error={errors.status}
                  required
                />
              </div>

              {/* Creative Fields */}
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

              {/* People Fields */}
              <div className="flex flex-col gap-[16px]">
                <Textarea
                  label="Cast & Characters"
                  value={castAndCharacters}
                  onChange={(e) => setCastAndCharacters(e.target.value)}
                  error={errors.castAndCharacters}
                  helpText="Key characters and roles"
                  required
                />

                <Textarea
                  label="Key Team"
                  value={team}
                  onChange={(e) => setTeam(e.target.value)}
                  error={errors.team}
                  helpText="Director, producer, writer, etc."
                  required
                />
              </div>

              {/* Optional Sections */}
              <div className="border-t border-border pt-[24px] mt-[8px]">
                <h2 className="font-[var(--font-heading)] text-[18px] font-semibold leading-[28px] text-text-primary mb-[16px]">
                  Optional Sections
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                  {/* Flow */}
                  <div>
                    <label className="flex items-center gap-[8px] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={flowEnabled}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setFlowEnabled(e.target.checked)}
                        className="w-[16px] h-[16px]"
                      />
                      <span className="text-[14px] leading-[20px] text-text-primary">Flow</span>
                    </label>
                    {flowEnabled && (
                      <Textarea
                        value={flowContent}
                        onChange={(e) => setFlowContent(e.target.value)}
                        helpText="Beat descriptions, character arc labels, captions"
                        className="mt-[8px]"
                      />
                    )}
                  </div>

                  {/* Companion Documents */}
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-[8px] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={companionDocsEnabled}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setCompanionDocsEnabled(e.target.checked)}
                        className="w-[16px] h-[16px]"
                      />
                      <span className="text-[14px] leading-[20px] text-text-primary">Companion Documents</span>
                    </label>
                    {companionDocsEnabled && (
                      <div className="mt-[8px] flex flex-col gap-[12px]">
                        <Textarea
                          value={companionDocsContent}
                          onChange={(e) => setCompanionDocsContent(e.target.value)}
                          helpText="Description of attached script/design doc"
                        />
                        <PDFUpload
                          pitchId={params.id}
                          sectionName="companion_documents"
                          existingMedia={null}
                          onUploadComplete={(mediaId) => setCompanionDocMediaId(mediaId)}
                          onDeleteComplete={() => setCompanionDocMediaId(null)}
                        />
                      </div>
                    )}
                  </div>

                  {/* Locations */}
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-[8px] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={locationsEnabled}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setLocationsEnabled(e.target.checked)}
                        className="w-[16px] h-[16px]"
                      />
                      <span className="text-[14px] leading-[20px] text-text-primary">Locations</span>
                    </label>
                    {locationsEnabled && (
                      <div className="mt-[8px] flex flex-col gap-[12px]">
                        <Textarea
                          value={locationsContent}
                          onChange={(e) => setLocationsContent(e.target.value)}
                          helpText="Shooting locations, requirements, permit notes"
                        />
                        <ImageUpload
                          pitchId={params.id}
                          sectionName="locations"
                          maxFiles={10}
                          existingMedia={[]}
                          onUploadComplete={(mediaIds) => setLocationsMediaIds(mediaIds)}
                          onDeleteComplete={(mediaId) => setLocationsMediaIds(locationsMediaIds.filter(id => id !== mediaId))}
                        />
                      </div>
                    )}
                  </div>

                  {/* Art Direction */}
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-[8px] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={artDirectionEnabled}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setArtDirectionEnabled(e.target.checked)}
                        className="w-[16px] h-[16px]"
                      />
                      <span className="text-[14px] leading-[20px] text-text-primary">Art Direction & Set Design</span>
                    </label>
                    {artDirectionEnabled && (
                      <div className="mt-[8px] flex flex-col gap-[12px]">
                        <Textarea
                          value={artDirectionContent}
                          onChange={(e) => setArtDirectionContent(e.target.value)}
                          helpText="Visual style, set pieces, color palette"
                        />
                        <ImageUpload
                          pitchId={params.id}
                          sectionName="art_direction"
                          maxFiles={10}
                          existingMedia={[]}
                          onUploadComplete={(mediaIds) => setArtDirectionMediaIds(mediaIds)}
                          onDeleteComplete={(mediaId) => setArtDirectionMediaIds(artDirectionMediaIds.filter(id => id !== mediaId))}
                        />
                      </div>
                    )}
                  </div>

                  {/* Costumes */}
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-[8px] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={costumesEnabled}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setCostumesEnabled(e.target.checked)}
                        className="w-[16px] h-[16px]"
                      />
                      <span className="text-[14px] leading-[20px] text-text-primary">Costumes & Wardrobe</span>
                    </label>
                    {costumesEnabled && (
                      <div className="mt-[8px] flex flex-col gap-[12px]">
                        <Textarea
                          value={costumesContent}
                          onChange={(e) => setCostumesContent(e.target.value)}
                          helpText="Period/style, key changes, requirements"
                        />
                        <ImageUpload
                          pitchId={params.id}
                          sectionName="costumes"
                          maxFiles={10}
                          existingMedia={[]}
                          onUploadComplete={(mediaIds) => setCostumesMediaIds(mediaIds)}
                          onDeleteComplete={(mediaId) => setCostumesMediaIds(costumesMediaIds.filter(id => id !== mediaId))}
                        />
                      </div>
                    )}
                  </div>

                  {/* Makeup */}
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-[8px] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={makeupEnabled}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setMakeupEnabled(e.target.checked)}
                        className="w-[16px] h-[16px]"
                      />
                      <span className="text-[14px] leading-[20px] text-text-primary">Makeup & Hair</span>
                    </label>
                    {makeupEnabled && (
                      <div className="mt-[8px] flex flex-col gap-[12px]">
                        <Textarea
                          value={makeupContent}
                          onChange={(e) => setMakeupContent(e.target.value)}
                          helpText="Special requirements, prosthetics, period guidance"
                        />
                        <ImageUpload
                          pitchId={params.id}
                          sectionName="makeup"
                          maxFiles={10}
                          existingMedia={[]}
                          onUploadComplete={(mediaIds) => setMakeupMediaIds(mediaIds)}
                          onDeleteComplete={(mediaId) => setMakeupMediaIds(makeupMediaIds.filter(id => id !== mediaId))}
                        />
                      </div>
                    )}
                  </div>

                  {/* Props */}
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-[8px] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={propsEnabled}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setPropsEnabled(e.target.checked)}
                        className="w-[16px] h-[16px]"
                      />
                      <span className="text-[14px] leading-[20px] text-text-primary">Props & Set Dressing</span>
                    </label>
                    {propsEnabled && (
                      <div className="mt-[8px] flex flex-col gap-[12px]">
                        <Textarea
                          value={propsContent}
                          onChange={(e) => setPropsContent(e.target.value)}
                          helpText="Key props, set dressing aesthetic"
                        />
                        <ImageUpload
                          pitchId={params.id}
                          sectionName="props"
                          maxFiles={10}
                          existingMedia={[]}
                          onUploadComplete={(mediaIds) => setPropsMediaIds(mediaIds)}
                          onDeleteComplete={(mediaId) => setPropsMediaIds(propsMediaIds.filter(id => id !== mediaId))}
                        />
                      </div>
                    )}
                  </div>

                  {/* Vehicles */}
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-[8px] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={vehiclesEnabled}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setVehiclesEnabled(e.target.checked)}
                        className="w-[16px] h-[16px]"
                      />
                      <span className="text-[14px] leading-[20px] text-text-primary">Vehicles & Animals</span>
                    </label>
                    {vehiclesEnabled && (
                      <div className="mt-[8px] flex flex-col gap-[12px]">
                        <Textarea
                          value={vehiclesContent}
                          onChange={(e) => setVehiclesContent(e.target.value)}
                          helpText="Picture vehicles, animals, handlers"
                        />
                        <ImageUpload
                          pitchId={params.id}
                          sectionName="vehicles"
                          maxFiles={10}
                          existingMedia={[]}
                          onUploadComplete={(mediaIds) => setVehiclesMediaIds(mediaIds)}
                          onDeleteComplete={(mediaId) => setVehiclesMediaIds(vehiclesMediaIds.filter(id => id !== mediaId))}
                        />
                      </div>
                    )}
                  </div>

                  {/* Stunts */}
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-[8px] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={stuntsEnabled}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setStuntsEnabled(e.target.checked)}
                        className="w-[16px] h-[16px]"
                      />
                      <span className="text-[14px] leading-[20px] text-text-primary">Stunts & Special Effects</span>
                    </label>
                    {stuntsEnabled && (
                      <div className="mt-[8px] flex flex-col gap-[12px]">
                        <Textarea
                          value={stuntsContent}
                          onChange={(e) => setStuntsContent(e.target.value)}
                          helpText="Action sequences, SFX, VFX requirements"
                        />
                        <ImageUpload
                          pitchId={params.id}
                          sectionName="stunts"
                          maxFiles={10}
                          existingMedia={[]}
                          onUploadComplete={(mediaIds) => setStuntsMediaIds(mediaIds)}
                          onDeleteComplete={(mediaId) => setStuntsMediaIds(stuntsMediaIds.filter(id => id !== mediaId))}
                        />
                      </div>
                    )}
                  </div>

                  {/* Camera */}
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-[8px] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cameraEnabled}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setCameraEnabled(e.target.checked)}
                        className="w-[16px] h-[16px]"
                      />
                      <span className="text-[14px] leading-[20px] text-text-primary">Camera & Cinematography</span>
                    </label>
                    {cameraEnabled && (
                      <div className="mt-[8px] flex flex-col gap-[12px]">
                        <Textarea
                          value={cameraContent}
                          onChange={(e) => setCameraContent(e.target.value)}
                          helpText="Visual style, lens choices, lighting mood"
                        />
                        <ImageUpload
                          pitchId={params.id}
                          sectionName="camera"
                          maxFiles={10}
                          existingMedia={[]}
                          onUploadComplete={(mediaIds) => setCameraMediaIds(mediaIds)}
                          onDeleteComplete={(mediaId) => setCameraMediaIds(cameraMediaIds.filter(id => id !== mediaId))}
                        />
                      </div>
                    )}
                  </div>

                  {/* Sound */}
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-[8px] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={soundEnabled}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setSoundEnabled(e.target.checked)}
                        className="w-[16px] h-[16px]"
                      />
                      <span className="text-[14px] leading-[20px] text-text-primary">Sound & Music</span>
                    </label>
                    {soundEnabled && (
                      <div className="mt-[8px] flex flex-col gap-[12px]">
                        <Textarea
                          value={soundContent}
                          onChange={(e) => setSoundContent(e.target.value)}
                          helpText="Sound design, music style, voice-over"
                        />
                        <ImageUpload
                          pitchId={params.id}
                          sectionName="sound"
                          maxFiles={10}
                          existingMedia={[]}
                          onUploadComplete={(mediaIds) => setSoundMediaIds(mediaIds)}
                          onDeleteComplete={(mediaId) => setSoundMediaIds(soundMediaIds.filter(id => id !== mediaId))}
                        />
                      </div>
                    )}
                  </div>

                  {/* World Building */}
                  <div>
                    <label className="flex items-center gap-[8px] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={worldBuildingEnabled}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setWorldBuildingEnabled(e.target.checked)}
                        className="w-[16px] h-[16px]"
                      />
                      <span className="text-[14px] leading-[20px] text-text-primary">World Building & Lore</span>
                    </label>
                    {worldBuildingEnabled && (
                      <Textarea
                        value={worldBuildingContent}
                        onChange={(e) => setWorldBuildingContent(e.target.value)}
                        helpText="World rules, mythology, cultural details"
                        className="mt-[8px]"
                      />
                    )}
                  </div>

                  {/* Timeline */}
                  <div>
                    <label className="flex items-center gap-[8px] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={timelineEnabled}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setTimelineEnabled(e.target.checked)}
                        className="w-[16px] h-[16px]"
                      />
                      <span className="text-[14px] leading-[20px] text-text-primary">Timeline & Schedule</span>
                    </label>
                    {timelineEnabled && (
                      <Textarea
                        value={timelineContent}
                        onChange={(e) => setTimelineContent(e.target.value)}
                        helpText="Shooting days, production phases, dates"
                        className="mt-[8px]"
                      />
                    )}
                  </div>

                  {/* Crew Expanded */}
                  <div>
                    <label className="flex items-center gap-[8px] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={crewEnabled}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setCrewEnabled(e.target.checked)}
                        className="w-[16px] h-[16px]"
                      />
                      <span className="text-[14px] leading-[20px] text-text-primary">Crew & Team (Expanded)</span>
                    </label>
                    {crewEnabled && (
                      <Textarea
                        value={crewContent}
                        onChange={(e) => setCrewContent(e.target.value)}
                        helpText="Department heads, crew size, key hires"
                        className="mt-[8px]"
                      />
                    )}
                  </div>
                </div>

                {/* Custom Sections */}
                <div className="mt-[16px] flex flex-col gap-[16px]">
                  <div>
                    <label className="flex items-center gap-[8px] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={custom1Enabled}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setCustom1Enabled(e.target.checked)}
                        className="w-[16px] h-[16px]"
                      />
                      <span className="text-[14px] leading-[20px] text-text-primary">Custom Section 1</span>
                    </label>
                    {custom1Enabled && (
                      <div className="mt-[8px] flex flex-col gap-[8px]">
                        <TextInput
                          value={custom1Title}
                          onChange={(e) => setCustom1Title(e.target.value)}
                          placeholder="Section title"
                        />
                        <Textarea
                          value={custom1Content}
                          onChange={(e) => setCustom1Content(e.target.value)}
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-[8px] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={custom2Enabled}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setCustom2Enabled(e.target.checked)}
                        className="w-[16px] h-[16px]"
                      />
                      <span className="text-[14px] leading-[20px] text-text-primary">Custom Section 2</span>
                    </label>
                    {custom2Enabled && (
                      <div className="mt-[8px] flex flex-col gap-[8px]">
                        <TextInput
                          value={custom2Title}
                          onChange={(e) => setCustom2Title(e.target.value)}
                          placeholder="Section title"
                        />
                        <Textarea
                          value={custom2Content}
                          onChange={(e) => setCustom2Content(e.target.value)}
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-[8px] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={custom3Enabled}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setCustom3Enabled(e.target.checked)}
                        className="w-[16px] h-[16px]"
                      />
                      <span className="text-[14px] leading-[20px] text-text-primary">Custom Section 3</span>
                    </label>
                    {custom3Enabled && (
                      <div className="mt-[8px] flex flex-col gap-[8px]">
                        <TextInput
                          value={custom3Title}
                          onChange={(e) => setCustom3Title(e.target.value)}
                          placeholder="Section title"
                        />
                        <Textarea
                          value={custom3Content}
                          onChange={(e) => setCustom3Content(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Error message */}
              {errors.general && (
                <p className="text-[14px] leading-[20px] text-error">{errors.general}</p>
              )}

              {/* Actions */}
              <div className="flex gap-[12px] pt-[8px]">
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

              {/* Delete Section */}
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
