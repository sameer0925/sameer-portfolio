import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Calendar,
  Layers,
  CheckCircle2,
} from 'lucide-react'
import { getProjectBySlug, getProjects, getSiteSettings, getPortfolioProfile, getSocialLinks } from '@/lib/data'
import { Navbar } from '@/components/public/Navbar'
import { Footer } from '@/components/public/Footer'
import { formatDate } from '@/lib/utils'

interface ProjectPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug)
  if (!project) return { title: 'Project Not Found' }

  return {
    title: `${project.title} | Sameer Shaik Portfolio`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: [{ url: project.cover_image }],
    },
  }
}

export async function generateStaticParams() {
  const projects = await getProjects(false)
  return projects.map((p) => ({
    slug: p.slug,
  }))
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const project = await getProjectBySlug(params.slug)
  if (!project) {
    notFound()
  }

  const [settings, profile, socialLinks] = await Promise.all([
    getSiteSettings(),
    getPortfolioProfile(),
    getSocialLinks(),
  ])

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors">
      <Navbar settings={settings} profile={profile} />

      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Back link */}
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 mb-8 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to all projects</span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3">
              <span className="px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60">
                {project.category}
              </span>
              {project.created_at && (
                <span className="flex items-center gap-1 text-slate-400 font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(project.created_at)}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
              {project.title}
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Links & CTA Bar */}
          <div className="flex flex-wrap items-center gap-4 py-4 border-y border-slate-200 dark:border-slate-800 mb-10">
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md transition-transform active:scale-95"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Live Demo</span>
              </a>
            )}

            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-sm transition-transform active:scale-95"
              >
                <Github className="w-4 h-4" />
                <span>Source Code</span>
              </a>
            )}
          </div>

          {/* Hero Cover Image */}
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl mb-12 bg-slate-100 dark:bg-slate-900">
            <img
              src={project.cover_image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content & Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Main Content */}
            <div className="lg:col-span-8 prose prose-slate dark:prose-invert max-w-none">
              <div className="whitespace-pre-line text-slate-700 dark:text-slate-300 leading-relaxed text-base sm:text-lg">
                {project.content}
              </div>

              {/* Screenshots Gallery */}
              {project.screenshots && project.screenshots.length > 0 && (
                <div className="mt-12 not-prose">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                    Project Gallery
                  </h3>
                  <div className="grid grid-cols-1 gap-6">
                    {project.screenshots.map((imgUrl, i) => (
                      <div
                        key={i}
                        className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md aspect-[16/9] bg-slate-100 dark:bg-slate-900"
                      >
                        <img
                          src={imgUrl}
                          alt={`${project.title} screenshot ${i + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Meta */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-500" />
                  Technologies Used
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs font-semibold rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600 shadow-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                  Interested in this architecture?
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                  I can build similar production applications with clean modular code and robust backend integration.
                </p>
                <Link
                  href="/#contact"
                  className="inline-flex items-center justify-center w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors"
                >
                  Contact Sameer
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer settings={settings} profile={profile} socialLinks={socialLinks} />
    </div>
  )
}
