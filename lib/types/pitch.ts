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

export interface MediaRecord {
  id: string
  pitch_id: string
  section_name: string
  storage_path: string
  file_type: 'image' | 'document'
  file_size: number
  order_index: number | null
  caption: string | null
  created_at: string
  updated_at: string
}

export interface FlowBeat {
  id: string
  caption: string
  arcLabel?: string
  mediaIds: string[]
  videoUrl?: string
  audioUrl?: string
  order: number
}

export interface PitchSection {
  id: string
  pitch_id: string
  section_name: string
  data: {
    content?: string
    title?: string
    beats?: FlowBeat[] // For flow section
    mediaIds?: string[] // For production sections
    mediaId?: string // For companion_documents (single PDF)
    videoUrl?: string // Per-section video/reference link
  }
  order_index: number | null
  created_at: string
  updated_at: string
}

export interface PitchSectionWithMedia extends PitchSection {
  media?: MediaRecord[]
}

export interface ShareLink {
  id: string
  pitch_id: string
  visibility: 'public' | 'private' | 'invite-only'
  allow_version_history: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface StretchGoal {
  amount: number
  description: string
}

export interface FundingReward {
  amount: number
  title: string
  description: string
}

export interface Funding {
  id: string
  pitch_id: string
  funding_goal: number
  description: string | null
  end_date: string | null
  stretch_goals: StretchGoal[]
  rewards: FundingReward[]
  created_at: string
  updated_at: string
}

export interface Donation {
  id: string
  funding_id: string
  amount: number
  email: string
  name: string
  message: string | null
  stripe_session_id: string | null
  stripe_payment_intent: string | null
  created_at: string
}

export interface PitchVersion {
  id: string
  pitch_id: string
  version_number: number
  data: Record<string, unknown>
  created_at: string
}
