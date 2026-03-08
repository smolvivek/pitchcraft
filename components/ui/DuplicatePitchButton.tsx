'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface DuplicatePitchButtonProps {
  pitchId: string
}

export function DuplicatePitchButton({ pitchId }: DuplicatePitchButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDuplicate = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setLoading(true)
    try {
      const res = await fetch(`/api/pitches/${pitchId}/duplicate`, { method: 'POST' })
      const data = await res.json()
      if (res.status === 403 && data.upgrade) {
        router.push('/pricing')
        return
      }
      if (data.id) {
        router.push(`/dashboard/pitches/${data.id}/edit`)
        router.refresh()
      }
    } catch {
      // fail silently — user can retry
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleDuplicate}
      disabled={loading}
      title="Duplicate pitch"
      aria-label="Duplicate pitch"
      className="text-text-disabled hover:text-text-primary transition-colors duration-[150ms] p-[4px] disabled:opacity-40"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <rect x="1" y="4" width="8" height="9" rx="1" stroke="currentColor" strokeWidth="1.2" />
        <path d="M4 4V2.5C4 1.95 4.45 1.5 5 1.5h6.5C12.05 1.5 12.5 1.95 12.5 2.5V9c0 .55-.45 1-1 1H10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </button>
  )
}
