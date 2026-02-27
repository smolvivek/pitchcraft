import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LandingHero } from "@/components/landing/LandingHero";

export default async function Home() {
  let user = null;
  let profile = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data?.user ?? null;

    if (user) {
      const { data: profileData } = await supabase
        .from("users")
        .select("name, email")
        .eq("auth_id", user.id)
        .single();
      profile = profileData;
    }
  } catch {
    // Supabase unreachable — render as logged-out
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pitchcraft.app";
  const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Pitchcraft",
    url: siteUrl,
    description: "Present, fund, and evolve your creative work.",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
      />
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[24px] md:px-[48px] h-[64px]">
        <Link
          href="/"
          className="font-[var(--font-heading)] text-[18px] font-semibold text-text-primary"
        >
          Pitchcraft
        </Link>
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
              className="font-[var(--font-mono)] text-[13px] leading-[20px] text-text-primary hover:opacity-70 transition-opacity duration-[200ms] ease-out"
            >
              Sign up
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <LandingHero />
    </div>
  );
}
