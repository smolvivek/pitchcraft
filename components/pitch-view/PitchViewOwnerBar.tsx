import Link from 'next/link'

interface PitchViewOwnerBarProps {
  pitchId: string
  pitchName: string
  projectType?: string | null
}

const PROJECT_TYPE_LABELS: Record<string, string> = {
  fiction: 'Fiction',
  documentary: 'Documentary',
  ad_film: 'Ad Film',
  music_video: 'Music Video',
}

export function PitchViewOwnerBar({ pitchId, pitchName, projectType }: PitchViewOwnerBarProps) {
  const typeLabel = projectType ? PROJECT_TYPE_LABELS[projectType] : null

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-[40px] bg-background/95 backdrop-blur-sm border-b border-border flex items-center justify-between px-[24px]">
      <Link
        href="/dashboard"
        className="font-mono text-[11px] text-text-disabled hover:text-text-primary transition-colors flex items-center gap-[6px]"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M8 2L4 6L8 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Dashboard
      </Link>

      <div className="flex items-center gap-[8px]">
        <span className="font-mono text-[11px] text-text-secondary truncate max-w-[300px]">
          {pitchName}
        </span>
        {typeLabel && (
          <span className="font-mono text-[10px] text-text-disabled">
            — {typeLabel}
          </span>
        )}
      </div>

      <div className="flex items-center gap-[8px]">
        <Link
          href={`/dashboard/pitches/${pitchId}/edit`}
          className="font-mono text-[11px] text-text-disabled hover:text-text-primary transition-colors border border-border hover:border-text-secondary px-[10px] py-[4px]"
        >
          Edit
        </Link>
      </div>
    </div>
  )
}
