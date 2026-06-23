'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, Priority } from '@/lib/types'
import { useBoardStore } from '@/lib/store'
import { apiUrl } from '@/lib/apiUrl'
import { AIStatusBadge } from './AIStatusBadge'
import { AIAgentPanel } from './AIAgentPanel'
import { AIChat } from './AIChat'

interface CardModalProps {
  cardId: string
  onClose: () => void
}

const PRIORITY_COLORS: Record<Priority, string> = {
  low: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
}

const PRIORITY_DOT: Record<Priority, string> = {
  low: 'bg-emerald-400',
  medium: 'bg-yellow-400',
  high: 'bg-orange-400',
  critical: 'bg-red-500',
}

export function CardModal({ cardId, onClose }: CardModalProps) {
  const { cards, updateCard, deleteCard } = useBoardStore()
  const card = cards[cardId]
  const [tab, setTab] = useState<'details' | 'agents' | 'chat'>('details')
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleVal, setTitleVal] = useState(card?.title || '')
  const [descVal, setDescVal] = useState(card?.description || '')
  const [tagInput, setTagInput] = useState('')
  const [isSummarizing, setIsSummarizing] = useState(false)
  const [isSuggestingPriority, setIsSuggestingPriority] = useState(false)
  const [priorityReason, setPriorityReason] = useState('')

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  if (!card) return null

  const handleSummarize = async () => {
    setIsSummarizing(true)
    try {
      const res = await fetch(apiUrl('/api/ai/summarize'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: card.title, description: descVal }),
      })
      const data = await res.json()
      if (data.description) {
        setDescVal(data.description)
        updateCard(cardId, { description: data.description })
      }
    } finally {
      setIsSummarizing(false)
    }
  }

  const handleSuggestPriority = async () => {
    setIsSuggestingPriority(true)
    setPriorityReason('')
    try {
      const res = await fetch(apiUrl('/api/ai/priority'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: card.title, description: descVal }),
      })
      const data = await res.json()
      if (data.priority) {
        updateCard(cardId, { priority: data.priority })
        setPriorityReason(data.reason || '')
      }
    } finally {
      setIsSuggestingPriority(false)
    }
  }

  const handleAddTag = () => {
    if (!tagInput.trim()) return
    const newTags = [...card.tags, tagInput.trim()]
    updateCard(cardId, { tags: newTags })
    setTagInput('')
  }

  const handleDeleteCard = () => {
    deleteCard(cardId)
    onClose()
  }

  const activeAgents = card.aiAgents.filter((a) => a.status === 'thinking' || a.status === 'working')

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-4xl max-h-[90vh] rounded-2xl bg-[#0f0f1a] border border-white/10 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-start gap-4 px-6 pt-6 pb-4 border-b border-white/8">
          <div className="flex-1 min-w-0">
            {editingTitle ? (
              <input
                autoFocus
                value={titleVal}
                onChange={(e) => setTitleVal(e.target.value)}
                onBlur={() => { updateCard(cardId, { title: titleVal }); setEditingTitle(false) }}
                onKeyDown={(e) => { if (e.key === 'Enter') { updateCard(cardId, { title: titleVal }); setEditingTitle(false) } }}
                className="w-full text-xl font-bold text-white bg-white/5 border border-indigo-500/50 rounded-lg px-3 py-1.5 focus:outline-none"
              />
            ) : (
              <h2
                className="text-xl font-bold text-white cursor-pointer hover:text-indigo-300 transition-colors"
                onClick={() => setEditingTitle(true)}
              >
                {card.title}
              </h2>
            )}
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${PRIORITY_COLORS[card.priority]}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${PRIORITY_DOT[card.priority]}`} />
                {card.priority.charAt(0).toUpperCase() + card.priority.slice(1)}
              </span>
              {activeAgents.length > 0 && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                  {activeAgents.length} agent{activeAgents.length > 1 ? 's' : ''} running
                </span>
              )}
              {card.tags.map((tag) => (
                <span key={tag} className="px-2.5 py-1 rounded-full text-xs bg-white/8 text-white/50 border border-white/10">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleDeleteCard} className="p-2 rounded-lg hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 py-3 border-b border-white/8">
          {(['details', 'agents', 'chat'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                tab === t
                  ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/30'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/5'
              }`}
            >
              {t === 'details' && '📋 Details'}
              {t === 'agents' && `🤖 Agents ${card.aiAgents.length > 0 ? `(${card.aiAgents.length})` : ''}`}
              {t === 'chat' && `💬 AI Chat ${card.chatHistory.length > 0 ? `(${card.chatHistory.length})` : ''}`}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {tab === 'details' && (
            <div className="space-y-6">
              {/* Description */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Description</label>
                  <button
                    onClick={handleSummarize}
                    disabled={isSummarizing}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-violet-600/20 hover:bg-violet-600/40 border border-violet-500/20 text-violet-300 disabled:opacity-50 transition-colors"
                  >
                    {isSummarizing ? (
                      <><span className="w-3 h-3 border border-violet-400 border-t-transparent rounded-full animate-spin" />AI Writing...</>
                    ) : (
                      <><span>✨</span> AI Summarize</>
                    )}
                  </button>
                </div>
                <textarea
                  value={descVal}
                  onChange={(e) => setDescVal(e.target.value)}
                  onBlur={() => updateCard(cardId, { description: descVal })}
                  rows={5}
                  placeholder="Describe this task..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/80 placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-colors resize-none"
                />
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Priority</label>
                  <button
                    onClick={handleSuggestPriority}
                    disabled={isSuggestingPriority}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-600/20 hover:bg-amber-600/40 border border-amber-500/20 text-amber-300 disabled:opacity-50 transition-colors"
                  >
                    {isSuggestingPriority ? (
                      <><span className="w-3 h-3 border border-amber-400 border-t-transparent rounded-full animate-spin" />Analyzing...</>
                    ) : (
                      <><span>🎯</span> AI Suggest</>
                    )}
                  </button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {(['low', 'medium', 'high', 'critical'] as Priority[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => updateCard(cardId, { priority: p })}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                        card.priority === p
                          ? PRIORITY_COLORS[p] + ' scale-105'
                          : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>
                {priorityReason && (
                  <p className="text-xs text-amber-300/70 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
                    🎯 {priorityReason}
                  </p>
                )}
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {card.tags.map((tag) => (
                    <span key={tag} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-white/8 text-white/60 border border-white/10">
                      #{tag}
                      <button onClick={() => updateCard(cardId, { tags: card.tags.filter((t) => t !== tag) })} className="text-white/30 hover:text-red-400 transition-colors">×</button>
                    </span>
                  ))}
                  <div className="flex gap-2">
                    <input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                      placeholder="Add tag..."
                      className="bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-xs text-white/60 placeholder-white/20 focus:outline-none focus:border-indigo-500/50 w-28"
                    />
                  </div>
                </div>
              </div>

              {/* Assignees */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Assignees</label>
                <div className="flex flex-wrap gap-2">
                  {card.assignees.map((name) => (
                    <span key={name} className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-white/8 text-white/70 border border-white/10">
                      <span className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] text-white font-bold">
                        {name[0]}
                      </span>
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'agents' && (
            <AIAgentPanel card={card} />
          )}

          {tab === 'chat' && (
            <div className="h-[400px]">
              <AIChat card={card} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
