'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'

export function UpgradeBanner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (searchParams.get('upgraded') === 'true') {
      setVisible(true)
      router.replace(pathname, { scroll: false })
      const t = setTimeout(() => setVisible(false), 7000)
      return () => clearTimeout(t)
    }
  }, [searchParams, router, pathname])

  if (!visible) return null

  return (
    <div className="bg-success/10 border-b border-success/20 px-[24px] py-[12px]">
      <p className="font-[var(--font-mono)] text-[13px] leading-[20px] text-success max-w-[1200px] mx-auto">
        Subscription activated — AI, unlimited pitches, and privacy controls are now active.
      </p>
    </div>
  )
}
