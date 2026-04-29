'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'

interface ExportPDFButtonProps {
  pitchId: string
  tier: 'free' | 'pro' | 'studio' | null
}

export function ExportPDFButton({ pitchId, tier }: ExportPDFButtonProps) {
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle')

  const isFree = tier === 'free' || tier === null

  if (isFree) {
    return (
      <a
        href="/pricing"
        className="inline-flex items-center gap-[6px] px-[16px] py-[8px] text-[12px] font-medium text-text-disabled border border-border hover:border-border-hover hover:text-text-secondary transition-colors duration-[200ms]"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M2 4h10M4 4V2.5C4 1.67 4.67 1 5.5 1h3C9.33 1 10 1.67 10 2.5V4M5.5 7v3M8.5 7v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        Export PDF
        <span className="text-[10px] text-pop border border-pop/40 px-[5px] py-[1px] leading-none">PRO</span>
      </a>
    )
  }

  async function handleExport() {
    setState('loading')
    try {
      const res = await fetch(`/api/pitches/${pitchId}/pdf`)
      if (!res.ok) {
        setState('error')
        setTimeout(() => setState('idle'), 3000)
        return
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = '' // filename comes from Content-Disposition
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setState('idle')
    } catch {
      setState('error')
      setTimeout(() => setState('idle'), 3000)
    }
  }

  return (
    <Button
      variant="secondary"
      onClick={handleExport}
      disabled={state === 'loading'}
      className="flex items-center gap-[6px] !px-[16px] !py-[8px] !text-[12px]"
    >
      {state === 'loading' ? (
        <>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="animate-spin" aria-hidden="true">
            <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2" strokeDasharray="28" strokeDashoffset="10" />
          </svg>
          Generating...
        </>
      ) : state === 'error' ? (
        'Export failed'
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 1v8M4 6l3 3 3-3M2 10v1.5C2 12.33 2.67 13 3.5 13h7c.83 0 1.5-.67 1.5-1.5V10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Export PDF
        </>
      )}
    </Button>
  )
}
