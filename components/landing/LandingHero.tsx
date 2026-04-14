"use client";

import Link from "next/link";
import { LandingPreview } from "@/components/landing/LandingPreview";
import { motion, MotionConfig } from "framer-motion";

const expoOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function LandingHero() {
  return (
    <MotionConfig reducedMotion="user">
      <>
        {/* ── HERO ── */}
        <section className="px-[48px] md:px-[96px] pt-[160px] pb-[120px]">
          <div className="max-w-[1200px] mx-auto">

            {/* Section stamp — punches in after scan */}
            <div className="overflow-hidden mb-[32px]">
              <span
                className="font-mono text-[9px] uppercase text-text-disabled block animate-stamp-in"
                style={{ animationDelay: '0.7s' }}
              >
                00 / Pitchcraft
              </span>
            </div>

            {/* Title — each line rises from below its overflow mask */}
            <h1 className="font-heading font-light text-[clamp(56px,11vw,150px)] leading-[0.88] tracking-[-0.03em] text-text-primary mb-[8px]">
              <div className="overflow-hidden">
                <span
                  className="block animate-text-rise"
                  style={{ animationDelay: '0.75s' }}
                >
                  The pitch is
                </span>
              </div>
              <div className="overflow-hidden">
                <span
                  className="block animate-text-rise"
                  style={{ animationDelay: '0.92s' }}
                >
                  the <span className="italic">first frame.</span>
                </span>
              </div>
            </h1>

            {/* Rule draws under the title */}
            <div
              className="h-[1px] bg-white/20 mb-[48px] animate-rule-draw"
              style={{ animationDelay: '1.15s' }}
            />

            {/* Subtitle + CTA — fades in together */}
            <motion.div
              className="flex flex-col md:flex-row gap-[48px] items-start"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: expoOut, delay: 1.3 }}
            >
              <p className="max-w-[400px] text-text-secondary font-light leading-relaxed text-[17px]">
                One link for your entire project — share it with producers, clients, collaborators, anyone who needs to see your work.
              </p>
              <Link
                href="/signup"
                className="group flex items-center gap-[16px] text-[10px] tracking-[0.2em] uppercase font-bold text-text-primary mt-[4px]"
              >
                Create your first project
                <span className="group-hover:translate-x-2 transition-transform duration-200">→</span>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ── PHILOSOPHY ── */}
        <section className="py-[96px] px-[48px] md:px-[96px] bg-background border-t border-white/5">
          <div className="max-w-[1200px] mx-auto">
            {/* Header row — heading left, label right */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-baseline border-b border-white/10 pb-[24px] mb-[48px] gap-[12px]">
              <motion.h2
                className="font-heading text-[clamp(36px,5vw,72px)] font-light tracking-tight leading-[1.0]"
                initial={{ opacity: 0, y: 48 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, ease: expoOut }}
                viewport={{ once: true, amount: 0.2 }}
              >
                Your film. One page.
              </motion.h2>
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-text-disabled flex-shrink-0">
                01 / What it is
              </span>
            </div>

            {/* Body */}
            <motion.div
              initial={{ opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, ease: expoOut, delay: 0.12 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <p className="text-text-secondary mb-[48px] leading-relaxed text-[17px] font-light max-w-[600px]">
                Logline, vision, cast, and budget — assembled once, shared as one link. Reads like the film it&apos;s pitching, not a slide deck.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-[32px] pt-[32px] border-t border-white/10">
                <div>
                  <span className="text-text-disabled text-[9px] tracking-[0.3em] font-bold uppercase block mb-[8px]">Build</span>
                  <p className="text-[13px] font-light text-text-secondary leading-relaxed">Logline, vision, cast, budget, moodboard.</p>
                </div>
                <div>
                  <span className="text-text-disabled text-[9px] tracking-[0.3em] font-bold uppercase block mb-[8px]">Share</span>
                  <p className="text-[13px] font-light text-text-secondary leading-relaxed">One link. Public, private, or password-protected.</p>
                </div>
                <div>
                  <span className="text-text-disabled text-[9px] tracking-[0.3em] font-bold uppercase block mb-[8px]">Version</span>
                  <p className="text-[13px] font-light text-text-secondary leading-relaxed">Every draft saved. Send the right cut to the right person.</p>
                </div>
                <div>
                  <span className="text-text-disabled text-[9px] tracking-[0.3em] font-bold uppercase block mb-[8px]">Fund</span>
                  <p className="text-[13px] font-light text-text-secondary leading-relaxed">Accept investment directly through your pitch page.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── PRODUCT PREVIEW ── */}
        <LandingPreview />

        {/* ── BENTO GRID ── */}
        <section className="py-[96px] px-[48px] md:px-[96px] bg-surface border-t border-white/5">
          <div className="max-w-[1200px] mx-auto">

            {/* Section header — matches philosophy pattern */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-baseline border-b border-white/10 pb-[24px] mb-[48px] gap-[12px]">
              <motion.h2
                className="font-heading text-[clamp(36px,5vw,72px)] font-light tracking-tight leading-[1.0]"
                initial={{ opacity: 0, y: 48 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, ease: expoOut }}
                viewport={{ once: true, amount: 0.2 }}
              >
                How it works.
              </motion.h2>
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-text-disabled flex-shrink-0">
                03 / The Product
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] grid-rows-2 bg-white/5" style={{ minHeight: 640 }}>
              {/* Tile 1: The Editor — 2-col */}
              <motion.div
                className="md:col-span-2 bg-surface p-[48px] flex flex-col justify-between hover:bg-surface-hover transition-colors"
                initial={{ opacity: 0, y: 56 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, ease: expoOut, delay: 0 }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <div>
                  <span className="font-mono text-[9px] tracking-[0.25em] font-bold text-text-disabled uppercase block mb-[24px]">Editor</span>
                  <h3 className="font-heading text-[36px] mb-[16px] font-light">The Editor</h3>
                  <p className="max-w-[480px] text-text-secondary text-[14px] font-light leading-relaxed">
                    Build your project: logline, vision, cast, and budget in one place.
                  </p>
                </div>
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-text-disabled mt-[32px]">01</span>
              </motion.div>

              {/* Tile 2: Dashboard — 1-col, 2-row */}
              <motion.div
                className="row-span-2 bg-surface p-[48px] flex flex-col justify-between hover:bg-surface-hover transition-colors"
                initial={{ opacity: 0, y: 56 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, ease: expoOut, delay: 0.1 }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <div>
                  <span className="font-mono text-[9px] tracking-[0.25em] font-bold text-text-disabled uppercase block mb-[24px]">Dashboard</span>
                  <h3 className="font-heading text-[36px] mb-[16px] font-light leading-[1.1]">Your<br />Projects</h3>
                  <p className="text-text-secondary text-[14px] font-light leading-relaxed">
                    Every project. Every version. One dashboard.
                  </p>
                  <div className="mt-[40px] space-y-[16px]">
                    {["Project List", "Version History", "Share Controls", "Funding Tracker"].map((item) => (
                      <div key={item} className="py-[8px] border-b border-white/10">
                        <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-text-secondary">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-text-disabled mt-[32px]">02</span>
              </motion.div>

              {/* Tile 3: The Premiere — 2-col */}
              <motion.div
                className="md:col-span-2 bg-surface p-[48px] flex flex-col justify-between hover:bg-surface-hover transition-colors"
                initial={{ opacity: 0, y: 56 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, ease: expoOut, delay: 0.2 }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <div>
                  <span className="font-mono text-[9px] tracking-[0.25em] font-bold text-text-disabled uppercase block mb-[24px]">Distribution</span>
                  <h3 className="font-heading text-[36px] mb-[16px] font-light">The Premiere</h3>
                  <p className="max-w-[480px] text-text-secondary text-[14px] font-light leading-relaxed">
                    Private, password-protected exhibition links for investors and crew. One link for the entire world of your project.
                  </p>
                </div>
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-text-disabled mt-[32px]">03</span>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── FEATURES CHESS ── */}
        <section className="px-[48px] md:px-[96px] py-[96px] border-t border-white/5 bg-background">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex flex-col md:flex-row md:justify-between md:items-baseline border-b border-white/10 pb-[24px] mb-[96px] gap-[12px]">
              <motion.h2
                className="font-heading text-[clamp(36px,5vw,72px)] font-light tracking-tight leading-[1.0]"
                initial={{ opacity: 0, y: 48 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, ease: expoOut }}
                viewport={{ once: true, amount: 0.2 }}
              >
                Every tool a filmmaker needs.
              </motion.h2>
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-text-disabled flex-shrink-0">
                04 / Features
              </span>
            </div>

            {/* Row 1 — The Editor */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-[64px] items-center mb-[120px]"
              initial={{ opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, ease: expoOut }}
              viewport={{ once: true, amount: 0.15 }}
            >
              {/* Text */}
              <div>
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-text-disabled font-bold block mb-[24px]">01 / Build</span>
                <h3 className="font-heading text-[clamp(28px,4vw,56px)] font-light tracking-[-0.02em] leading-[1.0] mb-[24px]">
                  Built in an afternoon.<br />
                  <span className="italic">Not a weekend.</span>
                </h3>
                <p className="text-text-secondary text-[15px] leading-relaxed font-light mb-[32px] max-w-[440px]">
                  Logline, vision, cast, budget, moodboard — assembled in one place. The editor enforces nothing. It doesn&apos;t suggest tone, impose templates, or generate your copy. It gets out of the way.
                </p>
                <div className="space-y-[12px]">
                  {["Logline + Synopsis", "Director's Vision", "Cast & Characters", "Budget Range", "Moodboard Gallery"].map((item) => (
                    <div key={item} className="flex items-center gap-[12px]">
                      <span className="w-[16px] h-[1px] bg-pop flex-shrink-0" />
                      <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-secondary">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual — Editor mock */}
              <div className="bg-surface border border-border p-[32px] space-y-[20px]">
                <div className="flex items-center justify-between mb-[8px]">
                  <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-text-disabled">Draft — The Weight of Water</span>
                  <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-pop border border-pop/40 px-[6px] py-[2px]">Saved</span>
                </div>
                {[
                  { label: "Logline", value: "A marine biologist discovers the ocean she's spent her life studying is keeping a secret—one that could redefine memory itself.", tall: true },
                  { label: "Genre", value: "Fiction / Short Film", tall: false },
                  { label: "Status", value: "Development", tall: false },
                ].map((field) => (
                  <div key={field.label} className="border-b border-white/5 pb-[16px]">
                    <p className="font-mono text-[7px] uppercase tracking-[0.2em] text-text-disabled mb-[6px]">{field.label}</p>
                    <p className={`text-[12px] leading-[1.6] text-text-secondary font-light ${field.tall ? "line-clamp-3" : ""}`}>{field.value}</p>
                  </div>
                ))}
                <div className="pt-[8px]">
                  <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-text-disabled">+ Add Vision</span>
                </div>
              </div>
            </motion.div>

            {/* Row 2 — Share & Privacy (reversed) */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-[64px] items-center mb-[120px]"
              initial={{ opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, ease: expoOut }}
              viewport={{ once: true, amount: 0.15 }}
            >
              {/* Visual — Share controls mock */}
              <div className="bg-surface border border-border p-[32px] order-2 md:order-1">
                <p className="font-mono text-[8px] uppercase tracking-[0.25em] text-text-disabled mb-[20px]">Share Controls</p>
                <div className="space-y-[1px] mb-[24px]">
                  {[
                    { label: "Public", sub: "Anyone with the link", active: false },
                    { label: "Private", sub: "Only you", active: false },
                    { label: "Password Protected", sub: "Set a passphrase", active: true },
                  ].map((opt) => (
                    <div key={opt.label} className={`flex items-center justify-between p-[12px] ${opt.active ? "bg-surface border border-white/10" : ""}`}>
                      <div>
                        <p className={`font-mono text-[10px] uppercase tracking-[0.1em] ${opt.active ? "text-text-primary" : "text-text-disabled"}`}>{opt.label}</p>
                        <p className="font-mono text-[8px] text-text-disabled mt-[2px]">{opt.sub}</p>
                      </div>
                      {opt.active && <span className="w-[6px] h-[6px] bg-pop flex-shrink-0" />}
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/5 pt-[16px]">
                  <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-text-disabled mb-[6px]">Your link</p>
                  <p className="font-mono text-[11px] text-text-secondary">pitchcraft.app/p/the-weight-of-water</p>
                </div>
              </div>

              {/* Text */}
              <div className="order-1 md:order-2">
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-text-disabled font-bold block mb-[24px]">02 / Share</span>
                <h3 className="font-heading text-[clamp(28px,4vw,56px)] font-light tracking-[-0.02em] leading-[1.0] mb-[24px]">
                  One link.<br />
                  <span className="italic">Full control.</span>
                </h3>
                <p className="text-text-secondary text-[15px] leading-relaxed font-light mb-[32px] max-w-[440px]">
                  Public, private, or password-protected. Send the right cut to the right person. Every version is retrievable — the early draft doesn&apos;t disappear when you update the project.
                </p>
                <div className="space-y-[12px]">
                  {["Public / Private / Password-protected", "Version history — every draft", "Link analytics — basic, no surveillance", "Revoke access instantly"].map((item) => (
                    <div key={item} className="flex items-center gap-[12px]">
                      <span className="w-[16px] h-[1px] bg-pop flex-shrink-0" />
                      <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-secondary">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Row 3 — Funding */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-[64px] items-center"
              initial={{ opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, ease: expoOut }}
              viewport={{ once: true, amount: 0.15 }}
            >
              {/* Text */}
              <div>
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-text-disabled font-bold block mb-[24px]">03 / Fund</span>
                <h3 className="font-heading text-[clamp(28px,4vw,56px)] font-light tracking-[-0.02em] leading-[1.0] mb-[24px]">
                  Funding lives<br />
                  <span className="italic">on the page.</span>
                </h3>
                <p className="text-text-secondary text-[15px] leading-relaxed font-light mb-[32px] max-w-[440px]">
                  No redirects. No third-party crowdfunding platform taking a cut before you do. Accept investment directly alongside the logline, the vision, the cast. The project and the fund are the same page.
                </p>
                <div className="space-y-[12px]">
                  {["Razorpay-secured payments", "Stretch goals + backer rewards", "Funding progress visible to viewers", "Direct payout — no intermediary"].map((item) => (
                    <div key={item} className="flex items-center gap-[12px]">
                      <span className="w-[16px] h-[1px] bg-pop flex-shrink-0" />
                      <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-secondary">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual — Funding mock */}
              <div className="bg-surface border border-border p-[32px]">
                <p className="font-mono text-[8px] uppercase tracking-[0.25em] text-text-disabled mb-[20px]">Funding — The Weight of Water</p>
                <div className="mb-[20px]">
                  <div className="flex justify-between items-baseline mb-[8px]">
                    <span className="font-heading text-[28px] font-light tracking-[-0.02em] text-text-primary">$42,000</span>
                    <span className="font-mono text-[10px] text-text-disabled">of $80,000</span>
                  </div>
                  <div className="h-[3px] bg-border overflow-hidden mb-[6px]">
                    <div className="h-full bg-pop" style={{ width: "52%" }} />
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono text-[9px] text-text-disabled">23 supporters</span>
                    <span className="font-mono text-[9px] text-text-disabled">52%</span>
                  </div>
                </div>
                <div className="space-y-[8px] mb-[16px]">
                  {[
                    { amount: "$10,000", desc: "Post-production begins", reached: true },
                    { amount: "$50,000", desc: "Festival submission run", reached: false },
                    { amount: "$80,000", desc: "Full theatrical distribution", reached: false },
                  ].map((goal) => (
                    <div key={goal.amount} className={`flex items-start gap-[8px] px-[10px] py-[7px] border-l-2 ${goal.reached ? "border-pop/60 bg-white/[0.02]" : "border-transparent"}`}>
                      <span className="font-mono text-[9px] text-text-disabled whitespace-nowrap">{goal.amount}</span>
                      <span className={`font-mono text-[9px] ${goal.reached ? "text-text-secondary" : "text-text-disabled"}`}>{goal.desc}{goal.reached ? " ✓" : ""}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-[12px] border-t border-white/5">
                  <div className="bg-text-primary text-background px-[16px] py-[9px] inline-block font-mono text-[9px] uppercase tracking-[0.15em] font-bold">
                    Support this project
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="px-[48px] md:px-[96px] py-[96px] border-t border-white/5 bg-surface">
          <div className="max-w-[1200px] mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-[1px] bg-white/5">
              {[
                { number: "3", unit: "min", label: "To publish your first project" },
                { number: "1", unit: "link", label: "Logline, cast, moodboard, funding" },
                { number: "0", unit: "decks", label: "Forwarded without context" },
                { number: "∞", unit: "versions", label: "Every cut, always retrievable" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="bg-surface p-[40px] flex flex-col justify-between min-h-[200px]"
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.85, ease: expoOut, delay: i * 0.08 }}
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <div className="flex items-baseline gap-[6px] mb-[16px]">
                    <span className="font-heading text-[clamp(40px,6vw,80px)] font-light tracking-[-0.03em] leading-[1] text-text-primary">
                      {stat.number}
                    </span>
                    <span className="font-mono text-[12px] uppercase tracking-[0.15em] text-text-disabled">
                      {stat.unit}
                    </span>
                  </div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-secondary leading-[1.6]">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section className="px-[48px] md:px-[96px] py-[96px] border-t border-white/5 bg-background">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex flex-col md:flex-row md:justify-between md:items-baseline border-b border-white/10 pb-[24px] mb-[64px] gap-[12px]">
              <motion.h2
                className="font-heading text-[clamp(36px,5vw,72px)] font-light tracking-tight leading-[1.0]"
                initial={{ opacity: 0, y: 48 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, ease: expoOut }}
                viewport={{ once: true, amount: 0.2 }}
              >
                From the room.
              </motion.h2>
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-text-disabled flex-shrink-0">
                05 / Filmmakers
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-white/5">
              {[
                {
                  quote: "Sent the link to three exec producers before I finished writing the logline. None of them asked for a deck.",
                  name: "A. Mercer",
                  role: "Narrative Director",
                  delay: 0,
                },
                {
                  quote: "We use it for every project now — commercial, short, feature. The pitch page is the first thing we build, before the treatment, before the breakdown.",
                  name: "K. Osei",
                  role: "Independent Producer",
                  delay: 0.08,
                },
                {
                  quote: "Stopped making PDF decks six months ago. The link does what no PDF could — it shows the film's atmosphere before anyone reads a word.",
                  name: "R. Castillo",
                  role: "Documentary Filmmaker",
                  delay: 0.16,
                },
              ].map((item) => (
                <motion.div
                  key={item.name}
                  className="bg-background p-[40px] flex flex-col justify-between min-h-[280px] hover:bg-surface transition-colors duration-300"
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.85, ease: expoOut, delay: item.delay }}
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <p className="font-heading italic text-[18px] font-light leading-[1.5] text-text-primary/80 mb-[32px]">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-secondary">{item.name}</p>
                    <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-text-disabled mt-[2px]">{item.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section className="px-[48px] md:px-[96px] py-[96px] border-t border-white/5 bg-background">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex flex-col md:flex-row md:justify-between md:items-baseline border-b border-white/10 pb-[24px] mb-[48px] gap-[12px]">
              <h2 className="font-heading text-[clamp(36px,5vw,72px)] font-light tracking-tight leading-[1.0]">
                What it costs.
              </h2>
              <div className="flex items-baseline gap-[32px] flex-shrink-0">
                <Link
                  href="/pricing"
                  className="font-mono text-[9px] uppercase tracking-[0.15em] text-text-disabled hover:text-text-primary transition-colors"
                >
                  Full comparison →
                </Link>
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-text-disabled">
                  06 / Plans
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-white/5">
              {[
                { tier: "Free", price: "$0", period: "forever", desc: "One complete project. Share it publicly.", cta: "Start free", href: "/signup", pop: false },
                { tier: "Pro", price: "$12", period: "/mo", desc: "Unlimited projects. AI. Privacy controls.", cta: "Go Pro", href: "/pricing", pop: true },
                { tier: "Studio", price: "$29", period: "/mo", desc: "Teams. Unlimited AI. Detailed analytics.", cta: "Get Studio", href: "/pricing", pop: false },
              ].map((item) => (
                <div
                  key={item.tier}
                  className={`p-[32px] flex flex-col gap-[16px] ${item.pop ? "bg-surface" : "bg-background"}`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-secondary">{item.tier}</p>
                    {item.pop && (
                      <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-pop border border-pop/40 px-[6px] py-[2px]">Popular</span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-[4px]">
                    <span className="font-heading text-[40px] font-light leading-[1] tracking-[-0.03em] text-text-primary">{item.price}</span>
                    <span className="font-mono text-[12px] text-text-secondary">{item.period}</span>
                  </div>
                  <p className="text-[13px] leading-[20px] text-text-secondary font-light flex-1">{item.desc}</p>
                  <Link
                    href={item.href}
                    className={`font-mono text-[11px] uppercase tracking-[0.15em] ${item.pop ? "text-pop hover:underline" : "text-text-secondary hover:text-text-primary"} transition-colors`}
                  >
                    {item.cta} →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="py-[160px] px-[48px] md:px-[96px] bg-background border-t border-white/5">
          <div className="max-w-[1200px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: expoOut }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2 className="font-heading text-[clamp(48px,9vw,120px)] font-light tracking-[-0.03em] mb-[48px] italic leading-[0.9]">
              Begin the cut.
            </h2>
            <p className="max-w-[520px] mx-auto text-text-secondary mb-[48px] text-[18px] font-light leading-relaxed">
              Your next project. Built to be read, not forwarded as a PDF.
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-[16px]">
              <Link
                href="/signup"
                className="bg-text-primary text-background px-[48px] py-[18px] font-mono text-[11px] uppercase tracking-[0.2em] font-bold hover:opacity-90 transition-opacity"
              >
                Start Building
              </Link>
              <Link
                href="/pricing"
                className="border border-white/20 text-text-primary px-[48px] py-[18px] font-mono text-[11px] uppercase tracking-[0.2em] hover:bg-white/5 transition-colors"
              >
                See Pricing
              </Link>
            </div>
          </motion.div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="w-full px-[48px] md:px-[96px] py-[64px] border-t border-white/5 bg-background">
          <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-end gap-[32px]">
          <div className="space-y-[8px]">
            <div className="font-heading font-bold text-[20px] tracking-tighter uppercase text-text-primary">
              Pitchcraft
            </div>
            <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-text-disabled/50">
              © {new Date().getFullYear()} All rights reserved.
            </p>
          </div>
          <div className="flex flex-wrap gap-[32px]">
            {[
              { label: "Pricing", href: "/pricing" },
              { label: "Privacy", href: "/privacy" },
              { label: "Terms", href: "/terms" },
              { label: "Log In", href: "/login" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-mono text-[9px] uppercase tracking-[0.2em] text-text-disabled hover:text-text-primary transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
          </div>
        </footer>
      </>
    </MotionConfig>
  );
}
