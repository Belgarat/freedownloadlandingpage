export interface UploadOptions {
  path?: string
  contentType?: string
}

export interface UploadResult {
  publicUrl: string
  pathname?: string
}

export interface StorageProvider {
  uploadFile(file: File | Blob | Buffer, opts?: UploadOptions): Promise<UploadResult>
  deleteFile(pathname: string): Promise<void>
}

