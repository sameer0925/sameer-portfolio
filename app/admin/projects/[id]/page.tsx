import React from 'react'
import { notFound } from 'next/navigation'
import { ProjectForm } from '@/components/admin/ProjectForm'
import { createClientServer } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/client'
import { DEFAULT_PROJECTS } from '@/lib/constants'
import { Project } from '@/lib/supabase/types'

interface EditProjectPageProps {
  params: {
    id: string
  }
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  let project: Project | null = null

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClientServer()
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', params.id)
        .single()

      if (data && !error) {
        project = data
      }
    } catch {
      // Fallback
    }
  }

  if (!project) {
    project = DEFAULT_PROJECTS.find((p) => p.id === params.id) || null
  }

  if (!project) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
          Edit Project: {project.title}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Modify details, replace screenshots, update code repository links or toggle publication.
        </p>
      </div>

      <ProjectForm initialData={project} isNew={false} />
    </div>
  )
}
