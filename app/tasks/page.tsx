'use client'

import { useBoardStore } from '@/lib/store'

const priorityOrder = ['critical', 'high', 'medium', 'low']

const priorityBadge: Record<string, string> = {
  critical: 'bg-red-500/20 text-red-400 border-red-500/20',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/20',
  medium: 'bg-amber-500/20 text-amber-400 border-amber-500/20',
  low: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20',
}

const columnLabel: Record<string, string> = {
  'todo': 'Todo',
  'in-progress': 'In Progress',
  'in-review': 'In Review',
  'done': 'Done',
}

const columnBadge: Record<string, string> = {
  'todo': 'bg-violet-500/20 text-violet-400',
  'in-progress': 'bg-blue-500/20 text-blue-400',
  'in-review': 'bg-amber-500/20 text-amber-400',
  'done': 'bg-emerald-500/20 text-emerald-400',
}

export default function TasksPage() {
  const { cards } = useBoardStore()
  const allCards = Object.values(cards)

  const grouped = priorityOrder.map((priority) => ({
    priority,
    cards: allCards.filter((c) => c.priority === priority),
  })).filter((g) => g.cards.length > 0)

  return (
    <main className="flex flex-col h-full overflow-auto">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-violet-900/15 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-indigo-900/15 blur-3xl" />
      </div>

      <header className="relative z-10 border-b border-white/8 bg-black/10 backdrop-blur-md px-6 py-3 shrink-0">
        <p className="text-[11px] text-white/30 mb-0.5">Kanban AI / My Tasks</p>
        <h2 className="text-base font-bold text-white">My Tasks</h2>
        <p className="text-xs text-white/40">All cards grouped by priority</p>
      </header>

      <div className="relative z-10 flex-1 p-6 space-y-6">
        {grouped.map(({ priority, cards: groupCards }) => (
          <div key={priority}>
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border capitalize ${priorityBadge[priority]}`}>{priority}</span>
              <span className="text-xs text-white/30">{groupCards.length} task{groupCards.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="space-y-2">
              {groupCards.map((card) => (
                <div key={card.id} className="flex items-center gap-4 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/8 hover:bg-white/[0.06] transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white/90 truncate">{card.title}</p>
                    {card.description && (
                      <p className="text-xs text-white/35 truncate mt-0.5">{card.description}</p>
                    )}
                    {card.tags.length > 0 && (
                      <div className="flex gap-1 mt-1.5 flex-wrap">
                        {card.tags.map((tag) => (
                          <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] text-white/40">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {card.assignees.length > 0 && (
                      <div className="flex -space-x-1.5">
                        {card.assignees.slice(0, 3).map((a) => (
                          <div key={a} className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border border-[#080810] flex items-center justify-center text-[9px] font-bold text-white">
                            {a[0]}
                          </div>
                        ))}
                      </div>
                    )}
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${columnBadge[card.columnId] ?? 'bg-white/10 text-white/40'}`}>
                      {columnLabel[card.columnId] ?? card.columnId}
                    </span>
                    <span className="text-[10px] text-white/30">{card.aiAgents.length} agent{card.aiAgents.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
