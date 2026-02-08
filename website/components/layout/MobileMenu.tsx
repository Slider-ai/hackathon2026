'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useLenis } from '@/hooks/useLenis'
import Button from '@/components/ui/Button'
import type { User } from '@supabase/supabase-js'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  links: { label: string; href: string }[]
  user?: User | null
}

export default function MobileMenu({ isOpen, onClose, links, user }: MobileMenuProps) {
  const lenis = useLenis()
  const navRef = useRef<HTMLElement>(null)

  // Handle Escape key to close menu
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Focus management and body scroll lock
  useEffect(() => {
    if (!isOpen) return

    // Focus first link when menu opens
    const firstButton = navRef.current?.querySelector('button')
    if (firstButton) {
      firstButton.focus()
    }

    // Lock body scroll
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [isOpen])

  const handleLinkClick = (href: string) => {
    lenis?.scrollTo(href)
    onClose()
  }

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.email) return '?'
    return user.email.charAt(0).toUpperCase()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[280px] max-w-[80vw] bg-white dark:bg-stone-900 z-50 shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 pt-20">
          {/* Navigation Links */}
          <nav id="mobile-menu" ref={navRef}>
            <ul className="space-y-0">
              {links.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => handleLinkClick(link.href)}
                    className="block w-full text-left py-3 text-lg text-stone-700 hover:text-stone-900 dark:text-stone-300 dark:hover:text-stone-100 border-b border-stone-200 dark:border-stone-700 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Auth Buttons or Profile */}
          <div className="mt-6 space-y-3">
            {user ? (
              <Link
                href="/profile"
                onClick={onClose}
                className="flex items-center gap-3 py-3 text-stone-700 hover:text-stone-900 dark:text-stone-300 dark:hover:text-stone-100 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-burnt-orange flex items-center justify-center text-white font-semibold">
                  {getUserInitials()}
                </div>
                <div>
                  <p className="text-stone-900 dark:text-stone-100 font-medium">My Profile</p>
                  <p className="text-stone-500 dark:text-stone-400 text-sm truncate max-w-[180px]">{user.email}</p>
                </div>
              </Link>
            ) : (
              <>
                <Link href="/signup" onClick={onClose}>
                  <Button variant="primary" className="w-full">
                    Get Started
                  </Button>
                </Link>
                <Link
                  href="/login"
                  onClick={onClose}
                  className="block w-full text-center py-3 text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 transition-colors"
                >
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
