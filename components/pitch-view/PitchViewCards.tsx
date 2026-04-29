interface CardItem {
  name: string
  role: string
  detail?: string
}

interface PitchViewCardsProps {
  title: string
  index?: number
  id?: string
  items: CardItem[]
  variant?: 'cast' | 'team'
}

export function PitchViewCards({ title, index, id, items, variant = 'cast' }: PitchViewCardsProps) {
  if (items.length === 0) return null

  const sectionLabel = index !== undefined
    ? `${String(index).padStart(2, '0')} / ${title.toUpperCase()}`
    : title.toUpperCase()

  return (
    <section id={id} className="px-[48px] md:px-[96px] py-[96px] border-b border-white/5">
      <div className="max-w-[1200px] mx-auto grid grid-cols-12 gap-[48px]">

        {/* Left: sticky section label */}
        <div className="col-span-12 md:col-span-2">
          <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-pop font-bold md:sticky md:top-[88px]">
            {sectionLabel}
          </p>
        </div>

        {/* Right: content */}
        <div className="col-span-12 md:col-span-10">
          <h2 className="font-heading text-[48px] md:text-[56px] tracking-[-0.02em] text-text-primary leading-[1.0] mb-[64px]">
            {title}
          </h2>

          {variant === 'cast' ? (
            /* Cast: 3-column portrait grid */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[48px]">
              {items.map((item, i) => (
                <div key={i} className="space-y-[24px]">
                  {/* Portrait — typographic fallback */}
                  <div className="aspect-[3/4] bg-surface-hover border border-white/5 flex items-end p-[16px]">
                    <span className="font-heading text-[72px] leading-[1] tracking-[-0.04em] text-text-disabled/30 select-none">
                      {item.name.charAt(0)}
                    </span>
                  </div>
                  <div className="space-y-[12px]">
                    <div className="flex items-baseline gap-[8px]">
                      <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-pop font-bold">
                        {item.role}
                      </span>
                    </div>
                    <h3 className="font-heading text-[28px] text-text-primary leading-[1.1]">
                      {item.name}
                    </h3>
                    {item.detail && (
                      <p className="text-[13px] leading-[22px] text-text-secondary">
                        {item.detail}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Team: horizontal list with bio */
            <div className="space-y-[48px]">
              {items.map((item, i) => (
                <div key={i} className="flex flex-col md:flex-row gap-[32px] items-start">
                  {/* Headshot — typographic fallback */}
                  <div className="w-[96px] h-[96px] bg-surface-hover border border-white/5 flex-shrink-0 flex items-end p-[8px]">
                    <span className="font-heading text-[40px] leading-[1] tracking-[-0.04em] text-text-disabled/30 select-none">
                      {item.name.charAt(0)}
                    </span>
                  </div>
                  <div className="space-y-[8px] flex-1">
                    <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-pop font-bold">
                      {item.role}
                    </p>
                    <h3 className="font-heading text-[32px] text-text-primary leading-[1.1]">
                      {item.name}
                    </h3>
                    {item.detail && (
                      <p className="text-[15px] leading-[26px] text-text-secondary">
                        {item.detail}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
