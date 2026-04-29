interface AvailableSections {
  synopsis: boolean
  vision: boolean
  cast: boolean
  team: boolean
}

interface PitchViewTopBarProps {
  projectName: string
  availableSections?: AvailableSections
  topOffset?: string
}

const ALL_NAV_LINKS = [
  { label: 'Overview', href: '#synopsis', key: 'synopsis' as const },
  { label: 'Vision', href: '#vision', key: 'vision' as const },
  { label: 'Cast', href: '#cast', key: 'cast' as const },
  { label: 'Team', href: '#team', key: 'team' as const },
]

export function PitchViewTopBar({ projectName, availableSections, topOffset }: PitchViewTopBarProps) {
  const navLinks = availableSections
    ? ALL_NAV_LINKS.filter((link) => availableSections[link.key])
    : ALL_NAV_LINKS

  return (
    <header className={`fixed ${topOffset ?? 'top-0'} w-full flex justify-between items-center px-[48px] py-[28px] bg-background/90 backdrop-blur-sm z-50 border-b border-white/5`}>
      {/* Project name */}
      <div className="font-heading font-bold text-[22px] uppercase tracking-tighter text-text-primary">
        {projectName}
      </div>

      {/* Section nav */}
      {navLinks.length > 0 && (
        <nav className="hidden md:flex items-center gap-[48px]">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-disabled hover:text-text-primary transition-colors duration-[200ms]"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}

    </header>
  )
}
