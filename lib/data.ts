import { createClientServer } from './supabase/server'
import { isSupabaseConfigured } from './supabase/client'
import {
  DEFAULT_SITE_SETTINGS,
  DEFAULT_PROFILE,
  DEFAULT_CATEGORIES,
  DEFAULT_SKILLS,
  DEFAULT_PROJECTS,
  DEFAULT_EXPERIENCES,
  DEFAULT_TESTIMONIALS,
  DEFAULT_SOCIAL_LINKS,
} from './constants'
import {
  SiteSettings,
  PortfolioProfile,
  SkillCategory,
  Skill,
  Project,
  Experience,
  Testimonial,
  SocialLink,
} from './supabase/types'

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured()) return DEFAULT_SITE_SETTINGS
  try {
    const supabase = await createClientServer()
    const { data, error } = await supabase.from('site_settings').select('*').limit(1).single()
    if (error || !data) return DEFAULT_SITE_SETTINGS
    return data as SiteSettings
  } catch {
    return DEFAULT_SITE_SETTINGS
  }
}

export async function getPortfolioProfile(): Promise<PortfolioProfile> {
  if (!isSupabaseConfigured()) return DEFAULT_PROFILE
  try {
    const supabase = await createClientServer()
    const { data, error } = await supabase.from('portfolio_profile').select('*').limit(1).single()
    if (error || !data) return DEFAULT_PROFILE
    return data as PortfolioProfile
  } catch {
    return DEFAULT_PROFILE
  }
}

export async function getSkillCategories(): Promise<SkillCategory[]> {
  if (!isSupabaseConfigured()) return DEFAULT_CATEGORIES
  try {
    const supabase = await createClientServer()
    const { data, error } = await supabase.from('skill_categories').select('*').order('sort_order', { ascending: true })
    if (error || !data || data.length === 0) return DEFAULT_CATEGORIES
    return data as SkillCategory[]
  } catch {
    return DEFAULT_CATEGORIES
  }
}

export async function getSkills(): Promise<(Skill & { categoryName?: string })[]> {
  if (!isSupabaseConfigured()) return DEFAULT_SKILLS
  try {
    const supabase = await createClientServer()
    const { data, error } = await supabase
      .from('skills')
      .select('*, skill_categories(name)')
      .order('sort_order', { ascending: true })
    if (error || !data || data.length === 0) return DEFAULT_SKILLS
    return data.map((item: any) => ({
      ...item,
      categoryName: item.skill_categories?.name || 'General',
    }))
  } catch {
    return DEFAULT_SKILLS
  }
}

export async function getProjects(onlyPublished = true): Promise<Project[]> {
  if (!isSupabaseConfigured()) {
    return onlyPublished ? DEFAULT_PROJECTS.filter(p => p.published) : DEFAULT_PROJECTS
  }
  try {
    const supabase = await createClientServer()
    let query = supabase.from('projects').select('*').order('sort_order', { ascending: true })
    if (onlyPublished) {
      query = query.eq('published', true)
    }
    const { data, error } = await query
    if (error || !data || data.length === 0) {
      return onlyPublished ? DEFAULT_PROJECTS.filter(p => p.published) : DEFAULT_PROJECTS
    }
    return data as Project[]
  } catch {
    return onlyPublished ? DEFAULT_PROJECTS.filter(p => p.published) : DEFAULT_PROJECTS
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!isSupabaseConfigured()) {
    return DEFAULT_PROJECTS.find(p => p.slug === slug) || null
  }
  try {
    const supabase = await createClientServer()
    const { data, error } = await supabase.from('projects').select('*').eq('slug', slug).single()
    if (error || !data) {
      return DEFAULT_PROJECTS.find(p => p.slug === slug) || null
    }
    return data as Project
  } catch {
    return DEFAULT_PROJECTS.find(p => p.slug === slug) || null
  }
}

export async function getExperiences(): Promise<Experience[]> {
  if (!isSupabaseConfigured()) return DEFAULT_EXPERIENCES
  try {
    const supabase = await createClientServer()
    const { data, error } = await supabase.from('experiences').select('*').order('sort_order', { ascending: true })
    if (error || !data || data.length === 0) return DEFAULT_EXPERIENCES
    return data as Experience[]
  } catch {
    return DEFAULT_EXPERIENCES
  }
}

export async function getTestimonials(onlyPublished = true): Promise<Testimonial[]> {
  if (!isSupabaseConfigured()) {
    return onlyPublished ? DEFAULT_TESTIMONIALS.filter(t => t.published) : DEFAULT_TESTIMONIALS
  }
  try {
    const supabase = await createClientServer()
    let query = supabase.from('testimonials').select('*').order('sort_order', { ascending: true })
    if (onlyPublished) {
      query = query.eq('published', true)
    }
    const { data, error } = await query
    if (error || !data || data.length === 0) {
      return onlyPublished ? DEFAULT_TESTIMONIALS.filter(t => t.published) : DEFAULT_TESTIMONIALS
    }
    return data as Testimonial[]
  } catch {
    return onlyPublished ? DEFAULT_TESTIMONIALS.filter(t => t.published) : DEFAULT_TESTIMONIALS
  }
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  if (!isSupabaseConfigured()) return DEFAULT_SOCIAL_LINKS
  try {
    const supabase = await createClientServer()
    const { data, error } = await supabase.from('social_links').select('*').eq('is_active', true).order('sort_order', { ascending: true })
    if (error || !data || data.length === 0) return DEFAULT_SOCIAL_LINKS
    return data as SocialLink[]
  } catch {
    return DEFAULT_SOCIAL_LINKS
  }
}
