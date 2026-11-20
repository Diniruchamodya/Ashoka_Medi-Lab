import { Analytics } from '@vercel/analytics/next'
import { asset } from '@/lib/asset'
import type { Metadata, Viewport } from 'next'
import { Inter, Manrope } from 'next/font/google'
import { DemoStoreProvider } from '@/components/demo/demo-store'
import { ToastProvider } from '@/components/shared/toast'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' })

export const metadata: Metadata = {
  title: {
    default: 'Ashoka Medi-Lab | Fast, Accurate & Affordable Laboratory Services',
    template: '%s | Ashoka Medi-Lab',
  },
  description:
    'With over 35 years of experience, Ashoka Medi-Lab delivers fast, accurate, and affordable laboratory services to support your health and well-being.',
  keywords: ['medical laboratory', 'blood test', 'diagnostic lab', 'health checkup', 'Ashoka Medi-Lab'],
  icons: {
    icon: asset('/images/ashoka-logo.jpg'),
    apple: asset('/images/ashoka-logo.jpg'),
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#06b6d4',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable} bg-background`}>
      <body className="font-sans antialiased">
        <DemoStoreProvider>
          <ToastProvider>{children}</ToastProvider>
        </DemoStoreProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
