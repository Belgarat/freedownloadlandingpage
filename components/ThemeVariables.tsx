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

    // Surface variables
    if (theme.surface?.mode === 'custom') {
      const bgAlpha = typeof theme.surface.bgOpacity === 'number' ? Math.max(0, Math.min(100, theme.surface.bgOpacity)) / 100 : 0.85
      const borderAlpha = typeof theme.surface.borderOpacity === 'number' ? Math.max(0, Math.min(100, theme.surface.borderOpacity)) / 100 : 0.5
      set('--surface-bg', `${theme.surface.bgColor || '#000000'}${''}`)
      set('--surface-bg-alpha', String(bgAlpha))
      set('--surface-border', `${theme.surface.borderColor || '#ffffff'}${''}`)
      set('--surface-border-alpha', String(borderAlpha))
    } else {
      // Auto: blend background with a tint of primary
      set('--surface-bg', 'color-mix(in srgb, var(--color-background) 92%, var(--color-primary) 8%)')
      set('--surface-bg-alpha', '1')
      set('--surface-border', 'color-mix(in srgb, var(--color-background) 80%, white 20%)')
      set('--surface-border-alpha', '1')
    }
  }, [theme])

  return null
}


