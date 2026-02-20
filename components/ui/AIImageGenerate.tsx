'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'

interface AIImageGenerateProps {
  fieldName: string
  onAccept: (file: File) => void
  maxReached: boolean
  context?: {
    projectName?: string
    genre?: string
    format?: string
    logline?: string
  }
}

export function AIImageGenerate({ fieldName, onAccept, maxReached, context }: AIImageGenerateProps) {
  const [open, setOpen] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setLoading(true)
    setError('')
    setPreviewUrl('')

    try {
      const res = await fetch('/api/ai/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, fieldName, context }),
      })

      if (res.status === 429) {
        const data = await res.json()
        setError(data.error || 'Daily limit reached')
        return
      }

      if (!res.ok) {
        setError('Image generation failed. Try again.')
        return
      }

      const data = await res.json()
      setPreviewUrl(data.url)
    } catch {
      setError('Network error. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeep = async () => {
    if (!previewUrl) return

    try {
      const res = await fetch(previewUrl)
      const blob = await res.blob()
      const file = new File([blob], `ai-generated-${Date.now()}.png`, { type: 'image/png' })
      onAccept(file)
      setPreviewUrl('')
      setPrompt('')
      setOpen(false)
    } catch {
      setError('Failed to save image. Try again.')
    }
  }

  const handleDiscard = () => {
    setPreviewUrl('')
    setError('')
  }

  const handleClose = () => {
    setPreviewUrl('')
    setPrompt('')
    setError('')
    setOpen(false)
  }

  if (maxReached) return null

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="
          inline-flex items-center gap-[6px]
          px-[10px] py-[5px]
          text-[12px] leading-[16px] text-text-secondary
          border border-border rounded-[4px]
          hover:bg-surface hover:text-text-primary
          transition-colors duration-[200ms]
        "
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="1.5" y="1.5" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="5" cy="5.5" r="1.2" stroke="currentColor" strokeWidth="1" />
          <path d="M1.5 10l3-3 2 2 2.5-3 3.5 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        AI Generate
      </button>
    )
  }

  return (
    <div className="border border-border rounded-[4px] bg-white p-[16px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-[12px]">
        <span className="font-[var(--font-mono)] text-[11px] leading-[16px] uppercase tracking-[0.08em] text-text-secondary">
          AI Image Generate
        </span>
        <button
          type="button"
          onClick={handleClose}
          className="text-[12px] text-text-secondary hover:text-text-primary transition-colors"
        >
          Close
        </button>
      </div>

      {/* Prompt input */}
      {!previewUrl && !loading && (
        <div className="mb-[12px]">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you need — style, mood, subject"
            className="
              w-full px-[12px] py-[10px] min-h-[72px]
              bg-surface/50 border border-border rounded-[4px]
              text-[13px] leading-[20px] text-text-primary
              font-[var(--font-body)]
              placeholder:text-text-disabled
              resize-y
            "
          />
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-[8px] py-[24px] justify-center">
          <div className="w-[14px] h-[14px] border-2 border-border border-t-pop rounded-full animate-spin" />
          <span className="text-[13px] leading-[20px] text-text-secondary">
            Generating image...
          </span>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-[13px] leading-[20px] text-error mb-[12px]">{error}</p>
      )}

      {/* Preview */}
      {previewUrl && (
        <div className="mb-[12px]">
          <div className="font-[var(--font-mono)] text-[10px] leading-[14px] uppercase tracking-[0.08em] text-text-disabled mb-[6px]">
            AI Generated
          </div>
          <div className="w-full max-w-[300px] aspect-square rounded-[4px] overflow-hidden border border-[#D4D6C8] bg-surface">
            <img
              src={previewUrl}
              alt="AI generated reference"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-[8px]">
        {!previewUrl && !loading && (
          <Button
            type="button"
            variant="primary"
            onClick={handleGenerate}
            disabled={!prompt.trim()}
            className="!py-[8px] !px-[16px] !text-[13px]"
          >
            Generate
          </Button>
        )}
        {previewUrl && (
          <>
            <Button
              type="button"
              variant="primary"
              onClick={handleKeep}
              className="!py-[8px] !px-[16px] !text-[13px]"
            >
              Keep
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleDiscard}
              className="!py-[8px] !px-[16px] !text-[13px]"
            >
              Discard
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
