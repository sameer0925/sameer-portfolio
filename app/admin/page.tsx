'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  FolderGit2,
  Wrench,
  Mail,
  Sliders,
  User,
  ArrowRight,
  Eye,
  CheckCircle,
  Clock,
  Sparkles,
} from 'lucide-react'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import {
  DEFAULT_PROJECTS,
  DEFAULT_SKILLS,
  DEFAULT_SITE_SETTINGS,
  DEFAULT_PROFILE,
} from '@/lib/constants'
import { SiteSettings } from '@/lib/supabase/types'
import { toast } from 'sonner'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    projectsCount: DEFAULT_PROJECTS.length,
    skillsCount: DEFAULT_SKILLS.length,
    messagesCount: 0,
    publishedCount: DEFAULT_PROJECTS.filter((p) => p.published).length,
  })
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS)
  const [recentMessages, setRecentMessages] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      if (!isSupabaseConfigured()) {
        setIsLoading(false)
        return
      }

      try {
        const supabase = createClient()

        const [projRes, skillRes, msgRes, setRes] = await Promise.all([
          supabase.from('projects').select('id, published'),
          supabase.from('skills').select('id'),
          supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(5),
          supabase.from('site_settings').select('*').limit(1).single(),
        ])

        if (projRes.data) {
          setStats((prev) => ({
            ...prev,
            projectsCount: projRes.data.length,
            publishedCount: projRes.data.filter((p: any) => p.published).length,
          }))
        }

        if (skillRes.data) {
          setStats((prev) => ({ ...prev, skillsCount: skillRes.data.length }))
        }

        if (msgRes.data) {
          setStats((prev) => ({ ...prev, messagesCount: msgRes.data.length }))
          setRecentMessages(msgRes.data)
        }

        if (setRes.data) {
          setSettings(setRes.data)
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const statCards = [
    {
      label: 'Total Projects',
      value: stats.projectsCount,
      sub: `${stats.publishedCount} Published Live`,
      icon: FolderGit2,
      color: 'text-indigo-500 bg-indigo-500/10',
      href: '/admin/projects',
    },
    {
      label: 'Skills Listed',
      value: stats.skillsCount,
      sub: 'Categorized Technical Arsenal',
      icon: Wrench,
      color: 'text-purple-500 bg-purple-500/10',
      href: '/admin/skills',
    },
    {
      label: 'Contact Inquiries',
      value: stats.messagesCount,
      sub: 'Visitor inquiries in DB',
      icon: Mail,
      color: 'text-emerald-500 bg-emerald-500/10',
      href: '/admin/messages',
    },
    {
      label: 'Site Customization',
      value: 'Active',
      sub: 'Logo, Colors & Visibility',
      icon: Sliders,
      color: 'text-amber-500 bg-amber-500/10',
      href: '/admin/settings',
    },
  ]

  const quickLinks = [
    { title: 'Brand & Site Settings', desc: 'Change logo, favicon, accent colors & font', href: '/admin/settings', icon: Sliders },
    { title: 'Hero & About Bio', desc: 'Update profile photo, resume PDF, and tagline', href: '/admin/hero-about', icon: User },
    { title: 'Manage Projects', desc: 'Add new project, edit screenshots & links', href: '/admin/projects', icon: FolderGit2 },
    { title: 'Manage Skills', desc: 'Add tech skills & reorder categories', href: '/admin/skills', icon: Wrench },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-8 rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-sm mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Owner Control Center</span>
          </span>
          <h1 className="text-3xl font-black tracking-tight">
            Welcome back, Sameer!
          </h1>
          <p className="text-sm text-indigo-100 mt-1 max-w-xl">
            You have full control over every pixel and word of your portfolio. Changes made here update the public site instantly.
          </p>
        </div>

        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-indigo-900 font-bold text-xs shadow-md hover:bg-indigo-50 transition-colors"
        >
          <Eye className="w-4 h-4" />
          <span>View Live Site</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon
          return (
            <Link
              key={idx}
              href={card.href}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-500/50 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {card.label}
                </span>
                <div className={`p-2.5 rounded-xl ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900 dark:text-white">
                {card.value}
              </p>
              <p className="text-xs text-slate-400 mt-1 font-medium">
                {card.sub}
              </p>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
          Quick Management Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickLinks.map((ql, idx) => {
            const Icon = ql.icon
            return (
              <Link
                key={idx}
                href={ql.href}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 shadow-sm transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {ql.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {ql.desc}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
              </Link>
            )
          })}
        </div>
      </div>

      {/* Section Visibility Summary */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Public Sections Status
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Control which sections appear on your homepage
            </p>
          </div>
          <Link
            href="/admin/settings"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Configure Toggles &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {Object.entries(settings.sections_visibility || {}).map(([sec, isVisible]) => (
            <div
              key={sec}
              className={`p-3 rounded-xl border text-center text-xs font-semibold capitalize ${
                isVisible
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
                  : 'bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-400 line-through'
              }`}
            >
              {sec}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
