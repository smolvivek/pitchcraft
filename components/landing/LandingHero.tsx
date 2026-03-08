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

function easeOut(t: number): number {
  return 1 - (1 - t) * (1 - t);
}
function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

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

  const col0 = easeOut(clamp01(rawHow * 1.4));
  const col1 = easeOut(clamp01(rawHow * 1.4 - 0.2));
  const col2 = easeOut(clamp01(rawHow * 1.4 - 0.4));

  const ctaHead = easeOut(clamp01(rawCta * 1.4));
  const ctaVisible = rawCta > 0.3;

  const line1Clip = reducedMotion ? 0 : mounted ? 0 : 100;
  const line2Clip = reducedMotion ? 0 : mounted ? 0 : 100;
  const line3Clip = reducedMotion ? 0 : mounted ? 0 : 100;

  return (
    <>
      {/* ═══════════════════════════════════════════════
          HERO
          ═══════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center px-[24px] md:px-[48px] py-[120px]">
        <div className="max-w-[1200px] w-full mx-auto">

          {/* Kicker */}
          <div
            className="flex items-center gap-[8px] mb-[40px]"
            style={{
              opacity: mounted ? 1 : 0,
              transition: reducedMotion ? "none" : "opacity 0.4s ease 0.1s",
            }}
          >
            <span
              className="block w-[6px] h-[6px] rounded-full animate-led-breathe flex-shrink-0"
              style={{ background: "#CC2020", animationDelay: "0s" }}
            />
            <span className="font-[var(--font-mono)] text-[11px] leading-[16px] tracking-[0.1em] uppercase text-text-secondary">
              Built for Creators
            </span>
          </div>

          {/* Headline — DM Serif Display, clip-reveal */}
          <h1 className="font-[var(--font-heading)] text-[52px] sm:text-[72px] md:text-[92px] lg:text-[120px] leading-[1.0] tracking-[-0.03em] text-text-primary mb-[40px]">
            <span
              className="block overflow-hidden"
              style={{
                clipPath: `inset(0 ${line1Clip}% 0 0)`,
                transform: `translateY(${mounted ? 0 : 32}px)`,
                transition: reducedMotion
                  ? "none"
                  : "clip-path 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.1s, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
              }}
            >
              Present your work.
            </span>
            <span
              className="block overflow-hidden"
              style={{
                clipPath: `inset(0 ${line2Clip}% 0 0)`,
                transform: `translateY(${mounted ? 0 : 32}px)`,
                transition: reducedMotion
                  ? "none"
                  : "clip-path 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.4s, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.4s",
              }}
            >
              Fund your vision.
            </span>
            <span
              className="block overflow-hidden text-pop italic"
              style={{
                clipPath: `inset(0 ${line3Clip}% 0 0)`,
                transform: `translateY(${mounted ? 0 : 32}px)`,
                transition: reducedMotion
                  ? "none"
                  : "clip-path 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.7s, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.7s",
              }}
            >
              Properly.
            </span>
          </h1>

          {/* Subtext */}
          <p
            className="text-[16px] md:text-[18px] leading-[28px] text-text-secondary max-w-[480px] mb-[40px]"
            style={{
              opacity: mounted ? 1 : 0,
              transition: reducedMotion ? "none" : "opacity 0.6s ease 1.1s",
            }}
          >
            One link for your entire project — share it with producers, clients, collaborators, anyone who needs to see your work.
          </p>

          {/* CTA */}
          <div
            style={{
              opacity: mounted ? 1 : 0,
              transition: reducedMotion ? "none" : "opacity 0.4s ease 1.4s",
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
            transition: reducedMotion ? "none" : "opacity 1s ease 1.8s",
          }}
        >
          <span
            className="w-[4px] h-[4px] rounded-full animate-led-breathe flex-shrink-0"
            style={{ background: "#CC2020", animationDelay: "0.5s", opacity: 0.3 }}
          />
          Build &bull; Share &bull; Version
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          HOW IT WORKS — editorial list
          ═══════════════════════════════════════════════ */}
      <section ref={how.ref} className="px-[24px] md:px-[48px] py-[120px] md:py-[160px]">
        <div className="max-w-[1200px] mx-auto">
          <div className="border-t-[2px] border-text-primary" />
          {[
            {
              num: "01",
              title: "Build",
              desc: "Logline to budget to team. Upload images, generate references with AI, embed video. A complete project in one place.",
              col: col0,
            },
            {
              num: "02",
              title: "Share",
              desc: "One link. Public, private, or password-protected. Send it to a producer, a client, a collaborator.",
              col: col1,
            },
            {
              num: "03",
              title: "Version",
              desc: "Your project evolves. Every version persists. See what changed and why.",
              col: col2,
            },
          ].map((item) => (
            <div
              key={item.num}
              className="border-b border-border"
              style={{
                opacity: reducedMotion ? 1 : item.col,
                transform: reducedMotion ? "none" : `translateY(${(1 - item.col) * 24}px)`,
              }}
            >
              <div className="py-[32px] md:py-[40px] flex items-start gap-[24px] md:gap-[48px] lg:gap-[80px]">
                <span className="font-[var(--font-mono)] text-[11px] leading-[16px] tracking-[0.1em] text-text-disabled mt-[8px] md:mt-[12px] w-[24px] shrink-0">
                  {item.num}
                </span>
                <h3 className="font-[var(--font-heading)] text-[28px] md:text-[36px] lg:text-[44px] leading-[1.05] tracking-[-0.02em] text-text-primary w-[100px] md:w-[140px] lg:w-[180px] shrink-0">
                  {item.title}
                </h3>
                <p className="text-[14px] md:text-[15px] leading-[24px] text-text-secondary flex-1 mt-[4px] md:mt-[10px] lg:mt-[14px] max-w-[480px]">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          OUTPUT
          ═══════════════════════════════════════════════ */}
      <LandingPreview />

      {/* ═══════════════════════════════════════════════
          FINAL CTA
          ═══════════════════════════════════════════════ */}
      <section ref={ctaSection.ref} className="px-[24px] md:px-[48px] py-[120px] md:py-[160px]">
        <div className="max-w-[1200px] mx-auto">
          <div className="overflow-hidden mb-[32px]">
            <h2
              className="font-[var(--font-heading)] text-[32px] md:text-[48px] lg:text-[64px] leading-[1.1] tracking-[-0.02em] text-text-primary"
              style={{
                clipPath: `inset(0 ${(1 - ctaHead) * 100}% 0 0)`,
                transform: `translateY(${(1 - ctaHead) * 40}px)`,
              }}
            >
              Ready when you are.
            </h2>
          </div>
          <div style={{ opacity: ctaVisible ? 1 : 0, transition: "opacity 0.5s ease" }}>
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
            <Link href="/pricing" className="hover:text-text-secondary transition-colors">Pricing</Link>
            <Link href="/terms" className="hover:text-text-secondary transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-text-secondary transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
