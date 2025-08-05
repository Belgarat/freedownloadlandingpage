import { Inter } from 'next/font/google'
import './globals.css'
import { Metadata } from 'next'
import BookSchema from '@/components/BookSchema'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial']
})

export const metadata: Metadata = {
  title: 'Fish Cannot Carry Guns - Free Ebook Download',
  description: 'Download Fish Cannot Carry Guns by Michael B. Morgan - Free ebook with speculative short stories for fans of Black Mirror and cyberpunk. Complete collection available now.',
  keywords: 'ebook, science fiction, speculative fiction, short stories, cyberpunk, free download, Michael B. Morgan',
  authors: [{ name: 'Michael B. Morgan' }],
  openGraph: {
    title: 'Fish Cannot Carry Guns - Free Ebook Download',
    description: 'A collection of speculative short stories that delve into how technology fractures identity, erodes trust, and distorts reality. For fans of Black Mirror, cyberpunk noir, and fringe futurism.',
    type: 'website',
    images: [
      {
        url: '/ebook_cover.webp',
        width: 1200,
        height: 1600,
        alt: 'Fish Cannot Carry Guns Book Cover',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fish Cannot Carry Guns - Free Ebook Download',
    description: 'A collection of speculative short stories that delve into how technology fractures identity, erodes trust, and distorts reality.',
    images: ['/ebook_cover.webp'],
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'android-chrome', url: '/android-chrome-192x192.png', sizes: '192x192' },
      { rel: 'android-chrome', url: '/android-chrome-512x512.png', sizes: '512x512' },
    ],
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <BookSchema />
        {/* Preload critical resources */}
        <link rel="preload" href="/ebook_cover_small.webp" as="image" type="image/webp" />
        <link rel="preload" href="/favicon-32x32.png" as="image" type="image/png" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
} 