import Anthropic from '@anthropic-ai/sdk'

export const runtime = 'edge'
export const maxDuration = 60
import { NextRequest, NextResponse } from 'next/server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

interface KBEntry {
  title: string
  content: string
}

interface ChatTurn {
  role: 'user' | 'assistant'
  text: string
}

export async function POST(req: NextRequest) {
  const { kb, history } = (await req.json()) as { kb: KBEntry[]; history: ChatTurn[] }

  const kbText = (kb || [])
    .map((e, i) => `[${i + 1}] ${e.title}\n${e.content}`)
    .join('\n\n')

  const conversation = (history || [])
    .map((m) => (m.role === 'user' ? 'User: ' : 'Bot: ') + m.text)
    .join('\n')

  const prompt = `You are Knowledge Bot, an AI assistant that answers user questions about this project management system. Be polite and concise.
Answer ONLY using the knowledge base below. If the answer is not in the knowledge base, say honestly that you don't have that information and suggest adding it to the knowledge base. Never guess or make up information.

Respond with ONLY valid JSON (no markdown, no other text) in this exact format:
{"answer": "your answer", "source": "title of the knowledge base entry you used, or null if none"}

=== KNOWLEDGE BASE ===
${kbText}

=== CONVERSATION ===
${conversation}`

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  })

  const content = message.content[0]
  if (content.type !== 'text') {
    return NextResponse.json({ error: 'Unexpected response' }, { status: 500 })
  }

  const raw = content.text.replace(/```json|```/g, '').trim()
  try {
    const parsed = JSON.parse(raw)
    return NextResponse.json({ answer: parsed.answer, source: parsed.source ?? null })
  } catch {
    return NextResponse.json({ answer: raw, source: null })
  }
}
