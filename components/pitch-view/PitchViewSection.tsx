import Image from 'next/image'

interface ImageWithCaption {
  url: string
  caption?: string | null
}

interface PitchViewSectionProps {
  title: string
  content?: string
  imageUrls?: string[]
  images?: ImageWithCaption[]
  videoUrl?: string
}

function parseVideoEmbed(url: string): { type: 'youtube' | 'vimeo'; embedUrl: string } | null {
  // YouTube
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  )
  if (ytMatch) {
    return { type: 'youtube', embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}` }
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vimeoMatch) {
    return { type: 'vimeo', embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}` }
  }

  return null
}

export function PitchViewSection({ title, content, imageUrls, images, videoUrl }: PitchViewSectionProps) {
  // Merge imageUrls and images into a single array
  const allImages: ImageWithCaption[] = images
    ? images
    : imageUrls
      ? imageUrls.map((url) => ({ url }))
      : []

  if (!content && allImages.length === 0 && !videoUrl) return null

  const videoEmbed = videoUrl ? parseVideoEmbed(videoUrl) : null

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
      {allImages.length > 0 && (
        <div className="max-w-[960px] mx-auto w-full px-[24px]">
          <div className={`grid gap-[16px] ${allImages.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {allImages.map((img, i) => (
              <figure key={i} className="flex flex-col gap-[8px]">
                <div className="relative aspect-[4/3] rounded-[4px] overflow-hidden bg-surface">
                  <Image
                    src={img.url}
                    alt={img.caption || `${title} image ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes={allImages.length === 1 ? '960px' : '480px'}
                  />
                </div>
                {img.caption && (
                  <figcaption className="font-[var(--font-body)] text-[13px] leading-[18px] text-text-secondary">
                    {img.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </div>
      )}
      {videoEmbed && (
        <div className="max-w-[960px] mx-auto w-full px-[24px]">
          <div className="relative aspect-video rounded-[4px] overflow-hidden bg-background">
            <iframe
              src={videoEmbed.embedUrl}
              title={`${title} video`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>
      )}
      {videoUrl && !videoEmbed && (
        <div className="max-w-[680px] mx-auto w-full px-[24px]">
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-[var(--font-mono)] text-[13px] text-link underline"
          >
            {videoUrl}
          </a>
        </div>
      )}
    </section>
  )
}
