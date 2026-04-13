interface PitchViewCTAProps {
  projectName: string
}

export function PitchViewCTA({ projectName }: PitchViewCTAProps) {
  const subject = encodeURIComponent(`Re: ${projectName}`)
  const href = `mailto:?subject=${subject}`

  return (
    <section
      id="contact"
      className="flex flex-col justify-center items-center px-[48px] py-[160px] bg-background text-center"
    >
      <div className="max-w-[800px] space-y-[64px]">
        <div className="flex flex-col items-center gap-[16px]">
          <span className="font-mono text-[10px] tracking-[0.5em] uppercase text-pop font-bold">
            Next Steps
          </span>
          <h2 className="font-heading text-[64px] md:text-[88px] tracking-[-0.03em] text-text-primary leading-[0.9]">
            {projectName}.
          </h2>
        </div>

        <div className="flex flex-col md:flex-row gap-[16px] justify-center items-center">
          <a
            href={href}
            className="w-full md:w-auto bg-text-primary text-background px-[48px] py-[20px] font-mono text-[11px] tracking-[0.3em] uppercase font-bold hover:opacity-90 transition-opacity duration-[150ms]"
          >
            Get in touch
          </a>
        </div>
      </div>
    </section>
  )
}
