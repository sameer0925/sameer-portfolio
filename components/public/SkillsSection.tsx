'use client'

import React, { useState } from 'react'
import {
  Code2,
  Atom,
  Server,
  Database,
  GitBranch,
  Layers,
  Cpu,
  Palette,
  Terminal,
  FileCode,
  HardDrive,
  CheckCircle2,
  Network,
} from 'lucide-react'
import { Skill, SkillCategory } from '@/lib/supabase/types'

interface SkillsSectionProps {
  categories: SkillCategory[]
  skills: (Skill & { categoryName?: string })[]
}

const iconMap: Record<string, React.ElementType> = {
  Atom,
  Code2,
  FileCode,
  Palette,
  Server,
  Cpu,
  Network,
  Database,
  HardDrive,
  GitBranch,
  CheckCircle2,
  Terminal,
}

export function SkillsSection({ categories, skills }: SkillsSectionProps) {
  const [activeTab, setActiveTab] = useState<string>('all')

  const filteredSkills = activeTab === 'all'
    ? skills
    : skills.filter((s) => s.category_id === activeTab)

  return (
    <section id="skills" className="py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-xs uppercase tracking-widest text-indigo-600 dark:text-indigo-400 font-bold mb-2">
            My Technical Arsenal
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Skills & Expertise
          </h3>
          <p className="mt-4 text-slate-600 dark:text-slate-400 text-base">
            Modern tools, languages, and frameworks I use to engineer robust end-to-end applications.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            All Skills ({skills.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                activeTab === cat.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {filteredSkills.map((skill) => {
            const IconComponent = iconMap[skill.icon] || Code2
            return (
              <div
                key={skill.id}
                className="group relative p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm hover:shadow-md hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center gap-3.5 mb-3">
                  <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base">
                      {skill.name}
                    </h4>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {skill.categoryName || 'Technical Skill'}
                    </span>
                  </div>
                </div>

                {/* Proficiency Bar */}
                {skill.proficiency > 0 && (
                  <div className="mt-2">
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="text-slate-400 text-[11px]">Proficiency</span>
                      <span className="font-semibold text-slate-600 dark:text-slate-300 text-[11px]">
                        {skill.proficiency}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                        style={{ width: `${skill.proficiency}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
