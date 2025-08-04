import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'The Trapper - Free Ebook Download',
  description: 'For fans of Cormac McCarthy and Ernest Hemingway comes a debut novel that Book Sirens calls "Heartbreakingly beautiful, raw and enchanting. ★★★★★"',
  keywords: 'ebook, novel, fiction, literary fiction, free download',
  authors: [{ name: 'Author Name' }],
  openGraph: {
    title: 'The Trapper - Free Ebook Download',
    description: 'For fans of Cormac McCarthy and Ernest Hemingway comes a debut novel that Book Sirens calls "Heartbreakingly beautiful, raw and enchanting. ★★★★★"',
    type: 'website',
  },
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