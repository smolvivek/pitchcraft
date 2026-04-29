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
  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // Upgraded banner — show after DodoPayments checkout return
    if (searchParams.get('upgraded') === 'true') {
      setUpgradeVisible(true)
      router.replace(pathname, { scroll: false })

      let attempts = 0
      const delays = [2000, 3000, 4000, 5000, 6000, 8000, 10000, 12000, 15000, 20000]
      const scheduleNext = (attemptIndex: number) => {
        const delay = delays[Math.min(attemptIndex, delays.length - 1)]
        pollRef.current = setTimeout(async () => {
          attempts++
          try {
            const res = await fetch('/api/subscriptions/status')
            if (res.ok) {
              const data = await res.json()
              if (data.tier && data.tier !== 'free') {
                setConfirmed(true)
                router.refresh()
                return
              }
            }
          } catch { /* ignore */ }
          if (attempts < 10) scheduleNext(attempts)
        }, delay)
      }
      scheduleNext(0)

      // Do not auto-dismiss — user sees "activating…" until confirmed or manually closes
      return () => {
        if (pollRef.current) clearTimeout(pollRef.current)
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
        <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-[24px]">
          <p className="font-mono text-[13px] leading-[20px] text-success">
            {confirmed
              ? 'Subscription activated — AI, unlimited pitches, and privacy controls are now active.'
              : 'Payment received — activating your subscription… Refresh if this takes more than a minute.'}
          </p>
          <button
            type="button"
            onClick={() => setUpgradeVisible(false)}
            className="text-success/60 hover:text-success transition-colors font-mono text-[11px] shrink-0 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </div>
    )
  }

  if (firstPitchVisible) {
    return (
      <div className="bg-surface border-b border-border px-[24px] py-[12px]">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-[24px]">
          <p className="font-mono text-[13px] leading-[20px] text-text-secondary">
            Your pitch is live. Want private links, AI, and unlimited pitches?{' '}
            <Link href="/pricing" className="text-pop hover:text-pop-hover transition-colors">
              Go Pro →
            </Link>
          </p>
          <button
            type="button"
            onClick={() => setFirstPitchVisible(false)}
            className="text-text-disabled hover:text-text-secondary transition-colors font-mono text-[11px] shrink-0"
          >
            Dismiss
          </button>
        </div>
      </div>
    )
  }

  return null
}
