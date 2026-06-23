import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Card } from './types'
import { apiUrl } from './apiUrl'

export type AutomationTrigger = 'card.created' | 'card.moved' | 'card.critical' | 'agent.done'

export const TRIGGER_LABELS: Record<AutomationTrigger, string> = {
  'card.created': 'Card created',
  'card.moved': 'Card moved to another column',
  'card.critical': 'Card priority set to Critical',
  'agent.done': 'AI agent finished',
}

export interface AutomationRule {
  id: string
  name: string
  trigger: AutomationTrigger
  webhookUrl: string
  enabled: boolean
  lastRun?: { at: number; ok: boolean; detail: string }
}

interface AutomationState {
  rules: AutomationRule[]
  addRule: (name: string, trigger: AutomationTrigger, webhookUrl: string) => void
  updateRule: (id: string, updates: Partial<Omit<AutomationRule, 'id'>>) => void
  removeRule: (id: string) => void
  setLastRun: (id: string, lastRun: AutomationRule['lastRun']) => void
}

export const useAutomationStore = create<AutomationState>()(
  persist(
    (set) => ({
      rules: [],
      addRule: (name, trigger, webhookUrl) =>
        set((state) => ({
          rules: [...state.rules, { id: 'rule-' + Date.now(), name, trigger, webhookUrl, enabled: true }],
        })),
      updateRule: (id, updates) =>
        set((state) => ({
          rules: state.rules.map((r) => (r.id === id ? { ...r, ...updates } : r)),
        })),
      removeRule: (id) =>
        set((state) => ({
          rules: state.rules.filter((r) => r.id !== id),
        })),
      setLastRun: (id, lastRun) =>
        set((state) => ({
          rules: state.rules.map((r) => (r.id === id ? { ...r, lastRun } : r)),
        })),
    }),
    { name: 'kanban-automations-v1' }
  )
)

export const cardSummary = (card: Card) => ({
  id: card.id,
  title: card.title,
  priority: card.priority,
  tags: card.tags,
  assignees: card.assignees,
})

export async function dispatchToWebhook(url: string, payload: object): Promise<{ ok: boolean; detail: string }> {
  try {
    const res = await fetch(apiUrl('/api/automations/dispatch'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, payload }),
    })
    const data = await res.json()
    return { ok: Boolean(data.ok), detail: data.detail ?? `HTTP ${data.status ?? res.status}` }
  } catch {
    return { ok: false, detail: 'Network error' }
  }
}

export function fireAutomation(trigger: AutomationTrigger, payload: object) {
  if (typeof window === 'undefined') return
  const { rules, setLastRun } = useAutomationStore.getState()
  const matching = rules.filter((r) => r.enabled && r.trigger === trigger && r.webhookUrl)
  for (const rule of matching) {
    const body = { event: trigger, firedAt: new Date().toISOString(), rule: rule.name, ...payload }
    dispatchToWebhook(rule.webhookUrl, body).then((result) => {
      useAutomationStore.getState().setLastRun(rule.id, { at: Date.now(), ...result })
    })
  }
}
