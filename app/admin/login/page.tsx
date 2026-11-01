'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Lock, Mail, ArrowRight, Loader2, AlertCircle, Sparkles } from 'lucide-react'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import { ADMIN_EMAIL } from '@/lib/constants'
import { toast } from 'sonner'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState(ADMIN_EMAIL)
  const [password, setPassword] = useState('')
  const [authMode, setAuthMode] = useState<'password' | 'magic-link'>('password')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    // Strict client-side check: Block unauthorized emails immediately
    if (email.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      const msg = `Access Denied: Only the portfolio owner (${ADMIN_EMAIL}) is permitted to log in.`
      setErrorMessage(msg)
      toast.error(msg)
      return
    }

    if (!isSupabaseConfigured()) {
      toast.info('Supabase credentials not configured in .env yet. Granting Local Dev Mode access.')
      router.push('/admin')
      return
    }

    setIsLoading(true)
    const supabase = createClient()

    try {
      if (authMode === 'password') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: ADMIN_EMAIL,
          password,
        })

        if (error) {
          setErrorMessage(error.message)
          toast.error(error.message)
          return
        }

        toast.success('Welcome back, Sameer!')
        window.location.href = '/admin'
      } else {
        const { error } = await supabase.auth.signInWithOtp({
          email: ADMIN_EMAIL,
          options: {
            emailRedirectTo: `${window.location.origin}/admin`,
          },
        })

        if (error) {
          setErrorMessage(error.message)
          toast.error(error.message)
          return
        }

        toast.success(`Magic sign-in link dispatched to ${ADMIN_EMAIL}! Check your inbox.`)
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-white relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md p-8 sm:p-10 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/25">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Owner Authentication
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Private management portal for Sameer Shaik
          </p>
        </div>

        {/* Access Warning Card */}
        <div className="mb-6 p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/40 flex items-center gap-2.5 text-xs text-indigo-300">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>Restricted to portfolio owner: <strong>{ADMIN_EMAIL}</strong></span>
        </div>

        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="shaiksameer092526@gmail.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>

          {authMode === 'password' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:shadow-indigo-600/50 disabled:opacity-50 mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>{authMode === 'password' ? 'Sign In as Owner' : 'Send Magic Sign-In Link'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-6 text-center text-xs text-slate-400">
          {authMode === 'password' ? (
            <button
              onClick={() => setAuthMode('magic-link')}
              className="hover:text-indigo-400 transition-colors underline"
            >
              Prefer sign-in link via email? Click here
            </button>
          ) : (
            <button
              onClick={() => setAuthMode('password')}
              className="hover:text-indigo-400 transition-colors underline"
            >
              Sign in with password instead
            </button>
          )}
        </div>

        <div className="mt-8 pt-4 border-t border-slate-800 text-center">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            &larr; Return to Public Portfolio
          </button>
        </div>
      </div>
    </div>
  )
}
