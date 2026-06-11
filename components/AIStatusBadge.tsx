'use client'

import { AIAgentStatus } from '@/lib/types'

interface AIStatusBadgeProps {
  status: AIAgentStatus
  size?: 'sm' | 'md'
}

export function AIStatusBadge({ status, size = 'sm' }: AIStatusBadgeProps) {
  const dotSize = size === 'sm' ? 'w-2 h-2' : 'w-3 h-3'

  if (status === 'idle') return <span className={`${dotSize} rounded-full bg-gray-500 inline-block`} />
  if (status === 'thinking') return <span className={`${dotSize} rounded-full bg-yellow-400 inline-block animate-pulse`} />
  if (status === 'working') return <span className={`${dotSize} rounded-full border-2 border-blue-400 border-t-transparent inline-block animate-spin`} />
  if (status === 'done') return (
    <span className={`${dotSize} rounded-full bg-emerald-400 inline-flex items-center justify-center`}>
      <svg className="w-1.5 h-1.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </span>
  )
  if (status === 'failed') return (
    <span className={`${dotSize} rounded-full bg-red-500 inline-flex items-center justify-center`}>
      <svg className="w-1.5 h-1.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </span>
  )
  return null
}
