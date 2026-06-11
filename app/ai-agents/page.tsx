'use client'

import { useBoardStore } from '@/lib/store'

const statusConfig: Record<string, { label: string; dot: string; badge: string }> = {
  thinking: { label: 'Thinking', dot: 'bg-amber-400 animate-pulse', badge: 'bg-amber-500/20 text-amber-400 border border-amber-500/20' },
  working:  { label: 'Working',  dot: 'bg-blue-400 animate-pulse',  badge: 'bg-blue-500/20 text-blue-400 border border-blue-500/20' },
  done:     { label: 'Done',     dot: 'bg-emerald-400',             badge: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' },
  failed:   { label: 'Failed',   dot: 'bg-red-400',                 badge: 'bg-red-500/20 text-red-400 border border-red-500/20' },
  idle:     { label: 'Idle',     dot: 'bg-white/30',                badge: 'bg-white/10 text-white/40 border border-white/10' },
}

const statusOrder = ['thinking', 'working', 'failed', 'idle', 'done']

export default function AIAgentsPage() {
  const { cards, updateAIAgent } = useBoardStore()
  const allCards = Object.values(cards)

  type AgentWithCard = { agent: { id: string; name: string; type: string; status: string; statusMessage?: string; result?: string }; card: typeof allCards[0] }
  const allAgentsWithCard: AgentWithCard[] = allCards.flatMap((card) =>
    card.aiAgents.map((agent) => ({ agent, card }))
  )

  const grouped = statusOrder.map((status) => ({
    status,
    items: allAgentsWithCard.filter(({ agent }) => agent.status === status),
  })).filter((g) => g.items.length > 0)

  const totalAgents = allAgentsWithCard.length
  const runningCount = allAgentsWithCard.filter(({ agent }) => agent.status === 'thinking' || agent.status === 'working').length

  const handleRun = (cardId: string, agentId: string) => {
    updateAIAgent(cardId, agentId, { status: 'working', statusMessage: 'Running...' })
  }

  return (
    <main className="flex flex-col h-full overflow-auto">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-violet-900/15 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-indigo-900/15 blur-3xl" />
      </div>

      <header className="relative z-10 border-b border-white/8 bg-black/10 backdrop-blur-md px-6 py-3 shrink-0">
        <p className="text-[11px] text-white/30 mb-0.5">Kanban AI / AI Agents</p>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">AI Agents</h2>
            <p className="text-xs text-white/40">{totalAgents} total agents · {runningCount} running</p>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${runningCount > 0 ? 'bg-emerald-900/20 border border-emerald-500/20' : 'bg-white/5 border border-white/8'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${runningCount > 0 ? 'bg-emerald-400 animate-pulse' : 'bg-white/20'}`} />
            <span className={`text-xs font-medium ${runningCount > 0 ? 'text-emerald-400' : 'text-white/30'}`}>
              {runningCount > 0 ? `${runningCount} Active` : 'All Idle'}
            </span>
          </div>
        </div>
      </header>

      <div className="relative z-10 flex-1 p-6 space-y-6">
        {grouped.map(({ status, items }) => {
          const cfg = statusConfig[status] ?? statusConfig.idle
          return (
            <div key={status}>
              <div className="flex items-center gap-2 mb-3">
                <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${cfg.badge}`}>{cfg.label}</span>
                <span className="text-xs text-white/30">{items.length} agent{items.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="space-y-2">
                {items.map(({ agent, card }) => (
                  <div key={agent.id} className="flex items-center gap-4 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/8 hover:bg-white/[0.06] transition-colors">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white/90 truncate">{agent.name}</p>
                      <p className="text-xs text-white/35 truncate">
                        {agent.statusMessage ?? `Type: ${agent.type}`} · Card: {card.title}
                      </p>
                      {agent.result && (
                        <p className="text-[11px] text-emerald-400/70 mt-1 truncate">{agent.result}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-white/30 capitalize">{agent.type}</span>
                      {(agent.status === 'idle' || agent.status === 'done' || agent.status === 'failed') && (
                        <button
                          onClick={() => handleRun(card.id, agent.id)}
                          className="text-[11px] px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/20 text-indigo-300 font-medium transition-colors"
                        >
                          Run
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}
