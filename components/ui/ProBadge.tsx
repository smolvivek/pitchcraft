import Link from 'next/link'

interface ProBadgeProps {
  feature: string
}

export function ProBadge({ feature }: ProBadgeProps) {
  return (
    <Link
      href="/pricing"
      className="inline-flex items-center gap-[6px] px-[8px] py-[4px] rounded-[4px] border border-border bg-surface/50 hover:border-border-hover transition-colors"
    >
      <span className="font-[var(--font-mono)] text-[10px] leading-[14px] tracking-[0.06em] uppercase text-pop font-medium">
        Pro
      </span>
      <span className="font-[var(--font-mono)] text-[10px] leading-[14px] tracking-[0.04em] text-text-disabled">
        {feature}
      </span>
    </Link>
  )
}
