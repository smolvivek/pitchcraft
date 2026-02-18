import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LandingHero } from "@/components/landing/LandingHero";

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
    <div className="min-h-screen bg-background">
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
