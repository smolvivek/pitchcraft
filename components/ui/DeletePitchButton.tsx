'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface DeletePitchButtonProps {
  pitchId: string
  pitchName: string
}

export function DeletePitchButton({ pitchId, pitchName }: DeletePitchButtonProps) {
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deleted, setDeleted] = useState(false)
  const router = useRouter()

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!confirming) {
      setConfirming(true)
      return
    }

    setLoading(true)
    try {
      await fetch(`/api/pitches/${pitchId}`, { method: 'DELETE' })
      setDeleted(true)
      setTimeout(() => {
        router.refresh()
      }, 1500)
    } catch {
      setLoading(false)
      setConfirming(false)
    }
  }

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setConfirming(false)
  }

  if (deleted) {
    return (
      <span className="font-mono text-[11px] text-error">Deleted</span>
    )
  }

  if (confirming) {
    return (
      <span className="flex items-center gap-[6px]">
        <span className="font-mono text-[11px] text-text-secondary">Delete &quot;{pitchName.slice(0, 20)}&quot;?</span>
        <button
          type="button"
          onClick={handleDelete}
          disabled={loading}
          aria-label="Delete pitch"
          className="font-mono text-[11px] text-error hover:opacity-80 transition-opacity disabled:opacity-40"
        >
          {loading ? 'Deleting...' : 'Yes, delete'}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="font-mono text-[11px] text-text-disabled hover:text-text-secondary transition-colors"
        >
          Cancel
        </button>
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      title="Delete pitch"
      aria-label="Delete pitch"
      className="text-text-disabled hover:text-error transition-colors duration-[150ms] p-[4px]"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M2 3.5h10M5.5 3.5V2.5h3v1M3.5 3.5l.5 8h6l.5-8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}
