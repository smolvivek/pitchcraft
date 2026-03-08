'use client'

import { useEffect, useState, useRef } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'

export function UpgradeBanner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (searchParams.get('upgraded') !== 'true') return

    setVisible(true)
    router.replace(pathname, { scroll: false })

    // Poll /api/subscriptions/status every 2s until tier upgrades (webhook may be delayed)
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
            // Reload so Nav tier badge and all server components reflect new tier
            router.refresh()
          }
        }
      } catch { /* ignore */ }
      // Stop polling after 30s regardless
      if (attempts >= 15) {
        if (pollRef.current) clearInterval(pollRef.current)
      }
    }, 2000)

    // Auto-dismiss after 10s
    const dismiss = setTimeout(() => setVisible(false), 10000)

    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
      clearTimeout(dismiss)
    }
  }, [searchParams, router, pathname])

  if (!visible) return null

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
