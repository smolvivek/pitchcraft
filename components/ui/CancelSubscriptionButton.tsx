'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function CancelSubscriptionButton() {
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleCancel = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/subscriptions/cancel', { method: 'POST' })
      if (res.ok) {
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error ?? 'Something went wrong. Please try again.')
        setConfirming(false)
      }
    } catch {
      setError('Something went wrong. Please try again.')
      setConfirming(false)
    } finally {
      setLoading(false)
    }
  }

  if (confirming) {
    return (
      <div className="flex flex-col gap-[12px]">
        <p className="text-[14px] leading-[20px] text-text-primary">
          Cancel your subscription? You'll keep access until the end of your billing period.
        </p>
        {error && (
          <p className="font-mono text-[12px] leading-[18px] text-error">{error}</p>
        )}
        <div className="flex items-center gap-[12px]">
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="font-mono text-[12px] leading-[20px] text-error hover:underline disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Cancelling…' : 'Yes, cancel'}
          </button>
          <button
            type="button"
            onClick={() => { setConfirming(false); setError('') }}
            disabled={loading}
            className="font-mono text-[12px] leading-[20px] text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            Keep subscription
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="font-mono text-[13px] leading-[20px] text-text-disabled hover:text-error transition-colors cursor-pointer"
    >
      Cancel subscription
    </button>
  )
}
