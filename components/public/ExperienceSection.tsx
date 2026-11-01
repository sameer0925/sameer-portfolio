'use client'

import React from 'react'
import { GraduationCap, Briefcase, Calendar, MapPin } from 'lucide-react'
import { Experience } from '@/lib/supabase/types'

interface ExperienceSectionProps {
  experiences: Experience[]
}

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  const educationItems = experiences.filter((e) => e.type === 'education')
  const workItems = experiences.filter((e) => e.type === 'experience')

  return (
    <section id="experience" className="py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs uppercase tracking-widest text-indigo-600 dark:text-indigo-400 font-bold mb-2">
            Journey & Background
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Experience & Education
          </h3>
          <p className="mt-4 text-slate-600 dark:text-slate-400 text-base">
            My academic foundation at SRM University AP and hands-on engineering journey.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Education Timeline */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h4 className="text-2xl font-bold text-slate-900 dark:text-white">
                Education
              </h4>
            </div>

            <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {educationItems.map((item) => (
                <div key={item.id} className="relative group">
                  <div className="absolute -left-[29px] top-1.5 w-3 h-3 rounded-full bg-purple-600 ring-4 ring-white dark:ring-slate-900" />
                  <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {item.start_date} – {item.end_date}
                      </span>
                      <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                        <MapPin className="w-3.5 h-3.5" />
                        {item.location}
                      </span>
                    </div>

                    <h5 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                      {item.title}
                    </h5>
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-3">
                      {item.organization}
                    </p>

                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                      {item.description}
                    </p>

                    {item.skills_used && item.skills_used.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-700/50">
                        {item.skills_used.map((skill) => (
                          <span
                            key={skill}
                            className="text-xs px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Work / Experience Timeline */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Briefcase className="w-6 h-6" />
              </div>
              <h4 className="text-2xl font-bold text-slate-900 dark:text-white">
                Experience & Projects
              </h4>
            </div>

            <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {workItems.map((item) => (
                <div key={item.id} className="relative group">
                  <div className="absolute -left-[29px] top-1.5 w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-white dark:ring-slate-900" />
                  <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {item.start_date} – {item.end_date}
                      </span>
                      <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                        <MapPin className="w-3.5 h-3.5" />
                        {item.location}
                      </span>
                    </div>

                    <h5 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                      {item.title}
                    </h5>
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-3">
                      {item.organization}
                    </p>

                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                      {item.description}
                    </p>

                    {item.skills_used && item.skills_used.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-700/50">
                        {item.skills_used.map((skill) => (
                          <span
                            key={skill}
                            className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
