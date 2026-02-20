interface CardItem {
  name: string
  role: string
  detail?: string
}

interface PitchViewCardsProps {
  title: string
  items: CardItem[]
}

export function PitchViewCards({ title, items }: PitchViewCardsProps) {
  if (items.length === 0) return null

  return (
    <section className="max-w-[680px] mx-auto w-full px-[24px]">
      <h2 className="font-[var(--font-heading)] text-[24px] font-semibold leading-[32px] tracking-[-0.02em] text-text-primary">
        {title}
      </h2>
      <div className="mt-[16px] grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
        {items.map((item, i) => (
          <div
            key={i}
            className="bg-white border border-border rounded-[4px] p-[16px]"
          >
            <p className="font-[var(--font-body)] text-[16px] font-medium leading-[24px] text-text-primary">
              {item.name}
            </p>
            <p className="font-[var(--font-mono)] text-[13px] leading-[20px] text-text-secondary mt-[4px]">
              {item.role}
            </p>
            {item.detail && (
              <p className="font-[var(--font-body)] text-[14px] leading-[20px] text-text-secondary mt-[8px]">
                {item.detail}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
