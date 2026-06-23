'use client'

import { useEffect } from 'react'
import { initPurchases } from '@/lib/purchases'
import { useSubscriptionStore } from '@/lib/subscriptionStore'

export function PurchasesInitializer() {
  const resetUsageForNewMonth = useSubscriptionStore((s) => s.resetUsageForNewMonth)

  useEffect(() => {
    resetUsageForNewMonth()
    initPurchases()
  }, [resetUsageForNewMonth])

  return null
}
