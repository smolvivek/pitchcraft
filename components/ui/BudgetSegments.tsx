'use client'

import { type BudgetRange } from '@/lib/types/pitch'

interface BudgetSegmentsProps {
  value: BudgetRange | ''
  onChange: (value: BudgetRange) => void
  error?: string
}

const budgetOptions: { value: BudgetRange; label: string; sublabel: string }[] = [
  { value: 'under-5k', label: '<5K', sublabel: 'Micro-budget' },
  { value: '5k-50k', label: '5-50K', sublabel: 'Low-budget short' },
  { value: '50k-250k', label: '50-250K', sublabel: 'Low-budget feature' },
  { value: '250k-1m', label: '250K-1M', sublabel: 'Independent feature' },
  { value: '1m-plus', label: '1M+', sublabel: 'Studio/Commercial' },
]

export function BudgetSegments({ value, onChange, error }: BudgetSegmentsProps) {
  return (
    <div className="flex flex-col gap-[8px]">
      <div className="grid grid-cols-5 gap-[8px]">
        {budgetOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`
              flex flex-col items-center justify-center
              px-[12px] py-[16px]
              border rounded-[4px]
              transition-all duration-[150ms]
              relative overflow-hidden
              ${
                value === option.value
                  ? 'border-btn scale-[1.02]'
                  : 'bg-white border-border hover:bg-surface scale-100'
              }
            `}
            style={{
              transitionTimingFunction: value === option.value ? 'cubic-bezier(0.34, 1.56, 0.64, 1)' : 'ease-out'
            }}
          >
            {/* Terracotta background slide-in */}
            <div
              className={`
                absolute inset-0 bg-btn
                transition-transform duration-[150ms] ease-out
                ${value === option.value ? 'translate-x-0' : '-translate-x-full'}
              `}
            />

            <span
              className={`
                relative z-10
                font-[var(--font-mono)] text-[13px] leading-[20px] font-medium
                transition-colors duration-[150ms]
                ${value === option.value ? 'text-white' : 'text-text-primary'}
              `}
            >
              {option.label}
            </span>
            <span
              className={`
                relative z-10
                text-[11px] leading-[16px] mt-[4px]
                transition-colors duration-[150ms]
                ${value === option.value ? 'text-white/80' : 'text-text-secondary'}
              `}
            >
              {option.sublabel}
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
