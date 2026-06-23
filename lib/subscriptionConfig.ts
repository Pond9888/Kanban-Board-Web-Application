export const FREE_MONTHLY_LIMIT = 10

export const PLANS = {
  free: {
    name: 'Free',
    price: 'ฟรี',
    aiLimit: FREE_MONTHLY_LIMIT,
    features: [
      `AI ${FREE_MONTHLY_LIMIT} ครั้ง/เดือน`,
      'Kanban Board ไม่จำกัด',
      'Task management',
      'Analytics',
    ],
  },
  pro: {
    name: 'Pro',
    price: '$2.99',
    period: '/เดือน',
    productId: 'kanban_ai_pro_monthly',
    aiLimit: Infinity,
    features: [
      'AI ไม่จำกัด',
      'AI Agents ทุกประเภท',
      'AI Chat ไม่จำกัด',
      'Priority & Summarize ไม่จำกัด',
      'Knowledge Bot ไม่จำกัด',
      'Automations ไม่จำกัด',
    ],
  },
} as const

// ตั้งค่า API Key ใน Vercel environment variables
// NEXT_PUBLIC_REVENUECAT_ANDROID_API_KEY=appl_xxxxxxxxxx
export const REVENUECAT_ANDROID_KEY =
  process.env.NEXT_PUBLIC_REVENUECAT_ANDROID_API_KEY ?? ''
