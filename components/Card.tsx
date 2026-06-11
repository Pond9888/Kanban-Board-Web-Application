'use client'

import { useState } from 'react'
import { Draggable } from '@hello-pangea/dnd'
import { Card as CardType, Priority } from '@/lib/types'
import { AIStatusBadge } from './AIStatusBadge'
import { CardModal } from './CardModal'

interface CardProps {
  card: CardType
  index: number
}

const PRIORITY_STYLES: Record<Priority, { dot: string; label: string }> = {
  low: { dot: 'bg-emerald-400', label: 'text-emerald-400' },
  medium: { dot: 'bg-yellow-400', label: 'text-yellow-400' },
  high: { dot: 'bg-orange-400', label: 'text-orange-400' },
  critical: { dot: 'bg-red-500', label: 'text-red-400' },
}

export function KanbanCard({ card, index }: CardProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const { dot, label } = PRIORITY_STYLES[card.priority]
  const activeAgents = card.aiAgents.filter((a) => a.status === 'thinking' || a.status === 'working')
  const doneAgents = card.aiAgents.filter((a) => a.status === 'done')

  return (
    <>
      <Draggable draggableId={card.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={() => setModalOpen(true)}
            className={`group relative rounded-xl border cursor-pointer transition-all duration-200 overflow-hidden
              ${snapshot.isDragging
                ? 'bg-[#1a1a2e] border-indigo-500/60 shadow-xl shadow-indigo-900/40 rotate-1 scale-105'
                : 'bg-[#13131f] border-white/8 hover:border-white/20 hover:bg-[#16162a] hover:shadow-lg hover:shadow-black/30'
              }`}
          >
            {/* Active agent glow */}
            {activeAgents.length > 0 && (
              <div className="absolute inset-0 rounded-xl bg-blue-500/5 border border-blue-500/20 pointer-events-none animate-pulse" />
            )}

            <div className="p-4 space-y-3">
              {/* Priority + Title */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${dot}`} />
                    <span className={`text-[10px] font-semibold uppercase tracking-wider ${label}`}>
                      {card.priority}
                    </span>
                  </div>
                  {card.aiAgents.length > 0 && (
                    <div className="flex items-center gap-1">
                      {card.aiAgents.slice(0, 3).map((agent) => (
                        <AIStatusBadge key={agent.id} status={agent.status} size="sm" />
                      ))}
                      {card.aiAgents.length > 3 && (
                        <span className="text-[10px] text-white/30">+{card.aiAgents.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>
                <h3 className="text-sm font-semibold text-white/90 leading-snug line-clamp-2 group-hover:text-white transition-colors">
                  {card.title}
                </h3>
              </div>

              {/* Description snippet */}
              {card.description && (
                <p className="text-xs text-white/40 line-clamp-2 leading-relaxed">{card.description}</p>
              )}

              {/* Tags */}
              {card.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {card.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] bg-white/6 text-white/40 border border-white/8">
                      #{tag}
                    </span>
                  ))}
                  {card.tags.length > 3 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] text-white/25">+{card.tags.length - 3}</span>
                  )}
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-1">
                {/* Assignee avatars */}
                <div className="flex -space-x-1.5">
                  {card.assignees.slice(0, 4).map((name) => (
                    <div
                      key={name}
                      title={name}
                      className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border-2 border-[#13131f] flex items-center justify-center text-[9px] text-white font-bold"
                    >
                      {name[0]}
                    </div>
                  ))}
                </div>

                {/* Agent summary */}
                {card.aiAgents.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    {activeAgents.length > 0 && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-blue-500/10 border border-blue-500/20 text-blue-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                        {activeAgents.length} running
                      </span>
                    )}
                    {activeAgents.length === 0 && doneAgents.length > 0 && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                        ✓ {doneAgents.length} done
                      </span>
                    )}
                    {activeAgents.length === 0 && doneAgents.length === 0 && (
                      <span className="text-[10px] text-white/25">🤖 {card.aiAgents.length}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Draggable>

      {modalOpen && <CardModal cardId={card.id} onClose={() => setModalOpen(false)} />}
    </>
  )
}
