'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { TextInput } from '@/components/ui/Input'
import Script from 'next/script'

interface FundingData {
  id: string
  funding_goal: number
  description: string | null
  end_date: string | null
  total_raised: number
  donor_count: number
}

interface PitchViewFundingProps {
  pitchId: string
  projectName: string
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void
    }
  }
}

export function PitchViewFunding({ pitchId, projectName }: PitchViewFundingProps) {
  const [funding, setFunding] = useState<FundingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [donating, setDonating] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Donor form
  const [amount, setAmount] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function fetchFunding() {
      try {
        const res = await fetch(`/api/funding/public/${pitchId}`)
        const data = await res.json()
        setFunding(data.funding)
      } catch {
        // No funding — that's fine
      } finally {
        setLoading(false)
      }
    }
    fetchFunding()
  }, [pitchId])

  if (loading || !funding) return null

  const percentage = Math.min(
    100,
    Math.round((funding.total_raised / funding.funding_goal) * 100)
  )

  const isExpired = funding.end_date
    ? new Date(funding.end_date) < new Date()
    : false

  const handleDonate = async () => {
    const amountInPaise = Math.round(parseFloat(amount) * 100)
    if (!amountInPaise || amountInPaise < 100) {
      setError('Minimum donation is \u20B91')
      return
    }
    if (!name.trim() || !email.trim()) {
      setError('Name and email are required')
      return
    }

    setDonating(true)
    setError('')

    try {
      // Create order
      const orderRes = await fetch(`/api/funding/${funding.id}/donate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountInPaise,
          name,
          email,
          message: message || null,
        }),
      })

      if (!orderRes.ok) {
        const data = await orderRes.json()
        setError(data.error || 'Failed to create payment')
        return
      }

      const { orderId, currency } = await orderRes.json()

      // Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amountInPaise,
        currency,
        name: 'Pitchcraft',
        description: `Support: ${projectName}`,
        order_id: orderId,
        prefill: { name, email },
        handler: async (response: {
          razorpay_order_id: string
          razorpay_payment_id: string
          razorpay_signature: string
        }) => {
          // Verify payment
          const verifyRes = await fetch('/api/funding/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              funding_id: funding.id,
              name,
              email,
              message: message || null,
              amount: amountInPaise,
            }),
          })

          if (verifyRes.ok) {
            setSuccess(true)
            setShowForm(false)
            // Refresh funding data
            const refreshRes = await fetch(`/api/funding/public/${pitchId}`)
            const refreshData = await refreshRes.json()
            if (refreshData.funding) setFunding(refreshData.funding)
          } else {
            setError('Payment verification failed')
          }
        },
        theme: { color: '#1A1A1A' },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch {
      setError('Payment failed')
    } finally {
      setDonating(false)
    }
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <section className="max-w-[680px] mx-auto w-full px-[24px]">
        <div className="bg-white border border-border rounded-[4px] p-[24px]">
          <h2 className="font-[var(--font-heading)] text-[24px] font-semibold leading-[32px] tracking-[-0.02em] text-text-primary mb-[16px]">
            Support This Project
          </h2>

          {funding.description && (
            <p className="font-[var(--font-body)] text-[14px] leading-[20px] text-text-secondary mb-[16px]">
              {funding.description}
            </p>
          )}

          {/* Progress bar */}
          <div className="mb-[16px]">
            <div className="flex justify-between items-baseline mb-[8px]">
              <span className="font-[var(--font-mono)] text-[13px] leading-[20px] text-text-primary">
                {'\u20B9'}{funding.total_raised.toLocaleString()} raised
              </span>
              <span className="font-[var(--font-mono)] text-[13px] leading-[20px] text-text-secondary">
                of {'\u20B9'}{funding.funding_goal.toLocaleString()}
              </span>
            </div>
            <div className="h-[4px] bg-surface rounded-full overflow-hidden">
              <div
                className="h-full bg-pop rounded-full transition-all duration-[400ms] ease-out"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="flex justify-between items-baseline mt-[8px]">
              <span className="font-[var(--font-mono)] text-[13px] leading-[20px] text-text-secondary">
                {funding.donor_count} {funding.donor_count === 1 ? 'supporter' : 'supporters'}
              </span>
              {funding.end_date && (
                <span className="font-[var(--font-mono)] text-[13px] leading-[20px] text-text-secondary">
                  {isExpired ? 'Ended' : `Ends ${new Date(funding.end_date).toLocaleDateString()}`}
                </span>
              )}
            </div>
          </div>

          {success && (
            <p className="font-[var(--font-body)] text-[14px] leading-[20px] text-success mb-[16px]">
              Thank you for your support.
            </p>
          )}

          {!isExpired && !showForm && !success && (
            <Button
              variant="primary"
              type="button"
              onClick={() => setShowForm(true)}
            >
              Support this project
            </Button>
          )}

          {showForm && (
            <div className="flex flex-col gap-[12px] mt-[16px]">
              <TextInput
                label="Amount (INR)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="500"
              />
              <TextInput
                label="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <TextInput
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <TextInput
                label="Message (optional)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              {error && (
                <p className="text-[14px] leading-[20px] text-error">{error}</p>
              )}
              <div className="flex gap-[12px]">
                <Button
                  variant="primary"
                  type="button"
                  onClick={handleDonate}
                  disabled={donating}
                >
                  {donating ? 'Processing...' : 'Pay'}
                </Button>
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
