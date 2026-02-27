'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'

interface FlowBeatView {
  id: string
  caption: string
  arcLabel?: string
  imageUrls: string[]
  videoUrl?: string
  audioUrl?: string
}

interface PitchViewFlowProps {
  beats: FlowBeatView[]
  audioUrl?: string
}

export function PitchViewFlow({ beats, audioUrl }: PitchViewFlowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const scrollTo = useCallback((index: number) => {
    const container = scrollRef.current
    if (!container) return
    const child = container.children[index] as HTMLElement | undefined
    if (!child) return
    child.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
    setCurrentIndex(index)
  }, [])

  const handleScroll = useCallback(() => {
    const container = scrollRef.current
    if (!container) return
    const scrollLeft = container.scrollLeft
    const childWidth = container.children[0]?.clientWidth ?? 1
    const idx = Math.round(scrollLeft / childWidth)
    setCurrentIndex(idx)
  }, [])

  const canPrev = currentIndex > 0
  const canNext = currentIndex < beats.length - 1

  if (beats.length === 0) return null

  return (
    <section className="relative">
      <div className="max-w-[680px] mx-auto w-full px-[24px] mb-[16px]">
        <h2 className="font-[var(--font-heading)] text-[24px] font-semibold leading-[32px] tracking-[-0.02em] text-text-primary">
          Flow
        </h2>
      </div>

      <div className="relative">
        {/* Horizontal scroll container */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {beats.map((beat, i) => (
            <div
              key={beat.id}
              className="snap-start flex-shrink-0 w-full max-w-[960px] mx-auto relative"
            >
              {/* Image area */}
              {beat.imageUrls.length > 0 ? (
                <div className="relative aspect-[16/9] bg-[#1A1A1A]">
                  <Image
                    src={beat.imageUrls[0]}
                    alt={beat.caption || `Beat ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="960px"
                  />
                  {/* Gradient overlay for text readability */}
                  <div className="absolute inset-x-0 bottom-0 h-[120px] bg-gradient-to-t from-black/60 to-transparent" />

                  {/* Arc label */}
                  {beat.arcLabel && (
                    <div className="absolute top-[16px] left-[24px]">
                      <span className="font-[var(--font-mono)] text-[11px] leading-[16px] uppercase tracking-[0.08em] text-white/80 bg-black/30 px-[8px] py-[4px] rounded-[2px]">
                        {beat.arcLabel}
                      </span>
                    </div>
                  )}

                  {/* Caption */}
                  {beat.caption && (
                    <div className="absolute bottom-[24px] left-[24px] right-[24px]">
                      <p className="font-[var(--font-body)] text-[16px] leading-[24px] text-white">
                        {beat.caption}
                      </p>
                    </div>
                  )}

                  {/* Beat counter */}
                  <div className="absolute top-[16px] right-[24px]">
                    <span className="font-[var(--font-mono)] text-[11px] text-white/60">
                      {i + 1}/{beats.length}
                    </span>
                  </div>
                </div>
              ) : (
                /* Text-only beat (no image) */
                <div className="aspect-[16/9] bg-[#1A1A1A] flex flex-col items-center justify-center px-[48px]">
                  {beat.arcLabel && (
                    <span className="font-[var(--font-mono)] text-[11px] leading-[16px] uppercase tracking-[0.08em] text-white/60 mb-[16px]">
                      {beat.arcLabel}
                    </span>
                  )}
                  {beat.caption && (
                    <p className="font-[var(--font-body)] text-[18px] leading-[28px] text-white text-center">
                      {beat.caption}
                    </p>
                  )}
                  <span className="font-[var(--font-mono)] text-[11px] text-white/40 absolute top-[16px] right-[24px]">
                    {i + 1}/{beats.length}
                  </span>
                </div>
              )}

              {/* Per-beat audio */}
              {beat.audioUrl && (
                <div className="bg-[#1A1A1A] px-[24px] py-[8px]">
                  <audio controls src={beat.audioUrl} className="w-full h-[28px] opacity-80">
                    <track kind="captions" />
                  </audio>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        {beats.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => scrollTo(currentIndex - 1)}
              disabled={!canPrev}
              aria-label="Previous beat"
              className="absolute left-[8px] top-1/2 -translate-y-1/2 w-[40px] h-[40px] rounded-full bg-black/40 text-white flex items-center justify-center disabled:opacity-20 hover:bg-black/60 transition-opacity"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 5L7 10L12 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button
              type="button"
              onClick={() => scrollTo(currentIndex + 1)}
              disabled={!canNext}
              aria-label="Next beat"
              className="absolute right-[8px] top-1/2 -translate-y-1/2 w-[40px] h-[40px] rounded-full bg-black/40 text-white flex items-center justify-center disabled:opacity-20 hover:bg-black/60 transition-opacity"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M8 5L13 10L8 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </>
        )}

        {/* Dot indicators */}
        {beats.length > 1 && (
          <div className="flex justify-center gap-[6px] mt-[16px]">
            {beats.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollTo(i)}
                aria-label={`Go to beat ${i + 1}`}
                className={`w-[6px] h-[6px] rounded-full transition-colors ${
                  i === currentIndex ? 'bg-text-primary' : 'bg-text-disabled'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Section-level audio */}
      {audioUrl && (
        <div className="max-w-[680px] mx-auto w-full px-[24px] mt-[16px]">
          <audio ref={audioRef} controls src={audioUrl} className="w-full h-[32px]">
            <track kind="captions" />
          </audio>
        </div>
      )}
    </section>
  )
}
