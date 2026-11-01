import { NextResponse } from 'next/server'
import { createClientServer } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/client'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      )
    }

    if (isSupabaseConfigured()) {
      const supabase = await createClientServer()
      const { error } = await supabase.from('contact_messages').insert([
        {
          name,
          email,
          subject: subject || 'New Portfolio Inquiry',
          message,
        },
      ])

      if (error) {
        console.error('Supabase contact insert error:', error)
        return NextResponse.json(
          { error: 'Failed to record message in database.' },
          { status: 500 }
        )
      }
    } else {
      console.log('Mock Contact Form Submission (Supabase not connected yet):', {
        name,
        email,
        subject,
        message,
        date: new Date().toISOString(),
      })
    }

    return NextResponse.json(
      { success: true, message: 'Message received successfully!' },
      { status: 200 }
    )
  } catch (err: any) {
    console.error('Contact API Error:', err)
    return NextResponse.json(
      { error: err.message || 'Internal server error.' },
      { status: 500 }
    )
  }
}
