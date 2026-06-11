import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

export const runtime = 'edge'
export const maxDuration = 60

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const agentPrompts: Record<string, { thinking: string; working: string; prompt: string }> = {
  summarizer: {
    thinking: 'Analyzing task requirements and context...',
    working: 'Writing improved summary and description...',
    prompt: 'Summarize and improve this task description. Make it clear, actionable, and well-structured.',
  },
  researcher: {
    thinking: 'Researching best approaches and solutions...',
    working: 'Compiling research findings and recommendations...',
    prompt: 'Research the best approaches, tools, and solutions for this task. Provide actionable insights.',
  },
  coder: {
    thinking: 'Analyzing technical requirements...',
    working: 'Writing code snippets and implementation guide...',
    prompt: 'Write relevant code snippets, pseudocode, or implementation guidance for this task.',
  },
  reviewer: {
    thinking: 'Reviewing task scope and requirements...',
    working: 'Identifying improvements and potential issues...',
    prompt: 'Review this task. Identify potential issues, improvements, and missing requirements.',
  },
  tester: {
    thinking: 'Analyzing test scenarios and edge cases...',
    working: 'Generating comprehensive test cases...',
    prompt: 'Generate comprehensive test cases for this task including happy paths, edge cases, and error scenarios.',
  },
}

function sendLine(controller: ReadableStreamDefaultController, encoder: TextEncoder, data: object) {
  controller.enqueue(encoder.encode(JSON.stringify(data) + '\n'))
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function POST(req: NextRequest) {
  const { agentType, cardTitle, description } = await req.json()
  const agentConfig = agentPrompts[agentType] || agentPrompts.summarizer

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      try {
        sendLine(controller, encoder, { status: 'thinking', message: agentConfig.thinking })
        await sleep(1500)

        sendLine(controller, encoder, { status: 'working', message: agentConfig.working })

        const message = await anthropic.messages.create({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 1024,
          messages: [
            {
              role: 'user',
              content: `${agentConfig.prompt}\n\nTask: ${cardTitle}\nDescription: ${description || '(no description)'}`,
            },
          ],
        })

        const content = message.content[0]
        const result = content.type === 'text' ? content.text : 'Task completed.'

        sendLine(controller, encoder, { status: 'done', result })
        controller.close()
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        sendLine(controller, encoder, { status: 'failed', message: `Error: ${errorMessage}` })
        controller.close()
      }
    },
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'application/x-ndjson',
      'Transfer-Encoding': 'chunked',
    },
  })
}
