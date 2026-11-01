'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import { ADMIN_EMAIL } from '@/lib/constants'
import { Loader2, AlertCircle } from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(pathname !== '/admin/login')
  const [authorized, setAuthorized] = useState(pathname === '/admin/login')

  useEffect(() => {
    // If we are on the login page, never block or check auth
    if (pathname === '/admin/login') {
      setIsCheckingAuth(false)
      setAuthorized(true)
      return
    }

    async function checkAuth() {
      // If Supabase not configured with keys, allow local preview
      if (!isSupabaseConfigured()) {
        setAuthorized(true)
        setIsCheckingAuth(false)
        return
      }

      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          router.replace('/admin/login')
          return
        }

        if (user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
          await supabase.auth.signOut()
          router.replace('/admin/login')
          return
        }

        setAuthorized(true)
        setIsCheckingAuth(false)
      } catch (err) {
        console.error('Auth verification error:', err)
        router.replace('/admin/login')
        setIsCheckingAuth(false)
      }
    }

    checkAuth()
  }, [pathname, router])

  // If on login page, render children directly without sidebar or auth blocker
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <p className="text-sm font-medium text-slate-400">Verifying Admin Credentials...</p>
        </div>
      </div>
    )
  }

  if (!authorized) {
    return null
  }

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 shrink-0">
        <div className="fixed inset-y-0 left-0 w-64">
          <AdminSidebar />
        </div>
      </div>

      {/* Mobile Sidebar Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-10 w-64 max-w-[80vw]">
            <AdminSidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onMenuClick={() => setMobileSidebarOpen(true)} />

        {/* Development Mode Advisory Banner if Supabase not yet configured */}
        {!isSupabaseConfigured() && (
          <div className="mx-6 mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 flex items-start gap-3 text-xs">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Local Development Mode Active</p>
              <p className="mt-0.5 text-amber-700 dark:text-amber-400">
                Supabase keys are currently using placeholder defaults. To sync real-time changes to the cloud database, add your Supabase URL and Key in <code className="px-1 bg-amber-500/20 rounded">.env.local</code>.
              </p>
            </div>
          </div>
        )}

        <main className="flex-1 p-6 md:p-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
