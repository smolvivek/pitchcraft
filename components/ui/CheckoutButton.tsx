'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

interface CheckoutButtonProps {
  tier: 'pro' | 'studio'
  billingPeriod?: 'monthly' | 'annual'
  currency?: 'usd' | 'inr'
  variant?: 'primary' | 'secondary'
  className?: string
  children: React.ReactNode
}

export function CheckoutButton({ tier, billingPeriod = 'monthly', currency = 'usd', variant = 'secondary', className, children }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleClick = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/subscriptions/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, billing_period: billingPeriod, currency }),
      })

      if (res.status === 401) {
        router.push(`/signup?plan=${tier}`)
        return
      }

      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        router.push('/signup')
      }
    } catch {
      router.push('/signup')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant={variant} onClick={handleClick} disabled={loading} className={className}>
      {loading ? 'Loading...' : children}
    </Button>
  )
}
