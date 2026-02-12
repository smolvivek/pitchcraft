'use client'

interface CharacterCounterProps {
  current: number
  max?: number
  type?: 'characters' | 'words'
}

export function CharacterCounter({ current, max, type = 'characters' }: CharacterCounterProps) {
  const percentage = max ? (current / max) * 100 : 0
  const isNearLimit = percentage > 80
  const isOverLimit = max ? current > max : false

  return (
    <div className="flex justify-end mt-[8px]">
      <span
        className={`
          font-[var(--font-mono)] text-[13px] leading-[20px]
          ${isOverLimit ? 'text-error' : isNearLimit ? 'text-accent-text' : 'text-text-secondary'}
        `}
      >
        {type === 'words' ? `WC ${current}` : max ? `${current}/${max}` : current}
      </span>
    </div>
  )
}
