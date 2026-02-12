"use client";

export function MarqueeSection() {
  const items = [
    "Documentary",
    "Feature Film",
    "Short Film",
    "Music Video",
    "Commercial",
    "Series",
    "Pilot",
    "Experimental",
    "Animation",
    "Branded Content",
  ];

  // Duplicate items for seamless loop
  const displayItems = [...items, ...items];

  return (
    <section className="py-[80px] border-y border-border bg-surface/30">
      <div className="relative overflow-hidden">
        <div className="flex gap-[48px] animate-marquee items-center">
          {displayItems.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0 flex items-center gap-[16px]"
            >
              <span className="font-[var(--font-mono)] text-[13px] leading-[20px] uppercase tracking-[0.08em] text-text-secondary">
                {item}
              </span>
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="flex-shrink-0">
                <rect width="8" height="8" fill="currentColor" className="text-border" />
              </svg>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
