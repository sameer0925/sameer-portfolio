'use client'

import React, { useState, useEffect } from 'react'
import { Save, Loader2, Sliders, Palette, Type, ToggleLeft, ToggleRight, Sparkles } from 'lucide-react'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import { DEFAULT_SITE_SETTINGS } from '@/lib/constants'
import { SiteSettings } from '@/lib/supabase/types'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { toast } from 'sonner'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadSettings() {
      if (!isSupabaseConfigured()) {
        setIsLoading(false)
        return
      }

      try {
        const supabase = createClient()
        const { data, error } = await supabase.from('site_settings').select('*').limit(1).single()
        if (data && !error) {
          setSettings(data)
        }
      } catch (err) {
        console.error('Error loading settings:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient()
        const { error } = await supabase
          .from('site_settings')
          .upsert({
            ...settings,
            updated_at: new Date().toISOString(),
          })

        if (error) throw error
      }

      toast.success('Site settings saved successfully!')
    } catch (err: any) {
      toast.error(err.message || 'Failed to save settings.')
    } finally {
      setIsSaving(false)
    }
  }

  const toggleSection = (sectionKey: keyof typeof settings.sections_visibility) => {
    setSettings((prev) => ({
      ...prev,
      sections_visibility: {
        ...prev.sections_visibility,
        [sectionKey]: !prev.sections_visibility[sectionKey],
      },
    }))
  }

  const accentColors = [
    { name: 'Indigo (Default)', value: 'indigo', bg: 'bg-indigo-600' },
    { name: 'Emerald Green', value: 'emerald', bg: 'bg-emerald-600' },
    { name: 'Violet Purple', value: 'violet', bg: 'bg-violet-600' },
    { name: 'Cyan Blue', value: 'cyan', bg: 'bg-cyan-600' },
    { name: 'Rose Red', value: 'rose', bg: 'bg-rose-600' },
    { name: 'Amber Gold', value: 'amber', bg: 'bg-amber-600' },
  ]

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Site Settings & Branding
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Customize branding, logos, accent colors, and manage which sections are visible to visitors.
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
        {/* General Meta Information */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-500" />
            <span>General & SEO Metadata</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                Site Title (Browser Tab)
              </label>
              <input
                type="text"
                value={settings.site_title}
                onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                Accent Theme Color
              </label>
              <select
                value={settings.accent_color}
                onChange={(e) => setSettings({ ...settings, accent_color: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {accentColors.map((color) => (
                  <option key={color.value} value={color.value}>
                    {color.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              Site Meta Description (SEO)
            </label>
            <textarea
              rows={3}
              value={settings.site_description}
              onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>
        </div>

        {/* Logo & Favicon Customization */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Palette className="w-4 h-4 text-indigo-500" />
            <span>Brand Logo & Favicon</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                Logo Display Style
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                  <input
                    type="radio"
                    name="logo_type"
                    checked={settings.logo_type === 'text'}
                    onChange={() => setSettings({ ...settings, logo_type: 'text' })}
                    className="text-indigo-600"
                  />
                  <span>Text Logo (e.g. Sameer.dev)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                  <input
                    type="radio"
                    name="logo_type"
                    checked={settings.logo_type === 'image'}
                    onChange={() => setSettings({ ...settings, logo_type: 'image' })}
                    className="text-indigo-600"
                  />
                  <span>Image Logo</span>
                </label>
              </div>
            </div>

            {settings.logo_type === 'text' ? (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  Logo Text
                </label>
                <input
                  type="text"
                  value={settings.logo_text}
                  onChange={(e) => setSettings({ ...settings, logo_text: e.target.value })}
                  placeholder="Sameer.dev"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            ) : (
              <div>
                <ImageUploader
                  label="Upload Logo Image"
                  currentUrl={settings.logo_image_url}
                  folder="branding"
                  onUploadComplete={(url) => setSettings({ ...settings, logo_image_url: url })}
                  onRemove={() => setSettings({ ...settings, logo_image_url: '' })}
                />
              </div>
            )}
          </div>
        </div>

        {/* Section Visibility Toggles */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ToggleRight className="w-4 h-4 text-indigo-500" />
              <span>Section Visibility Toggles</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Easily turn any section on or off on your portfolio without touching code.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(settings.sections_visibility || {}).map(([sec, isVisible]) => (
              <div
                key={sec}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60"
              >
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white capitalize">
                    {sec} Section
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isVisible ? 'Visible to public' : 'Hidden from public'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => toggleSection(sec as any)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                    isVisible ? 'bg-indigo-600 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-white shadow-md transform transition-transform" />
                </button>
              </div>
            ))}
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
                <span>Save All Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
