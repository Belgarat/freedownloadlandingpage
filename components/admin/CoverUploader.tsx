'use client'

import { useRef, useState } from 'react'
import { getStorageProvider } from '@/lib/storage'

interface CoverUploaderProps {
  value?: string
  onUploaded: (publicUrl: string) => void
}

export default function CoverUploader({ value, onUploaded }: CoverUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | undefined>(value)

  const onSelect = async (file: File) => {
    setError(null)
    if (!file.type.startsWith('image/')) {
      setError('File must be an image')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Maximum size 5MB')
      return
    }
    setPreview(URL.createObjectURL(file))
    setUploading(true)
    try {
      const storage = getStorageProvider()
      const { publicUrl } = await storage.uploadFile(file, { path: 'covers', contentType: file.type })
      onUploaded(publicUrl)
    } catch (e: any) {
      setError(e?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2 flex items-center justify-between">
      {preview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="Preview cover" className="w-48 h-auto rounded border" />
      )}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Upload image'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) onSelect(file)
          }}
        />
        {value && (
          <span className="text-xs text-gray-600 break-all">{value}</span>
        )}
      </div>
      {error && <div className="text-xs text-red-600">{error}</div>}
    </div>
  )
}


