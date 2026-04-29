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
    <section className="px-[48px] md:px-[96px] py-[96px] border-b border-white/5">
      <div className="max-w-[1200px] mx-auto">

        {/* Header row */}
        <div className="grid grid-cols-12 gap-[48px] mb-[48px]">
          <div className="col-span-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-text-disabled sticky top-[96px]">
              Flow
            </p>
          </div>
          <div className="col-span-10">
            <h2 className="font-heading text-[48px] md:text-[56px] font-light leading-[1.1] tracking-[-0.02em] text-text-primary">
              Flow
            </h2>
          </div>
        </div>

        {/* Beat carousel */}
        <div className="grid grid-cols-12 gap-[48px]">
          <div className="col-span-2" />
          <div className="col-span-10">
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
                    className="snap-start flex-shrink-0 w-full relative"
                  >
                    {beat.imageUrls.length > 0 ? (
                      <div className="relative aspect-[16/9] bg-surface">
                        <Image
                          src={beat.imageUrls[0]}
                          alt={beat.caption || `Beat ${i + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1200px) 75vw, 900px"
                        />
                        <div className="absolute inset-x-0 bottom-0 h-[120px] bg-gradient-to-t from-black/60 to-transparent" />

                        {beat.arcLabel && (
                          <div className="absolute top-[16px] left-[24px]">
                            <span className="font-mono text-[11px] leading-[16px] uppercase tracking-[0.08em] text-text-primary/80 bg-black/30 px-[8px] py-[4px]">
                              {beat.arcLabel}
                            </span>
                          </div>
                        )}

                        {beat.caption && (
                          <div className="absolute bottom-[24px] left-[24px] right-[24px]">
                            <p className="text-[16px] leading-[24px] text-text-primary">
                              {beat.caption}
                            </p>
                          </div>
                        )}

                        <div className="absolute top-[16px] right-[24px]">
                          <span className="font-mono text-[11px] text-text-primary/60">
                            {i + 1}/{beats.length}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-[16/9] bg-surface flex flex-col items-center justify-center px-[48px] relative">
                        {beat.arcLabel && (
                          <span className="font-mono text-[11px] leading-[16px] uppercase tracking-[0.08em] text-text-primary/60 mb-[16px]">
                            {beat.arcLabel}
                          </span>
                        )}
                        {beat.caption && (
                          <p className="text-[18px] leading-[28px] text-text-primary text-center">
                            {beat.caption}
                          </p>
                        )}
                        <span className="font-mono text-[11px] text-text-primary/40 absolute top-[16px] right-[24px]">
                          {i + 1}/{beats.length}
                        </span>
                      </div>
                    )}

                    {beat.audioUrl && (
                      <div className="bg-surface px-[24px] py-[8px]">
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
                    className="absolute left-[8px] top-1/2 -translate-y-1/2 w-[40px] h-[40px] bg-black/40 text-text-primary flex items-center justify-center disabled:opacity-20 hover:bg-black/60 transition-opacity"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 5L7 10L12 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollTo(currentIndex + 1)}
                    disabled={!canNext}
                    aria-label="Next beat"
                    className="absolute right-[8px] top-1/2 -translate-y-1/2 w-[40px] h-[40px] bg-black/40 text-text-primary flex items-center justify-center disabled:opacity-20 hover:bg-black/60 transition-opacity"
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
                      className={`w-[6px] h-[6px] transition-colors ${
                        i === currentIndex ? 'bg-text-primary' : 'bg-text-disabled'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Section-level audio */}
            {audioUrl && (
              <div className="mt-[24px]">
                <audio ref={audioRef} controls src={audioUrl} className="w-full h-[32px]">
                  <track kind="captions" />
                </audio>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  )
}
