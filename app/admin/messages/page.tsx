'use client'

import React, { useState, useEffect } from 'react'
import {
  Mail,
  MailOpen,
  Trash2,
  Reply,
  Calendar,
  User,
  Clock,
  Loader2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import { ContactMessage } from '@/lib/supabase/types'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)

  useEffect(() => {
    async function loadMessages() {
      if (!isSupabaseConfigured()) {
        // Fallback sample inquiries for preview
        setMessages([
          {
            id: 'msg-sample-1',
            name: 'Priya Sharma',
            email: 'priya.sharma@techstart.io',
            subject: 'Excited to discuss a Full-Stack Engineer role',
            message:
              'Hi Sameer, I came across your portfolio and was impressed by your projects built with React, Node.js, and SQL. We are looking for a skilled developer to join our engineering team. Would you be open for a quick call this week?',
            is_read: false,
            created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
          },
          {
            id: 'msg-sample-2',
            name: 'Alex Turner',
            email: 'alex@cloudventures.co',
            subject: 'Contract Collaboration: SaaS Dashboard',
            message:
              'Hello Sameer, We have an upcoming MERN stack project requiring performant database queries and responsive UI components. Loved DevSphere. Let us know your availability.',
            is_read: true,
            created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
          },
        ])
        setIsLoading(false)
        return
      }

      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('contact_messages')
          .select('*')
          .order('created_at', { ascending: false })

        if (data && !error) {
          setMessages(data)
        }
      } catch (err) {
        console.error('Error fetching messages:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadMessages()
  }, [])

  const toggleReadStatus = async (msg: ContactMessage) => {
    const updatedStatus = !msg.is_read
    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient()
        const { error } = await supabase
          .from('contact_messages')
          .update({ is_read: updatedStatus })
          .eq('id', msg.id)
        if (error) throw error
      }

      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, is_read: updatedStatus } : m))
      )
      if (selectedMessage?.id === msg.id) {
        setSelectedMessage({ ...selectedMessage, is_read: updatedStatus })
      }
      toast.success(updatedStatus ? 'Marked as read.' : 'Marked as unread.')
    } catch (err: any) {
      toast.error(err.message || 'Failed to update status.')
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete message from ${name}?`)) return

    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient()
        const { error } = await supabase.from('contact_messages').delete().eq('id', id)
        if (error) throw error
      }

      setMessages((prev) => prev.filter((m) => m.id !== id))
      if (selectedMessage?.id === id) {
        setSelectedMessage(null)
      }
      toast.success('Message deleted.')
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete message.')
    }
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
          Contact Messages Inbox
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Inquiries sent through the public contact form are securely saved to your Supabase database.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Messages List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Messages ({messages.length})
            </span>
            <span className="text-xs font-semibold text-indigo-500">
              {messages.filter((m) => !m.is_read).length} Unread
            </span>
          </div>

          {messages.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <Mail className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                No messages yet
              </p>
              <p className="text-xs text-slate-400 mt-1">
                When visitors submit the contact form, their notes will arrive here.
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => {
                  setSelectedMessage(msg)
                  if (!msg.is_read) toggleReadStatus(msg)
                }}
                className={`cursor-pointer p-4 rounded-xl border transition-all ${
                  selectedMessage?.id === msg.id
                    ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30'
                    : msg.is_read
                    ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                    : 'border-indigo-300 dark:border-indigo-700 bg-indigo-50/20 dark:bg-indigo-950/20 font-semibold'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[160px]">
                    {msg.name}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(msg.created_at)}
                  </span>
                </div>

                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold truncate mb-1">
                  {msg.subject || 'Portfolio Inquiry'}
                </p>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {msg.message}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Message Viewer Pane */}
        <div className="lg:col-span-7">
          {selectedMessage ? (
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-start justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {selectedMessage.subject || 'Portfolio Inquiry'}
                  </h2>
                  <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      From: {selectedMessage.name}
                    </span>
                    <span>&bull;</span>
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      {selectedMessage.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleReadStatus(selectedMessage)}
                    className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title={selectedMessage.is_read ? 'Mark Unread' : 'Mark Read'}
                  >
                    {selectedMessage.is_read ? (
                      <MailOpen className="w-4 h-4" />
                    ) : (
                      <Mail className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(selectedMessage.id, selectedMessage.name)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    title="Delete Message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Message Content */}
              <div className="whitespace-pre-line text-sm text-slate-700 dark:text-slate-200 leading-relaxed min-h-[160px]">
                {selectedMessage.message}
              </div>

              {/* Reply Button */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                    selectedMessage.subject || 'Portfolio Inquiry'
                  )}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-transform active:scale-95"
                >
                  <Reply className="w-4 h-4" />
                  <span>Reply via Email Client</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400">
              <MailOpen className="w-10 h-10 text-slate-300 dark:text-slate-700 mb-3" />
              <p className="text-sm font-semibold">Select a message from the left to read</p>
              <p className="text-xs mt-1">Inquiries remain safely stored in your database.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
