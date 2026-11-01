'use client'

import React, { useState, useEffect } from 'react'
import {
  GraduationCap,
  Briefcase,
  Plus,
  Trash2,
  Calendar,
  MapPin,
  Save,
  Loader2,
} from 'lucide-react'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import { DEFAULT_EXPERIENCES } from '@/lib/constants'
import { Experience } from '@/lib/supabase/types'
import { toast } from 'sonner'

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>(DEFAULT_EXPERIENCES)
  const [isSaving, setIsSaving] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  const [formEntry, setFormEntry] = useState<Partial<Experience>>({
    type: 'experience',
    title: '',
    organization: '',
    location: 'Andhra Pradesh, India',
    start_date: '2023',
    end_date: 'Present',
    description: '',
    skills_used: ['React', 'Node.js', 'Express', 'MongoDB'],
  })
  const [skillsInput, setSkillsInput] = useState('React, Node.js, Express, MongoDB')

  useEffect(() => {
    async function loadExperiences() {
      if (!isSupabaseConfigured()) return

      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('experiences')
          .select('*')
          .order('sort_order', { ascending: true })

        if (data && !error && data.length > 0) {
          setExperiences(data)
        }
      } catch (err) {
        console.error('Error loading experience:', err)
      }
    }

    loadExperiences()
  }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formEntry.title || !formEntry.organization) {
      toast.error('Please enter title and organization.')
      return
    }

    setIsSaving(true)
    const skillsArray = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    const newExp: Experience = {
      id: isSupabaseConfigured() ? crypto.randomUUID() : `exp-${Date.now()}`,
      type: formEntry.type as 'experience' | 'education',
      title: formEntry.title!,
      organization: formEntry.organization!,
      location: formEntry.location || 'Andhra Pradesh, India',
      start_date: formEntry.start_date || '2023',
      end_date: formEntry.end_date || 'Present',
      description: formEntry.description || '',
      skills_used: skillsArray,
      sort_order: experiences.length + 1,
    }

    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient()
        const { error } = await supabase.from('experiences').insert([newExp])
        if (error) throw error
      }

      setExperiences((prev) => [...prev, newExp])
      setIsAdding(false)
      setFormEntry({
        type: 'experience',
        title: '',
        organization: '',
        location: 'Andhra Pradesh, India',
        start_date: '2023',
        end_date: 'Present',
        description: '',
        skills_used: [],
      })
      toast.success(`Added "${newExp.title}" to timeline!`)
    } catch (err: any) {
      toast.error(err.message || 'Failed to add entry.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Remove "${title}" from timeline?`)) return

    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient()
        const { error } = await supabase.from('experiences').delete().eq('id', id)
        if (error) throw error
      }

      setExperiences((prev) => prev.filter((e) => e.id !== id))
      toast.success(`Removed "${title}".`)
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete entry.')
    }
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Experience & Education Timeline
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage your academic credentials (e.g. SRM University AP) and software development experience.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? 'Cancel Entry' : 'Add New Entry'}</span>
        </button>
      </div>

      {/* Add Entry Form Modal / Panel */}
      {isAdding && (
        <form
          onSubmit={handleAdd}
          className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6"
        >
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            New Timeline Item
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                Type
              </label>
              <select
                value={formEntry.type}
                onChange={(e) => setFormEntry({ ...formEntry, type: e.target.value as any })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="education">Education (Degree / College)</option>
                <option value="experience">Experience (Job / Internship / Project)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                Title / Degree *
              </label>
              <input
                type="text"
                required
                value={formEntry.title}
                onChange={(e) => setFormEntry({ ...formEntry, title: e.target.value })}
                placeholder="e.g. B.Sc Computer Science or Full-Stack Developer"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                Organization / Institution *
              </label>
              <input
                type="text"
                required
                value={formEntry.organization}
                onChange={(e) => setFormEntry({ ...formEntry, organization: e.target.value })}
                placeholder="e.g. SRM University AP"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                Location
              </label>
              <input
                type="text"
                value={formEntry.location}
                onChange={(e) => setFormEntry({ ...formEntry, location: e.target.value })}
                placeholder="Andhra Pradesh, India"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                Start Year / Date
              </label>
              <input
                type="text"
                value={formEntry.start_date}
                onChange={(e) => setFormEntry({ ...formEntry, start_date: e.target.value })}
                placeholder="2021"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                End Year / Date
              </label>
              <input
                type="text"
                value={formEntry.end_date}
                onChange={(e) => setFormEntry({ ...formEntry, end_date: e.target.value })}
                placeholder="2024 or Present"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              Description
            </label>
            <textarea
              rows={3}
              value={formEntry.description}
              onChange={(e) => setFormEntry({ ...formEntry, description: e.target.value })}
              placeholder="Key achievements, courses, or responsibilities..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              Skills / Tags (comma separated)
            </label>
            <input
              type="text"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="Data Structures, SQL, Algorithms, React"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Entry</span>
            </button>
          </div>
        </form>
      )}

      {/* Entries List */}
      <div className="space-y-4">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-xl shrink-0 ${
                  exp.type === 'education'
                    ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400'
                    : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                }`}
              >
                {exp.type === 'education' ? (
                  <GraduationCap className="w-6 h-6" />
                ) : (
                  <Briefcase className="w-6 h-6" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
                  <span className="uppercase text-indigo-600 font-bold">{exp.type}</span>
                  <span>•</span>
                  <span>
                    {exp.start_date} – {exp.end_date}
                  </span>
                  <span>•</span>
                  <span>{exp.location}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {exp.title}
                </h3>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">
                  {exp.organization}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
                  {exp.description}
                </p>

                {exp.skills_used && exp.skills_used.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {exp.skills_used.map((s) => (
                      <span
                        key={s}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => handleDelete(exp.id, exp.title)}
              className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors shrink-0"
              title="Delete Entry"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
