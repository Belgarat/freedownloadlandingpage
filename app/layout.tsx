import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import ConfigStatus from '@/components/ConfigStatus'
import { useConfig } from '@/lib/useConfig'
import ThemeVariables from '@/components/ThemeVariables'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fish Cannot Carry Guns - Free Ebook Download',
  description: 'Download Fish Cannot Carry Guns by Michael B. Morgan - Free ebook with speculative short stories for fans of Black Mirror and cyberpunk. Complete collection available now.',
  keywords: 'ebook, science fiction, speculative fiction, short stories, cyberpunk, free download, Michael B. Morgan, Fish Cannot Carry Guns',
  authors: [{ name: 'Michael B. Morgan' }],
  openGraph: {
    title: 'Fish Cannot Carry Guns - Free Ebook',
    description: 'Download your free copy of Fish Cannot Carry Guns by Michael B. Morgan. A collection of speculative short stories for fans of Black Mirror and cyberpunk noir.',
    type: 'website',
    url: 'https://fishcannotcarryguns.aroundscifi.us',
    images: [
      {
        url: 'https://fishcannotcarryguns.aroundscifi.us/ebook_cover.webp',
        width: 1200,
        height: 630,
        alt: 'Fish Cannot Carry Guns Book Cover',
      },
    ],
    siteName: 'Fish Cannot Carry Guns',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fish Cannot Carry Guns - Free Ebook',
    description: 'Download your free copy of Fish Cannot Carry Guns by Michael B. Morgan',
    images: ['https://fishcannotcarryguns.aroundscifi.us/ebook_cover.webp'],
  },
  robots: 'index, follow',
  alternates: {
    canonical: 'https://fishcannotcarryguns.aroundscifi.us',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Expose config client-side for helpers (e.g., SEO generator)
  // Using a small client component pattern here
  const InjectConfig = () => {
    const { config } = useConfig()
    if (!config) return null
    return (
      <script
        dangerouslySetInnerHTML={{
          __html: `window.__APP_CONFIG__ = ${JSON.stringify(config).replace(/</g, '\u003c')}`,
        }}
      />
    )
  }

  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📚</text></svg>" />
        {/* Inject Book Schema if present */}
        <Script id="book-schema" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify((typeof window !== 'undefined' && (window as any).__APP_CONFIG__?.seo?.structuredData?.book) || null)}
        </Script>
      </head>
      <body className={inter.className} style={{ fontFamily: 'var(--font-body, inherit)' }}>
        <ThemeVariables />
        <InjectConfig />
        {children}
        <ConfigStatus />
      </body>
    </html>
  )
}