import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LandingHero } from "@/components/landing/LandingHero";
import { MarqueeSection } from "@/components/landing/MarqueeSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { CTASection } from "@/components/landing/CTASection";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("users")
      .select("name, email")
      .eq("auth_id", user.id)
      .single();
    profile = data;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-surface">
      {/* Navigation */}
      <nav className="fixed top-[24px] left-[24px] z-50">
        {user && profile ? (
          <Link
            href="/dashboard"
            className="font-[var(--font-mono)] text-[13px] leading-[20px] text-text-primary hover:opacity-70 transition-opacity duration-[200ms] ease-out"
          >
            Dashboard
          </Link>
        ) : (
          <div className="flex gap-[24px]">
            <Link
              href="/login"
              className="font-[var(--font-mono)] text-[13px] leading-[20px] text-text-primary hover:opacity-70 transition-opacity duration-[200ms] ease-out"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="font-[var(--font-mono)] text-[13px] leading-[20px] text-accent-visual hover:opacity-70 transition-opacity duration-[200ms] ease-out"
            >
              Sign up
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <LandingHero />

      {/* Marquee Section */}
      <MarqueeSection />

      {/* What It Does */}
      <FeaturesSection />

      {/* Final CTA */}
      <CTASection />
    </div>
  );
}
