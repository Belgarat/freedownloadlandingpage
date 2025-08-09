'use client'

import { useEffect } from 'react'
import { useConfig } from '@/lib/useConfig'

export default function ThemeVariables() {
  const { theme } = useConfig()

  useEffect(() => {
    if (!theme) return
    const root = document.documentElement
    const set = (k: string, v: string) => root.style.setProperty(k, v)
    const c = theme.colors
    set('--color-primary', c.primary)
    set('--color-secondary', c.secondary)
    set('--color-accent', c.accent)
    set('--color-background', c.background)
    set('--color-text-primary', c.text.primary)
    set('--color-text-secondary', c.text.secondary)
    set('--color-text-muted', c.text.muted)
    set('--color-success', c.success)
    set('--color-error', c.error)
    set('--color-warning', c.warning)
    if (theme.background?.gradientEnabled) {
      set('--bg-gradient', `linear-gradient(${theme.background.gradientDirection || 'to bottom right'}, ${c.primary}, ${c.secondary})`)
    } else {
      set('--bg-gradient', 'none')
    }
  }, [theme])

  return null
}


