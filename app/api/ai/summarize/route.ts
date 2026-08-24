import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest } from 'next/server'

export const runtime = 'edge'
export const maxDuration = 60

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(req: NextRequest) {
  const { cardTitle, description } = await req.json()

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const prompt = `Summarize this task into a concise 1-2 sentence description:

Title: ${cardTitle}
Current Description: ${description || '(none)'}`
    
    const resultResp = await model.generateContent(prompt)
    const text = resultResp.response.text()
    return new Response(text)
  } catch (error: any) {
    return new Response('Error', { status: 500 })
  }
}
