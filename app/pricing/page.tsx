'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { CheckoutButton } from '@/components/ui/CheckoutButton'

const CHECK = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-[2px]">
    <path d="M3 8.5L6.5 12L13 4" stroke="#66BB6A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const CROSS = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-[2px]">
    <path d="M4 4L12 12M12 4L4 12" stroke="#555555" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

interface TierProps {
  name: string
  monthlyPrice: string
  annualPrice: string
  annualMonthly: string
  description: string
  cta: string
  ctaHref?: string
  checkoutTier?: 'pro' | 'studio'
  highlight?: boolean
  features: { label: string; included: boolean }[]
  billingPeriod: 'monthly' | 'annual'
}

function TierCard({ name, monthlyPrice, annualPrice, annualMonthly, description, cta, ctaHref, checkoutTier, highlight, features, billingPeriod }: TierProps) {
  const displayPrice = billingPeriod === 'annual' ? annualMonthly : monthlyPrice
  const billedNote = billingPeriod === 'annual' ? `$${annualPrice}/yr billed annually` : null

  return (
    <div className={`flex flex-col rounded-[4px] border p-[24px] md:p-[32px] ${highlight ? 'border-pop bg-surface' : 'border-border bg-surface/50'}`}>
      <h3 className="font-[var(--font-heading)] text-[24px] font-semibold leading-[32px] tracking-[-0.02em] text-text-primary">
        {name}
      </h3>
      <div className="mt-[8px] flex items-baseline gap-[4px]">
        <span className="font-[var(--font-heading)] text-[40px] font-semibold leading-[1] tracking-[-0.03em] text-text-primary">
          {displayPrice}
        </span>
        {displayPrice !== '$0' && (
          <span className="font-[var(--font-mono)] text-[13px] text-text-secondary">/mo</span>
        )}
        {displayPrice === '$0' && (
          <span className="font-[var(--font-mono)] text-[13px] text-text-secondary">forever</span>
        )}
      </div>
      {billedNote && (
        <p className="font-[var(--font-mono)] text-[12px] leading-[16px] text-pop mt-[4px]">
          {billedNote} — save 25%
        </p>
      )}
      <p className="font-[var(--font-body)] text-[14px] leading-[22px] text-text-secondary mt-[16px]">
        {description}
      </p>
      <div className="mt-[24px]">
        {checkoutTier ? (
          <CheckoutButton tier={checkoutTier} billingPeriod={billingPeriod} variant={highlight ? 'primary' : 'secondary'} className="w-full">
            {cta}
          </CheckoutButton>
        ) : (
          <Link href={ctaHref ?? '/signup'}>
            <Button variant={highlight ? 'primary' : 'secondary'} className="w-full">
              {cta}
            </Button>
          </Link>
        )}
      </div>
      <ul className="mt-[24px] flex flex-col gap-[10px]">
        {features.map((f) => (
          <li key={f.label} className="flex items-start gap-[8px]">
            {f.included ? CHECK : CROSS}
            <span className={`font-[var(--font-body)] text-[14px] leading-[20px] ${f.included ? 'text-text-primary' : 'text-text-disabled'}`}>
              {f.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

const faqs = [
  {
    q: 'Are there payment processor fees on funding?',
    a: 'Yes. Payment processors charge their own fees (typically 2–3% per transaction) on top of Pitchcraft\'s commission. That goes to the processor, not us.',
  },
  {
    q: 'Can I change plans anytime?',
    a: 'Yes. Upgrade or downgrade at any time. When you downgrade, you keep access until the end of your billing period.',
  },
  {
    q: 'Do you use my content to train AI?',
    a: 'No. Your pitches, images, documents, and all content belong to you. We never use creator content for AI training.',
  },
  {
    q: 'What happens if I cancel?',
    a: 'You keep full access until the end of your billing period. After that, your account reverts to Free — your pitches stay, but paid features are locked.',
  },
]

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly')

  const tiers: Omit<TierProps, 'billingPeriod'>[] = [
    {
      name: 'Free',
      monthlyPrice: '$0',
      annualPrice: '0',
      annualMonthly: '$0',
      description: 'One complete pitch. All sections. Share it publicly.',
      cta: 'Create your first project',
      ctaHref: '/signup',
      features: [
        { label: '1 active pitch', included: true },
        { label: 'Full pitch structure (logline to team)', included: true },
        { label: 'Image & PDF uploads', included: true },
        { label: 'Video embeds', included: true },
        { label: 'Public share link', included: true },
        { label: 'Funding (8% commission)', included: true },
        { label: 'AI text & image generation', included: false },
        { label: 'Private or password-protected links', included: false },
        { label: 'Custom pitch slug', included: false },
        { label: 'Version history', included: false },
        { label: 'View notifications', included: false },
        { label: 'Collaborators', included: false },
        { label: 'PDF export', included: false },
      ],
    },
    {
      name: 'Pro',
      monthlyPrice: '$12',
      annualPrice: '108',
      annualMonthly: '$9',
      description: 'Unlimited pitches. AI features. Privacy controls. Lower commission.',
      cta: 'Go Pro',
      ctaHref: '/signup',
      checkoutTier: 'pro',
      highlight: true,
      features: [
        { label: 'Unlimited pitches', included: true },
        { label: 'Custom sections (up to 3)', included: true },
        { label: 'Image & PDF uploads', included: true },
        { label: 'Video embeds', included: true },
        { label: 'Public, private, or password-protected links', included: true },
        { label: 'Funding (5% commission)', included: true },
        { label: '15 AI text assists / day', included: true },
        { label: '5 AI image generations / day', included: true },
        { label: 'Custom slug (pitchcraft.app/p/my-film)', included: true },
        { label: 'Unlimited version history', included: true },
        { label: 'View notifications', included: true },
        { label: '2 collaborators per pitch', included: true },
        { label: 'PDF export', included: true },
      ],
    },
    {
      name: 'Studio',
      monthlyPrice: '$29',
      annualPrice: '264',
      annualMonthly: '$22',
      description: 'For teams and serious productions. Unlimited AI. Detailed analytics.',
      cta: 'Get Studio',
      ctaHref: '/signup',
      checkoutTier: 'studio',
      features: [
        { label: 'Everything in Pro', included: true },
        { label: 'Unlimited AI text assists', included: true },
        { label: '15 AI image generations / day', included: true },
        { label: 'Funding (3% commission)', included: true },
        { label: '5 collaborators per pitch', included: true },
        { label: 'Detailed view analytics', included: true },
        { label: 'Branded PDF export (custom logo, colors)', included: true },
        { label: 'Priority support', included: true },
        { label: 'Early access to new features', included: true },
      ],
    },
  ]

  return (
    <main className="min-h-screen bg-background px-[24px] md:px-[48px] py-[80px] md:py-[120px]">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="text-center mb-[48px]">
          <h1 className="font-[var(--font-heading)] text-[36px] md:text-[48px] font-semibold leading-[1.1] tracking-[-0.03em] text-text-primary mb-[16px]">
            Simple, honest pricing
          </h1>
          <p className="font-[var(--font-body)] text-[18px] leading-[28px] text-text-secondary max-w-[480px] mx-auto mb-[32px]">
            Free forever for your first pitch. Pro when you need more.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-[0px] bg-surface border border-border rounded-[4px] p-[3px]">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-[16px] py-[6px] rounded-[2px] font-[var(--font-mono)] text-[12px] leading-[20px] transition-colors duration-[150ms] ${
                billingPeriod === 'monthly'
                  ? 'bg-background text-text-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={`px-[16px] py-[6px] rounded-[2px] font-[var(--font-mono)] text-[12px] leading-[20px] transition-colors duration-[150ms] flex items-center gap-[8px] ${
                billingPeriod === 'annual'
                  ? 'bg-background text-text-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Annual
              <span className="font-[var(--font-mono)] text-[10px] px-[5px] py-[1px] rounded-[2px] bg-pop/15 text-pop">
                Save 25%
              </span>
            </button>
          </div>
        </div>

        {/* Tier cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px] mb-[80px]">
          {tiers.map((tier) => (
            <TierCard key={tier.name} {...tier} billingPeriod={billingPeriod} />
          ))}
        </div>

        {/* Funding commission */}
        <div className="max-w-[680px] mx-auto mb-[80px]">
          <h2 className="font-[var(--font-heading)] text-[24px] font-semibold leading-[32px] tracking-[-0.02em] text-text-primary mb-[24px] text-center">
            Funding commission
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-[16px]">
            {[
              { tier: 'Free', rate: '8%' },
              { tier: 'Pro', rate: '5%' },
              { tier: 'Studio', rate: '3%' },
            ].map((item) => (
              <div key={item.tier} className="bg-surface border border-border rounded-[4px] p-[20px] text-center">
                <p className="font-[var(--font-mono)] text-[11px] leading-[16px] tracking-[0.05em] uppercase text-text-secondary mb-[4px]">
                  {item.tier}
                </p>
                <p className="font-[var(--font-heading)] text-[28px] font-semibold leading-[1] text-text-primary">
                  {item.rate}
                </p>
              </div>
            ))}
          </div>
          <p className="font-[var(--font-mono)] text-[11px] leading-[16px] text-text-disabled text-center mt-[12px]">
            Payment processor fees are always separate from Pitchcraft&apos;s commission
          </p>
        </div>

        {/* FAQ */}
        <div className="max-w-[680px] mx-auto">
          <h2 className="font-[var(--font-heading)] text-[24px] font-semibold leading-[32px] tracking-[-0.02em] text-text-primary mb-[32px] text-center">
            Questions
          </h2>
          <div className="flex flex-col gap-[24px]">
            {faqs.map((faq) => (
              <div key={faq.q}>
                <h3 className="font-[var(--font-heading)] text-[16px] font-semibold leading-[24px] text-text-primary mb-[4px]">
                  {faq.q}
                </h3>
                <p className="font-[var(--font-body)] text-[14px] leading-[22px] text-text-secondary">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Print stylesheet */}
      <style>{`
        @media print {
          body { background: white !important; color: black !important; }
          nav, header, footer, .no-print { display: none !important; }
        }
      `}</style>
    </main>
  )
}
