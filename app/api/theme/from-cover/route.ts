import { NextResponse } from 'next/server'
import sharp from 'sharp'

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => n.toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const cleaned = hex.replace('#', '')
  const bigint = parseInt(cleaned.length === 3 ? cleaned.split('').map((c) => c + c).join('') : cleaned, 16)
  const r = ((bigint >> 16) & 255) / 255
  const g = ((bigint >> 8) & 255) / 255
  const b = (bigint & 255) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2
  const d = max - min
  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360
  s = Math.max(0, Math.min(100, s))
  l = Math.max(0, Math.min(100, l))
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

function bestTextColor(bgHex: string): { primary: string; secondary: string; muted: string } {
  const cleaned = bgHex.replace('#', '')
  const bigint = parseInt(cleaned, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  const primary = luminance > 0.6 ? '#0f172a' : '#e5e7eb' // slate-900 or slate-200
  const secondary = luminance > 0.6 ? '#334155' : '#cbd5e1' // slate-700 or slate-300
  const muted = luminance > 0.6 ? '#64748b' : '#94a3b8' // slate-500 or slate-400
  return { primary, secondary, muted }
}

export async function POST(req: Request) {
  try {
    const { coverUrl } = await req.json()
    if (!coverUrl || typeof coverUrl !== 'string') {
      return NextResponse.json({ error: 'coverUrl required' }, { status: 400 })
    }

    // Build absolute URL if relative
    const url = coverUrl.startsWith('http')
      ? coverUrl
      : new URL(coverUrl, new URL(req.url).origin).toString()

    const resp = await fetch(url)
    if (!resp.ok) {
      return NextResponse.json({ error: 'Unable to fetch image' }, { status: 400 })
    }
    const arrayBuf = await resp.arrayBuffer()
    const buf = Buffer.from(arrayBuf)

    // Use sharp to get average color (resize to 1x1)
    const pixel = await sharp(buf).resize(1, 1, { fit: 'cover' }).removeAlpha().raw().toBuffer()
    const [r, g, b] = [pixel[0], pixel[1], pixel[2]]
    const dominantHex = rgbToHex(r, g, b)
    const { h, s, l } = hexToHsl(dominantHex)

    const primary = dominantHex
    const secondary = hslToHex(h + 30, Math.min(100, s + 5), Math.min(100, l + 5))
    const accent = hslToHex(h - 30, Math.min(100, s + 10), Math.max(0, l - 5))
    const background = l > 50 ? '#f8fafc' : '#0b1220'
    const text = bestTextColor(background)

    // Keep status/progress colors as reasonable defaults
    const success = '#10b981'
    const error = '#ef4444'
    const warning = '#f59e0b'

    return NextResponse.json({
      colors: {
        primary,
        secondary,
        accent,
        background,
        text,
        success,
        error,
        warning,
      },
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to generate theme' }, { status: 500 })
  }
}


