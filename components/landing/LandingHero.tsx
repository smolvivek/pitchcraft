"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function LandingHero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-[24px] overflow-hidden">
      <div className="max-w-[1200px] w-full">
        {/* Split-text hero */}
        <div className="flex flex-col gap-[16px] mb-[48px]">
          {["Present your work.", "Share one link.", "Own your story."].map((line, index) => (
            <div
              key={index}
              style={{
                transform: isVisible ? "translateY(0)" : "translateY(20px)",
                opacity: isVisible ? 1 : 0,
                transition: `all 0.75s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.15}s`,
              }}
            >
              <h1
                className={`font-[var(--font-heading)] font-semibold text-[64px] md:text-[96px] lg:text-[120px] leading-[0.9] tracking-[-0.02em] ${
                  index === 1 ? "text-accent-visual" : "text-text-primary"
                }`}
              >
                {line}
              </h1>
            </div>
          ))}
        </div>

        {/* Subheading */}
        <div
          className="mb-[48px]"
          style={{
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
            opacity: isVisible ? 1 : 0,
            transition: "all 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.45s",
          }}
        >
          <p className="text-[18px] md:text-[20px] leading-[32px] text-text-secondary max-w-[600px]">
            Build your project. Share anywhere. Fund your work. Built for filmmakers, writers, and creators.
          </p>
        </div>

        {/* CTA */}
        <div
          style={{
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
            opacity: isVisible ? 1 : 0,
            transition: "all 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.6s",
          }}
        >
          <Link href="/signup">
            <Button variant="primary">Get Started</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
