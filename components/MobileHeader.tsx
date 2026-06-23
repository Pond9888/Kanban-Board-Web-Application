'use client'

import { usePathname } from 'next/navigation'
import { toggleMobileDrawer } from './Sidebar'
import { UsageMeter } from './UsageMeter'

const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/board': 'Kanban Board',
  '/tasks': 'My Tasks',
  '/calendar': 'Calendar',
  '/ai-agents': 'AI Agents',
  '/ai-chat': 'AI Chat',
  '/kb-chat': 'Knowledge Bot',
  '/automations': 'Automations',
  '/analytics': 'Analytics',
  '/projects': 'Projects',
  '/team': 'Team',
  '/settings': 'Settings',
}

export function MobileHeader() {
  const pathname = usePathname()
  const title = PAGE_TITLES[pathname] ?? 'Kanban AI'

  return (
    <header className="md:hidden sticky top-0 z-40 flex items-center gap-3 px-4 h-14 bg-[#0a0a16]/95 backdrop-blur-md border-b border-white/8 safe-top">
      {/* Hamburger */}
      <button
        onClick={() => toggleMobileDrawer(true)}
        className="p-2 -ml-2 rounded-lg text-white/60 hover:text-white active:bg-white/10 transition-colors"
        aria-label="Open menu"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Logo + title */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shrink-0">
          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
          </svg>
        </div>
        <span className="text-sm font-semibold text-white truncate">{title}</span>
      </div>

      {/* Usage meter / Pro badge */}
      <UsageMeter />
    </header>
  )
}
