"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* ─── Scroll reveal helper ─── */
function useReveal() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

/* ─── Cursor-following tilt ─── */
function useTilt(ref: React.RefObject<HTMLDivElement | null>) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      setTilt({ x: dy * -1.5, y: dx * 1.5 });
    };
    const onLeave = () => setTilt({ x: 0, y: 0 });

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [ref]);

  return tilt;
}

/* ─── Unsplash helper ─── */
function unsplash(id: string, w = 800, h?: number): string {
  const base = `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;
  return h ? `${base}&h=${h}` : base;
}

/* ═══════════════════════════════════════════════
   PROJECT DATA — Three distinct deck configurations
   ═══════════════════════════════════════════════ */

interface ProjectData {
  slug: string;
  title: string;
  logline: string;
  genre: string;
  status: string;
  statusColor: string;
  budget: string;
  version: string;
  posterImg: string;
  posterFallback: string;
  sections: SectionBlock[];
  morePills: string[];
  funding: {
    enabled: boolean;
    raised?: string;
    goal?: string;
    percent?: number;
    supporters?: number;
  };
}

type SectionBlock =
  | { type: "synopsis"; title: string; body: string; fade?: string }
  | { type: "text"; title: string; body: string }
  | { type: "images"; images: { src: string; fallback: string }[] }
  | { type: "cast"; title: string; people: { name: string; role: string }[] }
  | { type: "team"; title: string; people: { name: string; role: string }[] }
  | {
      type: "locations";
      title: string;
      locations: { name: string; tag: string; src: string; fallback: string }[];
    };

const projects: ProjectData[] = [
  /* ─── 1. Short Drama ─── */
  {
    slug: "the-weight-of-water",
    title: "The Weight of Water",
    logline:
      "A marine biologist discovers that the ocean she\u2019s spent her life studying is keeping a secret \u2014 one that could redefine how we understand memory itself.",
    genre: "Drama / Short Film",
    status: "Development",
    statusColor: "bg-status-looking",
    budget: "$250K\u2013$1M",
    version: "v2",
    posterImg: unsplash("photo-1551244072-5d12893278ab", 960, 540),
    posterFallback:
      "linear-gradient(135deg, #1A1A1A 0%, #2C3E50 40%, #34495E 60%, #1A1A1A 100%)",
    sections: [
      {
        type: "synopsis",
        title: "Synopsis",
        body: "Dr. Lena Vasquez has spent twelve years mapping the deepest trenches of the Pacific. When an anomalous signal surfaces from a depth no instrument has reached, she assembles a small crew for one last dive \u2014 only to find that what lies below isn\u2019t geological. It\u2019s personal.",
        fade: "The deeper they go, the more the ocean seems to remember\u2026",
      },
      {
        type: "text",
        title: "Director\u2019s Vision",
        body: "This is a film about what we carry without knowing it. The ocean is the metaphor, but the story is deeply human \u2014 about a woman confronting the weight of a life spent looking outward.",
      },
      {
        type: "images",
        images: [
          {
            src: unsplash("photo-1505118380757-91f5f5632de0", 400, 300),
            fallback: "linear-gradient(160deg, #1B2838 0%, #2C3E50 50%, #1A252F 100%)",
          },
          {
            src: unsplash("photo-1559825481-12a05cc00344", 400, 300),
            fallback: "linear-gradient(200deg, #2C3E50 0%, #1A1A2E 50%, #16213E 100%)",
          },
        ],
      },
      {
        type: "cast",
        title: "Cast & Characters",
        people: [
          { name: "Elena Vasquez", role: "Marine Biologist" },
          { name: "Marcus Chen", role: "Submersible Pilot" },
          { name: "Dr. Ama Osei", role: "Oceanographer" },
          { name: "James Holt", role: "Expedition Funder" },
        ],
      },
    ],
    morePills: ["Key Team", "Sound Design", "Music", "Flow"],
    funding: {
      enabled: true,
      raised: "$42,000",
      goal: "$80,000",
      percent: 52,
      supporters: 23,
    },
  },

  /* ─── 2. Rock Climbing Documentary ─── */
  {
    slug: "the-last-ascent",
    title: "The Last Ascent",
    logline:
      "Three climbers attempt the first free solo of Cerro Torre\u2019s west face \u2014 a route that has killed every person who\u2019s tried it.",
    genre: "Documentary / Feature",
    status: "In Production",
    statusColor: "bg-status-progress",
    budget: "$50K\u2013$250K",
    version: "v3",
    posterImg: unsplash("photo-1522163182402-834f871fd851", 960, 540),
    posterFallback:
      "linear-gradient(145deg, #1A1A1A 0%, #4A3728 30%, #8B6914 55%, #5C4033 75%, #1A1A1A 100%)",
    sections: [
      {
        type: "synopsis",
        title: "Synopsis",
        body: "Patagonia, 2024. Cerro Torre\u2019s west face has never been free soloed. The route is 800 metres of vertical granite, ice mushrooms, and wind that can pin a climber to the wall for days. Three friends \u2014 tied together by a decade of climbing and a shared loss \u2014 believe they can change that.",
        fade: "The mountain doesn\u2019t care what you believe\u2026",
      },
      {
        type: "locations",
        title: "Locations",
        locations: [
          {
            name: "El Chalt\u00e9n Base Camp",
            tag: "EXT / Base",
            src: unsplash("photo-1486870591958-9b9d0d1dda99", 280, 186),
            fallback: "linear-gradient(160deg, #3E2723 0%, #5D4037 50%, #4E342E 100%)",
          },
          {
            name: "Cerro Torre West Face",
            tag: "EXT / Summit",
            src: unsplash("photo-1464822759023-fed622ff2c3b", 280, 186),
            fallback: "linear-gradient(200deg, #546E7A 0%, #37474F 50%, #263238 100%)",
          },
          {
            name: "Buenos Aires",
            tag: "INT / Interview",
            src: unsplash("photo-1589909202802-8f4aadce1849", 280, 186),
            fallback: "linear-gradient(180deg, #2C2C2C 0%, #3E3E3E 50%, #1A1A1A 100%)",
          },
        ],
      },
      {
        type: "text",
        title: "Camera",
        body: "Handheld 16mm for base camp intimacy. Drone and fixed-rig RED Komodo for wall sequences. The audience should feel the exposure \u2014 2,000ft of air beneath them. No stabilisation on summit footage. Let it shake.",
      },
      {
        type: "team",
        title: "Key Team",
        people: [
          { name: "Ren\u00e9 Carillo", role: "Director / Climber" },
          { name: "Sarah Ng", role: "Producer" },
          { name: "Tom\u00e1s Vidal", role: "Director of Photography" },
        ],
      },
    ],
    morePills: ["Sound Design", "Music", "Schedule", "Stunts & SFX"],
    funding: {
      enabled: true,
      raised: "$18,400",
      goal: "$35,000",
      percent: 53,
      supporters: 41,
    },
  },

  /* ─── 3. Beverage Ad Film ─── */
  {
    slug: "monsoon-estrella",
    title: "Monsoon",
    logline:
      "A 60-second spot for Estrella\u2019s summer campaign \u2014 one continuous shot following a bottle of cold beer through a monsoon street party in Mumbai.",
    genre: "Commercial / Campaign Film",
    status: "Development",
    statusColor: "bg-status-looking",
    budget: "$5K\u2013$50K",
    version: "v1",
    posterImg: unsplash("photo-1534274988757-a28bf1a57c17", 960, 540),
    posterFallback:
      "linear-gradient(150deg, #0A1628 0%, #0D3B66 35%, #1B6B93 55%, #0A4C6A 75%, #0A1628 100%)",
    sections: [
      {
        type: "synopsis",
        title: "Synopsis",
        body: "Rain hits the street. A bottle cap pops. The camera never cuts \u2014 it follows the bottle hand to hand through a monsoon block party. Dancers, street food vendors, a couple sharing an umbrella, kids splashing in puddles. Sixty seconds. One take. The bottle is always cold, the city is always warm.",
      },
      {
        type: "text",
        title: "Art Direction",
        body: "Mumbai monsoon palette \u2014 wet concrete, neon reflections, warm amber street light against blue rain. The bottle is the only consistently lit object in frame. Everything else is beautiful chaos. Wardrobe is soaked \u2014 saturated colour against grey rain.",
      },
      {
        type: "images",
        images: [
          {
            src: unsplash("photo-1513002749550-c59d786b8e6c", 280, 210),
            fallback: "linear-gradient(160deg, #0D3B66 0%, #1B6B93 40%, #14506E 100%)",
          },
          {
            src: unsplash("photo-1514565131-fce0801e5785", 280, 210),
            fallback: "linear-gradient(200deg, #2C1810 0%, #5D4037 40%, #3E2723 100%)",
          },
          {
            src: unsplash("photo-1533282960533-51328aa49826", 280, 210),
            fallback: "linear-gradient(170deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)",
          },
        ],
      },
      {
        type: "text",
        title: "Music",
        body: "Original score. Tabla meets electronic \u2014 building from a single raindrop rhythm into a full monsoon groove. Think Anoushka Shankar meets Four Tet. Tempo locked to the walk speed of the camera move.",
      },
    ],
    morePills: ["Costume", "Props", "Schedule", "Camera"],
    funding: { enabled: false },
  },
];

/* ═══════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════ */

export function LandingPreview() {
  const reveal = useReveal();
  const frameRef = useRef<HTMLDivElement>(null);
  const tilt = useTilt(frameRef);

  const [activeIndex, setActiveIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const transitionTo = useCallback((next: number) => {
    setFading(true);
    setTimeout(() => {
      setActiveIndex(next);
      setFading(false);
    }, 300);
  }, []);

  // Auto-shuffle every 6s
  useEffect(() => {
    const advance = () => {
      transitionTo((activeIndex + 1) % projects.length);
    };
    timerRef.current = setTimeout(advance, 6000);
    return () => clearTimeout(timerRef.current ?? undefined);
  }, [activeIndex, transitionTo]);

  const p = projects[activeIndex];

  return (
    <section
      ref={reveal.ref}
      className="px-[24px] md:px-[48px] py-[120px] md:py-[160px] bg-surface/40 relative overflow-hidden"
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Section header */}
        <div className="mb-[24px]">
          <span
            className="font-[var(--font-mono)] text-[11px] leading-[16px] tracking-[0.08em] uppercase text-text-disabled block mb-[16px]"
            style={{
              opacity: reveal.visible ? 1 : 0,
              transition: "opacity 0.6s ease 0.1s",
            }}
          >
            The Output
          </span>
          <h2
            className="font-[var(--font-heading)] font-semibold text-[32px] md:text-[48px] leading-[1.1] tracking-[-0.02em] text-text-primary"
            style={{
              opacity: reveal.visible ? 1 : 0,
              transform: reveal.visible ? "translateY(0)" : "translateY(32px)",
              transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.15s",
            }}
          >
            One link. This is what they see.
          </h2>
        </div>

        <p
          className="text-[16px] leading-[28px] text-text-secondary max-w-[480px] mb-[32px]"
          style={{
            opacity: reveal.visible ? 1 : 0,
            transform: reveal.visible ? "translateY(0)" : "translateY(16px)",
            transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
          }}
        >
          Someone opens your link. No downloads, no decks, no friction.
          Your project, exactly as you intended.
        </p>

        {/* ─── Project type indicators ─── */}
        <div
          className="flex items-center gap-[24px] mb-[24px]"
          style={{
            opacity: reveal.visible ? 1 : 0,
            transition: "opacity 0.6s ease 0.35s",
          }}
        >
          {projects.map((proj, i) => (
            <div key={proj.slug} className="flex items-center gap-[8px]">
              <span
                className="block w-[6px] h-[6px] rounded-full transition-all duration-[300ms]"
                style={{
                  backgroundColor: i === activeIndex ? "#E8503A" : "#333333",
                  transform: i === activeIndex ? "scale(1.3)" : "scale(1)",
                }}
              />
              <span
                className="font-[var(--font-mono)] text-[11px] leading-[16px] tracking-[0.04em] uppercase transition-colors duration-[300ms]"
                style={{
                  color: i === activeIndex ? "#F5F5F5" : "#555555",
                }}
              >
                {proj.genre.split(" / ")[0]}
              </span>
            </div>
          ))}
        </div>

        {/* ─── Browser frame ─── */}
        <div
          ref={frameRef}
          className="max-w-[960px] mx-auto"
          style={{
            opacity: reveal.visible ? 1 : 0,
            transform: reveal.visible
              ? `translateY(0) perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
              : "translateY(48px)",
            transition: reveal.visible
              ? "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s, transform 0.3s ease-out"
              : "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s",
          }}
        >
          {/* Browser chrome */}
          <div className="bg-[#1A1A1A] rounded-t-[8px] border border-border border-b-0 px-[16px] py-[10px] flex items-center gap-[12px]">
            <div className="flex gap-[6px]">
              <div className="w-[10px] h-[10px] rounded-full bg-[#333333]" />
              <div className="w-[10px] h-[10px] rounded-full bg-[#333333]" />
              <div className="w-[10px] h-[10px] rounded-full bg-[#333333]" />
            </div>
            <div className="flex-1 bg-background/60 rounded-[4px] px-[12px] py-[4px] overflow-hidden">
              <span className="font-[var(--font-mono)] text-[11px] leading-[16px] text-text-disabled whitespace-nowrap">
                pitchcraft.app/p/{p.slug}
              </span>
            </div>
          </div>

          {/* Pitch content */}
          <div className="bg-background border border-border border-t-0 rounded-b-[8px] overflow-hidden">
            <div
              className="flex flex-col gap-[32px] md:gap-[40px] pb-[40px]"
              style={{
                opacity: fading ? 0 : 1,
                transition: "opacity 300ms ease-out",
              }}
            >
              {/* Top bar */}
              <div className="border-b border-border py-[12px]">
                <div className="max-w-[680px] mx-auto px-[20px] md:px-[24px] flex items-center justify-between">
                  <span className="font-[var(--font-heading)] text-[12px] md:text-[13px] font-semibold tracking-[-0.02em] text-text-primary">
                    Pitchcraft
                  </span>
                  <span className="font-[var(--font-mono)] text-[11px] text-text-secondary">
                    {p.version}
                  </span>
                </div>
              </div>

              {/* Poster — real image with gradient fallback */}
              <div className="max-w-[680px] mx-auto w-full px-[20px] md:px-[24px]">
                <div
                  className="relative w-full aspect-[16/9] rounded-[4px] overflow-hidden"
                  style={{ background: p.posterFallback }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.posterImg}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                  {/* Film grain overlay */}
                  <div className="absolute inset-0 opacity-[0.04] bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%20256%20256%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter%20id%3D%22n%22%3E%3CfeTurbulence%20baseFrequency%3D%220.8%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23n)%22%2F%3E%3C%2Fsvg%3E')]" />
                  {/* Vignette */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(ellipse at center, transparent 50%, rgba(10,10,10,0.5) 100%)",
                    }}
                  />
                </div>
              </div>

              {/* Project name + logline */}
              <div className="max-w-[680px] mx-auto w-full px-[20px] md:px-[24px]">
                <h3 className="font-[var(--font-heading)] font-semibold text-[22px] md:text-[28px] leading-[1.2] tracking-[-0.02em] text-text-primary">
                  {p.title}
                </h3>
                <p className="mt-[12px] font-[var(--font-body)] text-[14px] md:text-[16px] leading-[24px] text-text-secondary">
                  {p.logline}
                </p>
              </div>

              {/* Metadata */}
              <div className="max-w-[680px] mx-auto w-full px-[20px] md:px-[24px]">
                <div className="flex flex-wrap items-center gap-[12px] md:gap-[16px] font-[var(--font-mono)] text-[11px] md:text-[12px] leading-[20px] text-text-secondary">
                  <span>{p.genre}</span>
                  <span className="text-border">&middot;</span>
                  <span className="inline-flex items-center gap-[5px]">
                    <span
                      className={`inline-block w-[7px] h-[7px] rounded-full ${p.statusColor}`}
                    />
                    {p.status}
                  </span>
                  <span className="text-border">&middot;</span>
                  <span>{p.budget}</span>
                </div>
              </div>

              {/* Dynamic sections */}
              {p.sections.map((section, i) => {
                if (section.type === "synopsis") {
                  return (
                    <div
                      key={i}
                      className="max-w-[680px] mx-auto w-full px-[20px] md:px-[24px]"
                    >
                      <h4 className="font-[var(--font-heading)] font-semibold text-[18px] md:text-[20px] leading-[28px] tracking-[-0.02em] text-text-primary">
                        {section.title}
                      </h4>
                      <p className="mt-[12px] font-[var(--font-body)] text-[13px] md:text-[14px] leading-[22px] text-text-primary">
                        {section.body}
                      </p>
                      {section.fade && (
                        <p className="mt-[8px] font-[var(--font-body)] text-[13px] md:text-[14px] leading-[22px] text-text-primary opacity-60">
                          {section.fade}
                        </p>
                      )}
                    </div>
                  );
                }

                if (section.type === "text") {
                  return (
                    <div
                      key={i}
                      className="max-w-[680px] mx-auto w-full px-[20px] md:px-[24px]"
                    >
                      <h4 className="font-[var(--font-heading)] font-semibold text-[18px] md:text-[20px] leading-[28px] tracking-[-0.02em] text-text-primary">
                        {section.title}
                      </h4>
                      <p className="mt-[12px] font-[var(--font-body)] text-[13px] md:text-[14px] leading-[22px] text-text-primary">
                        {section.body}
                      </p>
                    </div>
                  );
                }

                if (section.type === "images") {
                  return (
                    <div
                      key={i}
                      className="max-w-[680px] mx-auto w-full px-[20px] md:px-[24px]"
                    >
                      <div
                        className={`grid gap-[8px] md:gap-[12px] ${
                          section.images.length === 3
                            ? "grid-cols-3"
                            : "grid-cols-2"
                        }`}
                      >
                        {section.images.map((img, j) => (
                          <div
                            key={j}
                            className="relative aspect-[4/3] rounded-[4px] overflow-hidden"
                            style={{ background: img.fallback }}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={img.src}
                              alt=""
                              className="absolute inset-0 w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }

                if (
                  section.type === "cast" ||
                  section.type === "team"
                ) {
                  return (
                    <div
                      key={i}
                      className="max-w-[680px] mx-auto w-full px-[20px] md:px-[24px]"
                    >
                      <h4 className="font-[var(--font-heading)] font-semibold text-[18px] md:text-[20px] leading-[28px] tracking-[-0.02em] text-text-primary">
                        {section.title}
                      </h4>
                      <div
                        className={`mt-[12px] grid gap-[8px] md:gap-[12px] ${
                          section.people.length <= 3
                            ? "grid-cols-3"
                            : "grid-cols-2"
                        }`}
                      >
                        {section.people.map((person) => (
                          <div
                            key={person.name}
                            className="bg-surface border border-border rounded-[4px] p-[10px] md:p-[12px]"
                          >
                            <p className="font-[var(--font-body)] text-[12px] md:text-[13px] font-medium leading-[18px] text-text-primary">
                              {person.name}
                            </p>
                            <p className="font-[var(--font-mono)] text-[10px] md:text-[11px] leading-[16px] text-text-secondary mt-[2px]">
                              {person.role}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }

                if (section.type === "locations") {
                  return (
                    <div
                      key={i}
                      className="max-w-[680px] mx-auto w-full px-[20px] md:px-[24px]"
                    >
                      <h4 className="font-[var(--font-heading)] font-semibold text-[18px] md:text-[20px] leading-[28px] tracking-[-0.02em] text-text-primary">
                        {section.title}
                      </h4>
                      <div className="mt-[12px] grid grid-cols-3 gap-[8px] md:gap-[12px]">
                        {section.locations.map((loc) => (
                          <div
                            key={loc.name}
                            className="bg-surface border border-border rounded-[4px] overflow-hidden"
                          >
                            <div
                              className="relative aspect-[3/2]"
                              style={{ background: loc.fallback }}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={loc.src}
                                alt=""
                                className="absolute inset-0 w-full h-full object-cover"
                                loading="lazy"
                              />
                            </div>
                            <div className="p-[10px] md:p-[12px]">
                              <p className="font-[var(--font-body)] text-[12px] md:text-[13px] font-medium leading-[18px] text-text-primary">
                                {loc.name}
                              </p>
                              <p className="font-[var(--font-mono)] text-[10px] md:text-[11px] leading-[16px] text-text-secondary mt-[2px]">
                                {loc.tag}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }

                return null;
              })}

              {/* More sections pills */}
              <div className="max-w-[680px] mx-auto w-full px-[20px] md:px-[24px]">
                <div className="border-t border-border pt-[20px]">
                  <div className="flex flex-wrap gap-[6px]">
                    {p.morePills.map((pill) => (
                      <span
                        key={pill}
                        className="font-[var(--font-mono)] text-[9px] md:text-[10px] leading-[14px] tracking-[0.04em] uppercase px-[8px] py-[4px] border border-border rounded-[3px] text-text-secondary bg-surface/50"
                      >
                        {pill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Funding (conditional) */}
              {p.funding.enabled && (
                <div className="max-w-[680px] mx-auto w-full px-[20px] md:px-[24px]">
                  <div className="bg-surface border border-border rounded-[4px] p-[16px] md:p-[20px]">
                    <h4 className="font-[var(--font-heading)] font-semibold text-[16px] md:text-[18px] leading-[24px] tracking-[-0.02em] text-text-primary mb-[12px]">
                      Support This Project
                    </h4>
                    <div className="flex justify-between items-baseline mb-[6px]">
                      <span className="font-[var(--font-mono)] text-[11px] md:text-[12px] text-text-primary">
                        {p.funding.raised} raised
                      </span>
                      <span className="font-[var(--font-mono)] text-[11px] md:text-[12px] text-text-secondary">
                        of {p.funding.goal}
                      </span>
                    </div>
                    <div className="h-[3px] bg-surface rounded-full overflow-hidden">
                      <div
                        className="h-full bg-pop rounded-full"
                        style={{ width: `${p.funding.percent}%` }}
                      />
                    </div>
                    <p className="font-[var(--font-mono)] text-[10px] md:text-[11px] text-text-secondary mt-[6px]">
                      {p.funding.supporters} supporters
                    </p>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="max-w-[680px] mx-auto w-full px-[20px] md:px-[24px] pt-[24px]">
                <p className="font-[var(--font-mono)] text-[10px] md:text-[11px] leading-[16px] text-text-disabled">
                  Made with Pitchcraft
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Closing line */}
        <p
          className="text-[15px] md:text-[16px] leading-[28px] text-text-secondary mt-[40px] max-w-[520px]"
          style={{
            opacity: reveal.visible ? 1 : 0,
            transition: "opacity 0.6s ease 1s",
          }}
        >
          Logline, vision, cast, funding &mdash; one URL, any device. Everything
          they need to see. Nothing they don&apos;t.
        </p>
      </div>
    </section>
  );
}
