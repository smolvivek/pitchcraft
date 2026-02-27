'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { TextInput } from '@/components/ui/Input'

interface PitchViewPasswordGateProps {
  pitchId: string
  onVerified: () => void
}

export function PitchViewPasswordGate({ pitchId, onVerified }: PitchViewPasswordGateProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password.trim()) {
      setError('Enter the password')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch(`/api/pitches/${pitchId}/verify-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        onVerified()
      } else {
        setError('Incorrect password')
      }
    } catch {
      setError('Verification failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-[24px]">
      <div className="bg-surface border border-border rounded-[4px] p-[32px] max-w-[400px] w-full">
        <h1 className="font-[var(--font-heading)] text-[24px] font-semibold leading-[32px] tracking-[-0.02em] text-text-primary mb-[8px]">
          This project is password-protected
        </h1>
        <p className="font-[var(--font-body)] text-[14px] leading-[20px] text-text-secondary mb-[24px]">
          Enter the password to view.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-[16px]">
          <TextInput
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
          {error && (
            <p className="text-[14px] leading-[20px] text-error">{error}</p>
          )}
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Verifying...' : 'View project'}
          </Button>
        </form>
        <p className="font-[var(--font-mono)] text-[11px] leading-[16px] text-text-disabled mt-[24px]">
          Pitchcraft
        </p>
      </div>
    </div>
  )
}
