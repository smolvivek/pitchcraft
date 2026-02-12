export type PitchStatus = 'development' | 'production' | 'completed'

export type BudgetRange =
  | 'under-5k'
  | '5k-50k'
  | '50k-250k'
  | '250k-1m'
  | '1m-plus'

export interface Pitch {
  id: string
  user_id: string
  project_name: string
  logline: string
  synopsis: string
  genre: string
  vision: string
  cast_and_characters: string
  budget_range: BudgetRange
  status: PitchStatus
  team: string
  current_version: number
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface PitchFormData {
  project_name: string
  logline: string
  synopsis: string
  genre: string
  vision: string
  cast_and_characters: string
  budget_range: BudgetRange
  status: PitchStatus
  team: string
}

export interface CastMember {
  id: string
  name: string
  role: string
  description?: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  bio?: string
}

export interface PitchSection {
  id: string
  pitch_id: string
  section_name: string
  data: {
    content?: string
    title?: string
  }
  order_index: number | null
  created_at: string
  updated_at: string
}
