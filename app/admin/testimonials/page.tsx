'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Trash2, Sparkles, Quote, Save, Loader2, CheckCircle, XCircle } from 'lucide-react'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import { DEFAULT_TESTIMONIALS } from '@/lib/constants'
import { Testimonial } from '@/lib/supabase/types'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { toast } from 'sonner'

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(DEFAULT_TESTIMONIALS)
  const [isAdding, setIsAdding] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [newTestimonial, setNewTestimonial] = useState<Partial<Testimonial>>({
    name: '',
    role: '',
    company: '',
    avatar_url: '',
    content: '',
    published: true,
  })

  useEffect(() => {
    async function loadTestimonials() {
      if (!isSupabaseConfigured()) return

      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .order('sort_order', { ascending: true })

        if (data && !error && data.length > 0) {
          setTestimonials(data)
        }
      } catch (err) {
        console.error('Error loading testimonials:', err)
      }
    }

    loadTestimonials()
  }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTestimonial.name || !newTestimonial.content) {
      toast.error('Please enter a name and testimonial content.')
      return
    }

    setIsSaving(true)
    const item: Testimonial = {
      id: isSupabaseConfigured() ? crypto.randomUUID() : `test-${Date.now()}`,
      name: newTestimonial.name!,
      role: newTestimonial.role || 'Collaborator',
      company: newTestimonial.company || '',
      avatar_url:
        newTestimonial.avatar_url ||
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      content: newTestimonial.content!,
      published: newTestimonial.published ?? true,
      sort_order: testimonials.length + 1,
    }

    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient()
        const { error } = await supabase.from('testimonials').insert([item])
        if (error) throw error
      }

      setTestimonials((prev) => [...prev, item])
      setIsAdding(false)
      setNewTestimonial({
        name: '',
        role: '',
        company: '',
        avatar_url: '',
        content: '',
        published: true,
      })
      toast.success(`Testimonial from "${item.name}" added!`)
    } catch (err: any) {
      toast.error(err.message || 'Failed to add testimonial.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete recommendation from "${name}"?`)) return

    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient()
        const { error } = await supabase.from('testimonials').delete().eq('id', id)
        if (error) throw error
      }

      setTestimonials((prev) => prev.filter((t) => t.id !== id))
      toast.success(`Removed testimonial.`)
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete.')
    }
  }

  const togglePublished = async (item: Testimonial) => {
    const updated = !item.published
    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient()
        const { error } = await supabase
          .from('testimonials')
          .update({ published: updated })
          .eq('id', item.id)
        if (error) throw error
      }

      setTestimonials((prev) =>
        prev.map((t) => (t.id === item.id ? { ...t, published: updated } : t))
      )
      toast.success(`Testimonial is now ${updated ? 'Published' : 'Hidden'}.`)
    } catch (err: any) {
      toast.error(err.message || 'Failed to toggle status.')
    }
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Testimonials & Recommendations
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Showcase endorsements, peer feedback, and mentor quotes on your website.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? 'Cancel' : 'Add Testimonial'}</span>
        </button>
      </div>

      {isAdding && (
        <form
          onSubmit={handleAdd}
          className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6"
        >
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            New Recommendation Entry
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                Person Name *
              </label>
              <input
                type="text"
                required
                value={newTestimonial.name}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                placeholder="Dr. Rajesh Kumar"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                Role / Title
              </label>
              <input
                type="text"
                value={newTestimonial.role}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, role: e.target.value })}
                placeholder="Professor of CS"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                Organization / College
              </label>
              <input
                type="text"
                value={newTestimonial.company}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, company: e.target.value })}
                placeholder="SRM University AP"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <ImageUploader
              label="Avatar Photo"
              currentUrl={newTestimonial.avatar_url}
              folder="testimonials"
              onUploadComplete={(url) => setNewTestimonial({ ...newTestimonial, avatar_url: url })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              Feedback / Endorsement *
            </label>
            <textarea
              required
              rows={4}
              value={newTestimonial.content}
              onChange={(e) => setNewTestimonial({ ...newTestimonial, content: e.target.value })}
              placeholder="What they said about your engineering ability, problem-solving, or collaboration..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
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
              <span>Save Testimonial</span>
            </button>
          </div>
        </form>
      )}

      {/* Testimonials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <Quote className="w-6 h-6 text-indigo-500" />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePublished(t)}
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      t.published
                        ? 'bg-emerald-500/10 text-emerald-600'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                    }`}
                  >
                    {t.published ? 'Live' : 'Hidden'}
                  </button>
                  <button
                    onClick={() => handleDelete(t.id, t.name)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 italic mb-6 leading-relaxed">
                &ldquo;{t.content}&rdquo;
              </p>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <img
                src={t.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80'}
                alt={t.name}
                className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
              />
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-white">
                  {t.name}
                </p>
                <p className="text-[11px] text-slate-400">
                  {t.role} {t.company && `• ${t.company}`}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
