export interface OptionalSectionDef {
  key: string
  label: string
  description: string
  hasImages: boolean
  hasPDF: boolean
}

export const OPTIONAL_SECTIONS: OptionalSectionDef[] = [
  { key: 'flow', label: 'Flow', description: 'The emotional arc of your project.', hasImages: false, hasPDF: false },
  { key: 'script_documents', label: 'Script & Documents', description: 'Script, treatment, lookbook.', hasImages: false, hasPDF: true },
  { key: 'locations', label: 'Locations', description: 'Where are you shooting?', hasImages: true, hasPDF: false },
  { key: 'art_direction', label: 'Art Direction', description: 'Visual style, color palette, design references.', hasImages: true, hasPDF: false },
  { key: 'set_design', label: 'Set Design', description: 'Key sets, construction, dressing.', hasImages: true, hasPDF: false },
  { key: 'costume', label: 'Costume', description: 'Period, style, key costume changes.', hasImages: true, hasPDF: false },
  { key: 'makeup_hair', label: 'Makeup & Hair', description: 'SFX makeup, prosthetics, hair changes.', hasImages: true, hasPDF: false },
  { key: 'props', label: 'Props', description: 'Key props. Script-essential vs. decorative.', hasImages: true, hasPDF: false },
  { key: 'vehicles_animals', label: 'Vehicles & Animals', description: 'Picture vehicles, trained animals, handlers.', hasImages: true, hasPDF: false },
  { key: 'stunts_sfx', label: 'Stunts & SFX', description: 'Action sequences, stunt coordination, effects.', hasImages: true, hasPDF: false },
  { key: 'camera', label: 'Camera', description: 'Visual style, lens choices, lighting mood.', hasImages: true, hasPDF: false },
  { key: 'sound_design', label: 'Sound Design', description: 'Ambience, foley, voice-over.', hasImages: false, hasPDF: false },
  { key: 'music', label: 'Music', description: 'Score, soundtrack, temp tracks.', hasImages: false, hasPDF: false },
  { key: 'setting_world', label: 'Setting & World', description: 'World rules, environment, cultural details.', hasImages: true, hasPDF: false },
  { key: 'schedule', label: 'Schedule', description: 'Shooting days, pre-production, post-production.', hasImages: false, hasPDF: false },
  { key: 'crew', label: 'Crew', description: 'Department heads, crew size, key hires.', hasImages: false, hasPDF: false },
]

export const CUSTOM_SECTION_KEYS = ['custom_1', 'custom_2', 'custom_3'] as const
