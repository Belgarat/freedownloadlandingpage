import { NextResponse } from 'next/server'
import { put, del } from '@vercel/blob'

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const file = form.get('file') as File | null
    const path = (form.get('path') as string | null) || 'covers'
    if (!file) return NextResponse.json({ error: 'Missing file' }, { status: 400 })

    const key = `${path}/${Date.now()}-${file.name}`
    const { url, pathname } = await put(key, file, { access: 'public', addRandomSuffix: true })
    return NextResponse.json({ publicUrl: url, pathname })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Upload failed' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { pathname } = await req.json()
    if (!pathname) return NextResponse.json({ error: 'Missing pathname' }, { status: 400 })
    await del(pathname)
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Delete failed' }, { status: 500 })
  }
}


