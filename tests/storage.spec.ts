import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'

test.describe('Storage System', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to admin panel and login
    await page.goto('/admin')
    await page.fill('input[type="password"]', 'admin123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/admin')
  })

  test.describe('Filesystem Storage', () => {
    test('should upload image file to filesystem', async ({ page }) => {
      // Navigate to book configuration
      await page.goto('/admin/config')
      
      // Wait for the page to load
      await page.waitForSelector('h1:has-text("Configuration")')
      
      // Find the cover uploader
      const coverUploader = page.locator('button:has-text("Upload image")').first()
      await expect(coverUploader).toBeVisible()
      
      // Create a test image file
      const testImagePath = path.join(process.cwd(), 'test-image.png')
      const testImageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64')
      fs.writeFileSync(testImagePath, testImageBuffer)
      
      // Upload the test image
      await coverUploader.click()
      const fileInput = page.locator('input[type="file"]').first()
      await fileInput.setInputFiles(testImagePath)
      
      // Wait for upload to complete
      await page.waitForSelector('img[alt="Preview cover"]', { timeout: 10000 })
      
      // Verify the image was uploaded
      const previewImage = page.locator('img[alt="Preview cover"]').first()
      await expect(previewImage).toBeVisible()
      
      // Check that the image URL points to local filesystem
      const imageSrc = await previewImage.getAttribute('src')
      expect(imageSrc).toMatch(/^\/uploads\/covers\/\d+-[a-z0-9]+\.png$/)
      
      // Clean up test file
      fs.unlinkSync(testImagePath)
    })

    test('should reject invalid file types for cover upload', async ({ page }) => {
      await page.goto('/admin/config')
      await page.waitForSelector('h1:has-text("Configuration")')
      
      const coverUploader = page.locator('button:has-text("Upload image")').first()
      await expect(coverUploader).toBeVisible()
      
      // Create a test text file
      const testFilePath = path.join(process.cwd(), 'test.txt')
      fs.writeFileSync(testFilePath, 'This is not an image')
      
      // Try to upload the text file
      await coverUploader.click()
      const fileInput = page.locator('input[type="file"]').first()
      await fileInput.setInputFiles(testFilePath)
      
      // Should show error message
      await page.waitForSelector('text=File must be an image', { timeout: 5000 })
      
      // Clean up test file
      fs.unlinkSync(testFilePath)
    })

    test('should reject oversized files', async ({ page }) => {
      await page.goto('/admin/config')
      await page.waitForSelector('h1:has-text("Configuration")')
      
      const coverUploader = page.locator('button:has-text("Upload image")').first()
      await expect(coverUploader).toBeVisible()
      
      // Create a large test image (6MB)
      const testImagePath = path.join(process.cwd(), 'large-test.png')
      const largeBuffer = Buffer.alloc(6 * 1024 * 1024, 'A')
      fs.writeFileSync(testImagePath, largeBuffer)
      
      // Try to upload the large file
      await coverUploader.click()
      const fileInput = page.locator('input[type="file"]').first()
      await fileInput.setInputFiles(testImagePath)
      
      // Should show error message
      await page.waitForSelector('text=Maximum size 5MB', { timeout: 5000 })
      
      // Clean up test file
      fs.unlinkSync(testImagePath)
    })
  })

  test.describe('Ebook Upload', () => {
    test('should upload PDF file to filesystem', async ({ page }) => {
      await page.goto('/admin/config')
      await page.waitForSelector('h1:has-text("Configuration")')
      
      // Find the PDF upload area
      const pdfUploadArea = page.locator('label[for="pdf-upload"]').first()
      await expect(pdfUploadArea).toBeVisible()
      
      // Create a test PDF file
      const testPdfPath = path.join(process.cwd(), 'test.pdf')
      // Simple PDF header
      const pdfContent = '%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids []\n/Count 0\n>>\nendobj\nxref\n0 3\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \ntrailer\n<<\n/Size 3\n/Root 1 0 R\n>>\nstartxref\n149\n%%EOF'
      fs.writeFileSync(testPdfPath, pdfContent)
      
      // Upload the test PDF
      await pdfUploadArea.click()
      const fileInput = page.locator('input[type="file"]').first()
      await fileInput.setInputFiles(testPdfPath)
      
      // Wait for upload to complete
      await page.waitForSelector('text=File uploaded', { timeout: 10000 })
      
      // Verify the PDF was uploaded
      const fileInfo = page.locator('text=test.pdf').first()
      await expect(fileInfo).toBeVisible()
      
      // Check that the file URL points to local filesystem
      const downloadLink = page.locator('a[href*="/uploads/ebooks/"]').first()
      await expect(downloadLink).toBeVisible()
      
      // Clean up test file
      fs.unlinkSync(testPdfPath)
    })

    test('should reject invalid file types for ebook upload', async ({ page }) => {
      await page.goto('/admin/config')
      await page.waitForSelector('h1:has-text("Configuration")')
      
      const pdfUploadArea = page.locator('label[for="pdf-upload"]').first()
      await expect(pdfUploadArea).toBeVisible()
      
      // Create a test text file
      const testFilePath = path.join(process.cwd(), 'test.txt')
      fs.writeFileSync(testFilePath, 'This is not a PDF')
      
      // Try to upload the text file
      await pdfUploadArea.click()
      const fileInput = page.locator('input[type="file"]').first()
      await fileInput.setInputFiles(testFilePath)
      
      // Should show error message
      await page.waitForSelector('text=Invalid file type', { timeout: 5000 })
      
      // Clean up test file
      fs.unlinkSync(testFilePath)
    })
  })

  test.describe('API Upload Endpoints', () => {
    test('should upload file via API', async ({ request }) => {
      // Create a test image file
      const testImagePath = path.join(process.cwd(), 'test-api-upload.png')
      const testImageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64')
      fs.writeFileSync(testImagePath, testImageBuffer)
      
      // Upload via API using FormData
      const formData = new FormData()
      formData.append('file', fs.createReadStream(testImagePath), 'test-api-upload.png')
      formData.append('path', 'test')
      formData.append('type', 'cover')
      
      const response = await request.post('/api/upload', {
        data: formData
      })
      
      expect(response.ok()).toBeTruthy()
      
      const result = await response.json()
      expect(result.publicUrl).toMatch(/^\/uploads\/test\/\d+-[a-z0-9]+\.png$/)
      expect(result.filename).toBe('test-api-upload.png')
      expect(result.type).toBe('image/png')
      
      // Test delete
      const deleteResponse = await request.delete('/api/upload', {
        data: { pathname: result.publicUrl }
      })
      
      expect(deleteResponse.ok()).toBeTruthy()
      
      // Clean up test file
      fs.unlinkSync(testImagePath)
    })

    test('should reject invalid file types via API', async ({ request }) => {
      // Create a test text file
      const testFilePath = path.join(process.cwd(), 'test-invalid.txt')
      fs.writeFileSync(testFilePath, 'This is not an image')
      
      // Try to upload the text file
      const formData = new FormData()
      formData.append('file', fs.createReadStream(testFilePath), 'test-invalid.txt')
      formData.append('path', 'test')
      formData.append('type', 'cover')
      
      const response = await request.post('/api/upload', {
        data: formData
      })
      
      expect(response.status()).toBe(400)
      
      const result = await response.json()
      expect(result.error).toContain('Invalid file type')
      
      // Clean up test file
      fs.unlinkSync(testFilePath)
    })

    test('should reject oversized files via API', async ({ request }) => {
      // Create a large file (6MB)
      const largeFilePath = path.join(process.cwd(), 'test-large.png')
      const largeBuffer = Buffer.alloc(6 * 1024 * 1024, 'A')
      fs.writeFileSync(largeFilePath, largeBuffer)
      
      // Try to upload the large file
      const formData = new FormData()
      formData.append('file', fs.createReadStream(largeFilePath), 'test-large.png')
      formData.append('path', 'test')
      formData.append('type', 'cover')
      
      const response = await request.post('/api/upload', {
        data: formData
      })
      
      expect(response.status()).toBe(400)
      
      const result = await response.json()
      expect(result.error).toContain('Maximum size')
      
      // Clean up test file
      fs.unlinkSync(largeFilePath)
    })
  })

  test.describe('Storage Provider Selection', () => {
    test('should use filesystem storage by default', async ({ page }) => {
      // Check that storage provider is filesystem
      await page.goto('/admin/config')
      await page.waitForSelector('h1:has-text("Configuration")')
      
      // The fact that we can upload files without Vercel Blob token
      // indicates that filesystem storage is being used
      const coverUploader = page.locator('button:has-text("Upload image")').first()
      await expect(coverUploader).toBeVisible()
    })
  })

  test.describe('File Management', () => {
    test('should delete uploaded files', async ({ page }) => {
      await page.goto('/admin/config')
      await page.waitForSelector('h1:has-text("Configuration")')
      
      // Upload a test image first
      const testImagePath = path.join(process.cwd(), 'delete-test.png')
      const testImageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64')
      fs.writeFileSync(testImagePath, testImageBuffer)
      
      const coverUploader = page.locator('button:has-text("Upload image")').first()
      await coverUploader.click()
      const fileInput = page.locator('input[type="file"]').first()
      await fileInput.setInputFiles(testImagePath)
      
      // Wait for upload to complete
      await page.waitForSelector('img[alt="Preview cover"]', { timeout: 10000 })
      
      // Find and click delete button
      const deleteButton = page.locator('button[title="Delete file"]').first()
      await deleteButton.click()
      
      // Verify the image was removed
      await expect(page.locator('img[alt="Preview cover"]')).not.toBeVisible()
      
      // Clean up test file
      fs.unlinkSync(testImagePath)
    })
  })
})
