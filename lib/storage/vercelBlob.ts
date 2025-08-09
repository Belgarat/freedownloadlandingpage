import { UploadOptions, UploadResult, StorageProvider } from '@/types/storage'

const uploadViaApi = async (file: File | Blob | Buffer, opts?: UploadOptions): Promise<UploadResult> => {
  const form = new FormData()
  // @ts-expect-error: Buffer acceptable in server, File/Blob in browser
  form.append('file', file)
  if (opts?.path) form.append('path', opts.path)

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: form,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Upload failed: ${res.status} ${text}`)
  }
  return res.json()
}

export const vercelBlobStorage: StorageProvider = {
  async uploadFile(file, opts) {
    return uploadViaApi(file, opts)
  },
  async deleteFile(pathname: string) {
    // Optional: implement deletion endpoint if needed
    await fetch('/api/upload', { method: 'DELETE', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ pathname }) })
  },
}


