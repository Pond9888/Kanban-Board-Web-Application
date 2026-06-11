'use client'

import { useState, useEffect, useRef } from 'react'
import { useKBStore, KBEntry } from '@/lib/kbStore'

interface Message {
  role: 'user' | 'assistant'
  text: string
  source?: string | null
}

const WELCOME: Message = {
  role: 'assistant',
  text: "Hi! I'm Knowledge Bot. I answer questions using only the knowledge base on this page. Try asking me something like \"How do AI Agents work?\" or \"How do I move a card?\"",
}

const SUGGESTIONS = [
  'How do AI Agents work?',
  'How do I move a card?',
  'What do priority levels mean?',
]

export default function KBChatPage() {
  const [tab, setTab] = useState<'chat' | 'kb'>('chat')
  const [mounted, setMounted] = useState(false)
  const entries = useKBStore((s) => s.entries)

  useEffect(() => setMounted(true), [])

  return (
    <main className="flex flex-col h-full overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-violet-900/15 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-indigo-900/15 blur-3xl" />
      </div>

      <header className="relative z-10 border-b border-white/8 bg-black/10 backdrop-blur-md px-6 py-3 shrink-0 flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] text-white/30 mb-0.5">Project Management / Knowledge Bot</p>
          <h2 className="text-base font-bold text-white">Knowledge Bot</h2>
        </div>
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/8">
          {([
            ['chat', 'Chat'],
            ['kb', 'Knowledge Base'],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all
                ${tab === key
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-900/40'
                  : 'text-white/40 hover:text-white/80'
                }`}
            >
              {label}
              {key === 'kb' && mounted && (
                <span className={`ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${tab === key ? 'bg-white/20' : 'bg-white/10'}`}>
                  {entries.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      <div className="relative z-10 flex-1 overflow-hidden p-6">
        {!mounted ? null : tab === 'chat' ? <ChatPanel kb={entries} /> : <KbPanel />}
      </div>
    </main>
  )
}

function ChatPanel({ kb }: { kb: KBEntry[] }) {
  const [messages, setMessages] = useState<Message[]>([WELCOME])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async (question?: string) => {
    const q = (question ?? input).trim()
    if (!q || loading) return
    const history = [...messages, { role: 'user' as const, text: q }]
    setMessages(history)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/ai/kb-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kb: kb.map(({ title, content }) => ({ title, content })),
          history: history.map(({ role, text }) => ({ role, text })),
        }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setMessages((m) => [...m, { role: 'assistant', text: `Sorry, the AI service returned an error: ${data.error ?? res.statusText}` }])
        return
      }
      setMessages((m) => [...m, { role: 'assistant', text: data.answer ?? 'Something went wrong.', source: data.source }])
    } catch {
      setMessages((m) => [...m, { role: 'assistant', text: 'Connection error — please try sending your question again.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto h-full flex flex-col rounded-2xl bg-white/[0.03] border border-white/8 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex flex-col max-w-[85%] ${m.role === 'user' ? 'self-end items-end ml-auto' : 'self-start items-start'}`}>
            <div
              className={`px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap
                ${m.role === 'user'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl rounded-br-md shadow-lg shadow-indigo-900/30'
                  : 'bg-white/[0.06] border border-white/8 text-white/80 rounded-2xl rounded-bl-md'
                }`}
            >
              {m.text}
            </div>
            {m.source && (
              <span className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/25 text-indigo-300 text-[11px] font-medium">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Source: {m.source}
              </span>
            )}
          </div>
        ))}

        {loading && (
          <div className="self-start flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-bl-md bg-white/[0.06] border border-white/8 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" />
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.15s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.3s]" />
          </div>
        )}

        {messages.length === 1 && !loading && (
          <div className="flex flex-wrap gap-2 pt-2">
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
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-white/8 p-3 flex gap-2 shrink-0">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Ask a question, e.g. How do AI Agents work?"
          className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-indigo-500/50 transition-colors"
        />
        <button
          onClick={() => send()}
          disabled={loading || !input.trim()}
          className="px-5 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-900/40 disabled:opacity-30 disabled:shadow-none transition-all hover:opacity-90"
        >
          Send
        </button>
      </div>
    </div>
  )
}

function KbPanel() {
  const { entries, addEntry, updateEntry, removeEntry } = useKBStore()
  const [editing, setEditing] = useState<string | null>(null) // entry id | 'new' | null
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const startEdit = (entry: KBEntry | null) => {
    setEditing(entry ? entry.id : 'new')
    setTitle(entry ? entry.title : '')
    setContent(entry ? entry.content : '')
  }

  const save = () => {
    if (!title.trim() || !content.trim()) return
    if (editing === 'new') {
      addEntry(title.trim(), content.trim())
    } else if (editing) {
      updateEntry(editing, title.trim(), content.trim())
    }
    setEditing(null)
  }

  return (
    <div className="max-w-3xl mx-auto h-full overflow-y-auto">
      <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
        <div>
          <h3 className="text-lg font-bold text-white">Knowledge Base</h3>
          <p className="text-xs text-white/40 mt-1">
            The bot answers only from the entries on this page — edit here and answers change instantly.
          </p>
        </div>
        <button
          onClick={() => startEdit(null)}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-900/40 hover:opacity-90 transition-all"
        >
          + Add Entry
        </button>
      </div>

      {editing !== null && (
        <div className="rounded-2xl bg-white/[0.04] border-2 border-indigo-500/40 p-4 mb-5">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Topic title, e.g. Exporting Boards"
            className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm font-semibold text-white placeholder:text-white/25 focus:outline-none focus:border-indigo-500/50 mb-3"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Details / steps you want the bot to use when answering"
            rows={5}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white/80 placeholder:text-white/25 leading-relaxed resize-y focus:outline-none focus:border-indigo-500/50"
          />
          <div className="flex gap-2 mt-3">
            <button
              onClick={save}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:opacity-90 transition-all"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(null)}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-white/10 text-white/50 hover:text-white/80 hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3 pb-6">
        {entries.length === 0 && (
          <p className="text-sm text-white/40">No entries yet — click &quot;Add Entry&quot; to start teaching the bot.</p>
        )}
        {entries.map((e) => (
          <div key={e.id} className="rounded-2xl bg-white/[0.03] border border-white/8 p-4 hover:border-white/15 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <h4 className="text-sm font-semibold text-white">{e.title}</h4>
              <div className="flex gap-1.5 shrink-0">
                <button
                  onClick={() => startEdit(e)}
                  className="px-3 py-1 rounded-lg text-[11px] font-medium border border-white/10 text-white/50 hover:text-indigo-300 hover:border-indigo-500/40 transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={() => removeEntry(e.id)}
                  className="px-3 py-1 rounded-lg text-[11px] font-medium border border-white/10 text-white/50 hover:text-red-400 hover:border-red-500/40 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="text-xs text-white/45 leading-relaxed mt-2">{e.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
