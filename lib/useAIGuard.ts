'use client'

import { useState, useCallback } from 'react'
import { useSubscriptionStore } from './subscriptionStore'

export function useAIGuard() {
  const { canUseAI, incrementUsage } = useSubscriptionStore()
  const [showPaywall, setShowPaywall] = useState(false)

  const guard = useCallback((): boolean => {
    if (!canUseAI()) {
      setShowPaywall(true)
      return false
    }
    incrementUsage()
    return true
  }, [canUseAI, incrementUsage])

  return { guard, showPaywall, setShowPaywall }
}
