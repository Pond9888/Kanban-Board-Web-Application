'use client'

import { useState, useEffect } from 'react'
import {
  useAutomationStore,
  dispatchToWebhook,
  AutomationRule,
  AutomationTrigger,
  TRIGGER_LABELS,
} from '@/lib/automationStore'

const SAMPLE_PAYLOADS: Record<AutomationTrigger, object> = {
  'card.created': {
    event: 'card.created',
    card: { id: 'card-test', title: 'Sample task', priority: 'medium', tags: ['demo'], assignees: ['Admin'] },
    column: 'Todo',
  },
  'card.moved': {
    event: 'card.moved',
    card: { id: 'card-test', title: 'Sample task', priority: 'high', tags: ['demo'], assignees: ['Admin'] },
    from: 'In Progress',
    to: 'Done',
  },
  'card.critical': {
    event: 'card.critical',
    card: { id: 'card-test', title: 'Sample task', priority: 'critical', tags: ['demo'], assignees: ['Admin'] },
  },
  'agent.done': {
    event: 'agent.done',
    card: { id: 'card-test', title: 'Sample task', priority: 'high', tags: ['demo'], assignees: ['Admin'] },
    agent: { name: 'Researcher', type: 'researcher', result: 'Sample agent result text.' },
  },
}

export default function AutomationsPage() {
  const { rules, addRule, updateRule, removeRule, setLastRun } = useAutomationStore()
  const [mounted, setMounted] = useState(false)
  const [editing, setEditing] = useState<string | null>(null) // rule id | 'new' | null
  const [name, setName] = useState('')
  const [trigger, setTrigger] = useState<AutomationTrigger>('card.moved')
  const [webhookUrl, setWebhookUrl] = useState('')
  const [testing, setTesting] = useState<string | null>(null)
  const [guideOpen, setGuideOpen] = useState(false)

  useEffect(() => setMounted(true), [])

  const startEdit = (rule: AutomationRule | null) => {
    setEditing(rule ? rule.id : 'new')
    setName(rule ? rule.name : '')
    setTrigger(rule ? rule.trigger : 'card.moved')
    setWebhookUrl(rule ? rule.webhookUrl : '')
  }

  const save = () => {
    if (!name.trim() || !webhookUrl.trim()) return
    if (editing === 'new') {
      addRule(name.trim(), trigger, webhookUrl.trim())
    } else if (editing) {
      updateRule(editing, { name: name.trim(), trigger, webhookUrl: webhookUrl.trim() })
    }
    setEditing(null)
  }

  const testRule = async (rule: AutomationRule) => {
    setTesting(rule.id)
    const payload = { ...SAMPLE_PAYLOADS[rule.trigger], firedAt: new Date().toISOString(), rule: rule.name, test: true }
    const result = await dispatchToWebhook(rule.webhookUrl, payload)
    setLastRun(rule.id, { at: Date.now(), ...result })
    setTesting(null)
  }

  return (
    <main className="flex flex-col h-full overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-violet-900/15 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-indigo-900/15 blur-3xl" />
      </div>

      <header className="relative z-10 border-b border-white/8 bg-black/10 backdrop-blur-md px-6 py-3 shrink-0 flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] text-white/30 mb-0.5">Project Management / Automations</p>
          <h2 className="text-base font-bold text-white">Automations</h2>
        </div>
        <button
          onClick={() => startEdit(null)}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-900/40 hover:opacity-90 transition-all"
        >
          + New Rule
        </button>
      </header>

      <div className="relative z-10 flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto space-y-5 pb-10">
          <div className="rounded-2xl bg-white/[0.03] border border-white/8 p-4">
            <p className="text-sm text-white/70 font-medium mb-1">Send board events to Make, Zapier or n8n</p>
            <p className="text-xs text-white/40 leading-relaxed">
              When something happens on your board — a card is created, moved, marked critical, or an AI agent
              finishes — the matching rules below fire a webhook with a JSON payload. Connect it to a Make
              scenario to send notifications, log to Google Sheets, or trigger anything else.
            </p>
            <button
              onClick={() => setGuideOpen(!guideOpen)}
              className="mt-3 text-xs font-semibold text-indigo-300 hover:text-indigo-200 transition-colors"
            >
              {guideOpen ? '▾ Hide Make setup guide' : '▸ How to set up in Make (3 steps)'}
            </button>
            {guideOpen && (
              <div className="mt-3 space-y-3 text-xs text-white/50 leading-relaxed">
                <div className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
                  <p>In Make, create a new <span className="text-white/80">Scenario</span> and choose <span className="text-white/80">Webhooks → Custom webhook</span> as the trigger. Click <span className="text-white/80">Add</span> to generate a hook, then copy the URL (looks like <code className="text-indigo-300">https://hook.eu2.make.com/abc123...</code>).</p>
                </div>
                <div className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
                  <p>Create a rule on this page, paste the webhook URL, then press <span className="text-white/80">Test</span> while Make shows &quot;Listening for data&quot; — Make will learn the payload structure automatically.</p>
                </div>
                <div className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
                  <p>Add any action module after the webhook (Gmail, Line, Google Sheets, Slack…) and turn the scenario <span className="text-white/80">ON</span>. Done — board events now flow into Make.</p>
                </div>
                <div>
                  <p className="text-white/40 font-semibold mb-1.5">Example payload (card.moved):</p>
                  <pre className="rounded-xl bg-black/30 border border-white/8 p-3 text-[11px] text-emerald-300/80 overflow-x-auto">{JSON.stringify({ event: 'card.moved', firedAt: '2026-06-11T12:00:00.000Z', rule: 'Notify on Done', card: { id: 'card-7', title: 'Deploy v2.0 to production', priority: 'high', tags: ['deployment'], assignees: ['Jack', 'Kate'] }, from: 'In Progress', to: 'Done' }, null, 2)}</pre>
                </div>
              </div>
            )}
          </div>

          {editing !== null && (
            <div className="rounded-2xl bg-white/[0.04] border-2 border-indigo-500/40 p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rule name, e.g. Notify on Done"
                  className="px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm font-semibold text-white placeholder:text-white/25 focus:outline-none focus:border-indigo-500/50"
                />
                <select
                  value={trigger}
                  onChange={(e) => setTrigger(e.target.value as AutomationTrigger)}
                  className="px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white focus:outline-none focus:border-indigo-500/50 [&>option]:bg-[#12121f]"
                >
                  {(Object.keys(TRIGGER_LABELS) as AutomationTrigger[]).map((t) => (
                    <option key={t} value={t}>{TRIGGER_LABELS[t]}</option>
                  ))}
                </select>
              </div>
              <input
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="Webhook URL from Make, e.g. https://hook.eu2.make.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white/80 placeholder:text-white/25 focus:outline-none focus:border-indigo-500/50"
              />
              <div className="flex gap-2 mt-3">
                <button onClick={save} className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:opacity-90 transition-all">
                  Save
                </button>
                <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-xl text-xs font-semibold border border-white/10 text-white/50 hover:text-white/80 hover:bg-white/5 transition-all">
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {mounted && rules.length === 0 && editing === null && (
              <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center">
                <p className="text-sm text-white/40 mb-1">No automation rules yet</p>
                <p className="text-xs text-white/25">Click &quot;New Rule&quot; to connect your board to Make</p>
              </div>
            )}
            {mounted && rules.map((rule) => (
              <div key={rule.id} className={`rounded-2xl border p-4 transition-colors ${rule.enabled ? 'bg-white/[0.03] border-white/8 hover:border-white/15' : 'bg-white/[0.01] border-white/5 opacity-60'}`}>
                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    onClick={() => updateRule(rule.id, { enabled: !rule.enabled })}
                    className={`w-9 h-5 rounded-full relative transition-colors shrink-0 ${rule.enabled ? 'bg-indigo-600' : 'bg-white/10'}`}
                    title={rule.enabled ? 'Disable' : 'Enable'}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${rule.enabled ? 'left-[18px]' : 'left-0.5'}`} />
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{rule.name}</p>
                    <p className="text-[11px] text-white/35 truncate">{rule.webhookUrl}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-violet-500/15 border border-violet-500/25 text-violet-300 text-[11px] font-medium shrink-0">
                    {TRIGGER_LABELS[rule.trigger]}
                  </span>
                  <div className="flex gap-1.5 shrink-0">
                    <button
                      onClick={() => testRule(rule)}
                      disabled={testing === rule.id}
                      className="px-3 py-1 rounded-lg text-[11px] font-medium border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 disabled:opacity-40 transition-all"
                    >
                      {testing === rule.id ? 'Sending…' : 'Test'}
                    </button>
                    <button onClick={() => startEdit(rule)} className="px-3 py-1 rounded-lg text-[11px] font-medium border border-white/10 text-white/50 hover:text-indigo-300 hover:border-indigo-500/40 transition-all">
                      Edit
                    </button>
                    <button onClick={() => removeRule(rule.id)} className="px-3 py-1 rounded-lg text-[11px] font-medium border border-white/10 text-white/50 hover:text-red-400 hover:border-red-500/40 transition-all">
                      Delete
                    </button>
                  </div>
                </div>
                {rule.lastRun && (
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${rule.lastRun.ok ? 'bg-emerald-400' : 'bg-red-400'}`} />
                    <p className={`text-[11px] truncate ${rule.lastRun.ok ? 'text-emerald-400/80' : 'text-red-400/80'}`}>
                      {new Date(rule.lastRun.at).toLocaleString()} — {rule.lastRun.detail}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
