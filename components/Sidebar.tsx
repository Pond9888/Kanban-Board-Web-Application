'use client'

import { useState } from 'react'

interface NavItem {
  icon: React.ReactNode
  label: string
  badge?: string | number
  active?: boolean
  section?: string
}

const Icon = ({ path, path2 }: { path: string; path2?: string }) => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    {path2 && <path strokeLinecap="round" strokeLinejoin="round" d={path2} />}
  </svg>
)

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [activeItem, setActiveItem] = useState('Kanban Board')

  const navSections = [
    {
      title: 'WORKSPACE',
      items: [
        { label: 'Dashboard', icon: <Icon path="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> },
        { label: 'Kanban Board', icon: <Icon path="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />, badge: '8' },
        { label: 'My Tasks', icon: <Icon path="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />, badge: '3' },
        { label: 'Calendar', icon: <Icon path="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /> },
      ],
    },
    {
      title: 'AI TOOLS',
      items: [
        { label: 'AI Agents', icon: <Icon path="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" />, badge: '2' },
        { label: 'AI Chat', icon: <Icon path="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /> },
        { label: 'Automations', icon: <Icon path="M13 10V3L4 14h7v7l9-11h-7z" /> },
        { label: 'Analytics', icon: <Icon path="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /> },
      ],
    },
    {
      title: 'MANAGE',
      items: [
        { label: 'Projects', icon: <Icon path="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /> },
        { label: 'Team', icon: <Icon path="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /> },
        { label: 'Settings', icon: <Icon path="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />, },
      ],
    },
  ]

  return (
    <aside className={`flex flex-col h-screen bg-[#0a0a16] border-r border-white/8 transition-all duration-300 ${collapsed ? 'w-16' : 'w-56'} shrink-0`}>
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/8 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-900/50 shrink-0">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
          </svg>
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-bold text-white tracking-tight">Kanban AI</p>
            <p className="text-[10px] text-white/40 truncate">AI-powered ERP</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-5">
        {navSections.map((section) => (
          <div key={section.title}>
            {!collapsed && (
              <p className="text-[10px] font-semibold text-white/25 tracking-widest px-2 mb-2">{section.title}</p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = activeItem === item.label
                return (
                  <button
                    key={item.label}
                    onClick={() => setActiveItem(item.label)}
                    title={collapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg transition-all duration-150 group
                      ${isActive
                        ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/20'
                        : 'text-white/40 hover:text-white/80 hover:bg-white/5'
                      } ${collapsed ? 'justify-center' : ''}`}
                  >
                    <span className={`shrink-0 ${isActive ? 'text-indigo-400' : ''}`}>{item.icon}</span>
                    {!collapsed && (
                      <span className="flex-1 text-left text-xs font-medium truncate">{item.label}</span>
                    )}
                    {!collapsed && item.badge && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? 'bg-indigo-500/30 text-indigo-300' : 'bg-white/10 text-white/40'}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom: AI status + collapse */}
      <div className="border-t border-white/8 p-3 space-y-3">
        {!collapsed && (
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-emerald-900/20 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-[11px] text-emerald-400 font-medium">AI Active</span>
          </div>
        )}
        <div className={`flex items-center gap-2 ${collapsed ? 'justify-center' : 'px-1'}`}>
          {!collapsed && (
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-[11px] font-bold text-white shrink-0">T</div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-white/80 truncate">Teerawat</p>
                <p className="text-[10px] text-white/30 truncate">Hobby plan</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/30 hover:text-white/70 transition-colors shrink-0"
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            <svg className={`w-3.5 h-3.5 transition-transform ${collapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  )
}
