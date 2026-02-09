"use client";

import { useState } from "react";
import Link from "next/link";

interface NavLink {
  label: string;
  href: string;
  active?: boolean;
}

interface NavProps {
  links?: NavLink[];
}

function Nav({ links = [] }: NavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="h-[64px] bg-background border-b border-border flex items-center px-[24px] relative">
      {/* Logo */}
      <Link
        href="/"
        className="font-heading text-[18px] font-semibold text-text-primary"
      >
        Pitchcraft
      </Link>

      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-[24px] ml-auto">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`
              text-[14px] leading-[20px] transition-colors duration-[200ms] ease-out
              ${
                link.active
                  ? "text-text-primary border-b-2 border-accent pb-[2px]"
                  : "text-text-secondary hover:text-text-primary"
              }
            `}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Mobile hamburger */}
      <button
        className="md:hidden ml-auto w-[44px] h-[44px] flex items-center justify-center cursor-pointer"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
        aria-expanded={mobileOpen}
      >
        <svg width="20" height="16" viewBox="0 0 20 16" fill="none" aria-hidden="true">
          {mobileOpen ? (
            <>
              <path d="M2 2L18 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M18 2L2 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </>
          ) : (
            <>
              <path d="M1 1H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M1 8H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M1 15H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </>
          )}
        </svg>
      </button>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="absolute top-[64px] left-0 right-0 bg-background border-b border-border z-40 md:hidden animate-[fade-in_150ms_ease-out]">
          <div className="flex flex-col p-[16px] gap-[8px]">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  px-[16px] py-[12px] rounded-[4px] text-[14px] leading-[20px]
                  transition-colors duration-[200ms] ease-out
                  ${
                    link.active
                      ? "text-text-primary bg-surface font-medium"
                      : "text-text-secondary hover:bg-surface hover:text-text-primary"
                  }
                `}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

export { Nav };
export type { NavProps, NavLink };
