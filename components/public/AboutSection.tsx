'use client'

import React from 'react'
import { FileDown, GraduationCap, Code2, MapPin, CheckCircle } from 'lucide-react'
import { PortfolioProfile } from '@/lib/supabase/types'

interface AboutSectionProps {
  profile: PortfolioProfile
}

export function AboutSection({ profile }: AboutSectionProps) {
  const highlights = [
    {
      icon: GraduationCap,
      label: 'Education',
      value: 'B.Sc Computer Science',
      sub: 'SRM University AP',
    },
    {
      icon: Code2,
      label: 'Core Focus',
      value: 'Full-Stack Web Dev',
      sub: 'MERN & SQL Ecosystem',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'Andhra Pradesh',
      sub: 'India (Remote / Hybrid)',
    },
  ]

  return (
    <section id="about" className="py-24 bg-slate-50/50 dark:bg-slate-900/30 border-y border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs uppercase tracking-widest text-indigo-600 dark:text-indigo-400 font-bold mb-2">
            Get To Know Me
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            About Me
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Photo & Stats */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-sm aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800">
              <img
                src={profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'}
                alt={profile.full_name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
                <div>
                  <p className="text-white font-bold text-lg">{profile.full_name}</p>
                  <p className="text-indigo-300 text-sm font-medium">{profile.title}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Bio & Highlights */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Passionate about building scalable digital solutions with clean code.
            </h4>

            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base sm:text-lg mb-8 whitespace-pre-line">
              {profile.bio}
            </p>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {highlights.map((item, idx) => {
                const Icon = item.icon
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-sm"
                  >
                    <Icon className="w-6 h-6 text-indigo-500 mb-2" />
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                      {item.label}
                    </span>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1">
                      {item.value}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {item.sub}
                    </p>
                  </div>
                )
              })}
            </div>

            {/* Resume CTA */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={profile.resume_url || '/sample-resume.pdf'}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold text-sm shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                <FileDown className="w-4 h-4 text-indigo-400 dark:text-indigo-600" />
                <span>Download Resume (PDF)</span>
              </a>

              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Updated & ready for review</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
