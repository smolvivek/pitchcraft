import Image from 'next/image'

interface PitchViewHeroProps {
  projectName: string
  logline: string
  posterUrl?: string | null
}

export function PitchViewHero({ projectName, logline, posterUrl }: PitchViewHeroProps) {
  return (
    <section className="flex flex-col gap-[24px]">
      {posterUrl && (
        <div className="max-w-[960px] mx-auto w-full">
          <div className="relative w-full aspect-[16/9] rounded-[4px] overflow-hidden bg-surface">
            <Image
              src={posterUrl}
              alt={`${projectName} poster`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 960px"
              priority
            />
          </div>
        </div>
      )}
      <div className="max-w-[680px] mx-auto w-full px-[24px]">
        <h1 className="font-[var(--font-heading)] text-[36px] font-semibold leading-[44px] tracking-[-0.02em] text-text-primary">
          {projectName}
        </h1>
        <p className="mt-[16px] font-[var(--font-body)] text-[18px] leading-[28px] text-text-secondary">
          {logline}
        </p>
      </div>
    </section>
  )
}
