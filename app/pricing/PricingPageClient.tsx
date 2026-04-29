'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { CheckoutButton } from '@/components/ui/CheckoutButton'

const CHECK = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-[2px]" aria-hidden="true">
    <path d="M3 8.5L6.5 12L13 4" stroke="#66BB6A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const CROSS = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-[2px]" aria-hidden="true">
    <path d="M4 4L12 12M12 4L4 12" stroke="#555555" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

interface TierData {
  name: string
  usd: { monthly: string; annual: string; annualMonthly: string }
  inr: { monthly: string; annual: string; annualMonthly: string }
  description: string
  cta: string
  ctaHref?: string
  checkoutTier?: 'pro' | 'studio'
  highlight?: boolean
  features: { label: string; included: boolean }[]
}

interface TierCardProps extends TierData {
  billingPeriod: 'monthly' | 'annual'
  currency: 'usd' | 'inr'
}

function TierCard({ name, usd, inr, description, cta, ctaHref, checkoutTier, highlight, features, billingPeriod, currency }: TierCardProps) {
  const prices = currency === 'inr' ? inr : usd
  const symbol = currency === 'inr' ? '₹' : '$'
  const displayPrice = billingPeriod === 'annual' ? prices.annualMonthly : prices.monthly
  const isFree = prices.monthly === '0'

  const billedNote = billingPeriod === 'annual' && !isFree
    ? `${symbol}${prices.annual}/yr — vs ${symbol}${prices.monthly}/mo monthly`
    : null

  return (
    <div className={`flex flex-col rounded-none border p-[24px] md:p-[32px] ${highlight ? 'border-pop bg-surface' : 'border-border bg-surface/50'}`}>
      <h3 className="font-heading text-[24px] font-bold leading-[32px] tracking-[-0.02em] text-text-primary">
        {name}
      </h3>
      <div className="mt-[8px] flex items-baseline gap-[4px]">
        <span className="font-heading text-[40px] font-bold leading-[1] tracking-[-0.03em] text-text-primary">
          {isFree ? `${symbol}0` : `${symbol}${displayPrice}`}
        </span>
        {!isFree && (
          <span className="font-mono text-[13px] text-text-secondary">/mo</span>
        )}
        {isFree && (
          <span className="font-mono text-[13px] text-text-secondary">forever</span>
        )}
      </div>
      {billedNote && (
        <p className="font-mono text-[12px] leading-[16px] text-pop mt-[4px]">
          {billedNote} — save 25%
        </p>
      )}
      <p className="font-[var(--font-body)] text-[14px] leading-[22px] text-text-secondary mt-[16px]">
        {description}
      </p>
      <div className="mt-[24px]">
        {checkoutTier ? (
          <CheckoutButton tier={checkoutTier} billingPeriod={billingPeriod} currency={currency} variant={highlight ? 'primary' : 'secondary'} className="w-full">
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
    a: "Yes. Payment processors charge their own fees (typically 2–3% per transaction) on top of Pitchcraft's commission. That goes to the processor, not us.",
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
    a: 'You keep full access until the end of your billing period. After that, your account moves to Free — your pitches stay, you just lose access to Pro and Studio features.',
  },
]

const TIERS: TierData[] = [
  {
    name: 'Free',
    usd: { monthly: '0', annual: '0', annualMonthly: '0' },
    inr: { monthly: '0', annual: '0', annualMonthly: '0' },
    description: 'One complete pitch. All sections. Share it publicly.',
    cta: 'Start free',
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
      { label: 'Version history', included: false },
      { label: 'View notifications', included: false },
      { label: 'Collaborators', included: false },
      { label: 'PDF export', included: false },
    ],
  },
  {
    name: 'Pro',
    usd: { monthly: '12', annual: '108', annualMonthly: '9' },
    inr: { monthly: '499', annual: '4,488', annualMonthly: '374' },
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
      { label: 'Unlimited version history', included: true },
      { label: 'View notifications', included: true },
      { label: '5 collaborators per pitch', included: true },
      { label: 'PDF export', included: true },
    ],
  },
  {
    name: 'Studio',
    usd: { monthly: '29', annual: '264', annualMonthly: '22' },
    inr: { monthly: '1,199', annual: '10,788', annualMonthly: '899' },
    description: 'For production companies and multi-project teams. Unlimited AI. Lower commission.',
    cta: 'Get Studio',
    ctaHref: '/signup',
    checkoutTier: 'studio',
    features: [
      { label: 'Everything in Pro', included: true },
      { label: 'Unlimited AI text assists', included: true },
      { label: '15 AI image generations / day', included: true },
      { label: 'Funding (3% commission)', included: true },
      { label: 'Unlimited collaborators per pitch', included: true },
      { label: 'Branded PDF export (custom logo, colors)', included: true },
      { label: 'Priority support', included: true },
      { label: 'Early access to new features', included: true },
    ],
  },
]

interface PricingPageClientProps {
  defaultCurrency: 'usd' | 'inr'
}

export function PricingPageClient({ defaultCurrency }: PricingPageClientProps) {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly')
  const [currency, setCurrency] = useState<'usd' | 'inr'>(defaultCurrency)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Minimal wordmark nav */}
      <header className="px-[24px] md:px-[48px] py-[20px] border-b border-border flex items-center justify-between">
        <Link href="/" className="font-heading font-bold text-[18px] tracking-tight text-text-primary hover:text-pop transition-colors duration-[200ms]">
          Pitchcraft
        </Link>
        <Link href="/dashboard" className="font-mono text-[12px] text-text-secondary hover:text-text-primary transition-colors duration-[200ms]">
          Dashboard →
        </Link>
      </header>

      <main className="flex-1 px-[24px] md:px-[48px] py-[80px] md:py-[120px]">
        <div className="max-w-[1200px] mx-auto">
          {/* Header */}
          <div className="text-center mb-[48px]">
            <h1 className="font-heading text-[36px] md:text-[48px] font-light leading-[1.1] tracking-[-0.03em] text-text-primary mb-[16px]">
              What it costs
            </h1>
            <p className="font-[var(--font-body)] text-[18px] leading-[28px] text-text-secondary max-w-[480px] mx-auto mb-[32px]">
              One pitch, free forever. Go Pro for unlimited projects, privacy controls, and AI.
            </p>

            {/* Billing toggle */}
            <div className="inline-flex items-center gap-[0px] bg-surface border border-border rounded-none p-[3px] mb-[12px]">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-[16px] py-[6px] rounded-none font-mono text-[12px] leading-[20px] transition-colors duration-[150ms] ${
                  billingPeriod === 'monthly'
                    ? 'bg-surface-hover text-text-primary'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('annual')}
                className={`px-[16px] py-[6px] rounded-none font-mono text-[12px] leading-[20px] transition-colors duration-[150ms] flex items-center gap-[8px] ${
                  billingPeriod === 'annual'
                    ? 'bg-surface-hover text-text-primary'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Annual
                <span className="font-mono text-[10px] px-[5px] py-[1px] rounded-none bg-pop/15 text-pop">
                  Save 25%
                </span>
              </button>
            </div>

            {/* Currency toggle */}
            <div className="flex items-center justify-center gap-[8px]">
              <button
                onClick={() => setCurrency(currency === 'inr' ? 'usd' : 'inr')}
                className="font-mono text-[11px] text-text-disabled hover:text-text-secondary transition-colors duration-[150ms]"
              >
                {currency === 'inr' ? 'Switch to USD ($)' : 'Switch to INR (₹)'}
              </button>
            </div>
          </div>

          {/* Tier cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px] mb-[80px]">
            {TIERS.map((tier) => (
              <TierCard key={tier.name} {...tier} billingPeriod={billingPeriod} currency={currency} />
            ))}
          </div>

          {/* Funding commission */}
          <div className="max-w-[680px] mx-auto mb-[80px]">
            <h2 className="font-heading text-[24px] font-light leading-[32px] tracking-[-0.02em] text-text-primary mb-[24px] text-center">
              Funding commission
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-[16px]">
              {[
                { tier: 'Free', rate: '8%' },
                { tier: 'Pro', rate: '5%' },
                { tier: 'Studio', rate: '3%' },
              ].map((item) => (
                <div key={item.tier} className="bg-surface border border-border rounded-none p-[20px] text-center">
                  <p className="font-mono text-[11px] leading-[16px] tracking-[0.05em] uppercase text-text-secondary mb-[4px]">
                    {item.tier}
                  </p>
                  <p className="font-heading text-[28px] font-bold leading-[1] text-text-primary">
                    {item.rate}
                  </p>
                </div>
              ))}
            </div>
            <p className="font-mono text-[11px] leading-[16px] text-text-disabled text-center mt-[12px]">
              Payment processor fees are always separate from Pitchcraft&apos;s commission
            </p>
          </div>

          {/* FAQ */}
          <div className="max-w-[680px] mx-auto">
            <h2 className="font-heading text-[24px] font-light leading-[32px] tracking-[-0.02em] text-text-primary mb-[32px] text-center">
              Common questions
            </h2>
            <div className="flex flex-col gap-[24px]">
              {faqs.map((faq) => (
                <div key={faq.q}>
                  <h3 className="font-heading text-[16px] font-bold leading-[24px] text-text-primary mb-[4px]">
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

        <style>{`
          @media print {
            body { background: white !important; color: black !important; }
            nav, header, footer, .no-print { display: none !important; }
          }
        `}</style>
      </main>

      {/* Footer */}
      <footer className="px-[24px] md:px-[48px] py-[24px] border-t border-border flex items-center justify-between">
        <Link href="/" className="font-mono text-[11px] text-text-disabled hover:text-text-secondary transition-colors duration-[200ms]">
          ← Back to Pitchcraft
        </Link>
        <span className="font-mono text-[11px] text-text-disabled">
          © {new Date().getFullYear()} Pitchcraft
        </span>
      </footer>
    </div>
  )
}
