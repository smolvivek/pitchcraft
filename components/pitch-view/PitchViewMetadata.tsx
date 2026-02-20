import type { PitchStatus, BudgetRange } from '@/lib/types/pitch'

interface PitchViewMetadataProps {
  genre: string
  status: PitchStatus
  budgetRange: BudgetRange
}

const STATUS_LABELS: Record<PitchStatus, string> = {
  development: 'Development',
  production: 'Production',
  completed: 'Completed',
}

const STATUS_COLORS: Record<PitchStatus, string> = {
  development: 'bg-status-looking',
  production: 'bg-status-progress',
  completed: 'bg-status-complete',
}

const BUDGET_LABELS: Record<BudgetRange, string> = {
  'under-5k': 'Under $5K',
  '5k-50k': '$5K\u2013$50K',
  '50k-250k': '$50K\u2013$250K',
  '250k-1m': '$250K\u2013$1M',
  '1m-plus': '$1M+',
}

export function PitchViewMetadata({ genre, status, budgetRange }: PitchViewMetadataProps) {
  return (
    <div className="max-w-[680px] mx-auto w-full px-[24px]">
      <div className="flex flex-wrap items-center gap-[16px] font-[var(--font-mono)] text-[13px] leading-[20px] text-text-secondary">
        <span>{genre}</span>
        <span className="text-border" aria-hidden="true">&middot;</span>
        <span className="inline-flex items-center gap-[6px]">
          <span className={`inline-block w-[8px] h-[8px] rounded-full ${STATUS_COLORS[status]}`} />
          {STATUS_LABELS[status]}
        </span>
        <span className="text-border" aria-hidden="true">&middot;</span>
        <span>{BUDGET_LABELS[budgetRange]}</span>
      </div>
    </div>
  )
}
