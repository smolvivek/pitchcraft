'use client'

import { useState, type ReactNode } from 'react'
import { PitchViewPasswordGate } from './PitchViewPasswordGate'

interface PitchViewPasswordWrapperProps {
  pitchId: string
  children: ReactNode
}

export function PitchViewPasswordWrapper({ pitchId, children }: PitchViewPasswordWrapperProps) {
  const [verified, setVerified] = useState(false)

  if (!verified) {
    return <PitchViewPasswordGate pitchId={pitchId} onVerified={() => setVerified(true)} />
  }

  return <>{children}</>
}
