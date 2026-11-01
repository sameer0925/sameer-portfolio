'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowDown, Sparkles, Send, FolderGit2, MapPin } from 'lucide-react'
import { PortfolioProfile } from '@/lib/supabase/types'

interface HeroSectionProps {
  profile: PortfolioProfile
}

export function HeroSection({ profile }: HeroSectionProps) {
  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Background ambient gradient glow blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/20 dark:bg-indigo-600/15 rounded-full blur-3xl pointer-events-none -z-10 animate-blob" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-500/20 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none -z-10 animate-blob [animation-delay:2s]" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Availability Badge */}
        {profile.available_for_work && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Available for new projects & opportunities</span>
          </div>
        )}

        {/* Profile Avatar with subtle glowing border */}
        <div className="relative mx-auto w-32 h-32 sm:w-36 sm:h-36 mb-8 group">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-1 blur-sm group-hover:blur-md transition-all duration-300 opacity-75" />
          <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white dark:border-slate-900 shadow-xl bg-slate-100 dark:bg-slate-800">
            <img
              src={profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'}
              alt={profile.full_name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
          Hi, I&apos;m{' '}
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            {profile.full_name}
          </span>
        </h1>

        {/* Title & Location */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-lg sm:text-xl font-medium text-slate-700 dark:text-slate-300 mb-6">
          <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{profile.title}</span>
          <span className="hidden sm:inline text-slate-400">•</span>
          <span className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-base">
            <MapPin className="w-4 h-4 text-rose-500" />
            {profile.location}
          </span>
        </div>

        {/* Tagline */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-10">
          {profile.tagline}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={profile.hero_cta_primary_link || '#projects'}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm sm:text-base shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0"
          >
            <FolderGit2 className="w-4 h-4" />
            <span>{profile.hero_cta_primary_text || 'View Projects'}</span>
          </Link>

          <Link
            href={profile.hero_cta_secondary_link || '#contact'}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-sm sm:text-base transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <Send className="w-4 h-4 text-indigo-500" />
            <span>{profile.hero_cta_secondary_text || 'Contact Me'}</span>
          </Link>
        </div>

        {/* Scroll hint */}
        <div className="mt-14 flex justify-center">
          <Link
            href="#about"
            aria-label="Scroll to About section"
            className="p-2 rounded-full text-slate-400 hover:text-indigo-500 transition-colors animate-bounce"
          >
            <ArrowDown className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
