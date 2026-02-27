"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { LandingPreview } from "@/components/landing/LandingPreview";

/* ─── Reduced motion ─── */
function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

/* ─── Helpers ─── */
function easeOut(t: number): number {
  return 1 - (1 - t) * (1 - t);
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

/* ─── Scroll-driven progress ─── */
function useScrollProgress() {
  const ref = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let rafId: number;
    const compute = () => {
      const { top } = el.getBoundingClientRect();
      const vh = window.innerHeight;
      setProgress(clamp01((vh - top) / (vh * 0.75)));
    };
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(compute);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    compute();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return { ref, progress };
}

export function LandingHero() {
  const [mounted, setMounted] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const how = useScrollProgress();
  const ctaSection = useScrollProgress();

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const rawHow = reducedMotion ? 1 : how.progress;
  const rawCta = reducedMotion ? 1 : ctaSection.progress;

  const howHead = easeOut(clamp01(rawHow * 1.4));
  const col0 = easeOut(clamp01(rawHow * 1.4));
  const col1 = easeOut(clamp01(rawHow * 1.4 - 0.2));
  const col2 = easeOut(clamp01(rawHow * 1.4 - 0.4));

  const ctaHead = easeOut(clamp01(rawCta * 1.4));
  const ctaVisible = rawCta > 0.3;

  return (
    <>
      {/* ═══════════════════════════════════════════════
          HERO
          ═══════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center px-[24px] md:px-[48px] py-[120px]">
        <div className="max-w-[1200px] w-full mx-auto relative">
          {/* Audience kicker */}
          <p
            className="font-[var(--font-mono)] text-[11px] leading-[16px] tracking-[0.08em] uppercase text-text-secondary mb-[8px] flex items-center gap-[8px]"
            style={{
              opacity: mounted ? 1 : 0,
              transition: reducedMotion
                ? "none"
                : "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
            }}
          >
            <span className="w-[4px] h-[4px] rounded-full bg-pop animate-led-breathe flex-shrink-0" style={{ opacity: 0.3 }} />
            Built for Creators
          </p>

          {/* Witness line */}
          <div
            className="h-[1px] w-[40px] bg-border mb-[24px]"
            style={{
              transform: mounted ? "scaleX(1)" : "scaleX(0)",
              transformOrigin: "left",
              opacity: mounted ? 1 : 0,
              transition: reducedMotion
                ? "none"
                : "transform 600ms ease-out 0.7s, opacity 0.3s ease-out 0.7s",
            }}
          />

          <h1
            className="font-[var(--font-heading)] font-semibold text-[48px] sm:text-[64px] md:text-[88px] lg:text-[112px] leading-[1.05] tracking-[-0.03em] text-text-primary mb-[32px]"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(32px)",
              transition: reducedMotion
                ? "none"
                : "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
            }}
          >
            Present your work.<br />
            Fund your vision.<br />
            <span className="text-pop">Properly.</span>
          </h1>

          {/* Subtext */}
          <p
            className="text-[18px] md:text-[20px] leading-[32px] text-text-secondary max-w-[520px] mb-[40px]"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(24px)",
              transition: reducedMotion
                ? "none"
                : "all 0.75s cubic-bezier(0.16, 1, 0.3, 1) 1.1s",
            }}
          >
            One link for your entire project — share it with producers,
            clients, collaborators, anyone who needs to see your work.
          </p>

          {/* CTA */}
          <div
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(24px)",
              transition: reducedMotion
                ? "none"
                : "all 0.75s cubic-bezier(0.16, 1, 0.3, 1) 1.3s",
            }}
          >
            <Link href="/signup">
              <Button variant="primary">Create your first project</Button>
            </Link>
          </div>
        </div>

        {/* Bottom metadata */}
        <div
          className="absolute bottom-[32px] left-[24px] md:left-[48px] font-[var(--font-mono)] text-[11px] leading-[16px] tracking-[0.05em] text-text-disabled uppercase flex items-center gap-[8px]"
          style={{
            opacity: mounted ? 1 : 0,
            transition: reducedMotion
              ? "none"
              : "opacity 1s cubic-bezier(0.16, 1, 0.3, 1) 1.5s",
          }}
        >
          <span className="w-[4px] h-[4px] rounded-full bg-pop animate-led-breathe flex-shrink-0" style={{ animationDelay: "0.5s", opacity: 0.3 }} />
          Build &bull; Share &bull; Version
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          HOW IT WORKS — Breathing numbers, staggered entry
          ═══════════════════════════════════════════════ */}
      <section ref={how.ref} className="px-[24px] md:px-[48px] py-[120px] md:py-[160px] relative">
        <div className="max-w-[1200px] mx-auto">
          <div className="overflow-hidden mb-[64px]">
            <h2
              className="font-[var(--font-heading)] font-semibold text-[32px] md:text-[48px] leading-[1.1] tracking-[-0.02em] text-text-primary"
              style={{
                clipPath: `inset(0 ${(1 - howHead) * 100}% 0 0)`,
                transform: `translateY(${(1 - howHead) * 40}px)`,
              }}
            >
              How it works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[48px] md:gap-[64px]">
            {[
              { num: "01", title: "Build", desc: "Logline to budget to team. Upload images, generate references with AI, embed video. A complete project in one place.", col: col0, delay: 0 },
              { num: "02", title: "Share", desc: "One link. Public, private, or password-protected. Send it to a producer, a client, a collaborator.", col: col1, delay: 1 },
              { num: "03", title: "Version", desc: "Your project evolves. Every version persists. See what changed and why.", col: col2, delay: 2 },
            ].map((item) => (
              <div
                key={item.num}
                style={{
                  opacity: item.col,
                  transform: `translateY(${(1 - item.col) * 32}px)`,
                }}
              >
                <span
                  className="font-[var(--font-mono)] text-[64px] md:text-[80px] leading-[1] font-medium text-border/60 block mb-[16px]"
                >
                  {item.num}
                </span>
                <h3 className="font-[var(--font-heading)] font-semibold text-[20px] leading-[28px] text-text-primary mb-[8px]">
                  {item.title}
                </h3>
                <p className="text-[15px] leading-[24px] text-text-secondary">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          OUTPUT — Realistic pitch preview
          ═══════════════════════════════════════════════ */}
      <LandingPreview />

      {/* ═══════════════════════════════════════════════
          FINAL CTA
          ═══════════════════════════════════════════════ */}
      <section ref={ctaSection.ref} className="px-[24px] md:px-[48px] py-[120px] md:py-[160px]">
        <div className="max-w-[1200px] mx-auto">
          <div className="overflow-hidden mb-[32px]">
            <h2
              className="font-[var(--font-heading)] font-semibold text-[32px] md:text-[48px] lg:text-[64px] leading-[1.1] tracking-[-0.02em] text-text-primary"
              style={{
                clipPath: `inset(0 ${(1 - ctaHead) * 100}% 0 0)`,
                transform: `translateY(${(1 - ctaHead) * 40}px)`,
              }}
            >
              Ready when you are.
            </h2>
          </div>
          <div style={{ opacity: ctaVisible ? 1 : 0 }}>
            <Link href="/signup">
              <Button variant="primary">Create your first project</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="px-[24px] md:px-[48px] py-[48px] border-t border-border">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between gap-[16px]">
          <div className="font-[var(--font-mono)] text-[11px] leading-[16px] tracking-[0.05em] text-text-disabled uppercase">
            &copy; {new Date().getFullYear()} Pitchcraft
          </div>
          <div className="flex gap-[24px] font-[var(--font-mono)] text-[11px] leading-[16px] tracking-[0.05em] text-text-disabled uppercase">
            <Link href="/terms" className="hover:text-text-secondary transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-text-secondary transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
