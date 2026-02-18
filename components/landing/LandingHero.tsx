"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

/* ─── Scroll reveal ─── */
function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.unobserve(el); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, visible };
}

export function LandingHero() {
  const [mounted, setMounted] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const how = useScrollReveal(0.12);
  const output = useScrollReveal(0.12);
  const ctaSection = useScrollReveal(0.2);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  /* Mouse parallax — gentle, physics-based */
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      <style jsx global>{`
        @keyframes grid-pulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.16; }
        }
        @keyframes cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes check-draw {
          0% { stroke-dashoffset: 24; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes card-fan {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(4px); }
        }
        @keyframes dot-breathe {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.5); opacity: 1; }
        }
        @keyframes counter-tick {
          0% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
          100% { transform: translateY(0); }
        }
      `}</style>

      {/* ═══════════════════════════════════════════════
          HERO
          ═══════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center px-[24px] md:px-[48px] py-[120px] overflow-hidden">

        {/* ── Architectural grid — draws in, responds to mouse ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            transform: `translate(${mouse.x * 6}px, ${mouse.y * 4}px)`,
            transition: "transform 0.4s ease-out",
          }}
        >
          {/* Vertical grid lines */}
          {[18, 36, 54, 72, 90].map((pct, i) => (
            <div
              key={`v${i}`}
              className="absolute top-0 h-full w-[1px] bg-border"
              style={{
                left: `${pct}%`,
                transform: mounted ? "scaleY(1)" : "scaleY(0)",
                transformOrigin: i % 2 === 0 ? "top" : "bottom",
                transition: `transform 1.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.4 + i * 0.15}s`,
                opacity: 0.09,
                animation: mounted ? `grid-pulse ${8 + i * 2}s ease-in-out ${i * 0.5}s infinite` : "none",
              }}
            />
          ))}
          {/* Horizontal grid lines */}
          {[25, 50, 75].map((pct, i) => (
            <div
              key={`h${i}`}
              className="absolute left-0 w-full h-[1px] bg-border"
              style={{
                top: `${pct}%`,
                transform: mounted ? "scaleX(1)" : "scaleX(0)",
                transformOrigin: "left",
                transition: `transform 2.2s cubic-bezier(0.16, 1, 0.3, 1) ${0.8 + i * 0.2}s`,
                opacity: 0.06,
                animation: mounted ? `grid-pulse ${10 + i * 3}s ease-in-out ${1 + i * 0.7}s infinite` : "none",
              }}
            />
          ))}
          {/* Intersection accent dots — where grid lines cross */}
          {[
            { top: "25%", left: "36%" },
            { top: "50%", left: "72%" },
            { top: "75%", left: "54%" },
          ].map((pos, i) => (
            <div
              key={`dot${i}`}
              className="absolute w-[4px] h-[4px] rounded-full bg-pop"
              style={{
                top: pos.top,
                left: pos.left,
                opacity: mounted ? 0.25 : 0,
                transition: `opacity 1s ease-out ${1.5 + i * 0.3}s`,
                animation: mounted ? `dot-breathe ${4 + i}s ease-in-out ${2 + i * 0.5}s infinite` : "none",
              }}
            />
          ))}
        </div>

        <div className="max-w-[1200px] w-full mx-auto relative">

          {/* Headline — staggered word reveal */}
          <h1 className="font-[var(--font-heading)] font-semibold text-[48px] sm:text-[56px] md:text-[80px] lg:text-[104px] leading-[1.05] tracking-[-0.02em] text-text-primary mb-[24px]">
            <span className="block">
              {["Present", "your", "work."].map((word, i) => (
                <span key={word} className="inline-block overflow-hidden mr-[0.25em]">
                  <span
                    className="inline-block"
                    style={{
                      transform: mounted ? "translateY(0)" : "translateY(110%)",
                      transition: `transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${0.15 + i * 0.1}s`,
                    }}
                  >
                    {word}
                  </span>
                </span>
              ))}
            </span>
            <span className="inline-block overflow-hidden">
              <span
                className="inline-block text-pop"
                style={{
                  transform: mounted ? "translateY(0)" : "translateY(110%)",
                  transition: "transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.6s",
                }}
              >
                Properly.
              </span>
            </span>
          </h1>

          {/* Accent line — draws in, then breathes */}
          <div
            className="h-[3px] bg-pop mb-[40px] origin-left"
            style={{
              maxWidth: "80px",
              transform: mounted ? "scaleX(1)" : "scaleX(0)",
              transition: "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.8s",
            }}
          />

          {/* Subtext */}
          <p
            className="text-[18px] md:text-[20px] leading-[32px] text-text-secondary max-w-[520px] mb-[40px]"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(24px)",
              transition: "all 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.9s",
            }}
          >
            Built for creators. One link for your entire project — share it
            with producers, clients, collaborators, anyone who needs to see your work.
          </p>

          {/* CTA */}
          <div
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(24px)",
              transition: "all 0.75s cubic-bezier(0.16, 1, 0.3, 1) 1.05s",
            }}
          >
            <Link href="/signup">
              <Button variant="primary">Create your first project</Button>
            </Link>
          </div>
        </div>

        {/* Bottom metadata */}
        <div
          className="absolute bottom-[32px] left-[24px] md:left-[48px] font-[var(--font-mono)] text-[11px] leading-[16px] tracking-[0.05em] text-text-disabled uppercase"
          style={{
            opacity: mounted ? 1 : 0,
            transition: "opacity 1s cubic-bezier(0.16, 1, 0.3, 1) 1.2s",
          }}
        >
          Build • Share • Version
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          HOW IT WORKS — Three columns
          ═══════════════════════════════════════════════ */}
      <section ref={how.ref} className="px-[24px] md:px-[48px] py-[120px] md:py-[160px]">
        <div className="max-w-[1200px] mx-auto">

          <div className="overflow-hidden mb-[64px]">
            <h2
              className="font-[var(--font-heading)] font-semibold text-[32px] md:text-[48px] leading-[1.1] tracking-[-0.02em] text-text-primary"
              style={{
                clipPath: how.visible ? "inset(0 0 0 0)" : "inset(100% 0 0 0)",
                transform: how.visible ? "translateY(0)" : "translateY(40px)",
                transition: "clip-path 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              How it works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[48px] md:gap-[40px]">

            {/* ── 01 — Structure: Mini sidebar building itself ── */}
            <div style={{
              opacity: how.visible ? 1 : 0,
              transform: how.visible ? "translateY(0)" : "translateY(32px)",
              transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.15s",
            }}>
              <svg viewBox="0 0 200 120" fill="none" className="w-full h-auto mb-[24px]">
                {/* Sidebar panel */}
                <rect x="8" y="4" width="58" height="112" rx="3"
                  className="fill-surface stroke-border" strokeWidth="0.5"
                  style={{
                    opacity: how.visible ? 1 : 0,
                    transition: "opacity 0.4s ease-out 0.2s",
                  }}
                />
                {/* 8 section rows in sidebar */}
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <g key={i}>
                    {/* Row number */}
                    <text x="14" y={19 + i * 13}
                      className="fill-text-disabled"
                      style={{
                        fontSize: "7px",
                        fontFamily: "var(--font-mono)",
                        opacity: how.visible ? 0.6 : 0,
                        transition: `opacity 0.3s ease-out ${0.3 + i * 0.06}s`,
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </text>
                    {/* Row bar */}
                    <rect x="28" y={14 + i * 13} width={28 - (i % 3) * 4} height="6" rx="1"
                      className={i === 2 ? "fill-pop/25" : "fill-border/40"}
                      style={{
                        opacity: how.visible ? 1 : 0,
                        transform: how.visible ? "translateX(0)" : "translateX(-12px)",
                        transition: `all 0.4s ease-out ${0.35 + i * 0.07}s`,
                      }}
                    />
                    {/* Checkmark for first 5 rows */}
                    {i < 5 && (
                      <path
                        d={`M${54} ${14 + i * 13 + 1} l2 2.5 l3.5 -4`}
                        className="stroke-[#388E3C]" strokeWidth="1.2" fill="none"
                        strokeLinecap="round" strokeLinejoin="round"
                        strokeDasharray="12"
                        style={{
                          strokeDashoffset: how.visible ? 0 : 12,
                          transition: `stroke-dashoffset 0.4s ease-out ${0.7 + i * 0.1}s`,
                        }}
                      />
                    )}
                  </g>
                ))}

                {/* Main content panel */}
                <rect x="74" y="4" width="118" height="112" rx="3"
                  className="fill-white stroke-border" strokeWidth="0.5"
                  style={{
                    opacity: how.visible ? 0.9 : 0,
                    transition: "opacity 0.5s ease-out 0.4s",
                  }}
                />
                {/* Content skeleton lines */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <rect key={`c${i}`} x="84" y={18 + i * 20} width={90 - i * 14} height="8" rx="2"
                    className={i === 0 ? "fill-text-primary/10" : "fill-border/25"}
                    style={{
                      opacity: how.visible ? 1 : 0,
                      transform: how.visible ? "translateX(0)" : "translateX(15px)",
                      transition: `all 0.5s ease-out ${0.5 + i * 0.08}s`,
                    }}
                  />
                ))}
              </svg>
              <span className="font-[var(--font-mono)] text-[11px] leading-[16px] tracking-[0.05em] text-text-disabled uppercase block mb-[8px]">01</span>
              <h3 className="font-[var(--font-heading)] font-semibold text-[20px] leading-[28px] text-text-primary mb-[8px]">Build</h3>
              <p className="text-[15px] leading-[24px] text-text-secondary">Logline to budget to team. Upload images, generate references with AI, embed video. A complete project in one place.</p>
            </div>

            {/* ── 02 — Share: URL bar + progress bar ── */}
            <div style={{
              opacity: how.visible ? 1 : 0,
              transform: how.visible ? "translateY(0)" : "translateY(32px)",
              transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
            }}>
              <svg viewBox="0 0 200 120" fill="none" className="w-full h-auto mb-[24px]">
                {/* URL bar frame */}
                <rect x="10" y="12" width="180" height="30" rx="4"
                  className="fill-white stroke-border" strokeWidth="1"
                  style={{
                    opacity: how.visible ? 1 : 0,
                    transition: "opacity 0.4s ease-out 0.3s",
                  }}
                />
                {/* Lock icon */}
                <circle cx="24" cy="27" r="4" className="stroke-[#388E3C]" strokeWidth="1" fill="none"
                  style={{
                    opacity: how.visible ? 1 : 0,
                    transition: "opacity 0.4s ease-out 0.5s",
                  }}
                />
                {/* URL text — revealed left to right */}
                <g style={{
                  clipPath: how.visible ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
                  transition: "clip-path 1.8s steps(22, end) 0.6s",
                }}>
                  <text x="36" y="31" className="fill-text-secondary"
                    style={{ fontSize: "9.5px", fontFamily: "var(--font-mono)", letterSpacing: "0.02em" }}
                  >
                    pitchcraft.app/your-project
                  </text>
                </g>
                {/* Blinking cursor */}
                <rect x="155" y="21" width="1.5" height="12" className="fill-text-primary"
                  style={{
                    opacity: how.visible ? 1 : 0,
                    animation: how.visible ? "cursor-blink 1s step-end 2.5s infinite" : "none",
                  }}
                />

                {/* Shared indicator — recipients */}
                <line x1="30" y1="58" x2="170" y2="58" className="stroke-border" strokeWidth="0.5"
                  style={{ opacity: how.visible ? 0.4 : 0, transition: "opacity 0.5s ease-out 1.5s" }}
                />
                {/* Share recipients */}
                {[
                  { x: 30, label: "Producer", delay: 1.8 },
                  { x: 80, label: "Client", delay: 2.0 },
                  { x: 124, label: "Partner", delay: 2.2 },
                ].map((r) => (
                  <g key={r.label}>
                    <circle cx={r.x + 6} cy="76" r="5" className="fill-surface stroke-border" strokeWidth="0.5"
                      style={{ opacity: how.visible ? 1 : 0, transition: `opacity 0.4s ease-out ${r.delay}s` }}
                    />
                    <text x={r.x + 16} y="79" className="fill-text-secondary"
                      style={{
                        fontSize: "8px", fontFamily: "var(--font-mono)", letterSpacing: "0.02em",
                        opacity: how.visible ? 0.6 : 0, transition: `opacity 0.4s ease-out ${r.delay + 0.1}s`,
                      }}
                    >
                      {r.label}
                    </text>
                  </g>
                ))}
                {/* Checkmarks next to each — viewed */}
                {[30, 80, 124].map((x, i) => (
                  <path
                    key={`sh${i}`}
                    d={`M${x + 2} 92 l1.5 2 l3 -3.5`}
                    className="stroke-[#388E3C]" strokeWidth="0.8" fill="none"
                    strokeLinecap="round" strokeLinejoin="round"
                    strokeDasharray="10"
                    style={{
                      strokeDashoffset: how.visible ? 0 : 10,
                      transition: `stroke-dashoffset 0.4s ease-out ${2.4 + i * 0.15}s`,
                    }}
                  />
                ))}
              </svg>
              <span className="font-[var(--font-mono)] text-[11px] leading-[16px] tracking-[0.05em] text-text-disabled uppercase block mb-[8px]">02</span>
              <h3 className="font-[var(--font-heading)] font-semibold text-[20px] leading-[28px] text-text-primary mb-[8px]">Share</h3>
              <p className="text-[15px] leading-[24px] text-text-secondary">One link. Public, private, or password-protected. Send it to a producer, a client, a collaborator.</p>
            </div>

            {/* ── 03 — Version: Stacked cards fanning out ── */}
            <div style={{
              opacity: how.visible ? 1 : 0,
              transform: how.visible ? "translateY(0)" : "translateY(32px)",
              transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.45s",
            }}>
              <svg viewBox="0 0 200 120" fill="none" className="w-full h-auto mb-[24px]">
                {/* v1 — back card, faded */}
                <g style={{
                  opacity: how.visible ? 1 : 0,
                  transform: how.visible ? "translate(0, 0)" : "translate(20px, 8px)",
                  transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.5s",
                }}>
                  <rect x="50" y="8" width="100" height="65" rx="3"
                    className="fill-surface stroke-border" strokeWidth="0.5"
                    style={{ opacity: 0.4 }}
                  />
                  <text x="130" y="22" className="fill-text-disabled"
                    style={{ fontSize: "9px", fontFamily: "var(--font-mono)", opacity: 0.5 }}
                  >
                    v1
                  </text>
                  {/* Skeleton lines */}
                  <rect x="58" y="18" width="55" height="5" rx="1" className="fill-border/20" />
                  <rect x="58" y="28" width="40" height="4" rx="1" className="fill-border/15" />
                </g>

                {/* v2 — middle card */}
                <g style={{
                  opacity: how.visible ? 1 : 0,
                  transform: how.visible ? "translate(0, 0)" : "translate(12px, 4px)",
                  transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.65s",
                }}>
                  <rect x="38" y="22" width="110" height="65" rx="3"
                    className="fill-white stroke-border" strokeWidth="0.5"
                    style={{ opacity: 0.7 }}
                  />
                  <text x="128" y="36" className="fill-text-disabled"
                    style={{ fontSize: "9px", fontFamily: "var(--font-mono)", opacity: 0.6 }}
                  >
                    v2
                  </text>
                  <rect x="46" y="32" width="60" height="5" rx="1" className="fill-border/30" />
                  <rect x="46" y="42" width="45" height="4" rx="1" className="fill-border/20" />
                  <rect x="46" y="52" width="55" height="4" rx="1" className="fill-border/15" />
                </g>

                {/* v3 — front card, prominent */}
                <g style={{
                  opacity: how.visible ? 1 : 0,
                  transform: how.visible ? "translate(0, 0)" : "translate(0, 0) scale(0.95)",
                  transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.8s",
                  animation: how.visible ? "card-fan 8s ease-in-out 1.5s infinite" : "none",
                }}>
                  <rect x="25" y="38" width="120" height="72" rx="3"
                    className="fill-white stroke-pop/20" strokeWidth="1"
                  />
                  {/* Active indicator */}
                  <circle cx="135" cy="50" r="3" className="fill-pop"
                    style={{
                      animation: how.visible ? "dot-breathe 3s ease-in-out 1.2s infinite" : "none",
                    }}
                  />
                  <text x="126" y="63" className="fill-pop"
                    style={{ fontSize: "9px", fontFamily: "var(--font-mono)", fontWeight: 500 }}
                  >
                    v3
                  </text>
                  {/* Content lines */}
                  <rect x="33" y="48" width="70" height="6" rx="1.5" className="fill-text-primary/12" />
                  <rect x="33" y="59" width="52" height="4" rx="1" className="fill-border/30" />
                  <rect x="33" y="68" width="62" height="4" rx="1" className="fill-border/25" />
                  <rect x="33" y="77" width="42" height="4" rx="1" className="fill-border/20" />
                  {/* Status dot */}
                  <circle cx="33" cy="94" r="2.5" className="fill-[#388E3C]/50" />
                  <rect x="40" y="91" width="30" height="4" rx="1" className="fill-border/20" />
                </g>
              </svg>
              <span className="font-[var(--font-mono)] text-[11px] leading-[16px] tracking-[0.05em] text-text-disabled uppercase block mb-[8px]">03</span>
              <h3 className="font-[var(--font-heading)] font-semibold text-[20px] leading-[28px] text-text-primary mb-[8px]">Version</h3>
              <p className="text-[15px] leading-[24px] text-text-secondary">Your project evolves. Every version persists. See what changed and why.</p>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          OUTPUT — What a project looks like
          ═══════════════════════════════════════════════ */}
      <section ref={output.ref} className="px-[24px] md:px-[48px] py-[120px] md:py-[160px] bg-surface/40">
        <div className="max-w-[1200px] mx-auto">

          <div className="overflow-hidden mb-[48px]">
            <h2
              className="font-[var(--font-heading)] font-semibold text-[32px] md:text-[48px] leading-[1.1] tracking-[-0.02em] text-text-primary"
              style={{
                clipPath: output.visible ? "inset(0 0 0 0)" : "inset(100% 0 0 0)",
                transform: output.visible ? "translateY(0)" : "translateY(40px)",
                transition: "clip-path 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              What your project looks like
            </h2>
          </div>

          {/* Mock pitch card */}
          <div
            className="border border-border rounded-[4px] bg-white p-[32px] md:p-[48px] max-w-[800px]"
            style={{
              opacity: output.visible ? 1 : 0,
              transform: output.visible ? "translateY(0) scale(1)" : "translateY(32px) scale(0.98)",
              transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
            }}
          >
            <div className="flex items-center gap-[12px] mb-[32px]">
              <span className="relative inline-flex">
                <span className="w-[8px] h-[8px] rounded-full bg-status-looking" style={{ animation: "dot-breathe 3s ease-in-out infinite" }} />
              </span>
              <span className="font-[var(--font-mono)] text-[11px] leading-[16px] tracking-[0.05em] text-text-disabled uppercase">
                Development • v1 • Drama / Feature
              </span>
            </div>

            <h3 className="font-[var(--font-heading)] font-semibold text-[24px] md:text-[32px] leading-[1.2] tracking-[-0.02em] text-text-primary mb-[16px]">
              A retired detective returns to the case that ended
              her career — only to find the evidence was never
              what it seemed.
            </h3>

            <div className="flex flex-wrap gap-[24px] font-[var(--font-mono)] text-[13px] leading-[20px] text-text-secondary mb-[32px]">
              <span>Dir. Sofia Mendes</span>
              <span>Budget: $250K–$1M</span>
              <span>12 crew attached</span>
            </div>

            <div className="border-t border-border pt-[24px]">
              <div className="flex flex-wrap gap-[8px]">
                {["Synopsis", "Vision", "Cast", "Locations", "Cinematography", "Flow"].map((section, i) => (
                  <span key={section}
                    className="font-[var(--font-mono)] text-[11px] leading-[16px] tracking-[0.05em] uppercase px-[12px] py-[6px] border border-border rounded-[4px] text-text-secondary"
                    style={{
                      opacity: output.visible ? 1 : 0,
                      transform: output.visible ? "translateY(0)" : "translateY(8px)",
                      transition: `all 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${0.5 + i * 0.06}s`,
                    }}
                  >
                    {section}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <p className="text-[16px] leading-[28px] text-text-secondary mt-[32px] max-w-[560px]"
            style={{ opacity: output.visible ? 1 : 0, transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.6s" }}>
            One URL. Everything they need to say yes.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FINAL CTA
          ═══════════════════════════════════════════════ */}
      <section ref={ctaSection.ref} className="px-[24px] md:px-[48px] py-[120px] md:py-[160px]">
        <div className="max-w-[1200px] mx-auto">
          <div className="overflow-hidden mb-[32px]">
            <h2
              className="font-[var(--font-heading)] font-semibold text-[32px] md:text-[48px] lg:text-[64px] leading-[1.1] tracking-[-0.02em] text-text-primary"
              style={{
                clipPath: ctaSection.visible ? "inset(0 0 0 0)" : "inset(100% 0 0 0)",
                transform: ctaSection.visible ? "translateY(0)" : "translateY(40px)",
                transition: "clip-path 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              Ready when you are.
            </h2>
          </div>
          <div style={{
            opacity: ctaSection.visible ? 1 : 0,
            transform: ctaSection.visible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
          }}>
            <Link href="/signup">
              <Button variant="primary">Create your first project</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="px-[24px] md:px-[48px] py-[48px] border-t border-border">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between gap-[16px]">
          <div className="font-[var(--font-mono)] text-[11px] leading-[16px] tracking-[0.05em] text-text-disabled uppercase">Pitchcraft</div>
          <div className="font-[var(--font-mono)] text-[11px] leading-[16px] tracking-[0.05em] text-text-disabled uppercase">Build • Share • Version</div>
        </div>
      </footer>
    </>
  );
}
