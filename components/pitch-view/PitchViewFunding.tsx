'use client'

import { useState, useEffect } from 'react'
import Script from 'next/script'
import { Button } from '@/components/ui/Button'
import { TextInput } from '@/components/ui/Input'

interface StretchGoal {
  amount: number
  description: string
}

interface FundingReward {
  amount: number
  title: string
  description: string
}

interface FundingData {
  id: string
  funding_goal: number
  description: string | null
  end_date: string | null
  stretch_goals: StretchGoal[]
  rewards: FundingReward[]
  total_raised: number
  donor_count: number
}

interface RazorpayInstance {
  open(): void
  on(event: string, handler: (response: Record<string, string>) => void): void
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => RazorpayInstance
  }
}

interface PitchViewFundingProps {
  pitchId: string
  projectName: string
}

export function PitchViewFunding({ pitchId, projectName }: PitchViewFundingProps) {
  const [funding, setFunding] = useState<FundingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [donating, setDonating] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [amount, setAmount] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [breakdown, setBreakdown] = useState<{ creatorAmount: number; commissionPct: number } | null>(null)

  useEffect(() => {
    async function fetchFunding() {
      try {
        const res = await fetch(`/api/funding/public/${pitchId}`)
        const data = await res.json()
        setFunding(data.funding)
      } catch {
        // No funding — fine
      } finally {
        setLoading(false)
      }
    }
    fetchFunding()
  }, [pitchId])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('funded') === 'true') setSuccess(true)
  }, [])

  if (loading || !funding) return null

  const percentage = Math.min(100, Math.round((funding.total_raised / funding.funding_goal) * 100))
  const isExpired = funding.end_date ? new Date(funding.end_date) < new Date() : false

  const formatCurrency = (cents: number) =>
    `$${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`

  const handleDonate = async () => {
    const amountInCents = Math.round(parseFloat(amount) * 100)
    if (!amountInCents || amountInCents < 100) {
      setError('Minimum donation is $1')
      return
    }
    if (!name.trim() || !email.trim()) {
      setError('Name and email are required')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address')
      return
    }

    setDonating(true)
    setError('')

    try {
      const res = await fetch(`/api/funding/${funding.id}/donate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amountInCents, name, email, message: message || null }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to create payment')
        setDonating(false)
        return
      }

      const { order_id, amount: orderAmount, currency, key_id, creator_amount, commission_rate } = await res.json()

      setBreakdown({
        creatorAmount: creator_amount,
        commissionPct: Math.round(commission_rate * 100),
      })

      if (!window.Razorpay) {
        setError('Payment system failed to load. Please refresh and try again.')
        setDonating(false)
        return
      }

      const rzp = new window.Razorpay({
        key: key_id,
        order_id,
        amount: orderAmount,
        currency,
        name: 'PitchCraft',
        description: `Support: ${projectName}`,
        prefill: { name, email },
        notes: { project: projectName },
        theme: { color: '#FF6300' },
        modal: {
          ondismiss: () => setDonating(false),
        },
        handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
          try {
            const verifyRes = await fetch(`/api/funding/${funding.id}/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                name,
                email,
                message: message || null,
                amount: amountInCents,
                currency,
              }),
            })

            if (verifyRes.ok) {
              setSuccess(true)
              setShowForm(false)
              setFunding((prev) =>
                prev
                  ? {
                      ...prev,
                      total_raised: prev.total_raised + amountInCents,
                      donor_count: prev.donor_count + 1,
                    }
                  : prev
              )
            } else {
              setError('Payment recorded but verification failed. Please contact support.')
            }
          } catch {
            setError('Payment verification failed. Please contact support.')
          } finally {
            setDonating(false)
          }
        },
      })

      rzp.open()
    } catch {
      setError('Payment failed. Please try again.')
      setDonating(false)
    }
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <section className="max-w-[680px] mx-auto w-full px-[24px]">
        <div className="bg-surface border border-border rounded-[4px] p-[24px]">
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
                {formatCurrency(funding.total_raised)} raised
              </span>
              <span className="font-[var(--font-mono)] text-[13px] leading-[20px] text-text-secondary">
                of {formatCurrency(funding.funding_goal)}
              </span>
            </div>
            <div className="h-[4px] bg-border rounded-[2px] overflow-hidden">
              <div
                className="h-full bg-pop rounded-[2px] transition-all duration-[400ms] ease-out"
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

          {/* Stretch Goals */}
          {funding.stretch_goals && funding.stretch_goals.length > 0 && (
            <div className="mb-[16px]">
              <h3 className="font-[var(--font-heading)] text-[16px] font-semibold leading-[24px] text-text-primary mb-[8px]">
                Stretch Goals
              </h3>
              <div className="flex flex-col gap-[8px]">
                {funding.stretch_goals.map((goal, i) => {
                  const reached = funding.total_raised >= goal.amount
                  return (
                    <div
                      key={i}
                      className={`flex items-start gap-[8px] py-[8px] px-[12px] rounded-[4px] bg-surface border-l-2 ${reached ? 'border-success' : 'border-transparent'}`}
                    >
                      <span className="font-[var(--font-mono)] text-[13px] text-text-secondary whitespace-nowrap">
                        {formatCurrency(goal.amount)}
                      </span>
                      <span className={`font-[var(--font-body)] text-[14px] leading-[20px] ${reached ? 'text-success' : 'text-text-primary'}`}>
                        {goal.description}
                        {reached && ' ✓'}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Rewards */}
          {funding.rewards && funding.rewards.length > 0 && (
            <div className="mb-[16px]">
              <h3 className="font-[var(--font-heading)] text-[16px] font-semibold leading-[24px] text-text-primary mb-[8px]">
                Rewards
              </h3>
              <div className="flex flex-col gap-[8px]">
                {funding.rewards.map((reward, i) => (
                  <div key={i} className="py-[8px] px-[12px] bg-surface rounded-[4px]">
                    <div className="flex items-baseline justify-between mb-[4px]">
                      <span className="font-[var(--font-heading)] text-[14px] font-semibold text-text-primary">
                        {reward.title}
                      </span>
                      <span className="font-[var(--font-mono)] text-[13px] text-text-secondary">
                        {formatCurrency(reward.amount)}+
                      </span>
                    </div>
                    <p className="font-[var(--font-body)] text-[13px] leading-[18px] text-text-secondary">
                      {reward.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trust signals */}
          <div className="flex flex-wrap items-center gap-x-[16px] gap-y-[8px] mb-[16px] py-[12px] border-t border-border">
            <span className="flex items-center gap-[6px] font-[var(--font-mono)] text-[11px] leading-[16px] text-text-disabled">
              <svg width="10" height="12" viewBox="0 0 10 12" fill="none" aria-hidden="true">
                <path d="M5 0L0 2.18V5.5C0 8.57 2.13 11.44 5 12C7.87 11.44 10 8.57 10 5.5V2.18L5 0Z" fill="currentColor" opacity="0.5"/>
              </svg>
              Secured by Razorpay
            </span>
            <span className="text-border hidden sm:inline">·</span>
            <span className="font-[var(--font-mono)] text-[11px] leading-[16px] text-text-disabled">
              256-bit encryption
            </span>
            <span className="text-border hidden sm:inline">·</span>
            <span className="font-[var(--font-mono)] text-[11px] leading-[16px] text-text-disabled">
              PCI-DSS Level 1
            </span>
            <span className="text-border hidden sm:inline">·</span>
            <span className="font-[var(--font-mono)] text-[11px] leading-[16px] text-text-disabled">
              Your card details are never stored by PitchCraft
            </span>
          </div>

          {success && (
            <div className="mb-[16px] p-[12px] bg-surface border border-success/20 rounded-[4px]">
              <p className="font-[var(--font-body)] text-[14px] leading-[20px] text-success">
                Thank you for your support. A confirmation email is on its way.
              </p>
            </div>
          )}

          {!isExpired && !showForm && !success && (
            <Button variant="primary" type="button" onClick={() => setShowForm(true)}>
              Support this project
            </Button>
          )}

          {showForm && (
            <div className="flex flex-col gap-[12px] mt-[16px]">
              <TextInput
                label="Amount (USD)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="25"
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

              {/* Commission transparency */}
              {breakdown ? (
                <p className="font-[var(--font-mono)] text-[11px] leading-[16px] text-text-disabled">
                  You donate {formatCurrency(Math.round(parseFloat(amount) * 100))} → creator receives {formatCurrency(breakdown.creatorAmount)} ({breakdown.commissionPct}% platform fee)
                </p>
              ) : amount && parseFloat(amount) >= 1 && (
                <p className="font-[var(--font-mono)] text-[11px] leading-[16px] text-text-disabled">
                  Estimated: creator receives ~${(parseFloat(amount) * 0.92).toFixed(2)} (8% max platform fee)
                </p>
              )}

              <div className="flex gap-[12px]">
                <Button
                  variant="primary"
                  type="button"
                  onClick={handleDonate}
                  disabled={donating}
                >
                  {donating ? 'Opening payment...' : 'Continue to payment'}
                </Button>
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => { setShowForm(false); setError('') }}
                >
                  Cancel
                </Button>
              </div>

              <p className="font-[var(--font-mono)] text-[11px] leading-[16px] text-text-disabled">
                You will be taken to Razorpay&apos;s secure checkout. PitchCraft does not see your card details.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
