'use client'

import React, { useState, useEffect } from 'react'
import {
  Plus,
  Trash2,
  Wrench,
  Loader2,
  FolderPlus,
  Save,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import { DEFAULT_CATEGORIES, DEFAULT_SKILLS } from '@/lib/constants'
import { Skill, SkillCategory } from '@/lib/supabase/types'
import { toast } from 'sonner'

export default function AdminSkillsPage() {
  const [categories, setCategories] = useState<SkillCategory[]>(DEFAULT_CATEGORIES)
  const [skills, setSkills] = useState<(Skill & { categoryName?: string })[]>(DEFAULT_SKILLS)
  const [isLoading, setIsLoading] = useState(true)

  // New category form state
  const [newCategoryName, setNewCategoryName] = useState('')

  // New skill form state
  const [newSkill, setNewSkill] = useState({
    name: '',
    category_id: DEFAULT_CATEGORIES[0]?.id || '',
    icon: 'Code2',
    proficiency: 90,
  })

  useEffect(() => {
    async function loadData() {
      if (!isSupabaseConfigured()) {
        setIsLoading(false)
        return
      }

      try {
        const supabase = createClient()
        const [catRes, skillRes] = await Promise.all([
          supabase.from('skill_categories').select('*').order('sort_order', { ascending: true }),
          supabase.from('skills').select('*, skill_categories(name)').order('sort_order', { ascending: true }),
        ])

        if (catRes.data && catRes.data.length > 0) {
          setCategories(catRes.data)
          if (!newSkill.category_id) {
            setNewSkill((prev) => ({ ...prev, category_id: catRes.data[0].id }))
          }
        }

        if (skillRes.data && skillRes.data.length > 0) {
          setSkills(
            skillRes.data.map((item: any) => ({
              ...item,
              categoryName: item.skill_categories?.name || 'General',
            }))
          )
        }
      } catch (err) {
        console.error('Error loading skills:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCategoryName.trim()) return

    const newCat: SkillCategory = {
      id: isSupabaseConfigured() ? crypto.randomUUID() : `cat-${Date.now()}`,
      name: newCategoryName.trim(),
      sort_order: categories.length + 1,
    }

    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient()
        const { error } = await supabase.from('skill_categories').insert([newCat])
        if (error) throw error
      }

      setCategories((prev) => [...prev, newCat])
      setNewCategoryName('')
      toast.success(`Category "${newCat.name}" added successfully!`)
    } catch (err: any) {
      toast.error(err.message || 'Failed to add category.')
    }
  }

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}" and all its skills?`)) return

    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient()
        const { error } = await supabase.from('skill_categories').delete().eq('id', id)
        if (error) throw error
      }

      setCategories((prev) => prev.filter((c) => c.id !== id))
      setSkills((prev) => prev.filter((s) => s.category_id !== id))
      toast.success(`Category "${name}" removed.`)
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete category.')
    }
  }

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSkill.name.trim() || !newSkill.category_id) {
      toast.error('Please enter a skill name and select a category.')
      return
    }

    const catObj = categories.find((c) => c.id === newSkill.category_id)
    const createdSkill = {
      id: isSupabaseConfigured() ? crypto.randomUUID() : `sk-${Date.now()}`,
      name: newSkill.name.trim(),
      category_id: newSkill.category_id,
      icon: newSkill.icon,
      proficiency: Number(newSkill.proficiency),
      sort_order: skills.length + 1,
      categoryName: catObj?.name || 'General',
    }

    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient()
        const { error } = await supabase.from('skills').insert([
          {
            id: createdSkill.id,
            name: createdSkill.name,
            category_id: createdSkill.category_id,
            icon: createdSkill.icon,
            proficiency: createdSkill.proficiency,
            sort_order: createdSkill.sort_order,
          },
        ])
        if (error) throw error
      }

      setSkills((prev) => [...prev, createdSkill])
      setNewSkill((prev) => ({ ...prev, name: '', proficiency: 90 }))
      toast.success(`Skill "${createdSkill.name}" added!`)
    } catch (err: any) {
      toast.error(err.message || 'Failed to add skill.')
    }
  }

  const handleDeleteSkill = async (id: string, name: string) => {
    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient()
        const { error } = await supabase.from('skills').delete().eq('id', id)
        if (error) throw error
      }

      setSkills((prev) => prev.filter((s) => s.id !== id))
      toast.success(`Skill "${name}" removed.`)
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete skill.')
    }
  }

  const iconOptions = [
    { label: 'React / Atom', value: 'Atom' },
    { label: 'Code / HTML', value: 'Code2' },
    { label: 'File / JS', value: 'FileCode' },
    { label: 'Server / Node', value: 'Server' },
    { label: 'CPU / Express', value: 'Cpu' },
    { label: 'Database / MongoDB', value: 'Database' },
    { label: 'HardDrive / SQL', value: 'HardDrive' },
    { label: 'Git / Version Control', value: 'GitBranch' },
    { label: 'Design / Tailwind', value: 'Palette' },
    { label: 'Network / API', value: 'Network' },
    { label: 'Check / Testing', value: 'CheckCircle2' },
    { label: 'Terminal / CLI', value: 'Terminal' },
  ]

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
          Skills & Categories Manager
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Organize your technical capabilities into categories, set proficiency levels, and assign icons.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Add Forms */}
        <div className="lg:col-span-5 space-y-6">
          {/* Add Skill Form */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-500" />
              <span>Add New Skill</span>
            </h2>

            <form onSubmit={handleAddSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Skill Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next.js, Docker, Python"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Category *
                </label>
                <select
                  value={newSkill.category_id}
                  onChange={(e) => setNewSkill({ ...newSkill, category_id: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Icon
                </label>
                <select
                  value={newSkill.icon}
                  onChange={(e) => setNewSkill({ ...newSkill, icon: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {iconOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <label className="font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Proficiency
                  </label>
                  <span className="font-bold text-indigo-600">{newSkill.proficiency}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  step="5"
                  value={newSkill.proficiency}
                  onChange={(e) => setNewSkill({ ...newSkill, proficiency: Number(e.target.value) })}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors"
              >
                Add Skill
              </button>
            </form>
          </div>

          {/* Add Category Form */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FolderPlus className="w-4 h-4 text-purple-500" />
              <span>Create New Category</span>
            </h2>

            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cloud & DevOps"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-colors"
              >
                Add Category
              </button>
            </form>
          </div>
        </div>

        {/* Right: Existing Categories & Skills List */}
        <div className="lg:col-span-7 space-y-6">
          {categories.map((cat) => {
            const catSkills = skills.filter((s) => s.category_id === cat.id)
            return (
              <div
                key={cat.id}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
              >
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {cat.name}
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold">
                      {catSkills.length}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteCategory(cat.id, cat.name)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {catSkills.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-2">
                    No skills in this category yet. Add one using the form on the left.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {catSkills.map((sk) => (
                      <div
                        key={sk.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700"
                      >
                        <div>
                          <p className="font-bold text-sm text-slate-800 dark:text-slate-100">
                            {sk.name}
                          </p>
                          <span className="text-[11px] text-indigo-500 font-semibold">
                            {sk.proficiency}% proficiency
                          </span>
                        </div>

                        <button
                          onClick={() => handleDeleteSkill(sk.id, sk.name)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                          title="Remove Skill"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
