'use client'

import { useState, useRef } from 'react'
import { X } from 'lucide-react'

interface TagInputProps {
  values: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export default function TagInput({ values, onChange, placeholder = 'Aggiungi categoria e premi Invio', disabled = false, className = '' }: TagInputProps) {
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)

  const normalize = (v: string) => v.trim()
  const exists = (v: string) => values.some(t => t.toLowerCase() === v.toLowerCase())

  const commit = (raw: string) => {
    const cleaned = normalize(raw)
    if (!cleaned || exists(cleaned)) return
    onChange([...values, cleaned])
  }

  const removeAt = (idx: number) => {
    const next = values.slice()
    next.splice(idx, 1)
    onChange(next)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return
    if (['Enter', 'Tab', ','].includes(e.key)) {
      e.preventDefault()
      if (input) {
        commit(input)
        setInput('')
      }
    } else if (e.key === 'Backspace' && input === '' && values.length > 0) {
      // Rimuovi ultimo tag se backspace su input vuoto
      removeAt(values.length - 1)
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text')
    if (text.includes(',') || text.includes('\n')) {
      e.preventDefault()
      const parts = text
        .split(/[,\n]/)
        .map(normalize)
        .filter(Boolean)
        .filter((v) => !exists(v))
      if (parts.length) onChange([...values, ...parts])
    }
  }

  return (
    <div className={`w-full border border-gray-300 rounded-md px-2 py-2 focus-within:ring-2 focus-within:ring-blue-500 ${className}`}>
      <div className="flex flex-wrap gap-2">
        {values.map((tag, idx) => (
          <span key={`${tag}-${idx}`} className="inline-flex items-center gap-1 bg-blue-50 border border-blue-200 text-blue-700 text-xs px-2 py-1 rounded">
            {tag}
            <button
              type="button"
              aria-label={`Rimuovi ${tag}`}
              onClick={() => removeAt(idx)}
              className="hover:text-blue-900"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          className="flex-1 min-w-[140px] outline-none text-sm py-1"
          placeholder={values.length === 0 ? placeholder : ''}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          disabled={disabled}
        />
      </div>
    </div>
  )
}


