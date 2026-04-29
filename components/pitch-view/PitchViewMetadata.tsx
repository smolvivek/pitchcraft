import type { BudgetRange } from '@/lib/types/pitch'

interface PitchViewMetadataProps {
  genre: string
  budgetRange: BudgetRange
}

const BUDGET_LABELS: Record<BudgetRange, string> = {
  'under-5k': 'Less than $5K',
  '5k-50k': '$5K–$50K',
  '50k-250k': '$50K–$250K',
  '250k-1m': '$250K–$1M',
  '1m-plus': '$1M+',
}

export function PitchViewMetadata({ genre, budgetRange }: PitchViewMetadataProps) {
  return (
    <div className="px-[48px] md:px-[96px] py-[32px] border-b border-white/5 bg-background">
      <div className="flex flex-wrap gap-x-[64px] gap-y-[16px]">
        {genre && (
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-text-disabled mb-[4px]">Genre</p>
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-text-primary">{genre}</p>
          </div>
        )}
        {budgetRange && (
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-text-disabled mb-[4px]">Budget</p>
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-text-primary">
              {BUDGET_LABELS[budgetRange]}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
