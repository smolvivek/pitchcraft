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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-border">
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
                className="bg-background px-[32px] py-[40px] flex flex-col gap-[24px]"
                style={{
                  opacity: reducedMotion ? 1 : item.col,
                  transform: reducedMotion ? "none" : `translateY(${(1 - item.col) * 24}px)`,
                }}
              >
                <span className="font-[var(--font-mono)] text-[11px] leading-[16px] tracking-[0.1em] text-text-disabled">
                  {item.num}
                </span>
                <h3 className="font-[var(--font-heading)] text-[36px] md:text-[44px] leading-[1.05] tracking-[-0.02em] text-text-primary">
                  {item.title}
                </h3>
                <p className="text-[14px] leading-[24px] text-text-secondary">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          OUTPUT
          ═══════════════════════════════════════════════ */}
      <LandingPreview />

      {/* ═══════════════════════════════════════════════
          PRICING PREVIEW
          ═══════════════════════════════════════════════ */}
      <section className="px-[24px] md:px-[48px] py-[80px] md:py-[120px] border-t border-border">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-[24px] mb-[48px]">
            <h2 className="font-[var(--font-heading)] text-[32px] md:text-[40px] font-semibold leading-[1.1] tracking-[-0.02em] text-text-primary">
              Simple pricing
            </h2>
            <Link href="/pricing" className="font-[var(--font-mono)] text-[12px] leading-[20px] tracking-[0.05em] uppercase text-text-secondary hover:text-text-primary transition-colors">
              Full comparison →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-border rounded-[4px] overflow-hidden">
            {[
              { tier: 'Free', price: '$0', period: 'forever', desc: 'One complete pitch. Share it publicly.', cta: 'Start free', href: '/signup', pop: false },
              { tier: 'Pro', price: '$12', period: '/mo', desc: 'Unlimited pitches. AI. Privacy controls.', cta: 'Go Pro', href: '/pricing', pop: true },
              { tier: 'Studio', price: '$29', period: '/mo', desc: 'Teams. Unlimited AI. Detailed analytics.', cta: 'Get Studio', href: '/pricing', pop: false },
            ].map((item) => (
              <div key={item.tier} className={`p-[32px] flex flex-col gap-[16px] ${item.pop ? 'bg-surface' : 'bg-background'}`}>
                <p className="font-[var(--font-mono)] text-[11px] leading-[16px] tracking-[0.08em] uppercase text-text-secondary">{item.tier}</p>
                <div className="flex items-baseline gap-[4px]">
                  <span className="font-[var(--font-heading)] text-[36px] font-semibold leading-[1] tracking-[-0.03em] text-text-primary">{item.price}</span>
                  <span className="font-[var(--font-mono)] text-[12px] text-text-secondary">{item.period}</span>
                </div>
                <p className="font-[var(--font-body)] text-[13px] leading-[20px] text-text-secondary flex-1">{item.desc}</p>
                <Link href={item.href} className={`font-[var(--font-mono)] text-[12px] leading-[20px] ${item.pop ? 'text-pop hover:text-pop-hover' : 'text-text-secondary hover:text-text-primary'} transition-colors`}>
                  {item.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

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
