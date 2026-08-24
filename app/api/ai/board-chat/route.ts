import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'

export const runtime = 'edge'
export const maxDuration = 60

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(req: NextRequest) {
  const { messages, board, queryEmbedding } = await req.json()

  let kbContext = ''
  
  if (queryEmbedding && queryEmbedding.length > 0) {
    try {
      // Search Supabase for similar chunks
      const { data, error } = await supabase.rpc('match_knowledge', {
        query_embedding: queryEmbedding,
        match_threshold: 0.3, // Lower threshold to find more results
        match_count: 5,
      })

      if (error) {
        console.error('Supabase match_knowledge error:', error)
      } else if (data && data.length > 0) {
        kbContext = `\n\n=== RELEVANT KNOWLEDGE BASE DOCUMENTS ===\n` + 
          data.map((doc: any) => `Document: ${doc.title}\nContent:\n${doc.content}\n`).join('\n---\n')
      }
    } catch (e) {
      console.error('Error fetching knowledge:', e)
    }
  }

  const stream = await anthropic.messages.stream({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    system: `You are an AI assistant for a project management Kanban board. You have full visibility of the current board state below. Help the user understand their workload, find tasks, spot risks, and decide what to do next. When referring to tasks, use their exact titles. Be concise and helpful.

=== CURRENT BOARD STATE ===
${board}${kbContext}`,
    messages,
  })

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(event.delta.text))
          }
        }
        controller.close()
      } catch (error) {
        const msg = error instanceof Error ? error.message : 'AI service error'
        controller.enqueue(encoder.encode(`⚠️ AI service error: ${msg}`))
        controller.close()
      }
    },
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    },
  })
}
