'use client'

import { useState, useRef } from 'react'
import { validatePDFFile, formatFileSize } from '@/lib/utils/fileValidation'
import type { MediaRecord } from '@/lib/types/pitch'

interface PDFUploadProps {
  pitchId: string
  sectionName: string
  existingMedia?: MediaRecord | null
  onUploadComplete?: (mediaId: string) => void
  onDeleteComplete?: () => void
}

export function PDFUpload({
  pitchId,
  sectionName,
  existingMedia = null,
  onUploadComplete,
  onDeleteComplete,
}: PDFUploadProps) {
  const [media, setMedia] = useState<MediaRecord | null>(existingMedia)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File | null) => {
    if (!file) return

    setError(null)

    // Validate file
    const validation = validatePDFFile(file)
    if (!validation.valid) {
      setError(validation.message || 'Invalid file')
      return
    }

    // Upload file
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('pitchId', pitchId)
      formData.append('sectionName', sectionName)

      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Upload failed')
      }

      const { media: mediaRecord } = await response.json()

      // If replacing existing, delete old file first
      if (media) {
        await handleDelete()
      }

      setMedia(mediaRecord)
      onUploadComplete?.(mediaRecord.id)
    } catch (err) {
      console.error('Upload error:', err)
      setError('Upload failed. Try again')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async () => {
    if (!media) return

    try {
      const response = await fetch(`/api/media/${media.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Delete failed')
      }

      setMedia(null)
      onDeleteComplete?.()
    } catch (err) {
      console.error('Delete error:', err)
      setError('Delete failed. Try again')
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  const getFileName = () => {
    if (!media) return ''
    const parts = media.storage_path.split('/')
    return parts[parts.length - 1]
  }

  return (
    <div className="flex flex-col gap-[16px]">
      {/* Upload Zone or File Display */}
      {!media ? (
        <div
          onClick={handleClick}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            relative
            border-2 border-dashed rounded-[4px]
            px-[24px] py-[32px]
            cursor-pointer
            transition-colors duration-[200ms]
            ${
              dragActive
                ? 'border-accent-visual bg-accent-visual/5'
                : 'border-border bg-surface hover:bg-surface/70'
            }
          `}
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            onChange={handleChange}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-[8px] text-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              className="text-text-secondary"
            >
              <path
                d="M20 4H8C6.89543 4 6 4.89543 6 6V26C6 27.1046 6.89543 28 8 28H24C25.1046 28 26 27.1046 26 26V10L20 4Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M20 4V10H26"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div>
              <p className="text-[14px] leading-[20px] text-text-primary">
                Drop PDF or click to upload
              </p>
              <p className="text-[12px] leading-[16px] text-text-secondary mt-[4px]">
                PDF only (max 50MB)
              </p>
            </div>
          </div>
          {uploading && (
            <div className="absolute inset-0 bg-surface/90 rounded-[4px] flex items-center justify-center">
              <p className="text-[14px] text-text-primary">Uploading...</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white border border-border rounded-[4px] p-[16px]">
          <div className="flex items-center gap-[12px]">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              className="text-text-secondary flex-shrink-0"
            >
              <path
                d="M20 4H8C6.89543 4 6 4.89543 6 6V26C6 27.1046 6.89543 28 8 28H24C25.1046 28 26 27.1046 26 26V10L20 4Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M20 4V10H26"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] leading-[20px] text-text-primary truncate">
                {getFileName()}
              </p>
              <p className="text-[12px] leading-[16px] text-text-secondary">
                {formatFileSize(media.file_size)}
              </p>
            </div>
            <button
              onClick={handleDelete}
              className="
                flex-shrink-0
                w-[32px] h-[32px]
                rounded-[4px]
                flex items-center justify-center
                hover:bg-error/10 hover:text-error
                transition-colors duration-[200ms]
              "
              aria-label="Delete PDF"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M12 4L4 12M4 4L12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <p className="text-[14px] leading-[20px] text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
