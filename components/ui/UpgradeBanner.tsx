'use client'

import { useEffect, useState, useRef } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

export function UpgradeBanner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [upgradeVisible, setUpgradeVisible] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [firstPitchVisible, setFirstPitchVisible] = useState(false)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    // Upgraded banner — show after DodoPayments checkout return
    if (searchParams.get('upgraded') === 'true') {
      setUpgradeVisible(true)
      router.replace(pathname, { scroll: false })

      let attempts = 0
      pollRef.current = setInterval(async () => {
        attempts++
        try {
          const res = await fetch('/api/subscriptions/status')
          if (res.ok) {
            const data = await res.json()
            if (data.tier && data.tier !== 'free') {
              setConfirmed(true)
              if (pollRef.current) clearInterval(pollRef.current)
              router.refresh()
            }
          }
        } catch { /* ignore */ }
        if (attempts >= 15) {
          if (pollRef.current) clearInterval(pollRef.current)
        }
      }, 2000)

      const dismiss = setTimeout(() => setUpgradeVisible(false), 10000)
      return () => {
        if (pollRef.current) clearInterval(pollRef.current)
        clearTimeout(dismiss)
      }
    }

    // First pitch banner — show once after first successful pitch creation
    if (searchParams.get('firstpitch') === 'true') {
      const seen = typeof window !== 'undefined' && localStorage.getItem('pitchcraft_firstpitch_seen')
      if (!seen) {
        setFirstPitchVisible(true)
        router.replace(pathname, { scroll: false })
        localStorage.setItem('pitchcraft_firstpitch_seen', '1')
        const dismiss = setTimeout(() => setFirstPitchVisible(false), 12000)
        return () => clearTimeout(dismiss)
      }
    }
  }, [searchParams, router, pathname])

  if (upgradeVisible) {
    return (
      <div className="bg-success/10 border-b border-success/20 px-[24px] py-[12px]">
        <p className="font-[var(--font-mono)] text-[13px] leading-[20px] text-success max-w-[1200px] mx-auto">
          {confirmed
            ? 'Subscription activated — AI, unlimited pitches, and privacy controls are now active.'
            : 'Payment received — activating your subscription…'}
        </p>
      </div>
    )
  }

  if (firstPitchVisible) {
    return (
      <div className="bg-surface border-b border-border px-[24px] py-[12px]">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-[24px]">
          <p className="font-[var(--font-mono)] text-[13px] leading-[20px] text-text-secondary">
            Your pitch is live. Want private links, AI, and unlimited pitches?{' '}
            <Link href="/pricing" className="text-pop hover:text-pop-hover transition-colors">
              Go Pro →
            </Link>
          </p>
          <button
            type="button"
            onClick={() => setFirstPitchVisible(false)}
            className="text-text-disabled hover:text-text-secondary transition-colors font-[var(--font-mono)] text-[11px] shrink-0"
          >
            Dismiss
          </button>
        </div>
      </div>
    )
  }

  return null
}
