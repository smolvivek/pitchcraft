interface PitchViewFooterProps {
  projectName?: string
}

export function PitchViewFooter({ projectName }: PitchViewFooterProps) {
  return (
    <footer className="w-full px-[48px] md:px-[96px] py-[64px] flex flex-col md:flex-row justify-between items-end bg-background border-t border-white/5 gap-[32px]">
      <div className="space-y-[8px]">
        {projectName && (
          <div className="font-heading font-bold text-[18px] text-text-primary uppercase tracking-tighter">
            {projectName}
          </div>
        )}
        <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-text-disabled">
          © {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
      <a
        href="/"
        className="font-mono text-[9px] uppercase tracking-[0.2em] text-text-disabled hover:text-text-secondary transition-colors duration-[200ms]"
      >
        Presented with Pitchcraft
      </a>
    </footer>
  )
}
