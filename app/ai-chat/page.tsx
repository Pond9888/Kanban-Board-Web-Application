'use client'

import { useState, useEffect, useRef } from 'react'
import { useBoardStore } from '@/lib/store'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTIONS = [
  'Summarize the board for me',
  'Which tasks are critical or high priority?',
  'What should I work on next?',
  'Are any AI agents still running?',
]

export default function AIChatPage() {
  const { columns, cards } = useBoardStore()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const [mounted, setMounted] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingContent])

  const buildBoardSnapshot = () =>
    columns
      .map((col) => {
        const lines = col.cardIds
          .map((id) => cards[id])
          .filter(Boolean)
          .map((c) => {
            const agents = c.aiAgents.map((a) => `${a.name} (${a.status})`).join(', ')
            return [
              `- "${c.title}" [priority: ${c.priority}]`,
              c.assignees.length ? `  assignees: ${c.assignees.join(', ')}` : null,
              c.tags.length ? `  tags: ${c.tags.join(', ')}` : null,
              agents ? `  AI agents: ${agents}` : null,
              c.description ? `  description: ${c.description}` : null,
            ]
              .filter(Boolean)
              .join('\n')
          })
        return `## Column: ${col.title} (${lines.length} cards)\n${lines.join('\n') || '(empty)'}`
      })
      .join('\n\n')

  const send = async (question?: string) => {
    const q = (question ?? input).trim()
    if (!q || isStreaming) return

    const history = [...messages, { role: 'user' as const, content: q }]
    setMessages(history)
    setInput('')
    setIsStreaming(true)
    setStreamingContent('')

    try {
      const response = await fetch('/api/ai/board-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history.map(({ role, content }) => ({ role, content })),
          board: buildBoardSnapshot(),
        }),
      })

      if (!response.body) throw new Error('No response body')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let fullContent = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        fullContent += decoder.decode(value)
        setStreamingContent(fullContent)
      }

      setMessages((m) => [...m, { role: 'assistant', content: fullContent }])
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: 'Connection error — please try sending your message again.' }])
    } finally {
      setIsStreaming(false)
      setStreamingContent('')
    }
  }

  const totalCards = Object.keys(cards).length

  return (
    <main className="flex flex-col h-full overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-violet-900/15 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-indigo-900/15 blur-3xl" />
      </div>

      <header className="relative z-10 border-b border-white/8 bg-black/10 backdrop-blur-md px-6 py-3 shrink-0 flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] text-white/30 mb-0.5">Project Management / AI Chat</p>
          <h2 className="text-base font-bold text-white">AI Chat</h2>
        </div>
        {mounted && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Board-aware · {totalCards} cards in context
          </span>
        )}
      </header>

      <div className="relative z-10 flex-1 overflow-hidden p-6">
        <div className="max-w-3xl mx-auto h-full flex flex-col rounded-2xl bg-white/[0.03] border border-white/8 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.length === 0 && !isStreaming && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center mb-4 shadow-2xl shadow-indigo-900/40">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-white mb-1">Ask me about your board</h3>
                <p className="text-xs text-white/40 mb-5 max-w-xs">
                  I can see every column, card, priority, assignee and AI agent on your Kanban board right now.
                </p>
                <div className="flex flex-wrap justify-center gap-2 max-w-md">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs text-white/50 hover:text-white/90 hover:border-indigo-500/40 hover:bg-indigo-500/10 transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap
                    ${m.role === 'user'
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl rounded-br-md shadow-lg shadow-indigo-900/30'
                      : 'bg-white/[0.06] border border-white/8 text-white/80 rounded-2xl rounded-bl-md'
                    }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {isStreaming && (
              <div className="flex justify-start">
                <div className="max-w-[85%] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap bg-white/[0.06] border border-white/8 text-white/80 rounded-2xl rounded-bl-md">
                  {streamingContent || (
                    <span className="inline-flex items-center gap-1.5 py-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.15s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.3s]" />
                    </span>
                  )}
                  {streamingContent && <span className="inline-block w-1 h-3 bg-indigo-400 animate-pulse ml-0.5" />}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="border-t border-white/8 p-3 flex gap-2 shrink-0">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Ask about your board, e.g. What should I work on next?"
              className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
            <button
              onClick={() => send()}
              disabled={isStreaming || !input.trim()}
              className="px-5 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-900/40 disabled:opacity-30 disabled:shadow-none transition-all hover:opacity-90"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
