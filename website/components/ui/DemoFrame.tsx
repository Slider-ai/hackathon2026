import { forwardRef, ReactNode } from 'react'

interface DemoFrameProps {
  children: ReactNode
  sidebarContent?: ReactNode
  className?: string
}

export const DemoFrame = forwardRef<HTMLDivElement, DemoFrameProps>(
  ({ children, sidebarContent, className = '' }, ref) => {
    return (
      <div
        ref={ref}
        data-demo-frame
        className={`bg-stone-100 rounded-xl border border-stone-300 overflow-hidden shadow-2xl ${className}`}
      >
        {/* PowerPoint title bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-stone-200 border-b border-stone-300">
          {/* Left side: dots + filename */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <span className="text-stone-600 text-xs ml-2">Sales Pitch.pptx</span>
          </div>

          {/* Right side: PowerPoint label */}
          <span className="text-stone-500 text-xs">PowerPoint</span>
        </div>

        {/* Content area with optional sidebar */}
        <div className="flex">
          {/* Main content area */}
          <div className="flex-1 min-h-[320px] lg:min-h-[420px] bg-stone-300">
            {children}
          </div>

          {/* Sidebar (if provided) - styled like AIslideGen panel */}
          {sidebarContent && (
            <div className="w-[220px] lg:w-[280px] bg-white border-l border-stone-200 flex flex-col">
              {sidebarContent}
            </div>
          )}
        </div>
      </div>
    )
  }
)

DemoFrame.displayName = 'DemoFrame'
