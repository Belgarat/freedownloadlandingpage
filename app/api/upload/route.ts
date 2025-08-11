import { NextResponse } from 'next/server'
import { put, del } from '@vercel/blob'
import { getStorageProvider } from '@/lib/storage'

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload a file
 *     description: Upload a file (cover image or ebook) to the storage provider
 *     tags: [Files]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File to upload
 *               path:
 *                 type: string
 *                 example: "covers"
 *                 description: Storage path (optional)
 *               type:
 *                 type: string
 *                 enum: [cover, ebook]
 *                 example: "cover"
 *                 description: File type for validation
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UploadResult'
 *       400:
 *         description: Invalid request or file type
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Delete a file
 *     description: Delete a file from the storage provider
 *     tags: [Files]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [pathname]
 *             properties:
 *               pathname:
 *                 type: string
 *                 example: "/uploads/covers/1234567890-abc123.jpg"
 *                 description: Path to the file to delete
 *     responses:
 *       200:
 *         description: File deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function POST(req: Request) {
  try {
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

    // Get storage provider (filesystem or vercel blob)
    const storage = getStorageProvider()
    
    // Upload file using the appropriate storage provider
    const result = await storage.uploadFile(file, { 
      path, 
      contentType: file.type 
    })
    
    return NextResponse.json({ 
      publicUrl: result.publicUrl, 
      pathname: result.pathname,
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
    const { pathname } = await req.json()
    if (!pathname) return NextResponse.json({ error: 'Missing pathname' }, { status: 400 })
    
    // Get storage provider (filesystem or vercel blob)
    const storage = getStorageProvider()
    
    // Delete file using the appropriate storage provider
    await storage.deleteFile(pathname)
    
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Delete failed' }, { status: 500 })
  }
}


