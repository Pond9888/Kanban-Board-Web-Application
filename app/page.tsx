'use client'

import Link from 'next/link'
import { useBoardStore } from '@/lib/store'

export default function DashboardPage() {
  const { cards, columns } = useBoardStore()

  const allCards = Object.values(cards)
  const allAgents = allCards.flatMap((c) => c.aiAgents)
  const activeAgents = allAgents.filter((a) => a.status === 'thinking' || a.status === 'working')
  const completedToday = allCards.filter((c) => {
    const col = columns.find((col) => col.id === c.columnId)
    return col?.id === 'done'
  })

  const recentCards = [...allCards].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5)

  const stats = [
    { label: 'Total Cards', value: allCards.length, color: 'from-indigo-500 to-violet-600', icon: 'M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7' },
    { label: 'Active AI Agents', value: activeAgents.length, color: 'from-emerald-500 to-teal-600', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2' },
    { label: 'Completed Today', value: completedToday.length, color: 'from-amber-500 to-orange-600', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Team Members', value: 4, color: 'from-pink-500 to-rose-600', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  ]

  const priorityColor: Record<string, string> = {
    critical: 'text-red-400',
    high: 'text-orange-400',
    medium: 'text-amber-400',
    low: 'text-emerald-400',
  }

  const agentStatusColor: Record<string, string> = {
    thinking: 'bg-amber-500',
    working: 'bg-blue-500',
    done: 'bg-emerald-500',
    failed: 'bg-red-500',
    idle: 'bg-white/20',
  }

  const columnLabel: Record<string, string> = {
    'todo': 'Todo',
    'in-progress': 'In Progress',
    'in-review': 'In Review',
    'done': 'Done',
  }

  return (
    <main className="flex flex-col h-full overflow-auto">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-violet-900/15 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-indigo-900/15 blur-3xl" />
      </div>

      <header className="relative z-10 border-b border-white/8 bg-black/10 backdrop-blur-md px-6 py-3 flex items-center justify-between shrink-0">
        <div>
          <p className="text-[11px] text-white/30 mb-0.5">Kanban AI / Dashboard</p>
          <h2 className="text-base font-bold text-white">Dashboard</h2>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/board" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/20 text-indigo-300 text-xs font-medium transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
            </svg>
            Open Board
          </Link>
        </div>
      </header>

      <div className="relative z-10 flex-1 p-6 space-y-6">
        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl bg-white/[0.04] border border-white/8 p-4">
              <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 opacity-90`}>
                <svg className="w-4.5 h-4.5 text-white w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                </svg>
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-white/40 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Agents Running */}
          <div className="rounded-xl bg-white/[0.04] border border-white/8 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">AI Agents Running</h3>
              <Link href="/ai-agents" className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors">View all</Link>
            </div>
            {activeAgents.length === 0 ? (
              <p className="text-xs text-white/30 py-4 text-center">No active agents right now</p>
            ) : (
              <div className="space-y-2">
                {activeAgents.map((agent) => {
                  const card = allCards.find((c) => c.aiAgents.some((a) => a.id === agent.id))
                  return (
                    <div key={agent.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${agentStatusColor[agent.status]} animate-pulse`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white/80 truncate">{agent.name}</p>
                        <p className="text-[10px] text-white/30 truncate">{card?.title ?? 'Unknown card'}</p>
                      </div>
                      <span className="text-[10px] text-white/40 capitalize shrink-0">{agent.status}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="rounded-xl bg-white/[0.04] border border-white/8 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
              <Link href="/tasks" className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors">View all</Link>
            </div>
            <div className="space-y-2">
              {recentCards.map((card) => (
                <div key={card.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white/80 truncate">{card.title}</p>
                    <p className="text-[10px] text-white/30">{columnLabel[card.columnId] ?? card.columnId}</p>
                  </div>
                  <span className={`text-[10px] font-semibold capitalize shrink-0 ${priorityColor[card.priority]}`}>{card.priority}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl bg-white/[0.04] border border-white/8 p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <Link href="/board" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/20 text-indigo-300 text-xs font-medium transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
              </svg>
              Open Board
            </Link>
            <Link href="/ai-agents" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/20 text-emerald-300 text-xs font-medium transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" />
              </svg>
              View AI Agents
            </Link>
            <Link href="/analytics" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/20 text-amber-300 text-xs font-medium transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Analytics
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
