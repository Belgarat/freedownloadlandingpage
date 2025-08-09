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

    // Fonts
    const f = theme.fonts
    if (f?.heading) set('--font-heading', f.heading)
    if (f?.body) set('--font-body', f.body)
    if (f?.mono) set('--font-mono', f.mono)

    // Load Google Fonts when using known families
    const GOOGLE_FONTS: Record<string, string> = {
      Inter: 'Inter:wght@400;600;700',
      Roboto: 'Roboto:wght@400;500;700',
      'Open Sans': 'Open+Sans:wght@400;600;700',
      Lora: 'Lora:wght@400;600;700',
      Merriweather: 'Merriweather:wght@400;700;900',
      Montserrat: 'Montserrat:wght@400;600;700',
      Nunito: 'Nunito:wght@400;600;700',
      'Source Serif Pro': 'Source+Serif+Pro:wght@400;600;700',
      'Playfair Display': 'Playfair+Display:wght@400;600;700',
      'JetBrains Mono': 'JetBrains+Mono:wght@400;600;700',
      'Fira Mono': 'Fira+Mono:wght@400;500;700',
    }

    const desiredFamilies = new Set<string>()
    ;[f?.heading, f?.body, f?.mono].forEach((fam) => {
      if (fam && GOOGLE_FONTS[fam]) desiredFamilies.add(fam)
    })

    // Remove previously injected font links that are no longer needed
    const existing = Array.from(document.querySelectorAll<HTMLLinkElement>('link[data-bls-font="1"]'))
    existing.forEach((link) => {
      const fam = link.getAttribute('data-family') || ''
      if (!desiredFamilies.has(fam)) link.remove()
    })

    // Inject needed links
    desiredFamilies.forEach((fam) => {
      const id = `bls-font-${fam.replace(/\s+/g, '-').toLowerCase()}`
      if (!document.getElementById(id)) {
        const spec = GOOGLE_FONTS[fam]
        const href = `https://fonts.googleapis.com/css2?family=${spec}&display=swap`
        const link = document.createElement('link')
        link.id = id
        link.rel = 'stylesheet'
        link.href = href
        link.setAttribute('data-bls-font', '1')
        link.setAttribute('data-family', fam)
        document.head.appendChild(link)
      }
    })
  }, [theme])

  return null
}


