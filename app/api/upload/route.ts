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
    const type = (form.get('type') as string | null) || 'cover'
    
    if (!file) return NextResponse.json({ error: 'Missing file' }, { status: 400 })

    // Validate file type based on upload type
    if (type === 'ebook') {
      const allowedTypes = ['application/pdf', 'application/epub+zip']
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ 
          error: 'Invalid file type. Only PDF and EPUB files are allowed for ebook uploads.' 
        }, { status: 400 })
      }
      
      // Check file size (max 50MB for ebooks)
      const maxSize = 50 * 1024 * 1024 // 50MB
      if (file.size > maxSize) {
        return NextResponse.json({ 
          error: 'File too large. Maximum size for ebook files is 50MB.' 
        }, { status: 400 })
      }
    } else if (type === 'cover') {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ 
          error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed for cover uploads.' 
        }, { status: 400 })
      }
    }

    const key = `${path}/${Date.now()}-${file.name}`
    const { url, pathname } = await put(key, file, { access: 'public', addRandomSuffix: true, token })
    
    return NextResponse.json({ 
      publicUrl: url, 
      pathname,
      filename: file.name,
      size: file.size,
      type: file.type
    })
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


