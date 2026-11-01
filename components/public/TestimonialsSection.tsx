'use client'

import React from 'react'
import { Quote, Sparkles } from 'lucide-react'
import { Testimonial } from '@/lib/supabase/types'

interface TestimonialsSectionProps {
  testimonials: Testimonial[]
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  if (!testimonials || testimonials.length === 0) return null

  return (
    <section id="testimonials" className="py-24 bg-slate-50/50 dark:bg-slate-900/30 border-y border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Endorsements</span>
          </div>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Recommendations & Feedback
          </h3>
          <p className="mt-4 text-slate-600 dark:text-slate-400 text-base">
            What professors, peers, and collaborators say about working with me.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="relative p-8 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm flex flex-col justify-between"
            >
              <Quote className="w-10 h-10 text-indigo-200 dark:text-indigo-900/80 mb-4" />

              <p className="text-slate-700 dark:text-slate-300 text-base italic leading-relaxed mb-6">
                &ldquo;{t.content}&rdquo;
              </p>

              <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-700/60">
                <img
                  src={t.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80'}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                />
                <div>
                  <h5 className="font-bold text-slate-900 dark:text-white text-base">
                    {t.name}
                  </h5>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                    {t.role} • {t.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
