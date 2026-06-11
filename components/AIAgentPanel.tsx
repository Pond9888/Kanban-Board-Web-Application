'use client'

import { useState } from 'react'
import { AIAgent, AIAgentType, Card } from '@/lib/types'
import { AIStatusBadge } from './AIStatusBadge'
import { useBoardStore } from '@/lib/store'

interface AIAgentPanelProps {
  card: Card
}

const agentTypes: { type: AIAgentType; label: string; icon: string; description: string }[] = [
  { type: 'summarizer', label: 'Summarizer', icon: '📝', description: 'Summarize and improve description' },
  { type: 'researcher', label: 'Researcher', icon: '🔍', description: 'Research approaches and solutions' },
  { type: 'coder', label: 'Code Writer', icon: '💻', description: 'Write code or pseudocode' },
  { type: 'reviewer', label: 'Reviewer', icon: '🔎', description: 'Review and suggest improvements' },
  { type: 'tester', label: 'Test Writer', icon: '🧪', description: 'Generate test cases' },
]

const statusLabels: Record<string, string> = {
  idle: 'Idle',
  thinking: 'Thinking...',
  working: 'Working...',
  done: 'Done',
  failed: 'Failed',
}

export function AIAgentPanel({ card }: AIAgentPanelProps) {
  const { addAIAgent, updateAIAgent, removeAIAgent } = useBoardStore()
  const [showPicker, setShowPicker] = useState(false)
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null)

  const runAgent = async (agent: AIAgent) => {
    updateAIAgent(card.id, agent.id, { status: 'thinking', statusMessage: 'Initializing...' })

    try {
      const response = await fetch('/api/ai/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentType: agent.type,
          cardTitle: card.title,
          description: card.description,
        }),
      })

      if (!response.body) throw new Error('No response body')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const text = decoder.decode(value)
        const lines = text.split('\n').filter((l) => l.trim())

        for (const line of lines) {
          try {
            const data = JSON.parse(line)
            if (data.status === 'thinking') {
              updateAIAgent(card.id, agent.id, { status: 'thinking', statusMessage: data.message })
            } else if (data.status === 'working') {
              updateAIAgent(card.id, agent.id, { status: 'working', statusMessage: data.message })
            } else if (data.status === 'done') {
              updateAIAgent(card.id, agent.id, { status: 'done', statusMessage: 'Complete', result: data.result })
              setExpandedAgent(agent.id)
            } else if (data.status === 'failed') {
              updateAIAgent(card.id, agent.id, { status: 'failed', statusMessage: data.message })
            }
          } catch {
            // Skip malformed lines
          }
        }
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error'
      updateAIAgent(card.id, agent.id, { status: 'failed', statusMessage: msg })
    }
  }

  const handleAddAgent = (type: AIAgentType) => {
    addAIAgent(card.id, type)
    setShowPicker(false)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">AI Agents</h3>
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold transition-all duration-200 shadow-lg shadow-violet-900/30 flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Agent
        </button>
      </div>

      {showPicker && (
        <div className="grid grid-cols-1 gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
          <p className="text-xs text-white/50 mb-1">Select agent type:</p>
          {agentTypes.map(({ type, label, icon, description }) => (
            <button
              key={type}
              onClick={() => handleAddAgent(type)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors text-left group"
            >
              <span className="text-xl">{icon}</span>
              <div>
                <p className="text-sm font-medium text-white group-hover:text-violet-300 transition-colors">{label}</p>
                <p className="text-xs text-white/40">{description}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {card.aiAgents.length === 0 && !showPicker && (
        <div className="flex flex-col items-center justify-center p-6 rounded-xl border border-dashed border-white/10 text-center">
          <div className="text-3xl mb-2">🤖</div>
          <p className="text-sm text-white/40">No agents assigned yet</p>
          <p className="text-xs text-white/25 mt-1">Add an AI agent to automate tasks</p>
        </div>
      )}

      <div className="space-y-2">
        {card.aiAgents.map((agent) => (
          <div key={agent.id} className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
            <div className="flex items-center gap-3 p-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10">
                <span className="text-base">{agentTypes.find((a) => a.type === agent.type)?.icon || '🤖'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white truncate">{agent.name}</span>
                  <div className="flex items-center gap-1.5">
                    <AIStatusBadge status={agent.status} size="sm" />
                    <span className={`text-xs ${
                      agent.status === 'done' ? 'text-emerald-400' :
                      agent.status === 'failed' ? 'text-red-400' :
                      agent.status === 'thinking' ? 'text-yellow-400' :
                      agent.status === 'working' ? 'text-blue-400' : 'text-white/40'
                    }`}>
                      {statusLabels[agent.status]}
                    </span>
                  </div>
                </div>
                {agent.statusMessage && agent.status !== 'done' && (
                  <p className="text-xs text-white/40 mt-0.5 truncate">{agent.statusMessage}</p>
                )}
              </div>
              <div className="flex items-center gap-1">
                {(agent.status === 'idle' || agent.status === 'failed') && (
                  <button
                    onClick={() => runAgent(agent)}
                    className="px-2.5 py-1 rounded-md bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 text-xs font-medium transition-colors"
                  >
                    Run
                  </button>
                )}
                {agent.status === 'done' && agent.result && (
                  <button
                    onClick={() => setExpandedAgent(expandedAgent === agent.id ? null : agent.id)}
                    className="px-2.5 py-1 rounded-md bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 text-xs font-medium transition-colors"
                  >
                    {expandedAgent === agent.id ? 'Hide' : 'View'}
                  </button>
                )}
                <button
                  onClick={() => removeAIAgent(card.id, agent.id)}
                  className="p-1 rounded-md hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            {expandedAgent === agent.id && agent.result && (
              <div className="px-3 pb-3">
                <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/20">
                  <p className="text-xs text-emerald-300/80 font-mono whitespace-pre-wrap">{agent.result}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
