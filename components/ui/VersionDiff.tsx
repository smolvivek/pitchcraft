'use client'

import { useMemo } from 'react'
import { diffText, hasChanges, type DiffToken } from '@/lib/diff/text'

interface VersionSnapshot {
  logline?: string
  synopsis?: string
  vision?: string
  cast_and_characters?: string
  team?: string
}

interface VersionDiffProps {
  before: VersionSnapshot
  after: VersionSnapshot
}

const FIELD_LABELS: { key: keyof VersionSnapshot; label: string }[] = [
  { key: 'logline', label: 'Logline' },
  { key: 'synopsis', label: 'Synopsis' },
  { key: 'vision', label: "Director's Vision" },
  { key: 'cast_and_characters', label: 'Cast & Characters' },
  { key: 'team', label: 'Key Team' },
]

function DiffLine({ tokens }: { tokens: DiffToken[] }) {
  return (
    <p className="font-[var(--font-body)] text-[13px] leading-[1.7] text-text-secondary">
      {tokens.map((token, i) => {
        if (token.type === 'equal') return <span key={i}>{token.text}</span>
        if (token.type === 'add') return (
          <mark key={i} className="bg-success/20 text-success rounded-none px-[1px]">
            {token.text}
          </mark>
        )
        return (
          <del key={i} className="bg-error/15 text-error rounded-none px-[1px] no-underline line-through decoration-error/60">
            {token.text}
          </del>
        )
      })}
    </p>
  )
}

export function VersionDiff({ before, after }: VersionDiffProps) {
  const fields = useMemo(() => {
    return FIELD_LABELS.map(({ key, label }) => {
      const tokens = diffText(before[key] ?? '', after[key] ?? '')
      return { key, label, tokens, changed: hasChanges(tokens) }
    }).filter((f) => f.changed)
  }, [before, after])

  if (fields.length === 0) {
    return (
      <p className="font-mono text-[12px] text-text-disabled py-[8px]">No text changes in this version.</p>
    )
  }

  return (
    <div className="flex flex-col gap-[16px]">
      {fields.map(({ key, label, tokens }) => (
        <div key={key}>
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-text-disabled mb-[6px]">{label}</p>
          <DiffLine tokens={tokens} />
        </div>
      ))}
    </div>
  )
}
