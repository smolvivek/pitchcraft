"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const expoOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

function unsplash(id: string, w = 800): string {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;
}

interface MockProject {
  slug: string;
  title: string;
  director: string;
  logline: string;
  genre: string;
  status: string;
  budget: string;
  posterImg: string;
  posterFallback: string;
  sections: { title: string; body: string }[];
  people: { title: string; items: { name: string; role: string }[] } | null;
  funding: { raised: string; goal: string; percent: number; supporters: number } | null;
}

const projects: MockProject[] = [
  {
    slug: "the-uninvited",
    title: "The Uninvited",
    director: "Mara Holst",
    logline:
      "A folklore archivist cataloguing abandoned estates in rural Transylvania begins finding her own handwriting in century-old journals she has never seen before.",
    genre: "Fiction / Feature",
    status: "Development",
    budget: "$250K\u2013$1M",
    posterImg: "https://cdn2.picryl.com/photo/1921/12/31/nosferatu-original-poster-1921-325722-1024.jpg",
    posterFallback:
      "linear-gradient(135deg, #0A0A0A 0%, #1C1008 40%, #2A1A06 60%, #0A0A0A 100%)",
    sections: [
      {
        title: "Synopsis",
        body: "Dr. Mara Holst arrives in Bi\u015ftri\u021ba to catalogue three estates seized after the war. The work is routine\u2014until she opens a journal dated 1897 and finds her name. Her handwriting. A record of nights she has no memory of living.",
      },
      {
        title: "Director\u2019s Vision",
        body: "Shot on 35mm. No digital correction. The grain is the atmosphere. I want the audience to feel the cold of the archive room, the weight of the paper. This is a film about inheritance\u2014what we carry from lives we didn\u2019t choose.",
      },
    ],
    people: {
      title: "Cast & Characters",
      items: [
        { name: "Mara Holst", role: "Folklore Archivist" },
        { name: "Ion Dra\u0103goi", role: "Estate Caretaker" },
        { name: "Vera Albescu", role: "The Previous Tenant" },
      ],
    },
    funding: { raised: "$42,000", goal: "$80,000", percent: 52, supporters: 23 },
  },
  {
    slug: "white-silence",
    title: "White Silence",
    director: "Anika Strand",
    logline:
      "A glaciologist living alone at a Antarctic research station documents the final winter before the shelf she\u2019s studied for a decade breaks off into the sea.",
    genre: "Documentary / Feature",
    status: "In Production",
    budget: "$50K\u2013$250K",
    posterImg: "https://upload.wikimedia.org/wikipedia/commons/0/05/Antarctic_Sound-2016-Iceberg_02.jpg",
    posterFallback:
      "linear-gradient(145deg, #0A1C2E 0%, #0D2B40 30%, #1A4A6B 55%, #0D3050 75%, #0A1C2E 100%)",
    sections: [
      {
        title: "Synopsis",
        body: "Antarctica, 2025. Dr. Anika Strand has spent six winters on the Brunt Ice Shelf. This is her last. Satellite data shows the shelf will calve within the year\u2014a 1,700 sq km slab of ice, gone. She stays to document it, alone, in the silence before the break.",
      },
      {
        title: "Camera",
        body: "Locked-off wide shots. Long takes. No music. The sound design is the film\u2014wind, ice groaning, the crack of a shelf moving a millimetre at a time. One Sony FX3 for intimacy. One fixed exterior rig left running through blizzards.",
      },
    ],
    people: {
      title: "Key Team",
      items: [
        { name: "Anika Strand", role: "Director / Subject" },
        { name: "James Okafor", role: "Producer" },
        { name: "Priya Nair", role: "Editor" },
      ],
    },
    funding: { raised: "$18,400", goal: "$35,000", percent: 53, supporters: 41 },
  },
  {
    slug: "monsoon-estrella",
    title: "Monsoon",
    director: "Kiran Patel",
    logline:
      "A 60-second spot for Estrella\u2019s summer campaign\u2014one continuous shot following a bottle of cold beer through a monsoon street party in Mumbai.",
    genre: "Ad Film / Campaign",
    status: "Development",
    budget: "$5K\u2013$50K",
    posterImg: unsplash("photo-1534274988757-a28bf1a57c17", 960),
    posterFallback:
      "linear-gradient(150deg, #0A1628 0%, #0D3B66 35%, #1B6B93 55%, #0A4C6A 75%, #0A1628 100%)",
    sections: [
      {
        title: "Synopsis",
        body: "Rain hits the street. A bottle cap pops. The camera never cuts\u2014it follows the bottle hand to hand through a monsoon block party. Dancers, street food vendors, a couple sharing an umbrella, kids splashing in puddles. Sixty seconds. One take.",
      },
      {
        title: "Art Direction",
        body: "Mumbai monsoon palette\u2014wet concrete, neon reflections, warm amber street light against blue rain. The bottle is the only consistently lit object in frame. Everything else is beautiful chaos.",
      },
    ],
    people: null,
    funding: null,
  },
];

const NAV_LABELS = ["Overview", "Vision", "Cast", "Team"];

export function LandingPreview() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % projects.length);
    }, 6000);
    return () => clearTimeout(timer);
  }, [activeIndex]);

  const p = projects[activeIndex];

  return (
    <section className="px-[48px] md:px-[96px] py-[96px] bg-surface/40 border-t border-white/5 relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto">

        {/* Section header — matches philosophy pattern */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-baseline border-b border-white/10 pb-[24px] mb-[48px] gap-[12px]">
          <motion.h2
            className="font-heading font-light text-[clamp(36px,5vw,72px)] tracking-tight leading-[1.0]"
            initial={{ y: "110%", opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, ease: expoOut, delay: 0.15 }}
            viewport={{ once: true }}
            style={{ overflow: "hidden" } as React.CSSProperties}
          >
            This is what a producer sees.
          </motion.h2>
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-pop font-bold flex-shrink-0">
            02 / The Pitch Page
          </span>
        </div>

        {/* Project switcher */}
        <motion.div
          className="flex items-center gap-[24px] mb-[24px]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {projects.map((proj, i) => (
            <button
              key={proj.slug}
              onClick={() => setActiveIndex(i)}
              className="font-mono text-[10px] tracking-[0.06em] uppercase transition-colors duration-[200ms] pb-[4px]"
              style={{
                color: i === activeIndex ? "var(--color-text-primary)" : "var(--color-text-disabled)",
                borderBottom: i === activeIndex ? "1px solid var(--color-text-primary)" : "1px solid transparent",
              }}
            >
              {proj.genre.split(" / ")[0]}
            </button>
          ))}
        </motion.div>

        {/* Browser frame */}
        <motion.div
          className="max-w-[960px] mx-auto"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: expoOut, delay: 0.35 }}
          viewport={{ once: true }}
        >
          {/* Chrome bar */}
          <div className="bg-[#1C1C1C] border border-border border-b-0 px-[16px] py-[10px] flex items-center">
            <div className="flex-1 bg-background/50 px-[12px] py-[4px] overflow-hidden">
              <span className="font-mono text-[11px] text-text-disabled whitespace-nowrap">
                pitchcraft.app/p/{p.slug}
              </span>
            </div>
          </div>

          {/* Pitch page */}
          <div className="bg-background border border-border border-t-0 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >

                {/* ── TopBar — mirrors PitchViewTopBar ── */}
                <header className="py-[12px] px-[32px] flex items-center justify-between border-b border-white/5 bg-[#131313]">
                  <span className="font-heading font-bold text-[13px] uppercase tracking-tighter text-text-primary">
                    {p.title}
                  </span>
                  <nav className="hidden md:flex items-center gap-[20px]">
                    {NAV_LABELS.map((label) => (
                      <span
                        key={label}
                        className="font-mono text-[8px] tracking-[0.2em] uppercase text-text-disabled"
                      >
                        {label}
                      </span>
                    ))}
                  </nav>
                  <span className="bg-text-primary text-background px-[12px] py-[5px] font-mono text-[8px] tracking-[0.15em] uppercase font-bold">
                    Get in touch
                  </span>
                </header>

                {/* ── Hero — mirrors PitchViewHero ── */}
                <div
                  className="relative overflow-hidden flex flex-col justify-end"
                  style={{ height: 460, background: p.posterFallback }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.posterImg}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, #131313 0%, rgba(19,19,19,0.75) 25%, rgba(19,19,19,0.2) 55%, transparent 80%)",
                    }}
                  />

                  {/* Content pinned to bottom */}
                  <div className="relative z-10 px-[32px] pb-[32px] space-y-[16px]">
                    {/* Status indicator */}
                    <div className="flex items-center gap-[12px]">
                      <span className="w-[32px] h-[1px] bg-pop flex-shrink-0" />
                      <span className="font-mono text-[8px] tracking-[0.3em] uppercase text-pop font-bold">
                        {p.status}
                      </span>
                    </div>

                    {/* Project title */}
                    <h1 className="font-heading font-bold text-[42px] leading-[0.85] tracking-[-0.03em] uppercase text-text-primary">
                      {p.title}
                    </h1>

                    {/* Director + logline grid */}
                    <div className="grid grid-cols-12 gap-[20px] pt-[16px] border-t border-white/10">
                      <div className="col-span-4 border-l border-pop/30 pl-[14px]">
                        <p className="font-mono text-[7px] uppercase tracking-[0.25em] text-text-disabled mb-[5px]">
                          Director
                        </p>
                        <p className="font-heading text-[15px] text-text-primary leading-[1.1]">
                          {p.director}
                        </p>
                      </div>
                      <div className="col-span-8">
                        <p className="font-heading italic text-[14px] leading-[1.45] text-text-primary/70">
                          {p.logline}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Metadata — mirrors PitchViewMetadata ── */}
                <div className="px-[32px] py-[18px] border-b border-white/5 flex flex-wrap gap-x-[40px] gap-y-[10px]">
                  <div>
                    <p className="font-mono text-[7px] uppercase tracking-[0.2em] text-text-disabled mb-[3px]">Genre</p>
                    <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-text-primary">{p.genre}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[7px] uppercase tracking-[0.2em] text-text-disabled mb-[3px]">Budget</p>
                    <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-text-primary">{p.budget}</p>
                  </div>
                </div>

                {/* ── Sections — mirrors PitchViewSection grid ── */}
                {p.sections.map((section, idx) => (
                  <div key={section.title} className="px-[32px] py-[28px] border-b border-white/5">
                    <div className="grid grid-cols-12 gap-[20px]">
                      <div className="col-span-12 md:col-span-2">
                        <p className="font-mono text-[7px] uppercase tracking-[0.2em] text-pop font-bold">
                          {String(idx + 1).padStart(2, "0")} / {section.title.toUpperCase()}
                        </p>
                      </div>
                      <div className="col-span-12 md:col-span-10">
                        <h2 className="font-heading text-[20px] tracking-[-0.02em] text-text-primary mb-[10px] leading-[1.1]">
                          {section.title}
                        </h2>
                        <p className="text-[13px] leading-[22px] text-text-primary/65 max-w-[540px]">
                          {section.body}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* ── Cast / Team — mirrors PitchViewCards list ── */}
                {p.people && (
                  <div className="px-[32px] py-[28px] border-b border-white/5">
                    <div className="grid grid-cols-12 gap-[20px]">
                      <div className="col-span-12 md:col-span-2">
                        <p className="font-mono text-[7px] uppercase tracking-[0.2em] text-pop font-bold">
                          {p.people.title.toUpperCase()}
                        </p>
                      </div>
                      <div className="col-span-12 md:col-span-10 divide-y divide-white/5">
                        {p.people.items.map((item) => (
                          <div key={item.name} className="py-[10px] flex items-baseline gap-[16px]">
                            <span className="font-heading text-[15px] text-text-primary w-[180px] flex-shrink-0">
                              {item.name}
                            </span>
                            <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-pop">
                              {item.role}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Funding — mirrors PitchViewFunding strip ── */}
                {p.funding && (
                  <div className="px-[32px] py-[28px] border-b border-white/5">
                    <p className="font-mono text-[7px] uppercase tracking-[0.2em] text-text-disabled mb-[12px]">
                      Funding
                    </p>
                    <div className="flex justify-between items-baseline mb-[8px]">
                      <span className="font-heading text-[20px] tracking-[-0.02em] text-text-primary">
                        {p.funding.raised}
                      </span>
                      <span className="font-mono text-[9px] text-text-disabled">
                        of {p.funding.goal}
                      </span>
                    </div>
                    <div className="h-[2px] bg-border/60 overflow-hidden">
                      <div
                        className="h-full bg-pop"
                        style={{ width: `${p.funding.percent}%` }}
                      />
                    </div>
                    <p className="font-mono text-[9px] text-text-disabled mt-[6px]">
                      {p.funding.supporters} supporters
                    </p>
                  </div>
                )}

                {/* ── Footer — mirrors PitchViewFooter ── */}
                <div className="px-[32px] py-[20px] flex justify-between items-center">
                  <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-text-disabled">
                    pitchcraft.app
                  </span>
                  <span className="font-mono text-[8px] text-text-disabled/40">
                    {p.title}
                  </span>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
