'use client'

import { useState, useEffect } from 'react'
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

  // Check for success redirect from Stripe
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('funded') === 'true') {
      setSuccess(true)
    }
  }, [])

  if (loading || !funding) return null

  const percentage = Math.min(
    100,
    Math.round((funding.total_raised / funding.funding_goal) * 100)
  )

  const isExpired = funding.end_date
    ? new Date(funding.end_date) < new Date()
    : false

  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
  }

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

    setDonating(true)
    setError('')

    try {
      const res = await fetch(`/api/funding/${funding.id}/donate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountInCents,
          name,
          email,
          message: message || null,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to create payment')
        return
      }

      const { url } = await res.json()
      if (url) {
        window.location.href = url
      } else {
        setError('Failed to create checkout session')
      }
    } catch {
      setError('Payment failed')
    } finally {
      setDonating(false)
    }
  }

  return (
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
                    className={`flex items-start gap-[8px] py-[8px] px-[12px] rounded-[4px] ${
                      reached ? 'bg-success/10' : 'bg-surface'
                    }`}
                  >
                    <span className="font-[var(--font-mono)] text-[13px] text-text-secondary whitespace-nowrap">
                      {formatCurrency(goal.amount)}
                    </span>
                    <span className={`font-[var(--font-body)] text-[14px] leading-[20px] ${
                      reached ? 'text-success' : 'text-text-primary'
                    }`}>
                      {goal.description}
                      {reached && ' \u2713'}
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
                <div
                  key={i}
                  className="py-[8px] px-[12px] bg-surface rounded-[4px]"
                >
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
            <div className="flex gap-[12px]">
              <Button
                variant="primary"
                type="button"
                onClick={handleDonate}
                disabled={donating}
              >
                {donating ? 'Redirecting...' : 'Continue to payment'}
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
  )
}
