'use client'

import { useEffect, useRef, useState } from 'react'
import { useBoardStore } from '@/lib/store'

export function CardMemoryTracker() {
  const columns = useBoardStore((state) => state.columns)
  const cards = useBoardStore((state) => state.cards)
  const [processedCardIds, setProcessedCardIds] = useState<Set<string>>(new Set())
  const workerRef = useRef<Worker | null>(null)

  useEffect(() => {
    workerRef.current = new Worker(new URL('../app/kb-chat/worker.ts', import.meta.url), {
      type: 'module'
    })
    return () => workerRef.current?.terminate()
  }, [])

  useEffect(() => {
    const doneColumn = columns.find(c => c.id === 'done')
    if (!doneColumn) return

    const newDoneCards = doneColumn.cardIds.filter(id => !processedCardIds.has(id))
    
    if (newDoneCards.length > 0) {
      newDoneCards.forEach(async (cardId) => {
        setProcessedCardIds(prev => new Set(prev).add(cardId))
        
        const card = cards[cardId]
        if (!card) return

        console.log(`Saving completed card to AI Memory: ${card.title}`)
        
        const chatLogs = card.chatHistory.map(m => `${m.role}: ${m.content}`).join('\n')
        const agentLogs = card.aiAgents.map(a => `Agent ${a.type}: ${a.result || a.statusMessage}`).join('\n')
        
        const content = `Completed Task: ${card.title}
Priority: ${card.priority}
Tags: ${card.tags.join(', ')}

Description:
${card.description}

AI Chat History:
${chatLogs}

AI Agent Results:
${agentLogs}`

        if (!workerRef.current) return

        try {
          const embedding = await new Promise<number[]>((resolve, reject) => {
            if (!workerRef.current) return reject('No worker')
            const msgId = Date.now()
            const handler = (e: MessageEvent) => {
              if (e.data.id === msgId) {
                workerRef.current?.removeEventListener('message', handler)
                if (e.data.status === 'complete') resolve(e.data.output)
                else reject(e.data.error)
              }
            }
            workerRef.current.addEventListener('message', handler)
            workerRef.current.postMessage({ id: msgId, text: content })
          })

          await fetch('/api/knowledge/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              records: [{
                source_type: "card", source_id: `card-${card.id}`,
                title: `Task: ${card.title}`,
                
                content: content,
                embedding: embedding
              }]
            }),
          })
          console.log(`Successfully saved ${card.title} to knowledge base!`)
        } catch (e) {
          console.error('Failed to save card to memory', e)
        }
      })
    }
  }, [columns, cards, processedCardIds])

  return null
}
