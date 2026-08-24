import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest } from 'next/server'

export const runtime = 'edge'
export const maxDuration = 60

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(req: NextRequest) {

  const { messages, cardTitle, description } = await req.json()
  
  const systemPrompt = `You are an AI assistant helping with a task card titled "${cardTitle}". Context: ${description}. Be concise and helpful.`
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash', systemInstruction: systemPrompt })
  
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
