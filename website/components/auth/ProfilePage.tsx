'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface Profile {
  subscription_status: string | null
  stripe_customer_id: string | null
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [signingOut, setSigningOut] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      setUser(user)

      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_status, stripe_customer_id')
        .eq('id', user.id)
        .single()

      setProfile(profile)
      setLoading(false)
    }

    loadProfile()
  }, [router])

  const handleSignOut = async () => {
    setSigningOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const getUserInitials = () => {
    if (!user?.email) return '?'
    return user.email.charAt(0).toUpperCase()
  }

  const isProSubscriber = profile?.subscription_status === 'active' || profile?.subscription_status === 'trialing'

  if (loading) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-8">
          <div className="animate-pulse space-y-4">
            <div className="w-20 h-20 rounded-full bg-stone-200 dark:bg-stone-800 mx-auto" />
            <div className="h-6 bg-stone-200 dark:bg-stone-800 rounded w-3/4 mx-auto" />
            <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-1/2 mx-auto" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-stone-900 dark:text-white mb-2">Your Profile</h1>
        <p className="text-stone-600 dark:text-stone-400">Manage your account and subscription</p>
      </div>

      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-8">
        {/* Avatar and Email */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-burnt-orange flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            {getUserInitials()}
          </div>
          <p className="text-stone-900 dark:text-white font-medium">{user?.email}</p>
          <p className="text-stone-500 text-sm mt-1">
            Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'}
          </p>
        </div>

        {/* Subscription Status */}
        <div className="bg-stone-100 dark:bg-stone-800 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-stone-600 dark:text-stone-400 text-sm">Current Plan</p>
              <p className="text-stone-900 dark:text-white font-semibold text-lg">
                {isProSubscriber ? 'Pro' : 'Free'}
              </p>
            </div>
            <span
              className={`text-sm px-3 py-1 rounded-full ${
                isProSubscriber
                  ? 'bg-success/20 text-success'
                  : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-400'
              }`}
            >
              {isProSubscriber ? 'Active' : 'Free Tier'}
            </span>
          </div>

          {isProSubscriber ? (
            <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-700">
              <ul className="space-y-2 text-sm text-stone-600 dark:text-stone-400">
                <li className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-burnt-orange">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Unlimited slides
                </li>
                <li className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-burnt-orange">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  All Styles unlocked
                </li>
                <li className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-burnt-orange">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Priority support
                </li>
              </ul>
            </div>
          ) : (
            <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-700">
              <ul className="space-y-2 text-sm text-stone-600 dark:text-stone-400">
                <li className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-stone-500">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  5 slides per month
                </li>
                <li className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-stone-500">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Basic Styles
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {!isProSubscriber && (
            <Link
              href="/subscribe"
              className="block w-full text-center px-6 py-3 bg-burnt-orange hover:bg-burnt-orange-hover text-white font-medium rounded-full transition-colors"
            >
              Upgrade to Pro — $4.99/mo
            </Link>
          )}

          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="w-full px-6 py-3 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-900 dark:text-white font-medium rounded-full transition-colors disabled:opacity-50 cursor-pointer"
          >
            {signingOut ? 'Signing out...' : 'Sign out'}
          </button>
        </div>
      </div>

      <p className="text-center text-stone-500 text-sm mt-6">
        <Link href="/" className="hover:text-stone-400 transition-colors">
          ← Back to home
        </Link>
      </p>
    </div>
  )
}
