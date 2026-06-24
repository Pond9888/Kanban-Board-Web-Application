import type { Metadata } from 'next';
import { Inter, Fira_Code } from 'next/font/google';
import './globals.css';
import ScrollRevealInit from '@/components/ScrollRevealInit';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800', '900'],
  variable: '--font-inter',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-fira',
});

export const metadata: Metadata = {
  title: 'Teerawat — AI Systems Builder',
  description: 'Full-stack developer & AI strategist specializing in business automation, KPI systems, and AI-powered web applications.',
  openGraph: {
    title: 'Teerawat — AI Systems Builder | NextHorizon Studio',
    description: 'I build AI systems that work. Next.js, Supabase, Claude AI.',
    url: 'https://your-domain.vercel.app',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${firaCode.variable}`}>
        <ScrollRevealInit />
        {children}
      </body>
    </html>
  );
}
