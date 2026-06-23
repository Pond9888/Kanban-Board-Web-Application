import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Sidebar } from '@/components/Sidebar'
import { MobileHeader } from '@/components/MobileHeader'
import { MobileBottomNav } from '@/components/MobileBottomNav'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Kanban AI',
  description: 'AI-powered task management',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Kanban AI',
  },
  icons: {
    icon: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
    ],
  },
}

export const viewport: Viewport = {
  themeColor: '#6366f1',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#080810]`}>
        {/* Mobile header — visible only on small screens */}
        <MobileHeader />

        <div className="flex h-screen overflow-hidden pt-0 md:pt-0">
          {/* Sidebar — hidden on mobile, shown on md+ */}
          <Sidebar />

          {/* Main content area */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden pb-[env(safe-area-inset-bottom)]">
            {children}
          </div>
        </div>

        {/* Bottom nav — visible only on mobile */}
        <MobileBottomNav />
      </body>
    </html>
  )
}
