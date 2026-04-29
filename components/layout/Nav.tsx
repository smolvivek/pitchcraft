"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface NavLink {
  label: string;
  href: string;
  active?: boolean;
}

interface User {
  name: string;
  email: string;
}

interface NavProps {
  links?: NavLink[];
  user?: User | null;
  tier?: string;
}

function Nav({ links = [], user = null, tier }: NavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[72px] bg-background/90 backdrop-blur-sm border-b border-white/5 px-[48px] md:px-[96px]">
      <div className="max-w-[1200px] mx-auto h-full flex items-center">
      {/* Logo */}
      <Link
        href="/"
        className="font-heading font-bold text-[20px] tracking-tighter uppercase text-text-primary"
      >
        Pitchcraft
      </Link>

      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-[40px] ml-auto">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`
              font-heading text-[15px] tracking-tighter uppercase font-light
              transition-colors duration-[200ms] ease-out
              ${link.active
                ? "text-text-primary border-b border-pop pb-[2px]"
                : "text-text-secondary hover:text-text-primary"
              }
            `}
          >
            {link.label}
          </Link>
        ))}

        <div className="flex items-center gap-[24px]">
          {user ? (
            <>
              <Link
                href="/dashboard/account"
                className="font-heading text-[15px] tracking-tighter uppercase font-light text-text-secondary hover:text-text-primary transition-colors duration-[200ms]"
              >
                {user.name}
              </Link>
              {(!tier || tier === "free") && (
                <Link
                  href="/pricing"
                  className="font-heading text-[15px] tracking-tighter uppercase font-light text-text-secondary hover:text-text-primary transition-colors duration-[200ms]"
                >
                  Upgrade
                </Link>
              )}
              <button
                onClick={handleSignOut}
                className="font-heading text-[15px] tracking-tighter uppercase font-light text-text-secondary hover:text-text-primary transition-colors duration-[200ms] cursor-pointer"
              >
                Sign Out
              </button>
              <Link
                href="/dashboard/pitches/create"
                className="bg-text-primary text-background px-[24px] py-[10px] font-heading text-[15px] tracking-tighter uppercase font-bold hover:opacity-90 transition-opacity duration-[150ms]"
              >
                New Project
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="font-heading text-[15px] tracking-tighter uppercase font-light text-text-secondary hover:text-text-primary transition-colors duration-[200ms]"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="bg-text-primary text-background px-[24px] py-[10px] font-heading text-[15px] tracking-tighter uppercase font-bold hover:opacity-90 transition-opacity duration-[150ms]"
              >
                Join
              </Link>
            </>
          )}
        </div>
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
      </div>{/* end max-w wrapper */}

      {/* Mobile menu — full-width, outside wrapper */}
      {mobileOpen && (
        <div className="absolute top-[72px] left-0 right-0 bg-background border-b border-white/5 z-40 md:hidden animate-[fade-in_150ms_ease-out]">
          <div className="flex flex-col px-[24px] py-[16px] gap-[4px]">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  py-[12px] font-heading text-[15px] tracking-tighter uppercase font-light
                  transition-colors duration-[200ms] ease-out border-b border-white/5 last:border-0
                  ${link.active ? "text-text-primary" : "text-text-secondary hover:text-text-primary"}
                `}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <div className="flex flex-col gap-[4px] pt-[8px]">
                <Link
                  href="/dashboard/account"
                  onClick={() => setMobileOpen(false)}
                  className="py-[12px] font-heading text-[15px] tracking-tighter uppercase font-light text-text-secondary hover:text-text-primary transition-colors border-b border-white/5"
                >
                  {user.name}
                </Link>
                <Link
                  href="/pricing"
                  onClick={() => setMobileOpen(false)}
                  className="py-[12px] font-heading text-[15px] tracking-tighter uppercase font-light text-text-secondary hover:text-text-primary transition-colors border-b border-white/5"
                >
                  {(!tier || tier === "free") ? "Upgrade" : "Pricing"}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="py-[12px] font-heading text-[15px] tracking-tighter uppercase font-light text-text-secondary hover:text-text-primary transition-colors text-left border-b border-white/5 cursor-pointer"
                >
                  Sign Out
                </button>
                <Link
                  href="/dashboard/pitches/create"
                  onClick={() => setMobileOpen(false)}
                  className="mt-[16px] bg-text-primary text-background px-[24px] py-[12px] font-heading text-[15px] tracking-tighter uppercase font-bold hover:opacity-90 transition-opacity text-center"
                >
                  New Project
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-[12px] pt-[16px]">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="py-[12px] font-heading text-[15px] tracking-tighter uppercase font-light text-text-secondary hover:text-text-primary transition-colors text-center border-b border-white/5"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="bg-text-primary text-background px-[24px] py-[12px] font-heading text-[15px] tracking-tighter uppercase font-bold hover:opacity-90 transition-opacity text-center"
                >
                  Join
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export { Nav };
export type { NavProps, NavLink };
