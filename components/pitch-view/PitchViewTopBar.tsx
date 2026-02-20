interface PitchViewTopBarProps {
  version: number
}

export function PitchViewTopBar({ version }: PitchViewTopBarProps) {
  return (
    <header className="w-full border-b border-border py-[16px]">
      <div className="max-w-[960px] mx-auto px-[24px] flex items-center justify-between">
        <span className="font-[var(--font-heading)] text-[14px] font-semibold tracking-[-0.02em] text-text-primary">
          Pitchcraft
        </span>
        <span className="font-[var(--font-mono)] text-[13px] text-text-secondary">
          v{version}
        </span>
      </div>
    </header>
  )
}
