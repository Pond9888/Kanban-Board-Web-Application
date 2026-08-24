import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'

export const runtime = 'edge'
export const maxDuration = 60

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(req: NextRequest) {
  const { messages, cardTitle, description, queryEmbedding } = await req.json()
  
  let kbContext = ''
  
  if (queryEmbedding && queryEmbedding.length > 0) {
    try {
      const { data, error } = await supabase.rpc('match_knowledge', {
        query_embedding: queryEmbedding,
        match_threshold: 0.1,
        match_count: 20,
      })

      if (!error && data && data.length > 0) {
        kbContext = `\n\n=== RELEVANT COMPANY KNOWLEDGE & PAST CARDS ===\n` + 
          data.map((doc: any) => `Title: ${doc.title}\nContent:\n${doc.content}\n`).join('\n---\n')
      }
    } catch (e) {
      console.error('Error fetching knowledge:', e)
    }
  }

  const systemPrompt = `You are an AI assistant helping with a specific task card titled "${cardTitle}". Context: ${description || '(no description)'}.
${kbContext}

Be concise, helpful, and use the provided company knowledge or past cards if relevant.`
  
  const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash', systemInstruction: systemPrompt })
  
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
            controller.enqueue(encoder.encode(chunk.text()))
          }
          controller.close()
        } catch (error) {
          controller.error(error)
        }
      },
    })

    return new Response(readable, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Transfer-Encoding': 'chunked' },
    })
  } catch (error: any) {
    return new Response(`⚠️ AI error: ${error.message}`, { status: 500 })
  }
}
