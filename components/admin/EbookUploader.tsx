'use client'

import { useState } from 'react'
import { Upload, FileText, BookOpen, Trash2, Download, CheckCircle, AlertCircle } from 'lucide-react'

interface EbookFile {
  url: string
  filename: string
  size: string
  uploadedAt: string
}

interface EbookConfig {
  pdf?: EbookFile
  epub?: EbookFile
  defaultFormat: 'pdf' | 'epub'
}

interface EbookUploaderProps {
  value: EbookConfig
  onChange: (config: EbookConfig) => void
}

export default function EbookUploader({ value, onChange }: EbookUploaderProps) {
  const [uploading, setUploading] = useState<'pdf' | 'epub' | null>(null)
  const [error, setError] = useState<string | null>(null)

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleFileUpload = async (file: File, format: 'pdf' | 'epub') => {
    setUploading(format)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('path', 'ebooks')
      formData.append('type', 'ebook')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const result = await response.json()
      
      const newFile: EbookFile = {
        url: result.publicUrl,
        filename: result.filename,
        size: formatFileSize(result.size),
        uploadedAt: new Date().toISOString()
      }

      const newConfig = {
        ...value,
        [format]: newFile,
        defaultFormat: value.defaultFormat || 'pdf'
      }

      onChange(newConfig)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(null)
    }
  }

  const handleFileDelete = (format: 'pdf' | 'epub') => {
    const newConfig = { ...value }
    delete newConfig[format]
    
    // If we're deleting the default format, switch to the other one if available
    if (format === value.defaultFormat) {
      const otherFormat = format === 'pdf' ? 'epub' : 'pdf'
      newConfig.defaultFormat = newConfig[otherFormat] ? otherFormat : 'pdf'
    }
    
    onChange(newConfig)
  }

  const handleDefaultFormatChange = (format: 'pdf' | 'epub') => {
    onChange({
      ...value,
      defaultFormat: format
    })
  }

  const renderFileInfo = (format: 'pdf' | 'epub', file: EbookFile) => (
    <div className="bg-gray-50 rounded-lg p-4 border">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {format === 'pdf' ? <FileText className="w-5 h-5 text-red-500" /> : <BookOpen className="w-5 h-5 text-blue-500" />}
          <span className="font-medium text-gray-900">{file.filename}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleFileDelete(format)}
            className="text-red-500 hover:text-red-700 transition-colors"
            title="Delete file"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="text-sm text-gray-600 space-y-1">
        <div>Size: {file.size}</div>
        <div>Uploaded: {new Date(file.uploadedAt).toLocaleDateString()}</div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <a
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          <Download className="w-4 h-4" />
          Preview
        </a>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="defaultFormat"
            value={format}
            checked={value.defaultFormat === format}
            onChange={() => handleDefaultFormatChange(format)}
            className="text-blue-600"
          />
          Default format
        </label>
      </div>
    </div>
  )

  const renderUploadArea = (format: 'pdf' | 'epub') => {
    const isUploading = uploading === format
    const hasFile = value[format]
    
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
        <input
          type="file"
          id={`${format}-upload`}
          accept={format === 'pdf' ? '.pdf' : '.epub'}
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFileUpload(file, format)
          }}
          className="hidden"
          disabled={isUploading}
        />
        <label
          htmlFor={`${format}-upload`}
          className={`cursor-pointer block ${isUploading ? 'opacity-50' : ''}`}
        >
          <div className="flex flex-col items-center gap-2">
            {isUploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            ) : hasFile ? (
              <CheckCircle className="w-8 h-8 text-green-500" />
            ) : (
              <Upload className="w-8 h-8 text-gray-400" />
            )}
            <div>
              <div className="font-medium text-gray-900">
                {isUploading ? 'Uploading...' : hasFile ? 'File uploaded' : `Upload ${format.toUpperCase()}`}
              </div>
              <div className="text-sm text-gray-500">
                {format === 'pdf' ? 'PDF file' : 'EPUB file'} • Max 50MB
              </div>
            </div>
          </div>
        </label>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Ebook Files</h3>
        <p className="text-sm text-gray-600 mb-4">
          Upload PDF and EPUB versions of your ebook. At least one format is required for downloads.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Upload Error</span>
          </div>
          <p className="text-red-700 mt-1">{error}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* PDF Upload */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-red-500" />
            PDF Version
          </h4>
          {value.pdf ? renderFileInfo('pdf', value.pdf) : renderUploadArea('pdf')}
        </div>

        {/* EPUB Upload */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-500" />
            EPUB Version
          </h4>
          {value.epub ? renderFileInfo('epub', value.epub) : renderUploadArea('epub')}
        </div>
      </div>

      {/* Default Format Selection */}
      {(value.pdf || value.epub) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Default Download Format</h4>
          <p className="text-sm text-blue-700 mb-3">
            Choose which format users will download by default when they request your ebook.
          </p>
          <div className="flex gap-4">
            {value.pdf && (
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="defaultFormat"
                  value="pdf"
                  checked={value.defaultFormat === 'pdf'}
                  onChange={() => handleDefaultFormatChange('pdf')}
                  className="text-blue-600"
                />
                <span className="text-sm">PDF</span>
              </label>
            )}
            {value.epub && (
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="defaultFormat"
                  value="epub"
                  checked={value.defaultFormat === 'epub'}
                  onChange={() => handleDefaultFormatChange('epub')}
                  className="text-blue-600"
                />
                <span className="text-sm">EPUB</span>
              </label>
            )}
          </div>
        </div>
      )}

      {/* Status */}
      {!value.pdf && !value.epub && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-yellow-800">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">No ebook files uploaded</span>
          </div>
          <p className="text-yellow-700 mt-1">
            Upload at least one format (PDF or EPUB) to enable ebook downloads.
          </p>
        </div>
      )}
    </div>
  )
}
