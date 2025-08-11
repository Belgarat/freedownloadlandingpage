import { UploadOptions, UploadResult, StorageProvider } from '@/types/storage'
import fs from 'fs'
import path from 'path'
import { writeFile, mkdir } from 'fs/promises'

// Local filesystem storage for development
export const filesystemStorage: StorageProvider = {
  async uploadFile(file: File | Blob | Buffer, opts?: UploadOptions): Promise<UploadResult> {
    try {
      // Create uploads directory if it doesn't exist
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
      const filePath = opts?.path || 'files'
      const fullPath = path.join(uploadsDir, filePath)
      
      await mkdir(fullPath, { recursive: true })

      // Generate unique filename
      const timestamp = Date.now()
      const randomSuffix = Math.random().toString(36).substring(2, 15)
      const originalName = file instanceof File ? file.name : 'file'
      const extension = path.extname(originalName)
      const filename = `${timestamp}-${randomSuffix}${extension}`
      
      const filePathname = path.join(fullPath, filename)
      const publicUrl = `/uploads/${filePath}/${filename}`

      // Convert File/Blob to Buffer if needed
      let buffer: Buffer
      if (file instanceof Buffer) {
        buffer = file
      } else if (file instanceof Blob) {
        const arrayBuffer = await file.arrayBuffer()
        buffer = Buffer.from(arrayBuffer)
      } else {
        const arrayBuffer = await file.arrayBuffer()
        buffer = Buffer.from(arrayBuffer)
      }

      // Write file to filesystem
      await writeFile(filePathname, buffer)

      return {
        publicUrl,
        pathname: filePathname
      }
    } catch (error) {
      console.error('Filesystem upload error:', error)
      throw new Error(`Filesystem upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  },

  async deleteFile(pathname: string): Promise<void> {
    try {
      // Remove /uploads prefix and convert to filesystem path
      const relativePath = pathname.replace(/^\/uploads\//, '')
      const fullPath = path.join(process.cwd(), 'public', 'uploads', relativePath)
      
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath)
      }
    } catch (error) {
      console.error('Filesystem delete error:', error)
      throw new Error(`Filesystem delete failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}
