import { createClient } from "@/lib/supabase/server";
import { Nav } from "@/components/layout/Nav";
import { Button } from "@/components/ui/Button";
import { PitchCard } from "@/components/ui/Card";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { PitchStatus } from "@/lib/types/pitch";
import { DashboardShell } from "@/components/layout/DashboardShell";

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

  // Fetch pitches
  const { data: pitches } = await supabase
    .from("pitches")
    .select("id, project_name, logline, status, genre, budget_range, current_version, updated_at")
    .eq("user_id", profile.id)
    .is("deleted_at", null)
    .order("updated_at", { ascending: false });

  const hasPitches = pitches && pitches.length > 0;

  return (
    <>
      <Nav user={profile} />
      <DashboardShell>
        <div className="max-w-[1200px] mx-auto px-[24px] py-[40px]">
          {/* Header */}
          <div className="flex items-center justify-between mb-[12px]">
            <h1
              className="font-[var(--font-heading)] text-[32px] font-bold leading-[40px] text-text-primary animate-fade-up opacity-0 [animation-fill-mode:forwards] flex items-center gap-[10px]"
            >
              Your Projects
              <span className="w-[4px] h-[4px] rounded-full bg-pop animate-led-breathe flex-shrink-0" style={{ opacity: 0.3 }} />
            </h1>
            {hasPitches && (
              <div className="animate-slide-in-right opacity-0 [animation-fill-mode:forwards] [animation-delay:200ms]">
                <Link href="/dashboard/pitches/create">
                  <Button variant="primary">Create Project</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-[1px] bg-border mb-[32px]" />

          {!hasPitches ? (
            <div className="py-[80px] max-w-[440px] animate-fade-up opacity-0 [animation-fill-mode:forwards] [animation-delay:200ms]">
              <div className="font-[var(--font-mono)] text-[64px] leading-[1] font-medium text-text-disabled/20 mb-[24px] animate-micro-pulse">
                00
              </div>
              <p className="font-[var(--font-heading)] text-[20px] font-semibold leading-[28px] text-text-primary mb-[8px]">
                No projects yet
              </p>
              <p className="text-[14px] leading-[20px] text-text-secondary mb-[24px]">
                Build your first pitch — logline, vision, cast, budget, and team. Share it with one link.
              </p>
              <Link href="/dashboard/pitches/create">
                <Button variant="primary">Create your first project</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
              {pitches.map((pitch, i) => (
                <Link key={pitch.id} href={`/dashboard/pitches/${pitch.id}/edit`}>
                  <div
                    style={{
                      animationDelay: `${150 + i * 100}ms`,
                    }}
                    className="animate-fade-up opacity-0 [animation-fill-mode:forwards] relative"
                  >
                    <span
                      className="absolute top-[10px] right-[10px] w-[3px] h-[3px] rounded-full bg-pop animate-led-breathe z-10"
                      style={{ animationDelay: `${i * 1.3}s`, opacity: 0.3 }}
                    />
                    <PitchCard
                      title={pitch.project_name}
                      subtitle={pitch.logline}
                      status={pitch.status as PitchStatus}
                      genre={pitch.genre}
                      budget={pitch.budget_range}
                      version={pitch.current_version}
                      updatedAt={new Date(pitch.updated_at).toLocaleDateString()}
                    />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </DashboardShell>
    </>
  );
}
