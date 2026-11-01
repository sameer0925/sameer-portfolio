import React from 'react'
import {
  getSiteSettings,
  getPortfolioProfile,
  getSkillCategories,
  getSkills,
  getProjects,
  getExperiences,
  getTestimonials,
  getSocialLinks,
} from '@/lib/data'
import { Navbar } from '@/components/public/Navbar'
import { HeroSection } from '@/components/public/HeroSection'
import { AboutSection } from '@/components/public/AboutSection'
import { SkillsSection } from '@/components/public/SkillsSection'
import { ProjectsSection } from '@/components/public/ProjectsSection'
import { ExperienceSection } from '@/components/public/ExperienceSection'
import { TestimonialsSection } from '@/components/public/TestimonialsSection'
import { ContactSection } from '@/components/public/ContactSection'
import { Footer } from '@/components/public/Footer'

// Revalidate on demand or every 60 seconds
export const revalidate = 60

export default async function HomePage() {
  const [
    settings,
    profile,
    categories,
    skills,
    projects,
    experiences,
    testimonials,
    socialLinks,
  ] = await Promise.all([
    getSiteSettings(),
    getPortfolioProfile(),
    getSkillCategories(),
    getSkills(),
    getProjects(true),
    getExperiences(),
    getTestimonials(true),
    getSocialLinks(),
  ])

  const visibility = settings.sections_visibility || {
    hero: true,
    about: true,
    skills: true,
    projects: true,
    experience: true,
    testimonials: true,
    contact: true,
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors">
      <Navbar settings={settings} profile={profile} />

      <main className="flex-1">
        {visibility.hero && <HeroSection profile={profile} />}
        {visibility.about && <AboutSection profile={profile} />}
        {visibility.skills && <SkillsSection categories={categories} skills={skills} />}
        {visibility.projects && <ProjectsSection projects={projects} />}
        {visibility.experience && <ExperienceSection experiences={experiences} />}
        {visibility.testimonials && <TestimonialsSection testimonials={testimonials} />}
        {visibility.contact && <ContactSection profile={profile} socialLinks={socialLinks} />}
      </main>

      <Footer settings={settings} profile={profile} socialLinks={socialLinks} />
    </div>
  )
}
