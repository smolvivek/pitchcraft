import type { ReactNode } from 'react'

interface PitchViewLayoutProps {
  children: ReactNode
}

export function PitchViewLayout({ children }: PitchViewLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  )
}
