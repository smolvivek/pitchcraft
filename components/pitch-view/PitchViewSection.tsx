import Image from 'next/image'

interface ImageWithCaption {
  url: string
  caption?: string | null
}

interface PdfAttachment {
  url: string
  label?: string
}

interface PitchViewSectionProps {
  title: string
  index?: number
  id?: string
  content?: string
  imageUrls?: string[]
  images?: ImageWithCaption[]
  videoUrl?: string
  pdf?: PdfAttachment | null
}

function parseVideoEmbed(url: string): { type: 'youtube' | 'vimeo'; embedUrl: string } | null {
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  )
  if (ytMatch) {
    return { type: 'youtube', embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}` }
  }
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vimeoMatch) {
    return { type: 'vimeo', embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}` }
  }
  return null
}

export function PitchViewSection({ title, index, id, content, imageUrls, images, videoUrl, pdf }: PitchViewSectionProps) {
  const allImages: ImageWithCaption[] = images
    ? images
    : imageUrls
      ? imageUrls.map((url) => ({ url }))
      : []

  if (!content && allImages.length === 0 && !videoUrl && !pdf) return null

  const videoEmbed = videoUrl ? parseVideoEmbed(videoUrl) : null
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
        <div className="col-span-12 md:col-span-10 space-y-[40px]">
          <h2 className="font-heading text-[48px] md:text-[56px] tracking-[-0.02em] text-text-primary leading-[1.0]">
            {title}
          </h2>

          {content && (
            <div className="text-[17px] md:text-[19px] leading-[30px] md:leading-[32px] text-text-secondary font-light whitespace-pre-wrap max-w-[680px]">
              {content}
            </div>
          )}

          {pdf && (
            <div>
              <a
                href={pdf.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-[10px] border border-white/20 px-[16px] py-[10px] font-mono text-[11px] uppercase tracking-[0.15em] text-text-secondary hover:border-white/40 hover:text-text-primary transition-colors duration-[200ms]"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0">
                  <rect x="2" y="1" width="8" height="11" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M4.5 4.5H9.5M4.5 6.5H9.5M4.5 8.5H7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                {pdf.label ?? 'View PDF'}
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="flex-shrink-0 opacity-50">
                  <path d="M2 8L8 2M8 2H4M8 2V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          )}

          {allImages.length > 0 && (
            <div className={allImages.length === 1 ? 'max-w-[860px]' : ''}>
              <div className={`grid gap-[8px] ${
                allImages.length === 1 ? 'grid-cols-1' :
                allImages.length === 2 ? 'grid-cols-2' :
                'grid-cols-2 md:grid-cols-3'
              }`}>
                {allImages.map((img, i) => (
                  <figure key={i} className="flex flex-col gap-[8px]">
                    <div className={`relative overflow-hidden bg-surface ${allImages.length === 1 ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}>
                      <Image
                        src={img.url}
                        alt={img.caption || `${title} image ${i + 1}`}
                        fill
                        className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                        sizes={allImages.length === 1 ? '860px' : '420px'}
                      />
                    </div>
                    {img.caption && (
                      <figcaption className="font-mono text-[10px] uppercase tracking-[0.1em] leading-[16px] text-text-disabled">
                        {img.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </div>
          )}

          {videoEmbed && (
            <div className="max-w-[860px]">
              <div className="relative aspect-video overflow-hidden bg-surface/50">
                <iframe
                  src={videoEmbed.embedUrl}
                  title={`${title} video`}
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            </div>
          )}

          {videoUrl && !videoEmbed && (
            <div>
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-[6px] font-mono text-[11px] tracking-[0.05em] uppercase text-text-secondary border border-border px-[12px] py-[8px] hover:border-border-hover hover:text-text-primary transition-colors duration-[200ms]"
              >
                Watch ↗
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
