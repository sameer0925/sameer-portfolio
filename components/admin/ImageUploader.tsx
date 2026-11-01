'use client'

import React, { useState, useRef } from 'react'
import { UploadCloud, CheckCircle2, Loader2, X, FileText } from 'lucide-react'
import { compressImage } from '@/lib/utils'
import { toast } from 'sonner'

interface ImageUploaderProps {
  label: string
  currentUrl?: string
  accept?: string
  folder?: string
  onUploadComplete: (url: string) => void
  onRemove?: () => void
  isPdf?: boolean
}

export function ImageUploader({
  label,
  currentUrl,
  accept = 'image/*',
  folder = 'uploads',
  onUploadComplete,
  onRemove,
  isPdf = false,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | undefined>(currentUrl)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    try {
      setIsUploading(true)

      let fileToUpload = file
      if (!isPdf && file.type.startsWith('image/')) {
        // Automatic high-efficiency client-side compression
        fileToUpload = await compressImage(file, 1600, 1600, 0.85)
      }

      const formData = new FormData()
      formData.append('file', fileToUpload)
      formData.append('folder', folder)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (res.ok && data.url) {
        setPreview(data.url)
        onUploadComplete(data.url)
        toast.success(`${file.name} uploaded successfully!`)
      } else {
        toast.error(data.error || 'Failed to upload file.')
      }
    } catch (err: any) {
      toast.error(err.message || 'Error uploading file.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
        {label}
      </label>

      {preview && !isPdf ? (
        <div className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 aspect-[16/9] max-h-56 bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
          <img
            src={preview}
            alt="Upload preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-white/90 text-slate-900 text-xs font-semibold hover:bg-white transition-colors"
            >
              Replace
            </button>
            {onRemove && (
              <button
                type="button"
                onClick={() => {
                  setPreview(undefined)
                  onRemove()
                }}
                className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : preview && isPdf ? (
        <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                PDF Document Attached
              </p>
              <a
                href={preview}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                View uploaded document &rarr;
              </a>
            </div>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            Replace PDF
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer p-6 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center transition-all ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20'
              : 'border-slate-200 dark:border-slate-700 hover:border-indigo-400 bg-slate-50/50 dark:bg-slate-900/50'
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center py-4">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-2" />
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Compressing & Uploading...
              </p>
            </div>
          ) : (
            <>
              <div className="p-3 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Click to browse or drag and drop
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {isPdf ? 'PDF document (max 10MB)' : 'PNG, JPG, WebP (auto-compressed)'}
              </p>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
    </div>
  )
}
