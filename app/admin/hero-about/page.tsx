'use client'

import React, { useState, useEffect } from 'react'
import { Save, Loader2, User, FileText, Sparkles, MapPin, Mail, Phone } from 'lucide-react'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import { DEFAULT_PROFILE } from '@/lib/constants'
import { PortfolioProfile } from '@/lib/supabase/types'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { toast } from 'sonner'

export default function AdminHeroAboutPage() {
  const [profile, setProfile] = useState<PortfolioProfile>(DEFAULT_PROFILE)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadProfile() {
      if (!isSupabaseConfigured()) {
        setIsLoading(false)
        return
      }

      try {
        const supabase = createClient()
        const { data, error } = await supabase.from('portfolio_profile').select('*').limit(1).single()
        if (data && !error) {
          setProfile(data)
        }
      } catch (err) {
        console.error('Error loading profile:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient()
        const { error } = await supabase
          .from('portfolio_profile')
          .upsert({
            ...profile,
            updated_at: new Date().toISOString(),
          })

        if (error) throw error
      }

      toast.success('Hero & About details saved successfully!')
    } catch (err: any) {
      toast.error(err.message || 'Failed to save profile.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Hero & About Configuration
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Edit your personal introduction, hero tagline, avatar photo, bio description, and resume PDF document.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Hero Section Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-500" />
              <span>Hero Introduction Details</span>
            </h2>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <input
                type="checkbox"
                checked={profile.available_for_work}
                onChange={(e) => setProfile({ ...profile, available_for_work: e.target.checked })}
                className="rounded text-indigo-600"
              />
              <span>Available for Work Badge</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                Professional Title
              </label>
              <input
                type="text"
                required
                value={profile.title}
                onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              Hero Tagline / Subtitle
            </label>
            <input
              type="text"
              required
              value={profile.tagline}
              onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Profile Photo Uploader */}
          <div>
            <ImageUploader
              label="Profile Avatar Photo"
              currentUrl={profile.avatar_url}
              folder="profile"
              onUploadComplete={(url) => setProfile({ ...profile, avatar_url: url })}
              onRemove={() => setProfile({ ...profile, avatar_url: '' })}
            />
          </div>

          {/* Hero Buttons Customization */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                Primary Button Text & Link
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  value={profile.hero_cta_primary_text}
                  onChange={(e) => setProfile({ ...profile, hero_cta_primary_text: e.target.value })}
                  placeholder="View Projects"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
                <input
                  type="text"
                  value={profile.hero_cta_primary_link}
                  onChange={(e) => setProfile({ ...profile, hero_cta_primary_link: e.target.value })}
                  placeholder="#projects"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                Secondary Button Text & Link
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  value={profile.hero_cta_secondary_text}
                  onChange={(e) => setProfile({ ...profile, hero_cta_secondary_text: e.target.value })}
                  placeholder="Contact Me"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
                <input
                  type="text"
                  value={profile.hero_cta_secondary_link}
                  onChange={(e) => setProfile({ ...profile, hero_cta_secondary_link: e.target.value })}
                  placeholder="#contact"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* About & Resume Section */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-500" />
            <span>About Bio & Resume Document</span>
          </h2>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              Full Biography (Supports paragraphs)
            </label>
            <textarea
              rows={6}
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
            />
          </div>

          {/* Resume PDF Uploader */}
          <div>
            <ImageUploader
              label="Resume PDF Document (Downloadable by visitors)"
              currentUrl={profile.resume_url}
              accept=".pdf"
              folder="resume"
              isPdf={true}
              onUploadComplete={(url) => setProfile({ ...profile, resume_url: url })}
              onRemove={() => setProfile({ ...profile, resume_url: '' })}
            />
          </div>

          {/* Location & Contact Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                Location Display
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  placeholder="Andhra Pradesh, India"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                Public Contact Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  placeholder="shaiksameer092526@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Save Action */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Profile Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
