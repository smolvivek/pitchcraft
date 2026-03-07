'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { TextInput } from '@/components/ui/Input'

const MAX_ATTEMPTS = 5
const LOCKOUT_MS = 15 * 60 * 1000 // 15 minutes

function getLockoutKey(pitchId: string) {
  return `pitch_lockout_${pitchId}`
}

function getAttemptsKey(pitchId: string) {
  return `pitch_attempts_${pitchId}`
}

function getRemainingLockoutSeconds(pitchId: string): number {
  try {
    const raw = localStorage.getItem(getLockoutKey(pitchId))
    if (!raw) return 0
    const until = parseInt(raw, 10)
    const remaining = Math.ceil((until - Date.now()) / 1000)
    return remaining > 0 ? remaining : 0
  } catch {
    return 0
  }
}

interface PitchViewPasswordGateProps {
  pitchId: string
}

export function PitchViewPasswordGate({ pitchId }: PitchViewPasswordGateProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [lockoutSeconds, setLockoutSeconds] = useState(() => getRemainingLockoutSeconds(pitchId))

  // Countdown timer
  useEffect(() => {
    if (lockoutSeconds <= 0) return
    const interval = setInterval(() => {
      const remaining = getRemainingLockoutSeconds(pitchId)
      setLockoutSeconds(remaining)
      if (remaining <= 0) clearInterval(interval)
    }, 1000)
    return () => clearInterval(interval)
  }, [pitchId, lockoutSeconds])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password.trim()) {
      setError('Enter the password')
      return
    }

    const remaining = getRemainingLockoutSeconds(pitchId)
    if (remaining > 0) {
      setLockoutSeconds(remaining)
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
        localStorage.removeItem(getAttemptsKey(pitchId))
        localStorage.removeItem(getLockoutKey(pitchId))
        // Cookie is now set server-side. Full page reload triggers server re-render with cookie.
        window.location.reload()
      } else {
        // Track failed attempts
        const attempts = parseInt(localStorage.getItem(getAttemptsKey(pitchId)) ?? '0', 10) + 1
        localStorage.setItem(getAttemptsKey(pitchId), String(attempts))

        if (attempts >= MAX_ATTEMPTS) {
          const until = Date.now() + LOCKOUT_MS
          localStorage.setItem(getLockoutKey(pitchId), String(until))
          localStorage.removeItem(getAttemptsKey(pitchId))
          setLockoutSeconds(LOCKOUT_MS / 1000)
          setError('')
        } else {
          setError(`Incorrect password. ${MAX_ATTEMPTS - attempts} attempt${MAX_ATTEMPTS - attempts === 1 ? '' : 's'} remaining.`)
        }
      }
    } catch {
      setError('Verification failed')
    } finally {
      setLoading(false)
    }
  }

  if (lockoutSeconds > 0) {
    const mins = Math.floor(lockoutSeconds / 60)
    const secs = lockoutSeconds % 60
    return (
      <div className="flex flex-col gap-[12px]">
        <p className="font-[var(--font-body)] text-[14px] leading-[20px] text-error">
          Too many incorrect attempts. Try again in {mins}:{String(secs).padStart(2, '0')}.
        </p>
      </div>
    )
  }

  return (
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
  )
}
