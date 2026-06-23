import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { FREE_MONTHLY_LIMIT } from './subscriptionConfig'

function currentMonth() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

interface SubscriptionState {
  isPro: boolean
  usageCount: number
  usageMonth: string

  canUseAI: () => boolean
  remainingUses: () => number
  incrementUsage: () => void
  setPro: (value: boolean) => void
  resetUsageForNewMonth: () => void
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      isPro: false,
      usageCount: 0,
      usageMonth: currentMonth(),

      canUseAI: () => {
        const state = get()
        // รีเซ็ตถ้าขึ้นเดือนใหม่
        if (state.usageMonth !== currentMonth()) {
          set({ usageCount: 0, usageMonth: currentMonth() })
          return true
        }
        return state.isPro || state.usageCount < FREE_MONTHLY_LIMIT
      },

      remainingUses: () => {
        const state = get()
        if (state.isPro) return Infinity
        if (state.usageMonth !== currentMonth()) return FREE_MONTHLY_LIMIT
        return Math.max(0, FREE_MONTHLY_LIMIT - state.usageCount)
      },

      incrementUsage: () => {
        const state = get()
        if (state.isPro) return
        const month = currentMonth()
        // รีเซ็ตถ้าขึ้นเดือนใหม่
        if (state.usageMonth !== month) {
          set({ usageCount: 1, usageMonth: month })
        } else {
          set({ usageCount: state.usageCount + 1 })
        }
      },

      setPro: (value) => set({ isPro: value }),

      resetUsageForNewMonth: () => {
        const month = currentMonth()
        if (get().usageMonth !== month) {
          set({ usageCount: 0, usageMonth: month })
        }
      },
    }),
    { name: 'kanban-subscription-v1' }
  )
)
