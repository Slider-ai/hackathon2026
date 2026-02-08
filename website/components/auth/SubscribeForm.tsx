'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

type Plan = 'free' | 'pro'

export default function SubscribeForm() {
  const [selectedPlan, setSelectedPlan] = useState<Plan>('pro')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<{ email?: string } | null>(null)
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  const success = searchParams.get('success')
  const canceled = searchParams.get('canceled')

  useEffect(() => {
    async function getUser() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      setUser(user)

      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_status')
        .eq('id', user.id)
        .single()

      if (profile?.subscription_status) {
        setSubscriptionStatus(profile.subscription_status)
      }
    }

    getUser()
  }, [router])

  const handleContinue = async () => {
    if (selectedPlan === 'free') {
      router.push('/')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' })
      const data = await res.json()

      if (data.error) {
        setError(data.error)
        setLoading(false)
        return
      }

      window.location.href = data.url
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-md text-center">
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-8">
          <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-success">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-white mb-2">You&apos;re all set!</h1>
          <p className="text-stone-600 dark:text-stone-400 mb-6">
            Your subscription is active. You can now use Slider in PowerPoint with your account.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-burnt-orange hover:bg-burnt-orange-hover text-white font-medium rounded-full transition-colors"
          >
            Back to home
          </Link>
        </div>
      </div>
    )
  }

  if (canceled) {
    return (
      <div className="w-full max-w-md text-center">
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-stone-900 dark:text-white mb-2">Payment canceled</h1>
          <p className="text-stone-600 dark:text-stone-400 mb-6">
            No worries — you can subscribe whenever you&apos;re ready.
          </p>
          <button
            onClick={() => router.push('/subscribe')}
            className="inline-flex items-center justify-center px-6 py-3 bg-burnt-orange hover:bg-burnt-orange-hover text-white font-medium rounded-full transition-colors cursor-pointer"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  const isActive = subscriptionStatus === 'active' || subscriptionStatus === 'trialing'

  if (isActive) {
    return (
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-stone-900 dark:text-white mb-2">Your Subscription</h1>
          <p className="text-stone-600 dark:text-stone-400">
            Your subscription is active. Use the same account in the PowerPoint extension.
          </p>
        </div>
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-8 text-center">
          <span className="text-sm text-success bg-success/10 px-3 py-1 rounded-full">Active</span>
          <p className="text-stone-600 dark:text-stone-400 text-sm mt-4">
            Signed in as {user?.email}
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-burnt-orange hover:bg-burnt-orange-hover text-white font-medium rounded-full transition-colors mt-6"
          >
            Back to home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-stone-900 dark:text-white mb-2">Choose your plan</h1>
        <p className="text-stone-600 dark:text-stone-400">Select a plan to get started with Slider</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {/* Free Plan */}
        <button
          type="button"
          onClick={() => setSelectedPlan('free')}
          className={`relative text-left p-6 rounded-2xl border-2 transition-all cursor-pointer ${
            selectedPlan === 'free'
              ? 'border-burnt-orange bg-white dark:bg-stone-900'
              : 'border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/50 hover:border-stone-400 dark:hover:border-stone-600'
          }`}
        >
          <div className="mb-4">
            <h3 className="text-lg font-bold text-stone-900 dark:text-white">Free</h3>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-bold text-stone-900 dark:text-white">$0</span>
              <span className="text-stone-500">/month</span>
            </div>
          </div>
          <ul className="space-y-2.5 text-sm text-stone-600 dark:text-stone-400">
            <li className="flex items-start gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-stone-500 mt-0.5 shrink-0">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              5 slides per month
            </li>
            <li className="flex items-start gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-stone-500 mt-0.5 shrink-0">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Basic Styles
            </li>
            <li className="flex items-start gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-stone-500 mt-0.5 shrink-0">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Community support
            </li>
          </ul>
          {selectedPlan === 'free' && (
            <div className="absolute top-4 right-4 w-5 h-5 bg-burnt-orange rounded-full flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          )}
        </button>

        {/* Pro Plan */}
        <button
          type="button"
          onClick={() => setSelectedPlan('pro')}
          className={`relative text-left p-6 rounded-2xl border-2 transition-all cursor-pointer ${
            selectedPlan === 'pro'
              ? 'border-burnt-orange bg-white dark:bg-stone-900'
              : 'border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/50 hover:border-stone-400 dark:hover:border-stone-600'
          }`}
        >
          <span className="absolute -top-3 left-4 text-xs font-semibold bg-burnt-orange text-white px-3 py-1 rounded-full">
            Popular
          </span>
          <div className="mb-4">
            <h3 className="text-lg font-bold text-stone-900 dark:text-white">Pro</h3>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-bold text-stone-900 dark:text-white">$4.99</span>
              <span className="text-stone-500">/month</span>
            </div>
          </div>
          <ul className="space-y-2.5 text-sm text-stone-600 dark:text-stone-400">
            <li className="flex items-start gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-burnt-orange mt-0.5 shrink-0">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Unlimited slides
            </li>
            <li className="flex items-start gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-burnt-orange mt-0.5 shrink-0">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              All Styles
            </li>
            <li className="flex items-start gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-burnt-orange mt-0.5 shrink-0">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Priority support
            </li>
          </ul>
          {selectedPlan === 'pro' && (
            <div className="absolute top-4 right-4 w-5 h-5 bg-burnt-orange rounded-full flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          )}
        </button>
      </div>

      {error && (
        <div className="text-error text-sm bg-error/10 border border-error/20 rounded-xl px-4 py-3 mb-4">
          {error}
        </div>
      )}

      <button
        onClick={handleContinue}
        disabled={loading}
        className="w-full px-6 py-3 bg-burnt-orange hover:bg-burnt-orange-hover text-white font-medium rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {loading
          ? 'Redirecting to checkout...'
          : selectedPlan === 'free'
            ? 'Continue with Free'
            : 'Subscribe to Pro — $4.99/mo'}
      </button>
      <p className="text-stone-500 text-xs text-center mt-3">
        {selectedPlan === 'pro'
          ? 'Secure payment powered by Stripe. Cancel anytime.'
          : 'You can upgrade to Pro at any time.'}
      </p>
    </div>
  )
}
