'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/Button'

const STEPS = [
  {
    number: '01',
    title: 'Build your pitch',
    body: 'Give your project structure — logline, synopsis, vision, cast, budget, and more. Add images, embed video, upload documents.',
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

export function WelcomeOnboarding({ userId }: { userId?: string }) {
  const [visible, setVisible] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const key = userId ? `pitchcraft-onboarding-done-${userId}` : 'pitchcraft-onboarding-done'
    const dismissed = localStorage.getItem(key)
    if (!dismissed) {
      setVisible(true)
    }
  }, [userId])

  // Auto-focus the dismiss button when modal opens
  useEffect(() => {
    if (visible) {
      buttonRef.current?.focus()
    }
  }, [visible])

  // Escape key + focus trap
  useEffect(() => {
    if (!visible) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dismiss()
        return
      }

      if (e.key !== 'Tab') return

      const dialog = dialogRef.current
      if (!dialog) return

      const focusable = dialog.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [visible])

  const dismiss = () => {
    setVisible(false)
    const key = userId ? `pitchcraft-onboarding-done-${userId}` : 'pitchcraft-onboarding-done'
    localStorage.setItem(key, '1')
  }

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm px-[24px]"
      role="presentation"
      onClick={(e) => { if (e.target === e.currentTarget) dismiss() }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
        className="max-w-[460px] w-full"
      >
        <p className="font-mono text-[10px] leading-[16px] tracking-[0.12em] uppercase text-text-disabled mb-[32px]">
          Pitchcraft
        </p>
        <h2 id="onboarding-title" className="font-heading text-[28px] font-bold leading-[36px] tracking-[-0.02em] text-text-primary mb-[32px]">
          Your work.<br />One link.
        </h2>
        <div className="flex flex-col gap-[20px] mb-[40px]">
          {STEPS.map((step) => (
            <div key={step.number} className="flex items-start gap-[16px]">
              <span className="font-mono text-[11px] text-text-disabled mt-[3px] w-[20px] shrink-0">
                {step.number}
              </span>
              <div>
                <p className="text-[15px] leading-[22px] text-text-primary font-medium mb-[2px]">{step.title}</p>
                <p className="text-[13px] leading-[20px] text-text-secondary">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
        <Button ref={buttonRef} variant="primary" onClick={dismiss}>Start building</Button>
      </div>
    </div>
  )
}
