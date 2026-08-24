import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'
export const maxDuration = 60

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(req: NextRequest) {
  const { title, description } = await req.json()

  const promptText = `Analyze this task and determine its priority (Low, Medium, High, Urgent).
Title: ${title}
Description: ${description || '(no description)'}

Return ONLY a JSON object with this exact structure:
{
  "priority": "High",
  "reasoning": "A short 1-sentence explanation"
}`

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const resultResp = await model.generateContent(promptText)
    const text = resultResp.response.text()
    
    // Gemini sometimes wraps JSON in markdown blocks
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    const jsonString = jsonMatch ? jsonMatch[0] : text

    const parsed = JSON.parse(jsonString)
    return NextResponse.json(parsed)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
