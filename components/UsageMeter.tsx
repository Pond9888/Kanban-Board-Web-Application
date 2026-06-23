'use client'

import { useState } from 'react'
import { useSubscriptionStore } from '@/lib/subscriptionStore'
import { FREE_MONTHLY_LIMIT } from '@/lib/subscriptionConfig'
import { PaywallModal } from './PaywallModal'

export function UsageMeter() {
  const { isPro, usageCount, remainingUses } = useSubscriptionStore()
  const [showPaywall, setShowPaywall] = useState(false)
  const remaining = remainingUses()

  if (isPro) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-500/15 border border-violet-500/25">
        <svg className="w-3 h-3 text-violet-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span className="text-[10px] font-bold text-violet-400">PRO</span>
      </div>
    )
  }

  const pct = Math.min(100, (usageCount / FREE_MONTHLY_LIMIT) * 100)
  const isLow = remaining <= 3
  const isEmpty = remaining === 0

  return (
    <>
      <button
        onClick={() => setShowPaywall(true)}
        className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/10 hover:bg-white/10 transition-colors"
      >
        {/* Mini progress bar */}
        <div className="w-16 h-1 rounded-full bg-white/10 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              isEmpty ? 'bg-red-500' : isLow ? 'bg-amber-500' : 'bg-indigo-500'
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className={`text-[10px] font-semibold ${
          isEmpty ? 'text-red-400' : isLow ? 'text-amber-400' : 'text-white/50'
        }`}>
          {isEmpty ? 'หมดแล้ว' : `${remaining} AI`}
        </span>
      </button>

      {showPaywall && <PaywallModal reason={isEmpty ? 'limit' : 'feature'} onClose={() => setShowPaywall(false)} />}
    </>
  )
}
