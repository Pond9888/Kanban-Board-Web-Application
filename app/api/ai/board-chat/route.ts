import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'

export const runtime = 'edge'
export const maxDuration = 60

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(req: NextRequest) {
  const { messages, board, queryEmbedding } = await req.json()

  let kbContext = ''
  
  if (queryEmbedding && queryEmbedding.length > 0) {
    try {
      const { data, error } = await supabase.rpc('match_knowledge', {
        query_embedding: queryEmbedding,
        match_threshold: 0.3,
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

  const systemPrompt = `You are an AI assistant for a project management Kanban board. You have full visibility of the current board state below. Help the user understand their workload, find tasks, spot risks, and decide what to do next. When referring to tasks, use their exact titles. Be concise and helpful.

=== CURRENT BOARD STATE ===
${board}${kbContext}`

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: systemPrompt,
  })

  // Convert messages to Gemini format
  // messages format: [{ role: 'user' | 'assistant', content: '...' }]
  const history = messages.slice(0, -1).map((msg: any) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }))
  
  const currentMessage = messages[messages.length - 1].content

  try {
    const chat = model.startChat({ history })
    const result = await chat.sendMessageStream(currentMessage)
    
    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text()
            controller.enqueue(encoder.encode(chunkText))
          }
          controller.close()
        } catch (error) {
          const msg = error instanceof Error ? error.message : 'AI service error'
          controller.enqueue(encoder.encode(`\n⚠️ AI service error: ${msg}`))
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
  } catch (error: any) {
    return new Response(`⚠️ AI error: ${error.message}`, { status: 500 })
  }
}
