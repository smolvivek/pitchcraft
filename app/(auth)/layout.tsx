"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Background word changes per page
  const backgroundWord = pathname === "/signup" ? "Create." : "Pitchcraft";

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-[16px] py-[40px] relative overflow-hidden">
      {/* Oversized structural typography — background element */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden="true"
      >
        <span
          className="font-[var(--font-heading)] font-bold text-[18vw] leading-[1] tracking-[-0.04em] text-text-primary whitespace-nowrap"
          style={{
            opacity: mounted ? 0.04 : 0,
            transition: "opacity 1.5s ease-out 0.3s",
            animation: mounted ? "text-drift 25s ease-in-out infinite" : "none",
          }}
        >
          {backgroundWord}
        </span>
      </div>

      <div className="w-full max-w-[400px] relative">
        {/* Logo */}
        <div
          className="text-center mb-[32px]"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(-16px)",
            transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <h1 className="font-[var(--font-heading)] text-[32px] font-bold leading-[40px] text-text-primary">
            Pitchcraft
          </h1>
        </div>

        {/* Form card — opacity fade-in */}
        <div
          style={{
            opacity: mounted ? 1 : 0,
            transition: "opacity 400ms ease-out 0.2s",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
