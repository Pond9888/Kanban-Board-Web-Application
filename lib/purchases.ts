'use client'

import { REVENUECAT_ANDROID_KEY, PLANS } from './subscriptionConfig'
import { useSubscriptionStore } from './subscriptionStore'

// ตรวจสอบว่ารันบน Capacitor (Android) หรือเว็บ
function isNative(): boolean {
  return typeof window !== 'undefined' &&
    !!(window as unknown as Record<string, unknown>).Capacitor
}

export async function initPurchases(): Promise<void> {
  if (!isNative() || !REVENUECAT_ANDROID_KEY) return
  try {
    const { Purchases, LOG_LEVEL } = await import('@revenuecat/purchases-capacitor')
    await Purchases.setLogLevel({ level: LOG_LEVEL.ERROR })
    await Purchases.configure({ apiKey: REVENUECAT_ANDROID_KEY })
    // sync สถานะ subscription จาก RevenueCat
    await syncSubscriptionStatus()
  } catch (e) {
    console.error('RevenueCat init failed:', e)
  }
}

export async function syncSubscriptionStatus(): Promise<void> {
  if (!isNative()) return
  try {
    const { Purchases } = await import('@revenuecat/purchases-capacitor')
    const { customerInfo } = await Purchases.getCustomerInfo()
    const isPro = customerInfo.activeSubscriptions.includes(PLANS.pro.productId)
    useSubscriptionStore.getState().setPro(isPro)
  } catch (e) {
    console.error('RevenueCat sync failed:', e)
  }
}

export async function purchasePro(): Promise<{ success: boolean; error?: string }> {
  if (!isNative()) {
    // บนเว็บ: redirect ไปหน้า payment (ไม่รองรับ in-app purchase)
    return { success: false, error: 'In-app purchase is only available on Android.' }
  }
  try {
    const { Purchases } = await import('@revenuecat/purchases-capacitor')
    const offeringsResult = await Purchases.getOfferings()
    const pkg = offeringsResult.current?.availablePackages?.[0]
    if (!pkg) return { success: false, error: 'No packages available.' }

    const { customerInfo } = await Purchases.purchasePackage({ aPackage: pkg })
    const isPro = customerInfo.activeSubscriptions.includes(PLANS.pro.productId)
    useSubscriptionStore.getState().setPro(isPro)
    return { success: isPro }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Purchase failed.'
    return { success: false, error: msg }
  }
}

export async function restorePurchases(): Promise<{ success: boolean; error?: string }> {
  if (!isNative()) return { success: false, error: 'Only available on Android.' }
  try {
    const { Purchases } = await import('@revenuecat/purchases-capacitor')
    const { customerInfo } = await Purchases.restorePurchases()
    const isPro = customerInfo.activeSubscriptions.includes(PLANS.pro.productId)
    useSubscriptionStore.getState().setPro(isPro)
    return { success: true }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Restore failed.'
    return { success: false, error: msg }
  }
}
