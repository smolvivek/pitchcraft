export const ALLOWED_IMAGE_TYPES = {
  'image/jpeg': ['jpg', 'jpeg'],
  'image/png': ['png'],
  'image/webp': ['webp'],
} as const

export const ALLOWED_DOC_TYPES = {
  'application/pdf': ['pdf'],
} as const

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10MB
export const MAX_PDF_SIZE = 50 * 1024 * 1024 // 50MB

export type FileValidationError =
  | 'invalid-type'
  | 'too-large'
  | 'too-many-files'

export interface FileValidationResult {
  valid: boolean
  error?: FileValidationError
  message?: string
}

export function validateImageFile(file: File): FileValidationResult {
  // Type check
  if (!ALLOWED_IMAGE_TYPES[file.type as keyof typeof ALLOWED_IMAGE_TYPES]) {
    return {
      valid: false,
      error: 'invalid-type',
      message: 'Only JPG, PNG, and WebP images allowed',
    }
  }

  // Size check
  if (file.size > MAX_IMAGE_SIZE) {
    return {
      valid: false,
      error: 'too-large',
      message: 'Max 10MB per image',
    }
  }

  return { valid: true }
}

export function validatePDFFile(file: File): FileValidationResult {
  // Type check
  if (file.type !== 'application/pdf') {
    return {
      valid: false,
      error: 'invalid-type',
      message: 'Only PDF documents allowed',
    }
  }

  // Size check
  if (file.size > MAX_PDF_SIZE) {
    return {
      valid: false,
      error: 'too-large',
      message: 'Max 50MB per PDF',
    }
  }

  return { valid: true }
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
