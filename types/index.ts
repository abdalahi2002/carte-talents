export type UserRole = 'user' | 'admin'

export interface Profile {
  id: string
  user_id: string
  first_name: string
  last_name: string
  email: string
  bio?: string
  avatar_url?: string
  role: UserRole
  verified: boolean
  verified_by?: string
  verified_at?: string
  created_at: string
  updated_at: string
}

export interface Skill {
  id: string
  profile_id: string
  name: string
  category: SkillCategory
  level: SkillLevel
  description?: string
  created_at: string
}

export type SkillCategory = 
  | 'technique'
  | 'linguistique'
  | 'projet'
  | 'passion'
  | 'autre'

export type SkillLevel = 
  | 'débutant'
  | 'intermédiaire'
  | 'avancé'
  | 'expert'

export interface Language {
  id: string
  profile_id: string
  name: string
  level: LanguageLevel
  created_at: string
}

export type LanguageLevel = 
  | 'A1'
  | 'A2'
  | 'B1'
  | 'B2'
  | 'C1'
  | 'C2'
  | 'natif'

export interface Project {
  id: string
  profile_id: string
  title: string
  description: string
  technologies?: string[]
  url?: string
  github_url?: string
  created_at: string
}

export interface CollaborationRequest {
  id: string
  from_profile_id: string
  to_profile_id: string
  message: string
  status: 'pending' | 'accepted' | 'rejected'
  created_at: string
}

export interface SearchFilters {
  skills?: string[]
  languages?: string[]
  categories?: SkillCategory[]
  verified?: boolean
  search?: string
}

