import Image from 'next/image'

interface PitchViewSectionProps {
  title: string
  content?: string
  imageUrls?: string[]
}

export function PitchViewSection({ title, content, imageUrls }: PitchViewSectionProps) {
  if (!content && (!imageUrls || imageUrls.length === 0)) return null

  return (
    <section className="flex flex-col gap-[24px]">
      <div className="max-w-[680px] mx-auto w-full px-[24px]">
        <h2 className="font-[var(--font-heading)] text-[24px] font-semibold leading-[32px] tracking-[-0.02em] text-text-primary">
          {title}
        </h2>
        {content && (
          <div className="mt-[16px] font-[var(--font-body)] text-[16px] leading-[24px] text-text-primary whitespace-pre-wrap">
            {content}
          </div>
        )}
      </div>
      {imageUrls && imageUrls.length > 0 && (
        <div className="max-w-[960px] mx-auto w-full px-[24px]">
          <div className={`grid gap-[16px] ${imageUrls.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {imageUrls.map((url, i) => (
              <div key={i} className="relative aspect-[4/3] rounded-[4px] overflow-hidden bg-surface">
                <Image
                  src={url}
                  alt={`${title} image ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes={imageUrls.length === 1 ? '960px' : '480px'}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
