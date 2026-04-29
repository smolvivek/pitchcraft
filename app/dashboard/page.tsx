import { createClient } from "@/lib/supabase/server";
import { Nav } from "@/components/layout/Nav";
import { Button } from "@/components/ui/Button";
import { PitchCard } from "@/components/ui/Card";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { PitchStatus, BudgetRange } from "@/lib/types/pitch";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { WelcomeOnboarding } from "@/components/ui/WelcomeOnboarding";
import { UpgradeBanner } from "@/components/ui/UpgradeBanner";
import { Suspense } from "react";
import { getUserTier } from "@/lib/subscriptions/getTier";

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
  const tier = await getUserTier(supabase, user.id)

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pitchcraft.app";

  // Fetch pitches first, then share links with actual IDs
  const { data: pitches } = await supabase
    .from("pitches")
    .select("id, slug, project_name, logline, status, genre, budget_range, current_version, updated_at, project_type")
    .eq("user_id", profile.id)
    .is("deleted_at", null)
    .order("updated_at", { ascending: false });

  const pitchIds = (pitches ?? []).map((p) => p.id);
  const slugMap = new Map<string, string>();
  for (const p of pitches ?? []) {
    if (p.slug) slugMap.set(p.id, p.slug);
  }

  const shareLinkMap = new Map<string, string>();

  if (pitchIds.length > 0) {
    const { data: links } = await supabase
      .from("share_links")
      .select("pitch_id, visibility")
      .in("pitch_id", pitchIds)
      .is("deleted_at", null);

    for (const link of links ?? []) {
      if (link.visibility === "public" || link.visibility === "password") {
        const identifier = slugMap.get(link.pitch_id) ?? link.pitch_id;
        shareLinkMap.set(link.pitch_id, `${siteUrl}/p/${identifier}`);
      }
    }
  }

  const hasPitches = pitches && pitches.length > 0;

  // Fetch pitches shared with this user as a collaborator
  const { data: collabRows } = await supabase
    .from('collaborators')
    .select('pitch_id')
    .eq('user_id', profile.id)
    .eq('status', 'active')

  const collabPitchIds = (collabRows ?? []).map((r: { pitch_id: string }) => r.pitch_id)
  const sharedPitches: typeof pitches = []

  if (collabPitchIds.length > 0) {
    const { data: sp } = await supabase
      .from('pitches')
      .select('id, slug, project_name, logline, status, genre, budget_range, current_version, updated_at, project_type')
      .in('id', collabPitchIds)
      .is('deleted_at', null)
      .order('updated_at', { ascending: false })
    if (sp) sharedPitches.push(...sp)
  }

  const BUDGET_LABELS: Record<BudgetRange, string> = {
    'under-5k': 'Less than $5K',
    '5k-50k': '$5K–$50K',
    '50k-250k': '$50K–$250K',
    '250k-1m': '$250K–$1M',
    '1m-plus': '$1M+',
  };

  return (
    <>
      <Nav user={profile} tier={tier} />
      <Suspense fallback={null}>
        <UpgradeBanner />
      </Suspense>
      <WelcomeOnboarding userId={profile.id} />
      <DashboardShell>
        <div className="max-w-[960px] mx-auto px-[24px] py-[48px]">
          {/* Header */}
          <div className="flex items-end justify-between gap-[24px] mb-[32px] animate-fade-up opacity-0 [animation-fill-mode:forwards]">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-disabled mb-[8px]">
                Projects
              </p>
              <h1 className="font-heading italic text-[40px] leading-[44px] text-text-primary">
                {profile.name ? `${profile.name}'s Work` : "Your Projects"}
              </h1>
            </div>
            {hasPitches && (
              <Link href="/dashboard/pitches/create" className="shrink-0">
                <Button variant="primary">New Project</Button>
              </Link>
            )}
          </div>

          {/* Divider */}
          <div className="h-[1px] bg-white/5 mb-[16px]" />

          {!hasPitches ? (
            <div className="py-[80px] max-w-[480px] animate-fade-up opacity-0 [animation-fill-mode:forwards] [animation-delay:200ms]">
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-disabled mb-[24px]">
                00 / Start here
              </p>
              <h2 className="font-heading italic text-[28px] leading-[36px] text-text-primary mb-[12px]">
                Nothing here yet.
              </h2>
              <p className="text-[14px] leading-[22px] text-text-secondary mb-[32px]">
                Logline, vision, cast, budget — one page, one link.
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
                  style={{ animationDelay: `${100 + i * 80}ms` }}
                  className="animate-fade-up opacity-0 [animation-fill-mode:forwards]"
                >
                  <PitchCard
                    pitchId={pitch.id}
                    index={i}
                    title={pitch.project_name}
                    subtitle={pitch.logline}
                    status={pitch.status as PitchStatus}
                    genre={pitch.genre}
                    budget={BUDGET_LABELS[pitch.budget_range as BudgetRange] ?? pitch.budget_range}
                    version={pitch.current_version}
                    updatedAt={new Date(pitch.updated_at).toLocaleDateString()}
                    shareUrl={shareLinkMap.get(pitch.id)}
                    editHref={`/dashboard/pitches/${pitch.id}/edit`}
                    projectType={pitch.project_type ?? undefined}
                  />
                </div>
              ))}
            </div>
          )}
          {/* Shared with me */}
          {sharedPitches.length > 0 && (
            <div className="mt-[56px]">
              <div className="flex items-end justify-between gap-[24px] mb-[32px]">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-disabled mb-[8px]">
                    Shared with me
                  </p>
                  <h2 className="font-heading italic text-[28px] leading-[36px] text-text-primary">
                    Collaborating
                  </h2>
                </div>
              </div>
              <div className="h-[1px] bg-border mb-[4px]" />
              <div className="flex flex-col">
                {sharedPitches.map((pitch, i) => (
                  <div
                    key={pitch.id}
                    style={{ animationDelay: `${100 + i * 80}ms` }}
                    className="animate-fade-up opacity-0 [animation-fill-mode:forwards]"
                  >
                    <PitchCard
                      pitchId={pitch.id}
                      index={i}
                      title={pitch.project_name}
                      subtitle={pitch.logline}
                      status={pitch.status as PitchStatus}
                      genre={pitch.genre}
                      budget={BUDGET_LABELS[pitch.budget_range as BudgetRange] ?? pitch.budget_range}
                      version={pitch.current_version}
                      updatedAt={new Date(pitch.updated_at).toLocaleDateString()}
                      editHref={`/dashboard/pitches/${pitch.id}/edit`}
                      projectType={pitch.project_type ?? undefined}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DashboardShell>
    </>
  );
}
