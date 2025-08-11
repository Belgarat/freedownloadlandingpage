import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { filesystemStorage } from '@/lib/storage/filesystem'
import fs from 'fs'
import path from 'path'

describe('Filesystem Storage Adapter', () => {
  const testUploadsDir = path.join(process.cwd(), 'public', 'uploads', 'test')
  
  beforeEach(() => {
    // Clean up test directory before each test
    if (fs.existsSync(testUploadsDir)) {
      fs.rmSync(testUploadsDir, { recursive: true, force: true })
    }
  })
  
  afterEach(() => {
    // Clean up test directory after each test
    if (fs.existsSync(testUploadsDir)) {
      fs.rmSync(testUploadsDir, { recursive: true, force: true })
    }
  })

  describe('uploadFile', () => {
    it('should upload a file to filesystem', async () => {
      const testContent = 'Hello, World!'
      const testFile = new Blob([testContent], { type: 'text/plain' })
      
      const result = await filesystemStorage.uploadFile(testFile, {
        path: 'test',
        contentType: 'text/plain'
      })
      
      expect(result.publicUrl).toMatch(/^\/uploads\/test\/\d+-[a-z0-9]+$/)
      expect(result.pathname).toMatch(/.*\/public\/uploads\/test\/\d+-[a-z0-9]+$/)
      
      // Verify file was actually created
      expect(fs.existsSync(result.pathname!)).toBe(true)
      
      // Verify file content
      const fileContent = fs.readFileSync(result.pathname!, 'utf-8')
      expect(fileContent).toBe(testContent)
    })

    it('should create directory structure if it does not exist', async () => {
      const testContent = 'Test content'
      const testFile = new Blob([testContent], { type: 'text/plain' })
      
      // Ensure directory doesn't exist
      expect(fs.existsSync(testUploadsDir)).toBe(false)
      
      await filesystemStorage.uploadFile(testFile, {
        path: 'test',
        contentType: 'text/plain'
      })
      
      // Verify directory was created
      expect(fs.existsSync(testUploadsDir)).toBe(true)
    })

    it('should generate unique filenames', async () => {
      const testContent = 'Test content'
      const testFile = new Blob([testContent], { type: 'text/plain' })
      
      const result1 = await filesystemStorage.uploadFile(testFile, {
        path: 'test',
        contentType: 'text/plain'
      })
      
      const result2 = await filesystemStorage.uploadFile(testFile, {
        path: 'test',
        contentType: 'text/plain'
      })
      
      expect(result1.publicUrl).not.toBe(result2.publicUrl)
      expect(result1.pathname).not.toBe(result2.pathname)
    })

    it('should handle Buffer input', async () => {
      const testContent = Buffer.from('Buffer test content')
      
      const result = await filesystemStorage.uploadFile(testContent, {
        path: 'test',
        contentType: 'application/octet-stream'
      })
      
      expect(result.publicUrl).toMatch(/^\/uploads\/test\/\d+-[a-z0-9]+$/)
      expect(fs.existsSync(result.pathname!)).toBe(true)
      
      const fileContent = fs.readFileSync(result.pathname!)
      expect(fileContent).toEqual(testContent)
    })

    it('should handle File input', async () => {
      const testContent = 'File test content'
      const testFile = new File([testContent], 'test.txt', { type: 'text/plain' })
      
      const result = await filesystemStorage.uploadFile(testFile, {
        path: 'test'
      })
      
      expect(result.publicUrl).toMatch(/^\/uploads\/test\/\d+-[a-z0-9]+\.txt$/)
      expect(fs.existsSync(result.pathname!)).toBe(true)
      
      const fileContent = fs.readFileSync(result.pathname!, 'utf-8')
      expect(fileContent).toBe(testContent)
    })

    it('should preserve file extensions', async () => {
      const testContent = 'Test content'
      const testFile = new File([testContent], 'document.pdf', { type: 'application/pdf' })
      
      const result = await filesystemStorage.uploadFile(testFile, {
        path: 'test'
      })
      
      expect(result.publicUrl).toMatch(/\.pdf$/)
      expect(result.pathname).toMatch(/\.pdf$/)
    })

    it('should handle files without extensions', async () => {
      const testContent = 'Test content'
      const testFile = new File([testContent], 'file', { type: 'text/plain' })
      
      const result = await filesystemStorage.uploadFile(testFile, {
        path: 'test'
      })
      
      expect(result.publicUrl).toMatch(/^\/uploads\/test\/\d+-[a-z0-9]+$/)
      expect(result.pathname).toMatch(/^.*\/\d+-[a-z0-9]+$/)
    })
  })

  describe('deleteFile', () => {
    it('should delete an existing file', async () => {
      // First upload a file
      const testContent = 'Test content'
      const testFile = new Blob([testContent], { type: 'text/plain' })
      
      const uploadResult = await filesystemStorage.uploadFile(testFile, {
        path: 'test',
        contentType: 'text/plain'
      })
      
      expect(fs.existsSync(uploadResult.pathname!)).toBe(true)
      
      // Then delete it
      await filesystemStorage.deleteFile(uploadResult.publicUrl)
      
      expect(fs.existsSync(uploadResult.pathname!)).toBe(false)
    })

    it('should handle deleting non-existent files gracefully', async () => {
      // Should not throw an error when trying to delete a non-existent file
      await expect(filesystemStorage.deleteFile('/uploads/test/non-existent.txt')).resolves.not.toThrow()
    })

    it('should handle invalid pathname gracefully', async () => {
      // Should not throw an error when trying to delete with invalid pathname
      await expect(filesystemStorage.deleteFile('invalid-path')).resolves.not.toThrow()
    })

    it('should convert public URL to filesystem path correctly', async () => {
      // First upload a file
      const testContent = 'Test content'
      const testFile = new Blob([testContent], { type: 'text/plain' })
      
      const uploadResult = await filesystemStorage.uploadFile(testFile, {
        path: 'test',
        contentType: 'text/plain'
      })
      
      // Delete using the public URL
      await filesystemStorage.deleteFile(uploadResult.publicUrl)
      
      expect(fs.existsSync(uploadResult.pathname!)).toBe(false)
    })
  })

  // Error handling tests temporarily disabled due to mocking issues
  // TODO: Fix error handling tests with proper mocking
})
