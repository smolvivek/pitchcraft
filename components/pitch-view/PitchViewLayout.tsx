import type { ReactNode } from 'react'

interface PitchViewLayoutProps {
  children: ReactNode
}

export function PitchViewLayout({ children }: PitchViewLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col gap-[48px] pb-[48px]">
        {children}
      </div>
    </div>
  )
}
