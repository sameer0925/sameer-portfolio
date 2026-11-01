import { NextResponse } from 'next/server'
import { createClientServer } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/client'
import { ADMIN_EMAIL } from '@/lib/constants'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folder = (formData.get('folder') as string) || 'uploads'

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 })
    }

    if (isSupabaseConfigured()) {
      const supabase = await createClientServer()

      // Check auth - Only ADMIN_EMAIL can upload
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || user.email !== ADMIN_EMAIL) {
        return NextResponse.json(
          { error: 'Unauthorized. Only the owner can upload files.' },
          { status: 403 }
        )
      }

      const fileExt = file.name.split('.').pop()
      const cleanFileName = file.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-zA-Z0-9_-]/g, "_")
      const uniqueKey = `${folder}/${Date.now()}_${cleanFileName}.${fileExt}`

      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const { data, error } = await supabase.storage
        .from('portfolio-assets')
        .upload(uniqueKey, buffer, {
          contentType: file.type,
          upsert: true,
        })

      if (error) {
        console.error('Upload error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      const { data: publicUrlData } = supabase.storage
        .from('portfolio-assets')
        .getPublicUrl(data.path)

      return NextResponse.json({
        url: publicUrlData.publicUrl,
        name: file.name,
      })
    }

    // Fallback when Supabase is not yet connected
    return NextResponse.json({
      url: `https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80`,
      name: file.name,
      note: 'Supabase storage is pending configuration. Placeholder URL returned.',
    })
  } catch (err: any) {
    console.error('File Upload Error:', err)
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
