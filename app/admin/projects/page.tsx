'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Eye,
  Star,
  FolderGit2,
  Loader2,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import { DEFAULT_PROJECTS } from '@/lib/constants'
import { Project } from '@/lib/supabase/types'
import { toast } from 'sonner'

export default function AdminProjectsListPage() {
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadProjects() {
      if (!isSupabaseConfigured()) {
        setIsLoading(false)
        return
      }

      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('sort_order', { ascending: true })

        if (data && !error && data.length > 0) {
          setProjects(data)
        }
      } catch (err) {
        console.error('Error loading projects:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadProjects()
  }, [])

  const togglePublished = async (project: Project) => {
    const updated = !project.published
    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient()
        const { error } = await supabase
          .from('projects')
          .update({ published: updated })
          .eq('id', project.id)
        if (error) throw error
      }

      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, published: updated } : p))
      )
      toast.success(
        `Project "${project.title}" is now ${updated ? 'Published' : 'Draft (Hidden)'}.`
      )
    } catch (err: any) {
      toast.error(err.message || 'Failed to update status.')
    }
  }

  const toggleFeatured = async (project: Project) => {
    const updated = !project.featured
    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient()
        const { error } = await supabase
          .from('projects')
          .update({ featured: updated })
          .eq('id', project.id)
        if (error) throw error
      }

      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, featured: updated } : p))
      )
      toast.success(
        `Project "${project.title}" ${updated ? 'marked as Featured' : 'unmarked'}.`
      )
    } catch (err: any) {
      toast.error(err.message || 'Failed to update featured status.')
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return

    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient()
        const { error } = await supabase.from('projects').delete().eq('id', id)
        if (error) throw error
      }

      setProjects((prev) => prev.filter((p) => p.id !== id))
      toast.success(`Project "${title}" deleted.`)
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete project.')
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Projects Portfolio
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Showcase your best engineering work, update live links, and manage drafts.
          </p>
        </div>

        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all"
          >
            {/* Cover Image & Badges */}
            <div className="relative aspect-[16/9] bg-slate-100 dark:bg-slate-800">
              <img
                src={proj.cover_image}
                alt={proj.title}
                className="w-full h-full object-cover"
              />

              <div className="absolute top-3 left-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => togglePublished(proj)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-md transition-all ${
                    proj.published
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                  title="Click to toggle publish status"
                >
                  {proj.published ? (
                    <>
                      <CheckCircle className="w-3 h-3" />
                      <span>Live</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3" />
                      <span>Draft</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => toggleFeatured(proj)}
                  className={`p-1.5 rounded-full shadow-md transition-all ${
                    proj.featured
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-black/40 text-white/70 hover:text-white'
                  }`}
                  title="Toggle Featured"
                >
                  <Star className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 flex flex-col flex-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
                {proj.category}
              </span>
              <h2 className="font-bold text-slate-900 dark:text-white text-base mb-2 line-clamp-1">
                {proj.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                {proj.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4 mt-auto">
                {proj.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium"
                  >
                    {tag}
                  </span>
                ))}
                {proj.tags.length > 3 && (
                  <span className="text-[10px] px-1 text-slate-400 font-medium">
                    +{proj.tags.length - 3}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/projects/${proj.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </Link>

                  <Link
                    href={`/projects/${proj.slug}`}
                    target="_blank"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="View public page"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(proj.id, proj.title)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  title="Delete project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
