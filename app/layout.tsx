import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fish Cannot Carry Guns - Free Ebook Download',
  description: 'A collection of speculative short stories that delve into how technology fractures identity, erodes trust, and distorts reality. For fans of Black Mirror, cyberpunk noir, and fringe futurism.',
  keywords: 'ebook, science fiction, speculative fiction, short stories, cyberpunk, free download, Michael Morgan',
  authors: [{ name: 'Michael Morgan' }],
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
      <body className={inter.className}>{children}</body>
    </html>
  )
} 