'use client'

import { useEffect, useMemo, useState } from 'react'
import { ThemeConfig } from '@/lib/config-loader'

interface ThemeConfigEditorProps {
  config: ThemeConfig
  onChange: (config: ThemeConfig) => void
}

export default function ThemeConfigEditor({ config, onChange }: ThemeConfigEditorProps) {
  const [activeTab, setActiveTab] = useState<'colors' | 'fonts' | 'layout' | 'spacing' | 'animations' | 'development'>('colors')
  const [locks, setLocks] = useState<{ [k: string]: boolean }>({
    primary: false,
    secondary: false,
    accent: false,
    background: false,
    textPrimary: false,
    textSecondary: false,
    textMuted: false,
  })
  const [satAdj, setSatAdj] = useState<number>(0)
  const [lightAdj, setLightAdj] = useState<number>(0)
  const [customPresets, setCustomPresets] = useState<Array<{ name: string; colors: Partial<ThemeConfig['colors']> }>>([])

  const tabs = [
    { id: 'colors', label: 'Colors' },
    { id: 'fonts', label: 'Fonts' },
    { id: 'layout', label: 'Layout' },
    { id: 'spacing', label: 'Spacing' },
    { id: 'animations', label: 'Animations' },
    { id: 'development', label: 'Development' },
  ] as const

  // Simple palette presets to speed up theming
  const presets: Array<{ name: string; colors: Partial<ThemeConfig['colors']> }> = [
    {
      name: 'Ocean',
      colors: {
        primary: '#0ea5e9',
        secondary: '#22d3ee',
        accent: '#14b8a6',
        background: '#f0f9ff',
        text: { primary: '#0f172a', secondary: '#334155', muted: '#64748b' },
      },
    },
    {
      name: 'Sunset',
      colors: {
        primary: '#f97316',
        secondary: '#f59e0b',
        accent: '#ef4444',
        background: '#fff7ed',
        text: { primary: '#1f2937', secondary: '#4b5563', muted: '#6b7280' },
      },
    },
    {
      name: 'Midnight',
      colors: {
        primary: '#60a5fa',
        secondary: '#a78bfa',
        accent: '#34d399',
        background: '#0b1220',
        text: { primary: '#e5e7eb', secondary: '#cbd5e1', muted: '#94a3b8' },
      },
    },
  ]

  const applyPreset = (idx: number) => {
    const p = presets[idx]
    applyColorsWithLocks(p.colors)
  }

  // Utilities
  const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n))
  const hexToRgb = (hex: string) => {
    const h = hex.replace('#', '')
    const v = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
    const num = parseInt(v, 16)
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 }
  }
  const rgbToHex = (r: number, g: number, b: number) => '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')
  const hexToHsl = (hex: string) => {
    const { r, g, b } = hexToRgb(hex)
    const r1 = r / 255, g1 = g / 255, b1 = b / 255
    const max = Math.max(r1, g1, b1), min = Math.min(r1, g1, b1)
    let h = 0, s = 0
    const l = (max + min) / 2
    const d = max - min
    if (d !== 0) {
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r1: h = (g1 - b1) / d + (g1 < b1 ? 6 : 0); break
        case g1: h = (b1 - r1) / d + 2; break
        case b1: h = (r1 - g1) / d + 4; break
      }
      h /= 6
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
  }
  const hslToHex = (h: number, s: number, l: number) => {
    h = ((h % 360) + 360) % 360
    s = clamp(s, 0, 100)
    l = clamp(l, 0, 100)
    const c = (1 - Math.abs(2 * (l / 100) - 1)) * (s / 100)
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
    const m = (l / 100) - c / 2
    let r = 0, g = 0, b = 0
    if (h < 60) { r = c; g = x; b = 0 }
    else if (h < 120) { r = x; g = c; b = 0 }
    else if (h < 180) { r = 0; g = c; b = x }
    else if (h < 240) { r = 0; g = x; b = c }
    else if (h < 300) { r = x; g = 0; b = c }
    else { r = c; g = 0; b = x }
    return rgbToHex(Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255))
  }
  const getLuminance = (hex: string) => {
    const { r, g, b } = hexToRgb(hex)
    const srgb = [r, g, b].map((v) => {
      const c = v / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * (srgb[0] as number) + 0.7152 * (srgb[1] as number) + 0.0722 * (srgb[2] as number)
  }
  const contrastRatio = (hex1: string, hex2: string) => {
    const l1 = getLuminance(hex1)
    const l2 = getLuminance(hex2)
    const [a, b] = l1 > l2 ? [l1, l2] : [l2, l1]
    return (a + 0.05) / (b + 0.05)
  }
  const bestTextColor = (bgHex: string) => {
    const lum = getLuminance(bgHex)
    const primary = lum > 0.6 ? '#0f172a' : '#e5e7eb'
    const secondary = lum > 0.6 ? '#334155' : '#cbd5e1'
    const muted = lum > 0.6 ? '#64748b' : '#94a3b8'
    return { primary, secondary, muted }
  }

  // Custom presets persistence
  useEffect(() => {
    try {
      const raw = localStorage.getItem('bls_theme_custom_presets')
      if (raw) setCustomPresets(JSON.parse(raw))
    } catch {}
  }, [])
  const saveCustomPresets = (list: Array<{ name: string; colors: Partial<ThemeConfig['colors']> }>) => {
    setCustomPresets(list)
    try { localStorage.setItem('bls_theme_custom_presets', JSON.stringify(list)) } catch {}
  }

  const applyColorsWithLocks = (newColors: Partial<ThemeConfig['colors']>) => {
    const merged = { ...config.colors }
    if (newColors.primary && !locks.primary) merged.primary = newColors.primary
    if (newColors.secondary && !locks.secondary) merged.secondary = newColors.secondary
    if (newColors.accent && !locks.accent) merged.accent = newColors.accent
    if (newColors.background && !locks.background) merged.background = newColors.background
    if (newColors.text) {
      merged.text = { ...merged.text }
      if ((newColors.text as any).primary && !locks.textPrimary) merged.text.primary = (newColors.text as any).primary
      if ((newColors.text as any).secondary && !locks.textSecondary) merged.text.secondary = (newColors.text as any).secondary
      if ((newColors.text as any).muted && !locks.textMuted) merged.text.muted = (newColors.text as any).muted
    }
    if (newColors.success) merged.success = newColors.success
    if (newColors.error) merged.error = newColors.error
    if (newColors.warning) merged.warning = newColors.warning
    onChange({ ...config, colors: merged })
  }

  const applyAdjustments = () => {
    const adjust = (hex: string) => {
      const { h, s, l } = hexToHsl(hex)
      return hslToHex(h, clamp(s + satAdj, 0, 100), clamp(l + lightAdj, 0, 100))
    }
    const updated: Partial<ThemeConfig['colors']> = {
      primary: locks.primary ? undefined : adjust(config.colors.primary),
      secondary: locks.secondary ? undefined : adjust(config.colors.secondary),
      accent: locks.accent ? undefined : adjust(config.colors.accent),
      background: locks.background ? undefined : adjust(config.colors.background),
    }
    applyColorsWithLocks(updated)
  }

  const resetAdjustments = () => {
    setSatAdj(0)
    setLightAdj(0)
  }

  const textContrast = useMemo(() => {
    const bg = config.colors.background
    return {
      primary: contrastRatio(config.colors.text.primary, bg),
      secondary: contrastRatio(config.colors.text.secondary, bg),
      muted: contrastRatio(config.colors.text.muted, bg),
    }
  }, [config.colors])

  const autoFixTextContrast = () => {
    const auto = bestTextColor(config.colors.background)
    applyColorsWithLocks({ text: auto })
  }

  return (
    <div className="space-y-8">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900">Tema</h3>
        <p className="text-sm text-blue-700 mt-1">Configura colori, font, layout e opzioni di sviluppo.</p>
        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            className="px-3 py-2 text-xs rounded border bg-white hover:bg-gray-50"
            onClick={async () => {
              try {
                const res = await fetch('/api/theme/from-cover', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ coverUrl: (window as any).__currentCoverUrl || undefined }) })
                if (!res.ok) return
                const data = await res.json()
                applyColorsWithLocks(data.colors)
              } catch {}
            }}
          >
            Genera dai colori della copertina
          </button>
          <span className="text-xs text-gray-500">Usa i colori della copertina per una palette di base</span>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'colors' && (
      <div className="pb-2 space-y-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Colors</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Primary</label>
            <input
              type="color"
              value={config.colors.primary}
              onChange={(e) => onChange({...config, colors: {...config.colors, primary: e.target.value}})}
              className="w-full h-10 border border-gray-300 rounded-md"
            />
            <div className="mt-1 flex items-center gap-2">
              <label className="text-xs text-gray-600"><input type="checkbox" checked={locks.primary} onChange={(e) => setLocks({ ...locks, primary: e.target.checked })} className="mr-1"/>Lock</label>
              <span className="text-xs text-gray-400">{config.colors.primary}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Secondary</label>
            <input
              type="color"
              value={config.colors.secondary}
              onChange={(e) => onChange({...config, colors: {...config.colors, secondary: e.target.value}})}
              className="w-full h-10 border border-gray-300 rounded-md"
            />
            <div className="mt-1 flex items-center gap-2">
              <label className="text-xs text-gray-600"><input type="checkbox" checked={locks.secondary} onChange={(e) => setLocks({ ...locks, secondary: e.target.checked })} className="mr-1"/>Lock</label>
              <span className="text-xs text-gray-400">{config.colors.secondary}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Accent</label>
            <input
              type="color"
              value={config.colors.accent}
              onChange={(e) => onChange({...config, colors: {...config.colors, accent: e.target.value}})}
              className="w-full h-10 border border-gray-300 rounded-md"
            />
            <div className="mt-1 flex items-center gap-2">
              <label className="text-xs text-gray-600"><input type="checkbox" checked={locks.accent} onChange={(e) => setLocks({ ...locks, accent: e.target.checked })} className="mr-1"/>Lock</label>
              <span className="text-xs text-gray-400">{config.colors.accent}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Background</label>
            <input
              type="color"
              value={config.colors.background}
              onChange={(e) => onChange({...config, colors: {...config.colors, background: e.target.value}})}
              className="w-full h-10 border border-gray-300 rounded-md"
            />
            <div className="mt-1 flex items-center gap-2">
              <label className="text-xs text-gray-600"><input type="checkbox" checked={locks.background} onChange={(e) => setLocks({ ...locks, background: e.target.checked })} className="mr-1"/>Lock</label>
              <span className="text-xs text-gray-400">{config.colors.background}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-lg border p-4">
          <h4 className="text-md font-medium text-gray-900 mb-2">Background options</h4>
          <div className="flex items-center gap-2">
            <input
              id="bgGradientEnabled"
              type="checkbox"
              checked={Boolean(config.background?.gradientEnabled)}
              onChange={(e) => onChange({ ...config, background: { gradientEnabled: e.target.checked, gradientDirection: config.background?.gradientDirection || 'to bottom right' } })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="bgGradientEnabled" className="text-sm text-gray-700">Enable page background gradient</label>
          </div>
          {config.background?.gradientEnabled && (
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Gradient direction</label>
              <select
                value={config.background?.gradientDirection || 'to bottom right'}
                onChange={(e) => onChange({ ...config, background: { ...(config.background || {}), gradientDirection: e.target.value } })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="to bottom">to bottom</option>
                <option value="to right">to right</option>
                <option value="to bottom right">to bottom right</option>
                <option value="to bottom left">to bottom left</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Gradient from Primary to Secondary.</p>
            </div>
          )}
        </div>

        <div className="mt-4 rounded-lg border p-4">
          <h4 className="text-md font-medium text-gray-900 mb-2">Surface (boxes)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
              <select
                value={config.surface?.mode || 'auto'}
                onChange={(e) => onChange({ ...config, surface: { ...(config.surface || {}), mode: e.target.value as 'auto' | 'custom' } })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="auto">Auto (recommended)</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            {config.surface?.mode === 'custom' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Background color</label>
                  <input type="color" value={config.surface?.bgColor || '#000000'} onChange={(e) => onChange({ ...config, surface: { ...(config.surface || { mode: 'custom' }), bgColor: e.target.value } })} className="w-full h-10 border border-gray-300 rounded-md" />
                  <label className="block text-xs text-gray-500 mt-1">Opacity</label>
                  <input type="range" min={0} max={100} value={config.surface?.bgOpacity ?? 85} onChange={(e) => onChange({ ...config, surface: { ...(config.surface || { mode: 'custom' }), bgOpacity: parseInt(e.target.value) } })} className="w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Border color</label>
                  <input type="color" value={config.surface?.borderColor || '#ffffff'} onChange={(e) => onChange({ ...config, surface: { ...(config.surface || { mode: 'custom' }), borderColor: e.target.value } })} className="w-full h-10 border border-gray-300 rounded-md" />
                  <label className="block text-xs text-gray-500 mt-1">Opacity</label>
                  <input type="range" min={0} max={100} value={config.surface?.borderOpacity ?? 50} onChange={(e) => onChange({ ...config, surface: { ...(config.surface || { mode: 'custom' }), borderOpacity: parseInt(e.target.value) } })} className="w-full" />
                </div>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">In Auto, i box si adattano al background e al primary per coerenza visiva.</p>
        </div>

        <div className="mt-6 rounded-lg border p-4">
          <h4 className="text-md font-medium text-gray-900 mb-2">Global adjustments</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Saturation ({satAdj > 0 ? '+' : ''}{satAdj}%)</label>
              <input type="range" min={-50} max={50} value={satAdj} onChange={(e) => setSatAdj(parseInt(e.target.value))} className="w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lightness ({lightAdj > 0 ? '+' : ''}{lightAdj}%)</label>
              <input type="range" min={-30} max={30} value={lightAdj} onChange={(e) => setLightAdj(parseInt(e.target.value))} className="w-full" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button type="button" onClick={applyAdjustments} className="px-3 py-2 text-xs rounded border bg-white hover:bg-gray-50">Apply adjustments</button>
            <button type="button" onClick={resetAdjustments} className="px-3 py-2 text-xs rounded border bg-white hover:bg-gray-50">Reset</button>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="text-md font-medium text-gray-900 mb-2">Text Colors</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Primary</label>
              <input
                type="color"
                value={config.colors.text.primary}
                onChange={(e) => onChange({...config, colors: {...config.colors, text: {...config.colors.text, primary: e.target.value}}})}
                className="w-full h-10 border border-gray-300 rounded-md"
              />
              <div className="mt-1 flex items-center gap-2">
                <label className="text-xs text-gray-600"><input type="checkbox" checked={locks.textPrimary} onChange={(e) => setLocks({ ...locks, textPrimary: e.target.checked })} className="mr-1"/>Lock</label>
                <span className="text-xs text-gray-400">{config.colors.text.primary}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Secondary</label>
              <input
                type="color"
                value={config.colors.text.secondary}
                onChange={(e) => onChange({...config, colors: {...config.colors, text: {...config.colors.text, secondary: e.target.value}}})}
                className="w-full h-10 border border-gray-300 rounded-md"
              />
              <div className="mt-1 flex items-center gap-2">
                <label className="text-xs text-gray-600"><input type="checkbox" checked={locks.textSecondary} onChange={(e) => setLocks({ ...locks, textSecondary: e.target.checked })} className="mr-1"/>Lock</label>
                <span className="text-xs text-gray-400">{config.colors.text.secondary}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Muted</label>
              <input
                type="color"
                value={config.colors.text.muted}
                onChange={(e) => onChange({...config, colors: {...config.colors, text: {...config.colors.text, muted: e.target.value}}})}
                className="w-full h-10 border border-gray-300 rounded-md"
              />
              <div className="mt-1 flex items-center gap-2">
                <label className="text-xs text-gray-600"><input type="checkbox" checked={locks.textMuted} onChange={(e) => setLocks({ ...locks, textMuted: e.target.checked })} className="mr-1"/>Lock</label>
                <span className="text-xs text-gray-400">{config.colors.text.muted}</span>
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <div className="text-xs">Contrast background vs text: 
              <span className={`ml-2 px-2 py-0.5 rounded ${textContrast.primary >= 4.5 ? 'bg-green-100 text-green-800' : textContrast.primary >= 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>Primary {textContrast.primary.toFixed(2)}x</span>
              <span className={`ml-2 px-2 py-0.5 rounded ${textContrast.secondary >= 4.5 ? 'bg-green-100 text-green-800' : textContrast.secondary >= 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>Secondary {textContrast.secondary.toFixed(2)}x</span>
              <span className={`ml-2 px-2 py-0.5 rounded ${textContrast.muted >= 4.5 ? 'bg-green-100 text-green-800' : textContrast.muted >= 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>Muted {textContrast.muted.toFixed(2)}x</span>
            </div>
            <button type="button" onClick={autoFixTextContrast} className="px-3 py-2 text-xs rounded border bg-white hover:bg-gray-50">Auto-fix contrast</button>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="text-md font-medium text-gray-900 mb-2">Status Colors</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Success</label>
              <input
                type="color"
                value={config.colors.success}
                onChange={(e) => onChange({...config, colors: {...config.colors, success: e.target.value}})}
                className="w-full h-10 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Error</label>
              <input
                type="color"
                value={config.colors.error}
                onChange={(e) => onChange({...config, colors: {...config.colors, error: e.target.value}})}
                className="w-full h-10 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Warning</label>
              <input
                type="color"
                value={config.colors.warning}
                onChange={(e) => onChange({...config, colors: {...config.colors, warning: e.target.value}})}
                className="w-full h-10 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Live Preview + Presets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg border overflow-hidden" style={{ background: config.colors.background }}>
            <div className="p-4" style={{ background: `linear-gradient(135deg, ${config.colors.primary}, ${config.colors.secondary})` }}>
              <h4 className="text-white font-semibold">Theme Preview</h4>
            </div>
            <div className="p-4 space-y-2">
              <h3 className="text-xl font-bold" style={{ color: config.colors.text.primary }}>Fish Cannot Carry Guns</h3>
              <p className="text-sm" style={{ color: config.colors.text.secondary }}>A Collection of Speculative Sci-Fi Tales</p>
              <button className="px-3 py-2 rounded font-medium" style={{ background: config.colors.primary, color: config.colors.background }}>Primary CTA</button>
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Palette Presets</h4>
            <div className="flex flex-wrap gap-2">
              {presets.map((p, i) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => applyPreset(i)}
                  className="px-2 py-1 text-xs rounded border hover:bg-gray-50"
                >
                  {p.name}
                </button>
              ))}
            </div>
            {customPresets.length > 0 && (
              <div className="mt-4">
                <h5 className="text-xs font-medium text-gray-700 mb-2">Custom presets</h5>
                <div className="flex flex-wrap gap-2">
                  {customPresets.map((p, i) => (
                    <div key={p.name} className="flex items-center gap-1">
                      <button type="button" onClick={() => applyColorsWithLocks(p.colors)} className="px-2 py-1 text-xs rounded border hover:bg-gray-50">{p.name}</button>
                      <button type="button" onClick={() => { const next = customPresets.filter((_, idx) => idx !== i); saveCustomPresets(next) }} className="text-xs text-red-500 hover:underline">Del</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                className="px-2 py-1 text-xs rounded border hover:bg-gray-50"
                onClick={() => {
                  const name = prompt('Nome preset personalizzato?')?.trim()
                  if (!name) return
                  const newPreset = { name, colors: { ...config.colors } }
                  saveCustomPresets([...customPresets, newPreset])
                }}
              >
                Save current as preset
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">Scegli una palette e poi affina i colori. Puoi anche salvare preset personalizzati.</p>
          </div>
        </div>
      </div>
      )}

      {activeTab === 'fonts' && (
      <div className="pb-2">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Fonts</h3>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
            <input
              type="text"
              value={config.fonts.heading}
              onChange={(e) => onChange({...config, fonts: {...config.fonts, heading: e.target.value}})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Inter, sans-serif"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Body</label>
            <input
              type="text"
              value={config.fonts.body}
              onChange={(e) => onChange({...config, fonts: {...config.fonts, body: e.target.value}})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Inter, sans-serif"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mono</label>
            <input
              type="text"
              value={config.fonts.mono}
              onChange={(e) => onChange({...config, fonts: {...config.fonts, mono: e.target.value}})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="JetBrains Mono, monospace"
            />
          </div>
        </div>
      </div>
      )}

      {activeTab === 'layout' && (
      <div className="pb-2">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Layout</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Layout Type</label>
          <select
            value={config.layout.type}
            onChange={(e) => onChange({...config, layout: {...config.layout, type: e.target.value}})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="default">Default</option>
            <option value="minimal">Minimal</option>
            <option value="full-width">Full Width</option>
            <option value="sidebar">Sidebar</option>
          </select>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showCountdown"
              checked={config.layout.showCountdown}
              onChange={(e) => onChange({...config, layout: {...config.layout, showCountdown: e.target.checked}})}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="showCountdown" className="text-sm font-medium text-gray-700">Show Countdown</label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showStories"
              checked={config.layout.showStories}
              onChange={(e) => onChange({...config, layout: {...config.layout, showStories: e.target.checked}})}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="showStories" className="text-sm font-medium text-gray-700">Show Stories</label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showTestimonials"
              checked={config.layout.showTestimonials}
              onChange={(e) => onChange({...config, layout: {...config.layout, showTestimonials: e.target.checked}})}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="showTestimonials" className="text-sm font-medium text-gray-700">Show Testimonials</label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showAwards"
              checked={config.layout.showAwards}
              onChange={(e) => onChange({...config, layout: {...config.layout, showAwards: e.target.checked}})}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="showAwards" className="text-sm font-medium text-gray-700">Show Awards</label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showRankings"
              checked={config.layout.showRankings}
              onChange={(e) => onChange({...config, layout: {...config.layout, showRankings: e.target.checked}})}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="showRankings" className="text-sm font-medium text-gray-700">Show Rankings</label>
          </div>
        </div>
      </div>
      )}

      {activeTab === 'spacing' && (
      <div className="pb-2">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Spacing</h3>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Container</label>
            <input
              type="text"
              value={config.spacing.container}
              onChange={(e) => onChange({...config, spacing: {...config.spacing, container: e.target.value}})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="max-w-7xl mx-auto px-4"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
            <input
              type="text"
              value={config.spacing.section}
              onChange={(e) => onChange({...config, spacing: {...config.spacing, section: e.target.value}})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="py-16"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Element</label>
            <input
              type="text"
              value={config.spacing.element}
              onChange={(e) => onChange({...config, spacing: {...config.spacing, element: e.target.value}})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="p-6"
            />
          </div>
        </div>
      </div>
      )}

      {activeTab === 'animations' && (
      <div className="pb-2">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Animations</h3>
        
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="checkbox"
            id="animationsEnabled"
            checked={config.animations.enabled}
            onChange={(e) => onChange({...config, animations: {...config.animations, enabled: e.target.checked}})}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="animationsEnabled" className="text-sm font-medium text-gray-700">Enable Animations</label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
            <input
              type="text"
              value={config.animations.duration}
              onChange={(e) => onChange({...config, animations: {...config.animations, duration: e.target.value}})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="300ms"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Easing</label>
            <input
              type="text"
              value={config.animations.easing}
              onChange={(e) => onChange({...config, animations: {...config.animations, easing: e.target.value}})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ease-in-out"
            />
          </div>
        </div>
      </div>
      )}

      {activeTab === 'development' && (
      <div className="pb-2">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Development</h3>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="analytics"
              checked={config.development.analytics}
              onChange={(e) => onChange({...config, development: {...config.development, analytics: e.target.checked}})}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="analytics" className="text-sm font-medium text-gray-700">Enable Analytics</label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="tracking"
              checked={config.development.tracking}
              onChange={(e) => onChange({...config, development: {...config.development, tracking: e.target.checked}})}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="tracking" className="text-sm font-medium text-gray-700">Enable Tracking</label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="debug"
              checked={config.development.debug}
              onChange={(e) => onChange({...config, development: {...config.development, debug: e.target.checked}})}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="debug" className="text-sm font-medium text-gray-700">Debug Mode</label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="hotReload"
              checked={config.development.hotReload}
              onChange={(e) => onChange({...config, development: {...config.development, hotReload: e.target.checked}})}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="hotReload" className="text-sm font-medium text-gray-700">Hot Reload</label>
          </div>
        </div>
      </div>
      )}
    </div>
  )
}
