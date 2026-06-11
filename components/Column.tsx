'use client'

import { useState } from 'react'
import { Droppable } from '@hello-pangea/dnd'
import { Column as ColumnType, Card } from '@/lib/types'
import { useBoardStore } from '@/lib/store'
import { KanbanCard } from './Card'

interface ColumnProps {
  column: ColumnType
  cards: Card[]
}

export function Column({ column, cards }: ColumnProps) {
  const { addCard } = useBoardStore()
  const [isAdding, setIsAdding] = useState(false)
  const [newTitle, setNewTitle] = useState('')

  const handleAdd = () => {
    if (newTitle.trim()) {
      addCard(column.id, newTitle.trim())
      setNewTitle('')
    }
    setIsAdding(false)
  }

  return (
    <div className="flex flex-col w-72 shrink-0">
      {/* Column header */}
      <div className="mb-3">
        <div className={`h-1 w-full rounded-full bg-gradient-to-r ${column.color} mb-3`} />
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-white/80">{column.title}</h2>
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/10 text-[11px] text-white/50 font-semibold">
              {cards.length}
            </span>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/30 hover:text-white/70 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Cards */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 min-h-[100px] space-y-2.5 rounded-xl p-2 transition-all duration-200 ${
              snapshot.isDraggingOver ? 'bg-white/5 border border-dashed border-white/20' : ''
            }`}
          >
            {cards.map((card, index) => (
              <KanbanCard key={card.id} card={card} index={index} />
            ))}
            {provided.placeholder}

            {isAdding && (
              <div className="rounded-xl bg-[#13131f] border border-indigo-500/40 p-3 space-y-2">
                <textarea
                  autoFocus
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAdd() }
                    if (e.key === 'Escape') { setIsAdding(false); setNewTitle('') }
                  }}
                  placeholder="Card title..."
                  rows={2}
                  className="w-full bg-transparent text-sm text-white placeholder-white/30 focus:outline-none resize-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAdd}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => { setIsAdding(false); setNewTitle('') }}
                    className="px-3 py-1.5 rounded-lg hover:bg-white/10 text-white/50 text-xs transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  )
}
