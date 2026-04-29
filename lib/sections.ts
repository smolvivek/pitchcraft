export interface OptionalSectionDef {
  key: string
  label: string
  description: string
  hasImages: boolean
  hasPDF: boolean
  group: 'story' | 'visual' | 'practical' | 'sound' | 'production'
}

export const SECTION_GROUP_LABELS: Record<string, string> = {
  story: 'Story & Development',
  visual: 'Visual & Design',
  practical: 'Practical',
  sound: 'Sound & Music',
  production: 'Production',
}

export const OPTIONAL_SECTIONS: OptionalSectionDef[] = [
  // Story & Development
  { key: 'script_documents', label: 'Screenplay', description: 'Your screenplay, script, or treatment document.', hasImages: false, hasPDF: true, group: 'story' },
  { key: 'treatment', label: 'Treatment', description: 'The written treatment for your project.', hasImages: false, hasPDF: true, group: 'story' },
  { key: 'flow', label: 'Flow', description: 'The emotional arc of your project.', hasImages: true, hasPDF: false, group: 'story' },

  // Visual & Design
  { key: 'references', label: 'References', description: 'Mood board, visual references, inspiration.', hasImages: true, hasPDF: false, group: 'visual' },
  { key: 'art_direction', label: 'Art Direction', description: 'Visual style, color palette, design references.', hasImages: true, hasPDF: false, group: 'visual' },
  { key: 'set_design', label: 'Set Design', description: 'Key sets, construction, dressing.', hasImages: true, hasPDF: false, group: 'visual' },
  { key: 'costume', label: 'Costume', description: 'Period, style, key costume changes.', hasImages: true, hasPDF: false, group: 'visual' },
  { key: 'makeup_hair', label: 'Makeup & Hair', description: 'SFX makeup, prosthetics, hair changes.', hasImages: true, hasPDF: false, group: 'visual' },
  { key: 'camera', label: 'Camera', description: 'Visual style, lens choices, lighting mood.', hasImages: true, hasPDF: false, group: 'visual' },

  // Practical
  { key: 'locations', label: 'Locations', description: 'Where are you shooting?', hasImages: true, hasPDF: false, group: 'practical' },
  { key: 'props', label: 'Props', description: 'Key props. Script-essential vs. decorative.', hasImages: true, hasPDF: false, group: 'practical' },
  { key: 'vehicles', label: 'Vehicles', description: 'Picture vehicles and handlers.', hasImages: true, hasPDF: false, group: 'practical' },
  { key: 'stunts_sfx', label: 'Stunts & SFX', description: 'Action sequences, stunt coordination, effects.', hasImages: true, hasPDF: false, group: 'practical' },

  // Sound & Music
  { key: 'sound_design', label: 'Sound Design', description: 'Ambience, foley, voice-over.', hasImages: false, hasPDF: false, group: 'sound' },
  { key: 'music', label: 'Music', description: 'Score, soundtrack, temp tracks.', hasImages: false, hasPDF: false, group: 'sound' },

  // Production
  { key: 'setting_world', label: 'Setting & World', description: 'World rules, environment, cultural details.', hasImages: true, hasPDF: false, group: 'production' },
  { key: 'schedule', label: 'Schedule', description: 'Shooting days, pre-production, post-production.', hasImages: false, hasPDF: false, group: 'production' },
  { key: 'crew', label: 'Crew', description: 'Department heads, crew size, key hires.', hasImages: false, hasPDF: false, group: 'production' },
]

export type ProjectType = 'fiction' | 'documentary' | 'ad_film' | 'music_video'

export const PROJECT_TYPE_CONFIG: Record<ProjectType, {
  label: string
  description: string
  castLabel: string
  includeStatus: boolean
  suggestedOptional: string[]
}> = {
  fiction: {
    label: 'Fiction / Narrative',
    description: 'Short film, feature, web series, drama',
    castLabel: 'Cast & Characters',
    includeStatus: true,
    suggestedOptional: ['references', 'art_direction', 'locations', 'camera', 'costume'],
  },
  documentary: {
    label: 'Documentary',
    description: 'Non-fiction, doc series, observational',
    castLabel: 'Subjects & Characters',
    includeStatus: true,
    suggestedOptional: ['locations', 'camera', 'sound_design', 'schedule'],
  },
  ad_film: {
    label: 'Ad Film',
    description: 'Commercial, branded content, campaign',
    castLabel: 'Talent',
    includeStatus: false,
    suggestedOptional: ['art_direction', 'camera', 'locations', 'music'],
  },
  music_video: {
    label: 'Music Video',
    description: 'Artist, band, label projects',
    castLabel: 'Artist & Performer',
    includeStatus: false,
    suggestedOptional: ['references', 'art_direction', 'camera', 'locations', 'music'],
  },
}

export const CUSTOM_SECTION_KEYS = ['custom_1', 'custom_2', 'custom_3'] as const

// Co-located tier limits for custom sections — update here if count changes
export const CUSTOM_SECTION_LIMITS: Record<'free' | 'pro' | 'studio', number> = {
  free: 0,
  pro: 3,
  studio: 3,
}
