import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(req: NextRequest) {
  const { title, description } = await req.json()

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 256,
    messages: [
      {
        role: 'user',
        content: `Analyze this task and suggest a priority level. Respond with ONLY valid JSON.

Title: ${title}
Description: ${description}

Respond with exactly this JSON format:
{"priority": "low"|"medium"|"high"|"critical", "reason": "brief explanation"}`,
      },
    ],
  })

  const content = message.content[0]
  if (content.type !== 'text') {
    return NextResponse.json({ error: 'Unexpected response' }, { status: 500 })
  }

  try {
    const parsed = JSON.parse(content.text)
    return NextResponse.json(parsed)
  } catch {
    return NextResponse.json({ error: 'Failed to parse response' }, { status: 500 })
  }
}
