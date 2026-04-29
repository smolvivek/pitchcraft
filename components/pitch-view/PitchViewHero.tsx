import Image from 'next/image'

const STATUS_LABELS: Record<string, string> = {
  development: 'Development',
  production: 'Production',
  completed: 'Completed',
}

interface PitchViewHeroProps {
  projectName: string
  logline: string
  posterUrl?: string | null
  status?: string
  directorName?: string
}

export function PitchViewHero({ projectName, logline, posterUrl, status, directorName }: PitchViewHeroProps) {
  const statusLabel = status ? (STATUS_LABELS[status] ?? status) : null

  return (
    <section className="relative min-h-screen flex flex-col justify-end px-[48px] md:px-[96px] pb-[96px] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={`${projectName} poster`}
            fill
            className="object-cover grayscale opacity-50"
            sizes="100vw"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-[#0e0e0e]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1200px] space-y-[32px]">
        {/* Status indicator */}
        {statusLabel && (
          <div className="flex items-center gap-[16px]">
            <span className="w-[48px] h-[1px] bg-pop" />
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-pop font-bold">
              {statusLabel}
            </span>
          </div>
        )}

        {/* Title */}
        <h1 className="font-heading font-bold text-[clamp(48px,12vw,180px)] leading-[0.85] tracking-[-0.03em] uppercase text-text-primary">
          {projectName}
        </h1>

        {/* Director + logline grid */}
        {(directorName || logline) && (
          <div className="grid grid-cols-12 gap-[32px] pt-[48px] border-t border-white/10">
            {/* Left: director */}
            <div className="col-span-12 md:col-span-4 border-l border-pop/30 pl-[24px]">
              {directorName ? (
                <>
                  <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-text-disabled mb-[8px]">
                    Director
                  </p>
                  <p className="font-heading text-[22px] text-text-primary leading-[1.1]">
                    {directorName}
                  </p>
                </>
              ) : (
                <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-text-disabled mb-[8px]">
                  Logline
                </p>
              )}
            </div>

            {/* Right: logline */}
            {logline && (
              <div className="col-span-12 md:col-span-8">
                <p className="font-heading italic text-[22px] md:text-[28px] leading-[1.4] text-text-primary/80 max-w-[680px]">
                  {logline}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
