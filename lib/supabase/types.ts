export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface SiteSettings {
  id: string
  site_title: string
  site_description: string
  logo_type: 'text' | 'image'
  logo_text: string
  logo_image_url: string
  favicon_url: string
  accent_color: string
  font_family: string
  sections_visibility: {
    hero: boolean
    about: boolean
    skills: boolean
    projects: boolean
    experience: boolean
    testimonials: boolean
    contact: boolean
  }
  seo_keywords: string[]
  updated_at?: string
}

export interface PortfolioProfile {
  id: string
  full_name: string
  title: string
  tagline: string
  bio: string
  avatar_url: string
  resume_url: string
  location: string
  email: string
  phone: string
  hero_cta_primary_text: string
  hero_cta_primary_link: string
  hero_cta_secondary_text: string
  hero_cta_secondary_link: string
  available_for_work: boolean
  updated_at?: string
}

export interface SkillCategory {
  id: string
  name: string
  sort_order: number
  created_at?: string
}

export interface Skill {
  id: string
  category_id: string
  name: string
  icon: string
  proficiency: number
  sort_order: number
  created_at?: string
}

export interface Project {
  id: string
  title: string
  slug: string
  description: string
  content: string
  cover_image: string
  screenshots: string[]
  tags: string[]
  category: string
  demo_url: string
  github_url: string
  featured: boolean
  published: boolean
  sort_order: number
  created_at?: string
}

export interface Experience {
  id: string
  type: 'experience' | 'education'
  title: string
  organization: string
  location: string
  start_date: string
  end_date: string
  description: string
  skills_used: string[]
  sort_order: number
  created_at?: string
}

export interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  avatar_url: string
  content: string
  published: boolean
  sort_order: number
  created_at?: string
}

export interface SocialLink {
  id: string
  platform: string
  url: string
  icon: string
  sort_order: number
  is_active: boolean
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  is_read: boolean
  created_at: string
}
