import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ConfigStatus from '@/components/ConfigStatus'

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📚</text></svg>" />
      </head>
      <body className={inter.className}>
        {children}
        <ConfigStatus />
      </body>
    </html>
  )
} 