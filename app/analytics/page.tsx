'use client'

import { useBoardStore } from '@/lib/store'

export default function AnalyticsPage() {
  const { cards, columns } = useBoardStore()
  const allCards = Object.values(cards)
  const allAgents = allCards.flatMap((c) => c.aiAgents)
  const total = allCards.length || 1

  const columnStats = columns.map((col) => ({
    id: col.id,
    title: col.title,
    count: allCards.filter((c) => c.columnId === col.id).length,
    color: col.id === 'todo' ? 'bg-violet-500' : col.id === 'in-progress' ? 'bg-blue-500' : col.id === 'in-review' ? 'bg-amber-500' : 'bg-emerald-500',
  }))

  const priorityStats = [
    { label: 'Critical', key: 'critical', color: 'bg-red-500', text: 'text-red-400' },
    { label: 'High',     key: 'high',     color: 'bg-orange-500', text: 'text-orange-400' },
    { label: 'Medium',   key: 'medium',   color: 'bg-amber-500',  text: 'text-amber-400' },
    { label: 'Low',      key: 'low',      color: 'bg-emerald-500', text: 'text-emerald-400' },
  ].map((p) => ({ ...p, count: allCards.filter((c) => c.priority === p.key).length }))

  const agentStatusStats = [
    { label: 'Working / Thinking', count: allAgents.filter((a) => a.status === 'thinking' || a.status === 'working').length, color: 'bg-blue-500', text: 'text-blue-400' },
    { label: 'Done',   count: allAgents.filter((a) => a.status === 'done').length,   color: 'bg-emerald-500', text: 'text-emerald-400' },
    { label: 'Failed', count: allAgents.filter((a) => a.status === 'failed').length, color: 'bg-red-500',     text: 'text-red-400' },
    { label: 'Idle',   count: allAgents.filter((a) => a.status === 'idle').length,   color: 'bg-white/20',    text: 'text-white/40' },
  ]
  const totalAgents = allAgents.length || 1

  return (
    <main className="flex flex-col h-full overflow-auto">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-violet-900/15 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-indigo-900/15 blur-3xl" />
      </div>

      <header className="relative z-10 border-b border-white/8 bg-black/10 backdrop-blur-md px-6 py-3 shrink-0">
        <p className="text-[11px] text-white/30 mb-0.5">Kanban AI / Analytics</p>
        <h2 className="text-base font-bold text-white">Analytics</h2>
        <p className="text-xs text-white/40">Board statistics and AI usage overview</p>
      </header>

      <div className="relative z-10 flex-1 p-6 space-y-6">

        {/* Cards by Column */}
        <div className="rounded-xl bg-white/[0.04] border border-white/8 p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Cards by Column</h3>
          <div className="space-y-3">
            {columnStats.map((col) => (
              <div key={col.id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-white/60">{col.title}</span>
                  <span className="text-xs font-bold text-white/80">{col.count}</span>
                </div>
                <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className={`h-full rounded-full ${col.color} transition-all duration-500`}
                    style={{ width: `${(col.count / total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cards by Priority */}
        <div className="rounded-xl bg-white/[0.04] border border-white/8 p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Cards by Priority</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {priorityStats.map((p) => (
              <div key={p.key} className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-3 text-center">
                <p className={`text-2xl font-bold ${p.text}`}>{p.count}</p>
                <p className="text-[11px] text-white/40 mt-0.5">{p.label}</p>
                <div className="mt-2 h-1 rounded-full bg-white/[0.06]">
                  <div className={`h-full rounded-full ${p.color}`} style={{ width: `${(p.count / total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Agent Usage */}
        <div className="rounded-xl bg-white/[0.04] border border-white/8 p-5">
          <h3 className="text-sm font-semibold text-white mb-4">AI Agent Usage</h3>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-3xl font-bold text-white">{allAgents.length}</span>
            <span className="text-sm text-white/40">total agents across {allCards.length} cards</span>
          </div>
          <div className="space-y-3">
            {agentStatusStats.map((s) => (
              <div key={s.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs ${s.text}`}>{s.label}</span>
                  <span className="text-xs font-bold text-white/80">{s.count}</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <div className={`h-full rounded-full ${s.color} transition-all duration-500`} style={{ width: `${(s.count / totalAgents) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  )
}
