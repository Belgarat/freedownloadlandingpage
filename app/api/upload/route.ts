import { NextResponse } from 'next/server'
import { put, del } from '@vercel/blob'

export async function POST(req: Request) {
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN
    if (!token) {
      return NextResponse.json(
        { error: 'Missing BLOB_READ_WRITE_TOKEN. Set it in .env.local (local) or Project Settings (Vercel).'},
        { status: 500 }
      )
    }
    const form = await req.formData()
    const file = form.get('file') as File | null
    const path = (form.get('path') as string | null) || 'covers'
    if (!file) return NextResponse.json({ error: 'Missing file' }, { status: 400 })

    const key = `${path}/${Date.now()}-${file.name}`
    const { url, pathname } = await put(key, file, { access: 'public', addRandomSuffix: true, token })
    return NextResponse.json({ publicUrl: url, pathname })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Upload failed' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN
    if (!token) {
      return NextResponse.json(
        { error: 'Missing BLOB_READ_WRITE_TOKEN. Set it in .env.local (local) or Project Settings (Vercel).'},
        { status: 500 }
      )
    }
    const { pathname } = await req.json()
    if (!pathname) return NextResponse.json({ error: 'Missing pathname' }, { status: 400 })
    await del(pathname, { token })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Delete failed' }, { status: 500 })
  }
}


