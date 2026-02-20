"use client";

import { useState, useEffect, useRef } from "react";

interface SectionTransitionProps {
  sectionNumber: string;
  children: React.ReactNode;
  sectionKey: string;
}

/**
 * A24-style section transition (DESIGN.md Signature Animation 2).
 *
 * 1. Current content drops to opacity 0 (150ms ease-out)
 * 2. Section number appears large (72px mono, weight 500), centered
 * 3. Number holds for 350ms
 * 4. Number fades as new content fades in behind it (300ms)
 * 5. Total: ~1s
 */
export function SectionTransition({
  sectionNumber,
  children,
  sectionKey,
}: SectionTransitionProps) {
  const [phase, setPhase] = useState<"content" | "number" | "fade-in">(
    "content"
  );
  const [displayedKey, setDisplayedKey] = useState(sectionKey);
  const [displayedNumber, setDisplayedNumber] = useState(sectionNumber);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip transition on first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      setDisplayedKey(sectionKey);
      setDisplayedNumber(sectionNumber);
      return;
    }

    if (sectionKey === displayedKey) return;

    // Phase 1: fade out current content (150ms)
    setPhase("number");
    setDisplayedNumber(sectionNumber);

    // Phase 2: hold number for 350ms, then fade in new content
    const holdTimer = setTimeout(() => {
      setDisplayedKey(sectionKey);
      setPhase("fade-in");
    }, 150 + 350); // 150ms fade-out + 350ms hold

    // Phase 3: after fade-in completes, return to normal
    const doneTimer = setTimeout(() => {
      setPhase("content");
    }, 150 + 350 + 300); // + 300ms fade-in

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(doneTimer);
    };
  }, [sectionKey, sectionNumber, displayedKey]);

  return (
    <div className="relative min-h-[200px]">
      {/* Title card number — centered overlay */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
        style={{
          opacity: phase === "number" ? 1 : 0,
          transition:
            phase === "number"
              ? "opacity 150ms ease-out"
              : "opacity 300ms ease-out",
        }}
      >
        <span className="font-[var(--font-mono)] text-[72px] leading-[1] font-medium text-text-disabled/40 select-none">
          {displayedNumber}
        </span>
      </div>

      {/* Content */}
      <div
        style={{
          opacity: phase === "content" ? 1 : phase === "fade-in" ? 1 : 0,
          transition:
            phase === "number"
              ? "opacity 150ms ease-out"
              : "opacity 300ms ease-out",
        }}
      >
        {children}
      </div>
    </div>
  );
}
