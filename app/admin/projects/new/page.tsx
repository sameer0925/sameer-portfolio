import React from 'react'
import { ProjectForm } from '@/components/admin/ProjectForm'

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
          Create New Project
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Add a new application, upload screenshots, specify tech stack tags, and publish it live.
        </p>
      </div>

      <ProjectForm isNew={true} />
    </div>
  )
}
