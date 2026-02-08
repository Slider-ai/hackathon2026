'use client'

import { ReactNode, useRef, useState } from 'react'

interface BentoCardProps {
  children: ReactNode
  className?: string
  gridSpan?: 'large' | 'medium' | 'small'
  index?: number
}

export function BentoCard({ children, className = '', gridSpan = 'medium', index = 0 }: BentoCardProps) {
  const gradientRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!gradientRef.current) return

    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Direct DOM manipulation for 60fps performance
    gradientRef.current.style.background = `radial-gradient(circle 200px at ${x}px ${y}px, rgba(196,80,30,0.15), transparent)`
  }

  const handleMouseEnter = () => {
    setIsHovering(true)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
  }

  // Grid span classes for desktop layout
  const gridClasses = {
    large: 'md:col-span-2 md:row-span-2',
    medium: 'md:col-span-1 md:row-span-2',
    small: 'md:col-span-1 md:row-span-1'
  }

  return (
    <div
      className={`
        demo-card
        bg-stone-800/80 backdrop-blur-sm
        border border-stone-700/50
        rounded-[1.5rem]
        p-6 lg:p-8
        relative overflow-hidden
        group
        hover:border-stone-600/60
        transition-colors duration-300
        ${gridClasses[gridSpan]}
        ${className}
      `}
      data-demo-card
      data-index={index}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Cursor flashlight effect overlay */}
      <div
        ref={gradientRef}
        className="absolute inset-[-1px] rounded-[1.5rem] pointer-events-none transition-opacity duration-300"
        style={{
          opacity: isHovering ? 1 : 0,
          transform: 'translate3d(0,0,0)', // Force GPU compositing
          willChange: 'opacity'
        }}
      />

      {/* Card content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
