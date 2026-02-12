'use client'

import { useState, useRef, useCallback } from 'react'
import { validateImageFile } from '@/lib/utils/fileValidation'
import type { MediaRecord } from '@/lib/types/pitch'

interface ImageUploadProps {
  pitchId: string
  sectionName: string
  maxFiles?: number
  existingMedia?: MediaRecord[]
  onUploadComplete?: (mediaIds: string[]) => void
  onDeleteComplete?: (mediaId: string) => void
}

export function ImageUpload({
  pitchId,
  sectionName,
  maxFiles = 10,
  existingMedia = [],
  onUploadComplete,
  onDeleteComplete,
}: ImageUploadProps) {
  const [media, setMedia] = useState<MediaRecord[]>(existingMedia)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setError(null)

    // Check max files
    if (media.length + files.length > maxFiles) {
      setError(`Max ${maxFiles} images allowed`)
      return
    }

    // Validate all files
    const fileArray = Array.from(files)
    for (const file of fileArray) {
      const validation = validateImageFile(file)
      if (!validation.valid) {
        setError(validation.message || 'Invalid file')
        return
      }
    }

    // Upload files
    setUploading(true)
    const uploadedMedia: MediaRecord[] = []

    for (const file of fileArray) {
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
        uploadedMedia.push(mediaRecord)
      } catch (err) {
        console.error('Upload error:', err)
        setError('Upload failed. Try again')
        break
      }
    }

    if (uploadedMedia.length > 0) {
      const newMedia = [...media, ...uploadedMedia]
      setMedia(newMedia)
      onUploadComplete?.(newMedia.map(m => m.id))
    }

    setUploading(false)
  }, [media, maxFiles, pitchId, sectionName, onUploadComplete])

  const handleDelete = async (mediaId: string) => {
    try {
      const response = await fetch(`/api/media/${mediaId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Delete failed')
      }

      const newMedia = media.filter(m => m.id !== mediaId)
      setMedia(newMedia)
      onDeleteComplete?.(mediaId)
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
    handleFiles(e.dataTransfer.files)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    handleFiles(e.target.files)
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  return (
    <div className="flex flex-col gap-[16px]">
      {/* Upload Zone */}
      {media.length < maxFiles && (
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
            multiple
            accept="image/jpeg,image/png,image/webp"
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
                d="M16 22V10M16 10L11 15M16 10L21 15M28 16C28 22.6274 22.6274 28 16 28C9.37258 28 4 22.6274 4 16C4 9.37258 9.37258 4 16 4C22.6274 4 28 9.37258 28 16Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div>
              <p className="text-[14px] leading-[20px] text-text-primary">
                Drop images or click to upload
              </p>
              <p className="text-[12px] leading-[16px] text-text-secondary mt-[4px]">
                JPG, PNG, WebP (max 10MB)
              </p>
            </div>
          </div>
          {uploading && (
            <div className="absolute inset-0 bg-surface/90 rounded-[4px] flex items-center justify-center">
              <p className="text-[14px] text-text-primary">Uploading...</p>
            </div>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <p className="text-[14px] leading-[20px] text-error" role="alert">
          {error}
        </p>
      )}

      {/* Thumbnail Grid */}
      {media.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-[12px]">
          {media.map((item) => (
            <ImageThumbnail
              key={item.id}
              media={item}
              onDelete={() => handleDelete(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function ImageThumbnail({
  media,
  onDelete,
}: {
  media: MediaRecord
  onDelete: () => void
}) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch signed URL for image
  useState(() => {
    async function fetchUrl() {
      try {
        const response = await fetch(`/api/media/${media.id}`)
        if (response.ok) {
          const { url } = await response.json()
          setImageUrl(url)
        }
      } catch (err) {
        console.error('Failed to load image:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchUrl()
  })

  return (
    <div className="relative aspect-square bg-surface rounded-[4px] overflow-hidden border border-border group">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-[12px] text-text-secondary">Loading...</p>
        </div>
      )}
      {imageUrl && (
        <img
          src={imageUrl}
          alt=""
          className="w-full h-full object-cover"
        />
      )}
      <button
        onClick={onDelete}
        className="
          absolute top-[8px] right-[8px]
          w-[24px] h-[24px]
          bg-white rounded-full
          flex items-center justify-center
          opacity-0 group-hover:opacity-100
          transition-opacity duration-[200ms]
          hover:bg-error hover:text-white
        "
        aria-label="Delete image"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M9 3L3 9M3 3L9 9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  )
}
