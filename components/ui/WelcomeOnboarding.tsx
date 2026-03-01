'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'

const STEPS = [
  {
    number: '01',
    title: 'Build your pitch',
    body: 'Eight essential fields give your project structure — logline, synopsis, vision, cast, budget, and more. Add images, embed video, upload documents.',
  },
  {
    number: '02',
    title: 'Share one link',
    body: 'Your entire project lives at a single URL. Send it to a producer, a client, a collaborator. Public, private, or password-protected.',
  },
  {
    number: '03',
    title: 'Version as you go',
    body: 'Cast changes. Budget shifts. Your project evolves — and every version persists. See what changed and why.',
  },
]

export function WelcomeOnboarding() {
  const [visible, setVisible] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    const dismissed = localStorage.getItem('pitchcraft-onboarding-done')
    if (!dismissed) {
      setVisible(true)
    }
  }, [])

  const dismiss = () => {
    setVisible(false)
    localStorage.setItem('pitchcraft-onboarding-done', '1')
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-[24px]">
      <div className="bg-surface border border-border rounded-[4px] p-[32px] md:p-[48px] max-w-[520px] w-full">
        <p className="font-[var(--font-mono)] text-[11px] leading-[16px] tracking-[0.08em] uppercase text-text-disabled mb-[24px]">
          Welcome to Pitchcraft
        </p>

        <div className="min-h-[140px]">
          <span className="font-[var(--font-mono)] text-[48px] leading-[1] font-medium text-border/40 block mb-[12px]">
            {STEPS[step].number}
          </span>
          <h2 className="font-[var(--font-heading)] text-[24px] font-semibold leading-[32px] tracking-[-0.02em] text-text-primary mb-[8px]">
            {STEPS[step].title}
          </h2>
          <p className="font-[var(--font-body)] text-[15px] leading-[24px] text-text-secondary">
            {STEPS[step].body}
          </p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-[8px] mt-[32px] mb-[24px]">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className="h-[2px] flex-1 rounded-full transition-colors duration-300"
              style={{ backgroundColor: i <= step ? '#E8503A' : '#262626' }}
            />
          ))}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={dismiss}
            className="font-[var(--font-mono)] text-[12px] text-text-disabled hover:text-text-secondary transition-colors"
          >
            Skip
          </button>
          {step < STEPS.length - 1 ? (
            <Button variant="secondary" onClick={() => setStep(step + 1)}>
              Next
            </Button>
          ) : (
            <Button variant="primary" onClick={dismiss}>
              Create your first project
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
