'use client'

import { type PitchStatus } from '@/lib/types/pitch'

interface StatusRadioProps {
  value: PitchStatus
  onChange: (value: PitchStatus) => void
  error?: string
}

const statusOptions: { value: PitchStatus; label: string; dotColor: string; description: string }[] = [
  {
    value: 'development',
    label: 'DEVELOPMENT',
    dotColor: 'bg-[#D32F2F]',
    description: 'Seeking funding, crew, or in early stages',
  },
  {
    value: 'production',
    label: 'PRODUCTION',
    dotColor: 'bg-[#E8A817]',
    description: 'Pre-production, shooting, or post-production',
  },
  {
    value: 'completed',
    label: 'COMPLETED',
    dotColor: 'bg-[#388E3C]',
    description: 'Finished and ready for distribution',
  },
]

export function StatusRadio({ value, onChange, error }: StatusRadioProps) {
  return (
    <div className="flex flex-col gap-[8px]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[12px]">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`
              flex flex-col gap-[8px]
              px-[16px] py-[16px]
              border rounded-[4px]
              transition-all duration-[300ms] ease-out
              text-left
              ${
                value === option.value
                  ? 'bg-surface border-pop shadow-[0_0_0_1px_rgba(255,92,54,0.2)]'
                  : 'bg-white border-border hover:bg-surface'
              }
            `}
          >
            <div className="flex items-center gap-[8px]">
              <span
                className={`
                  w-[8px] h-[8px] rounded-full ${option.dotColor}
                  transition-transform duration-[300ms]
                  ${value === option.value ? 'scale-100' : 'scale-0'}
                `}
                style={{
                  transitionTimingFunction: value === option.value ? 'cubic-bezier(0.34, 1.56, 0.64, 1)' : 'ease-out'
                }}
                aria-hidden="true"
              />
              <span className="font-[var(--font-mono)] text-[12px] leading-[20px] font-medium tracking-[0.08em] text-text-primary">
                {option.label}
              </span>
            </div>
            <span className="text-[12px] leading-[16px] text-text-secondary">
              {option.description}
            </span>
          </button>
        ))}
      </div>
      {error && (
        <p className="text-[14px] leading-[20px] text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
