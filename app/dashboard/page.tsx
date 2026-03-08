import { createClient } from "@/lib/supabase/server";
import { Nav } from "@/components/layout/Nav";
import { Button } from "@/components/ui/Button";
import { PitchCard } from "@/components/ui/Card";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { PitchStatus } from "@/lib/types/pitch";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { WelcomeOnboarding } from "@/components/ui/WelcomeOnboarding";
import { UpgradeBanner } from "@/components/ui/UpgradeBanner";
import { Suspense } from "react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user profile from public.users
  const { data: profile } = await supabase
    .from("users")
    .select("id, name, email")
    .eq("auth_id", user.id)
    .single();

  if (!profile) {
    redirect("/login");
  }

  // Fetch subscription tier for nav
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("tier, status, current_period_end")
    .eq("user_id", user.id)
    .single();

  let tier = subscription?.tier ?? "free";
  if (
    subscription?.status === "cancelled" &&
    subscription?.current_period_end &&
    new Date(subscription.current_period_end) < new Date()
  ) {
    tier = "free";
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pitchcraft.app";

  // Fetch pitches first, then share links with actual IDs
  const { data: pitches } = await supabase
    .from("pitches")
    .select("id, project_name, logline, status, genre, budget_range, current_version, updated_at")
    .eq("user_id", profile.id)
    .is("deleted_at", null)
    .order("updated_at", { ascending: false });

  const pitchIds = (pitches ?? []).map((p) => p.id);
  const shareLinkMap = new Map<string, string>();

  if (pitchIds.length > 0) {
    const { data: links } = await supabase
      .from("share_links")
      .select("pitch_id, visibility")
      .in("pitch_id", pitchIds)
      .is("deleted_at", null);

    for (const link of links ?? []) {
      if (link.visibility === "public" || link.visibility === "password") {
        shareLinkMap.set(link.pitch_id, `${siteUrl}/p/${link.pitch_id}`);
      }
    }
  }

  const hasPitches = pitches && pitches.length > 0;

  return (
    <>
      <Nav user={profile} tier={tier} />
      <Suspense>
        <UpgradeBanner />
      </Suspense>
      <WelcomeOnboarding />
      <DashboardShell>
        <div className="max-w-[1200px] mx-auto px-[24px] py-[40px]">
          {/* Header */}
          <div className="flex items-center justify-between mb-[12px]">
            <h1
              className="font-[var(--font-heading)] text-[32px] font-bold leading-[40px] text-text-primary animate-fade-up opacity-0 [animation-fill-mode:forwards] flex items-center gap-[10px]"
            >
              Your Projects
              <span className="w-[4px] h-[4px] rounded-full bg-pop flex-shrink-0" style={{ opacity: 0.3 }} />
            </h1>
            {hasPitches && (
              <Link href="/dashboard/pitches/create">
                <Button variant="primary">Create Project</Button>
              </Link>
            )}
          </div>

          {/* Divider */}
          <div className="h-[1px] bg-border" />

          {!hasPitches ? (
            <div className="py-[80px] max-w-[440px] animate-fade-up opacity-0 [animation-fill-mode:forwards] [animation-delay:200ms]">
              <div className="font-[var(--font-mono)] text-[64px] leading-[1] font-medium text-text-disabled/20 mb-[24px]">
                00
              </div>
              <p className="font-[var(--font-heading)] text-[20px] font-semibold leading-[28px] text-text-primary mb-[8px]">
                Nothing here yet. Let&apos;s change that.
              </p>
              <p className="text-[14px] leading-[20px] text-text-secondary mb-[24px]">
                Build your first pitch — logline, vision, cast, budget, and team. Share it with one link.
              </p>
              <Link href="/dashboard/pitches/create">
                <Button variant="primary">Create your first project</Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col">
              {pitches.map((pitch, i) => (
                <div
                  key={pitch.id}
                  style={{ animationDelay: `${150 + i * 100}ms` }}
                  className="animate-fade-up opacity-0 [animation-fill-mode:forwards]"
                >
                  <PitchCard
                    pitchId={pitch.id}
                    title={pitch.project_name}
                    subtitle={pitch.logline}
                    status={pitch.status as PitchStatus}
                    genre={pitch.genre}
                    budget={pitch.budget_range}
                    version={pitch.current_version}
                    updatedAt={new Date(pitch.updated_at).toLocaleDateString()}
                    shareUrl={shareLinkMap.get(pitch.id)}
                    editHref={`/dashboard/pitches/${pitch.id}/edit`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </DashboardShell>
    </>
  );
}
