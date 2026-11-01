import React from 'react'
import Link from 'next/link'
import { Github, Linkedin, Mail, Twitter, Shield, Heart } from 'lucide-react'
import { SiteSettings, PortfolioProfile, SocialLink } from '@/lib/supabase/types'

interface FooterProps {
  settings: SiteSettings
  profile: PortfolioProfile
  socialLinks: SocialLink[]
}

const socialIconMap: Record<string, React.ElementType> = {
  Github,
  Linkedin,
  Twitter,
  Mail,
}

export function Footer({ settings, profile, socialLinks }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-12 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Link
              href="/"
              className="text-xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent mb-1"
            >
              {settings.logo_text || profile.full_name}
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {profile.title} • {profile.location}
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            {socialLinks.map((soc) => {
              const IconComp = socialIconMap[soc.icon] || Github
              return (
                <a
                  key={soc.id}
                  href={soc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={soc.platform}
                  className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <IconComp className="w-4 h-4" />
                </a>
              )
            })}
          </div>

          {/* Copyright & Admin Link */}
          <div className="flex flex-col sm:flex-row items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span>
              &copy; {currentYear} {profile.full_name}. All rights reserved.
            </span>
            <span className="hidden sm:inline">•</span>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 text-slate-400 hover:text-indigo-500 transition-colors font-medium"
              title="Admin Portal"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
