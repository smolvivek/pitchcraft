'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { TextInput } from '@/components/ui/Input'
import { ImageUpload } from '@/components/ui/ImageUpload'
import type { FlowBeat } from '@/lib/types/pitch'

interface FlowBeatEditorProps {
  pitchId: string
  beats: FlowBeat[]
  onUpdate: (beats: FlowBeat[]) => void
}

function generateId() {
  return crypto.randomUUID()
}

function emptyBeat(order: number): FlowBeat {
  return {
    id: generateId(),
    caption: '',
    arcLabel: '',
    mediaIds: [],
    videoUrl: '',
    audioUrl: '',
    order,
  }
}

export function FlowBeatEditor({ pitchId, beats, onUpdate }: FlowBeatEditorProps) {
  const [expandedId, setExpandedId] = useState<string | null>(beats[0]?.id ?? null)

  const addBeat = () => {
    const next = [...beats, emptyBeat(beats.length)]
    onUpdate(next)
    setExpandedId(next[next.length - 1].id)
  }

  const removeBeat = (id: string) => {
    const next = beats
      .filter((b) => b.id !== id)
      .map((b, i) => ({ ...b, order: i }))
    onUpdate(next)
    if (expandedId === id) setExpandedId(next[0]?.id ?? null)
  }

  const updateBeat = (id: string, update: Partial<FlowBeat>) => {
    onUpdate(beats.map((b) => (b.id === id ? { ...b, ...update } : b)))
  }

  const moveBeat = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= beats.length) return
    const next = [...beats]
    const temp = next[index]
    next[index] = next[target]
    next[target] = temp
    onUpdate(next.map((b, i) => ({ ...b, order: i })))
  }

  return (
    <div className="flex flex-col gap-[16px]">
      <p className="text-[13px] leading-[18px] text-text-secondary">
        Build your Flow beat by beat. Each beat can have images, a caption, and an arc label.
      </p>

      {beats.map((beat, i) => {
        const isExpanded = expandedId === beat.id
        return (
          <div
            key={beat.id}
            className="border border-border rounded-[4px] bg-surface overflow-hidden"
          >
            {/* Beat header */}
            <button
              type="button"
              onClick={() => setExpandedId(isExpanded ? null : beat.id)}
              className="w-full flex items-center justify-between px-[16px] py-[12px] hover:bg-surface-hover/50 transition-colors"
            >
              <div className="flex items-center gap-[8px]">
                <span className="font-[var(--font-mono)] text-[11px] text-text-disabled w-[24px]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-[var(--font-body)] text-[14px] text-text-primary truncate max-w-[300px]">
                  {beat.caption || beat.arcLabel || 'Untitled beat'}
                </span>
              </div>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className={`text-text-secondary transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              >
                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Beat content */}
            {isExpanded && (
              <div className="px-[16px] pb-[16px] flex flex-col gap-[12px] border-t border-border pt-[12px]">
                <TextInput
                  label="Arc Label"
                  value={beat.arcLabel || ''}
                  onChange={(e) => updateBeat(beat.id, { arcLabel: e.target.value })}
                  placeholder="e.g., Rising tension, Turning point"
                />
                <TextInput
                  label="Caption"
                  value={beat.caption}
                  onChange={(e) => updateBeat(beat.id, { caption: e.target.value })}
                  placeholder="Brief description of this beat"
                />
                <ImageUpload
                  pitchId={pitchId}
                  sectionName={`flow_beat_${beat.id}`}
                  maxFiles={5}
                  existingMedia={[]}
                  onUploadComplete={(mediaIds) =>
                    updateBeat(beat.id, { mediaIds: [...beat.mediaIds, ...mediaIds] })
                  }
                  onDeleteComplete={(mediaId) =>
                    updateBeat(beat.id, { mediaIds: beat.mediaIds.filter((id) => id !== mediaId) })
                  }
                />
                <TextInput
                  label="Video Link (optional)"
                  value={beat.videoUrl || ''}
                  onChange={(e) => updateBeat(beat.id, { videoUrl: e.target.value })}
                  placeholder="https://youtube.com/..."
                />
                <TextInput
                  label="Audio URL (optional)"
                  value={beat.audioUrl || ''}
                  onChange={(e) => updateBeat(beat.id, { audioUrl: e.target.value })}
                  placeholder="https://..."
                />

                {/* Move / Remove controls */}
                <div className="flex items-center gap-[8px] pt-[8px]">
                  <Button
                    variant="tertiary"
                    type="button"
                    onClick={() => moveBeat(i, -1)}
                    disabled={i === 0}
                  >
                    Move up
                  </Button>
                  <Button
                    variant="tertiary"
                    type="button"
                    onClick={() => moveBeat(i, 1)}
                    disabled={i === beats.length - 1}
                  >
                    Move down
                  </Button>
                  <Button
                    variant="tertiary"
                    type="button"
                    onClick={() => removeBeat(beat.id)}
                    className="text-error hover:bg-error/10 ml-auto"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            )}
          </div>
        )
      })}

      <Button variant="secondary" type="button" onClick={addBeat}>
        Add beat
      </Button>
    </div>
  )
}
