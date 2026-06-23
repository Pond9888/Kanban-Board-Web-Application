'use client'

import { useState } from 'react'
import { useSubscriptionStore } from '@/lib/subscriptionStore'
import { PLANS, FREE_MONTHLY_LIMIT } from '@/lib/subscriptionConfig'
import { purchasePro, restorePurchases } from '@/lib/purchases'
import { PaywallModal } from '@/components/PaywallModal'

export default function SettingsPage() {
  const { isPro, usageCount, remainingUses } = useSubscriptionStore()
  const [showPaywall, setShowPaywall] = useState(false)
  const [restoring, setRestoring] = useState(false)
  const [restoreMsg, setRestoreMsg] = useState('')

  const remaining = remainingUses()
  const pct = Math.min(100, (usageCount / FREE_MONTHLY_LIMIT) * 100)

  const handleRestore = async () => {
    setRestoring(true)
    setRestoreMsg('')
    const result = await restorePurchases()
    setRestoring(false)
    setRestoreMsg(result.success ? 'คืนค่าการซื้อสำเร็จ!' : (result.error ?? 'ไม่พบการซื้อที่ผ่านมา'))
  }

  return (
    <main className="flex flex-col h-full overflow-auto main-scroll">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-violet-900/15 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-indigo-900/15 blur-3xl" />
      </div>

      <header className="relative z-10 border-b border-white/8 bg-black/10 backdrop-blur-md px-6 py-3 shrink-0">
        <p className="text-[11px] text-white/30 mb-0.5">Kanban AI / Settings</p>
        <h2 className="text-base font-bold text-white">Settings</h2>
      </header>

      <div className="relative z-10 flex-1 p-4 sm:p-6 max-w-lg mx-auto w-full space-y-4">

        {/* Subscription Card */}
        <section className="rounded-2xl border border-white/10 overflow-hidden">
          {/* Header */}
          <div className={`px-5 py-4 ${isPro
            ? 'bg-gradient-to-r from-violet-600/20 to-indigo-600/20 border-b border-violet-500/20'
            : 'bg-white/[0.04] border-b border-white/8'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">แพ็คเกจของคุณ</h3>
                <p className="text-xs text-white/50 mt-0.5">
                  {isPro ? 'Pro — ใช้ AI ได้ไม่จำกัด' : `Free — เหลือ ${remaining === Infinity ? FREE_MONTHLY_LIMIT : remaining} ครั้งเดือนนี้`}
                </p>
              </div>
              {isPro ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-500/20 border border-violet-500/30">
                  <svg className="w-3 h-3 text-violet-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-xs font-bold text-violet-400">PRO</span>
                </div>
              ) : (
                <div className="px-3 py-1.5 rounded-full bg-white/8 border border-white/10">
                  <span className="text-xs text-white/50 font-medium">Free</span>
                </div>
              )}
            </div>
          </div>

          {/* Usage bar (Free only) */}
          {!isPro && (
            <div className="px-5 py-4 border-b border-white/8 bg-white/[0.02]">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-white/50">AI ที่ใช้เดือนนี้</span>
                <span className="text-white/70 font-medium">{usageCount} / {FREE_MONTHLY_LIMIT}</span>
              </div>
              <div className="h-2 rounded-full bg-white/8 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    pct >= 100 ? 'bg-red-500' : pct >= 70 ? 'bg-amber-500' : 'bg-indigo-500'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              {remaining === 0 && (
                <p className="text-xs text-red-400 mt-2">หมดโควต้าแล้ว — อัปเกรดเป็น Pro เพื่อใช้ต่อ</p>
              )}
            </div>
          )}

          {/* Plan comparison */}
          <div className="px-5 py-4 grid grid-cols-2 gap-4">
            {/* Free */}
            <div>
              <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-2">Free</p>
              {PLANS.free.features.map((f) => (
                <div key={f} className="flex items-start gap-2 mb-1.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="w-1 h-1 rounded-full bg-white/40" />
                  </span>
                  <span className="text-xs text-white/40">{f}</span>
                </div>
              ))}
            </div>
            {/* Pro */}
            <div>
              <p className="text-[10px] font-semibold text-violet-400 uppercase tracking-widest mb-2">Pro</p>
              {PLANS.pro.features.map((f) => (
                <div key={f} className="flex items-start gap-2 mb-1.5">
                  <svg className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xs text-white/70">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          {!isPro && (
            <div className="px-5 pb-5 space-y-2">
              <button
                onClick={() => setShowPaywall(true)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-violet-900/30 transition-all active:scale-[0.98]"
              >
                อัปเกรดเป็น Pro — {PLANS.pro.price}{PLANS.pro.period}
              </button>
              <button
                onClick={handleRestore}
                disabled={restoring}
                className="w-full py-2 text-xs text-white/35 hover:text-white/55 transition-colors"
              >
                {restoring ? 'กำลังตรวจสอบ...' : 'คืนค่าการซื้อ (Restore Purchases)'}
              </button>
              {restoreMsg && (
                <p className="text-xs text-center text-white/50">{restoreMsg}</p>
              )}
            </div>
          )}

          {isPro && (
            <div className="px-5 pb-5">
              <p className="text-xs text-white/30 text-center">
                จัดการหรือยกเลิก subscription ได้ที่ Google Play Store →{' '}
                <span className="text-white/50">Subscriptions</span>
              </p>
            </div>
          )}
        </section>

        {/* App info */}
        <section className="rounded-2xl bg-white/[0.03] border border-white/8 divide-y divide-white/8">
          <div className="px-5 py-3 flex justify-between items-center">
            <span className="text-sm text-white/60">เวอร์ชัน</span>
            <span className="text-sm text-white/40">1.0.0</span>
          </div>
          <div className="px-5 py-3 flex justify-between items-center">
            <span className="text-sm text-white/60">App ID</span>
            <span className="text-sm text-white/40">com.kanbanai.app</span>
          </div>
          <div className="px-5 py-3 flex justify-between items-center">
            <span className="text-sm text-white/60">AI Model</span>
            <span className="text-sm text-white/40">Claude Haiku</span>
          </div>
        </section>

        {/* Links */}
        <section className="rounded-2xl bg-white/[0.03] border border-white/8 divide-y divide-white/8">
          <a href="mailto:support@kanbanai.app" className="px-5 py-3 flex justify-between items-center">
            <span className="text-sm text-white/60">ติดต่อ Support</span>
            <svg className="w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </a>
          <a href="/privacy-policy" className="px-5 py-3 flex justify-between items-center">
            <span className="text-sm text-white/60">Privacy Policy</span>
            <svg className="w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </section>

      </div>

      {showPaywall && <PaywallModal reason="feature" onClose={() => setShowPaywall(false)} />}
    </main>
  )
}
