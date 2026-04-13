'use client'

import { useState, useEffect } from 'react'

interface DayData {
  date: string
  views: number
}

interface AnalyticsData {
  totalViews: number
  uniqueVisitors: number
  viewsByDay: DayData[]
}

interface AnalyticsPanelProps {
  pitchId: string
  tier: 'free' | 'pro' | 'studio' | null
}

function MiniBar({ value, max }: { value: number; max: number }) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100)
  return (
    <div className="flex flex-col items-center gap-[4px] flex-1">
      <div className="w-full flex items-end h-[40px]">
        <div
          className="w-full bg-pop/60 min-h-[2px] transition-all duration-[300ms]"
          style={{ height: `${Math.max(pct, 2)}%` }}
        />
      </div>
    </div>
  )
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function AnalyticsPanel({ pitchId, tier }: AnalyticsPanelProps) {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetched, setFetched] = useState(false)
  const [fetchError, setFetchError] = useState(false)

  const isStudio = tier === 'studio'

  useEffect(() => {
    if (!isStudio || fetched) return
    setLoading(true)
    setFetchError(false)
    fetch(`/api/pitches/${pitchId}/analytics`)
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status}`)
        return r.json()
      })
      .then((d) => { if (d.totalViews !== undefined) { setData(d); setFetched(true) } })
      .catch(() => setFetchError(true))
      .finally(() => setLoading(false))
  }, [pitchId, isStudio, fetched])

  if (!isStudio) {
    return (
      <div className="flex items-start justify-between gap-[12px] p-[16px] bg-surface border border-border">
        <div>
          <p className="text-[14px] font-medium text-text-primary mb-[4px]">Analytics</p>
          <p className="text-[13px] leading-[20px] text-text-secondary">
            View counts, unique visitors, and 14-day trend.{' '}
            <a href="/pricing" className="text-pop underline underline-offset-2">Studio only</a>
          </p>
        </div>
        <span className="shrink-0 text-[10px] text-pop border border-pop/40 px-[5px] py-[1px] leading-none font-mono">STUDIO</span>
      </div>
    )
  }

  if (loading) {
    return <p className="font-mono text-[12px] text-text-disabled">Loading analytics…</p>
  }

  if (fetchError) {
    return <p className="font-mono text-[12px] text-error">Failed to load analytics.</p>
  }

  if (!data) return null

  const maxViews = Math.max(...data.viewsByDay.map((d) => d.views), 1)
  const showDates = [0, 6, 13] // first, middle, last label indices

  return (
    <div className="flex flex-col gap-[20px]">
      {/* Stats row */}
      <div className="flex gap-[24px]">
        <div className="flex flex-col gap-[4px]">
          <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-text-disabled">Total views</span>
          <span className="font-heading text-[28px] font-bold leading-[32px] text-text-primary">{data.totalViews.toLocaleString()}</span>
        </div>
        <div className="w-[1px] bg-border" />
        <div className="flex flex-col gap-[4px]">
          <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-text-disabled">Unique visitors</span>
          <span className="font-heading text-[28px] font-bold leading-[32px] text-text-primary">{data.uniqueVisitors.toLocaleString()}</span>
        </div>
      </div>

      {/* 14-day bar chart */}
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-text-disabled mb-[8px]">Last 14 days</p>
        <div className="flex items-end gap-[3px] h-[48px]">
          {data.viewsByDay.map((d) => (
            <MiniBar key={d.date} value={d.views} max={maxViews} />
          ))}
        </div>
        {/* Date labels */}
        <div className="flex justify-between mt-[6px]">
          {showDates.map((i) => (
            <span key={i} className="font-mono text-[9px] text-text-disabled">
              {formatDate(data.viewsByDay[i]?.date ?? '')}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
