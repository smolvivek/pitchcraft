'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'

interface AITextAssistProps {
  fieldName: string
  currentText: string
  onAccept: (text: string) => void
  context?: {
    projectName?: string
    genre?: string
    format?: string
    logline?: string
  }
}

export function AITextAssist({ fieldName, currentText, onAccept, context }: AITextAssistProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [suggestion, setSuggestion] = useState('')
  const [brief, setBrief] = useState('')
  const [error, setError] = useState('')

  const hasText = currentText.trim().length > 0
  const mode = hasText ? 'refine' : 'draft'

  const handleRequest = async () => {
    if (mode === 'draft' && !brief.trim()) return

    setLoading(true)
    setError('')
    setSuggestion('')

    try {
      const res = await fetch('/api/ai/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          text: mode === 'refine' ? currentText : undefined,
          brief: mode === 'draft' ? brief : undefined,
          fieldName,
          context,
        }),
      })

      if (res.status === 429) {
        const data = await res.json()
        setError(data.error || 'Daily limit reached')
        return
      }

      if (!res.ok) {
        setError('Something went wrong. Try again.')
        return
      }

      const data = await res.json()
      setSuggestion(data.suggestion)
    } catch {
      setError('Network error. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = () => {
    onAccept(suggestion)
    setSuggestion('')
    setBrief('')
    setOpen(false)
  }

  const handleDismiss = () => {
    setSuggestion('')
    setBrief('')
    setError('')
    setOpen(false)
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="
          inline-flex items-center gap-[6px]
          mt-[8px] px-[10px] py-[5px]
          text-[12px] leading-[16px] text-text-secondary
          border border-border rounded-[4px]
          hover:bg-surface hover:text-text-primary
          transition-colors duration-[200ms]
        "
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 1v4M5 3h4M2.5 7.5l2-1M9.5 6.5l2 1M4 11.5l1.5-2.5M8.5 9l1.5 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="7" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.2" />
        </svg>
        {hasText ? 'AI Refine' : 'AI Draft'}
      </button>
    )
  }

  return (
    <div className="mt-[8px] border border-border rounded-[4px] bg-white p-[16px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-[12px]">
        <span className="font-[var(--font-mono)] text-[11px] leading-[16px] uppercase tracking-[0.08em] text-text-secondary">
          AI {mode === 'refine' ? 'Refine' : 'Draft'}
        </span>
        <button
          type="button"
          onClick={handleDismiss}
          className="text-[12px] text-text-secondary hover:text-text-primary transition-colors"
        >
          Close
        </button>
      </div>

      {/* Draft mode: brief input */}
      {mode === 'draft' && !suggestion && (
        <div className="mb-[12px]">
          <textarea
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            placeholder="Describe what you want — a few words or a rough idea"
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

      {/* Refine mode: show what will be refined */}
      {mode === 'refine' && !suggestion && !loading && (
        <p className="text-[13px] leading-[20px] text-text-secondary mb-[12px]">
          AI will refine your current text for clarity and tone.
        </p>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-[8px] py-[12px]">
          <div className="w-[14px] h-[14px] border-2 border-border border-t-pop rounded-full animate-spin" />
          <span className="text-[13px] leading-[20px] text-text-secondary">
            {mode === 'refine' ? 'Refining...' : 'Drafting...'}
          </span>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-[13px] leading-[20px] text-error mb-[12px]">{error}</p>
      )}

      {/* Suggestion preview */}
      {suggestion && (
        <div className="mb-[12px]">
          <div className="font-[var(--font-mono)] text-[10px] leading-[14px] uppercase tracking-[0.08em] text-text-disabled mb-[6px]">
            AI Suggestion
          </div>
          <div className="px-[12px] py-[10px] bg-[#F5F5EC] border border-[#D4D6C8] rounded-[4px] text-[14px] leading-[22px] text-text-primary whitespace-pre-wrap">
            {suggestion}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-[8px]">
        {!suggestion && !loading && (
          <Button
            type="button"
            variant="primary"
            onClick={handleRequest}
            disabled={mode === 'draft' && !brief.trim()}
            className="!py-[8px] !px-[16px] !text-[13px]"
          >
            {mode === 'refine' ? 'Refine' : 'Generate Draft'}
          </Button>
        )}
        {suggestion && (
          <>
            <Button
              type="button"
              variant="primary"
              onClick={handleAccept}
              className="!py-[8px] !px-[16px] !text-[13px]"
            >
              Use this
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleDismiss}
              className="!py-[8px] !px-[16px] !text-[13px]"
            >
              Dismiss
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
