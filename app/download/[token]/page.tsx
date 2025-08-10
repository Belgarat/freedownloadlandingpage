'use client'

import { useEffect, useState } from 'react'
import { Download, AlertCircle, CheckCircle, BookOpen, ExternalLink, FileText } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useConfig } from '@/lib/useConfig'

interface DownloadPageProps {
  params: Promise<{ token: string }>
}

export default function DownloadPage({ params }: DownloadPageProps) {
  const [token, setToken] = useState<string>('')
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [downloadStarted, setDownloadStarted] = useState(false)
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'epub'>('pdf')
  const router = useRouter()
  const { book } = useConfig()

  useEffect(() => {
    const getToken = async () => {
      try {
        const { token: tokenParam } = await params
        setToken(tokenParam)
        
        // Validate token
        const response = await fetch(`/api/validate-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: tokenParam }),
        })

        if (response.ok) {
          setIsValid(true)
        } else {
          const data = await response.json()
          setError(data.error || 'Invalid download link')
          setIsValid(false)
        }
      } catch (err) {
        setError('Failed to validate download link')
        setIsValid(false)
      } finally {
        setIsLoading(false)
      }
    }

    getToken()
  }, [params])

  const handleDownload = async () => {
    if (!token || !book?.ebook) return

    setIsLoading(true)
    try {
      // Track download attempt
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'download_page_clicked',
          timestamp: new Date().toISOString(),
        }),
      })

      // Trigger download with format parameter
      const response = await fetch(`/api/download/${token}?format=${selectedFormat}`)
      
      if (response.ok) {
        // For redirects, we need to handle the response differently
        if (response.redirected) {
          // The API redirected to the actual file URL
          window.location.href = response.url
        } else {
          // Fallback for direct file serving
          const blob = await response.blob()
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = book.ebook[selectedFormat]?.filename || `book.${selectedFormat}`
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)
        }
        
        setDownloadStarted(true)
        
        // Track successful download
        await fetch('/api/analytics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'download_completed',
            timestamp: new Date().toISOString(),
          }),
        })
      } else {
        const data = await response.json()
        setError(data.error || 'Download failed')
      }
    } catch (err) {
      setError('Download failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state while config is loading
  if (isLoading || !book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-900 via-cyan-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-900 via-cyan-900 to-blue-900 flex items-center justify-center">
        <div className="bg-[#073E44] backdrop-blur-sm rounded-lg shadow-xl p-8 text-center border border-teal-700/50 max-w-md w-full mx-4">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-white mb-4">Download Link Invalid</h1>
          <p className="text-teal-100 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-cyan-900 to-blue-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Your Download is Ready!</h1>
            <p className="text-teal-100 text-lg">Click the button below to download your free copy of "Fish Cannot Carry Guns"</p>
          </div>

          {/* Download Section */}
          <div className="bg-[#073E44] backdrop-blur-sm rounded-lg shadow-xl p-6 sm:p-8 border border-teal-700/50 mb-8">
            <div className="text-center">
              <BookOpen className="w-16 h-16 text-amber-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-4">{book?.title || 'Book'}</h2>
              <p className="text-teal-100 mb-6">
                {book?.description || 'Download your free copy'}
              </p>

              {/* Format Selection */}
              {book?.ebook && (book.ebook.pdf || book.ebook.epub) && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-teal-200 mb-3">Choose Format:</label>
                  <div className="flex justify-center gap-4">
                    {book?.ebook.pdf && (
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="format"
                          value="pdf"
                          checked={selectedFormat === 'pdf'}
                          onChange={() => setSelectedFormat('pdf')}
                          className="text-amber-600"
                        />
                        <FileText className="w-5 h-5 text-red-400" />
                        <span className="text-teal-100">PDF</span>
                        <span className="text-teal-300 text-sm">({book.ebook.pdf.size})</span>
                      </label>
                    )}
                    {book?.ebook.epub && (
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="format"
                          value="epub"
                          checked={selectedFormat === 'epub'}
                          onChange={() => setSelectedFormat('epub')}
                          className="text-amber-600"
                        />
                        <BookOpen className="w-5 h-5 text-blue-400" />
                        <span className="text-teal-100">EPUB</span>
                        <span className="text-teal-300 text-sm">({book.ebook.epub.size})</span>
                      </label>
                    )}
                  </div>
                </div>
              )}
              
              {downloadStarted ? (
                <div className="bg-green-900/50 border border-green-700 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <p className="text-green-300 font-medium">Download started! Check your downloads folder.</p>
                  </div>
                </div>
                                ) : (
                    <button
                      onClick={handleDownload}
                      disabled={isLoading || !book?.ebook}
                      className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-800 text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 text-lg"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                          <span>Preparing Download...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-6 h-6" />
                          <span>Download {selectedFormat.toUpperCase()}</span>
                        </>
                      )}
                    </button>
                  )}

              {error && (
                <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-300 flex-shrink-0" />
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Support Section */}
          <div className="bg-[#073E44] backdrop-blur-sm rounded-lg shadow-xl p-6 sm:p-8 border border-teal-700/50 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4 text-center">Support Independent Authors</h3>
            <p className="text-teal-100 text-center mb-6">
              Since this book is completely free, we'd be grateful if you could support {book.author} in these ways:
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {book.goodreadsUrl && (
                <a
                  href={book.goodreadsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <BookOpen className="w-5 h-5" />
                  <span>Add to Goodreads</span>
                </a>
              )}
              
              {book.substackUrl && (
                <a
                  href={book.substackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <ExternalLink className="w-5 h-5" />
                  <span>Subscribe to {book.substackName || 'Substack'}</span>
                </a>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-teal-200 text-sm">
            <p>© 2025 {book.author}. All rights reserved.</p>
            <div className="mt-4">
              <a href="/" className="underline hover:text-white transition-colors">
                Return to Homepage
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 