'use client'

import { useState } from 'react'
import { PLANS, FREE_MONTHLY_LIMIT } from '@/lib/subscriptionConfig'
import { purchasePro, restorePurchases } from '@/lib/purchases'

interface PaywallModalProps {
  reason?: 'limit' | 'feature'
  onClose: () => void
}

export function PaywallModal({ reason = 'limit', onClose }: PaywallModalProps) {
  const [loading, setLoading] = useState(false)
  const [restoring, setRestoring] = useState(false)
  const [error, setError] = useState('')

  const handlePurchase = async () => {
    setLoading(true)
    setError('')
    const result = await purchasePro()
    setLoading(false)
    if (result.success) {
      onClose()
    } else {
      setError(result.error ?? 'เกิดข้อผิดพลาด กรุณาลองใหม่')
    }
  }

  const handleRestore = async () => {
    setRestoring(true)
    setError('')
    const result = await restorePurchases()
    setRestoring(false)
    if (result.success) {
      onClose()
    } else {
      setError(result.error ?? 'ไม่พบการซื้อที่ผ่านมา')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-sm rounded-3xl bg-[#0e0e1a] border border-white/10 shadow-2xl overflow-hidden animate-slide-up">
        {/* Gradient header */}
        <div className="relative bg-gradient-to-br from-violet-600 to-indigo-600 px-6 pt-8 pb-10">
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #fff 0%, transparent 60%)' }} />
          <button onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 text-white/70 hover:bg-white/20">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="text-center relative">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-3 shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white">Upgrade to Pro</h2>
            <p className="text-white/70 text-sm mt-1">
              {reason === 'limit'
                ? `ใช้ AI ครบ ${FREE_MONTHLY_LIMIT} ครั้งแล้วเดือนนี้`
                : 'ปลดล็อคฟีเจอร์ AI ทั้งหมด'}
            </p>
          </div>
        </div>

        {/* Price badge */}
        <div className="flex justify-center -mt-5 relative z-10">
          <div className="px-5 py-2 rounded-full bg-[#0e0e1a] border border-violet-500/40 shadow-lg">
            <span className="text-2xl font-bold text-white">{PLANS.pro.price}</span>
            <span className="text-white/50 text-sm">{PLANS.pro.period}</span>
          </div>
        </div>

        <div className="px-6 pt-4 pb-6 space-y-4">
          {/* Features */}
          <div className="space-y-2.5">
            {PLANS.pro.features.map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-white/80">{f}</span>
              </div>
            ))}
          </div>

          {/* Free tier reminder */}
          <div className="rounded-xl bg-white/[0.04] border border-white/8 p-3 flex gap-2 items-start">
            <svg className="w-4 h-4 text-white/30 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-white/40">
              แพ็คเกจฟรีให้ใช้ AI {FREE_MONTHLY_LIMIT} ครั้ง/เดือน
              แพ็ค Pro ใช้ได้ไม่จำกัด ยกเลิกได้ทุกเมื่อผ่าน Play Store
            </p>
          </div>

          {error && (
            <p className="text-xs text-red-400 text-center">{error}</p>
          )}

          {/* CTA */}
          <button
            onClick={handlePurchase}
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-base shadow-lg shadow-violet-900/40 transition-all active:scale-[0.98]"
          >
            {loading ? 'กำลังดำเนินการ...' : `สมัคร Pro — ${PLANS.pro.price}${PLANS.pro.period}`}
          </button>

          <button
            onClick={handleRestore}
            disabled={restoring}
            className="w-full py-2.5 text-sm text-white/40 hover:text-white/60 transition-colors"
          >
            {restoring ? 'กำลังตรวจสอบ...' : 'คืนค่าการซื้อ (Restore Purchases)'}
          </button>
        </div>
      </div>
    </div>
  )
}
