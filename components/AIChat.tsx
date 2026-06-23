'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, ChatMessage } from '@/lib/types'
import { useBoardStore } from '@/lib/store'
import { apiUrl } from '@/lib/apiUrl'
import { useAIGuard } from '@/lib/useAIGuard'
import { PaywallModal } from './PaywallModal'

interface AIChatProps {
  card: Card
}

export function AIChat({ card }: AIChatProps) {
  const { addChatMessage } = useBoardStore()
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const { guard, showPaywall, setShowPaywall } = useAIGuard()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [card.chatHistory, streamingContent])

  const sendMessage = async () => {
    if (!input.trim() || isStreaming) return
    if (!guard()) return

    const userMessage: ChatMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    }

    addChatMessage(card.id, userMessage)
    setInput('')
    setIsStreaming(true)
    setStreamingContent('')

    const messages = [...card.chatHistory, userMessage].map(({ role, content }) => ({ role, content }))

    try {
      const response = await fetch(apiUrl('/api/ai/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          cardTitle: card.title,
          description: card.description,
        }),
      })

      if (!response.body) throw new Error('No response body')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let fullContent = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        fullContent += chunk
        setStreamingContent(fullContent)
      }

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: fullContent,
        timestamp: Date.now(),
      }
      addChatMessage(card.id, assistantMessage)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to get response'
      addChatMessage(card.id, {
        role: 'assistant',
        content: `Error: ${errorMsg}`,
        timestamp: Date.now(),
      })
    } finally {
      setIsStreaming(false)
      setStreamingContent('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">AI Assistant</h3>
          <p className="text-xs text-white/40">Ask anything about this task</p>
        </div>
        {isStreaming && (
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1">
        {card.chatHistory.length === 0 && !isStreaming && (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div className="w-12 h-12 rounded-full bg-violet-900/30 flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <p className="text-sm text-white/40">Start a conversation</p>
            <p className="text-xs text-white/25 mt-1">Ask about implementation details, blockers, or anything else</p>
          </div>
        )}

        {card.chatHistory.map((message, i) => (
          <div key={i} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
              message.role === 'user'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-tr-sm'
                : 'bg-white/8 border border-white/10 text-white/90 rounded-tl-sm'
            }`}>
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
              <p className={`text-[10px] mt-1 ${message.role === 'user' ? 'text-white/50' : 'text-white/30'}`}>
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {isStreaming && streamingContent && (
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-2xl rounded-tl-sm px-4 py-2.5 bg-white/8 border border-white/10 text-white/90">
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{streamingContent}</p>
              <span className="inline-block w-1 h-3 bg-violet-400 animate-pulse ml-0.5" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2 items-end">
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message AI assistant... (Enter to send)"
            rows={2}
            className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 resize-none focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all"
          />
        </div>
        <button
          onClick={sendMessage}
          disabled={!input.trim() || isStreaming}
          className="p-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-all duration-200 shadow-lg shadow-violet-900/30 flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
        </button>
      </div>
    </div>
    {showPaywall && <PaywallModal reason="limit" onClose={() => setShowPaywall(false)} />}
    </>
  )
}
