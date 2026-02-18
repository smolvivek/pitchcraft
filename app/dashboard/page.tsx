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
    .select("id, logline, status, genre, budget_range, current_version, updated_at")
    .eq("user_id", profile.id)
    .is("deleted_at", null)
    .order("updated_at", { ascending: false });

  return (
    <>
      <Nav user={profile} />
      <DashboardShell>
        <div className="max-w-[1200px] mx-auto px-[24px] py-[40px]">
          <div className="flex items-center justify-between mb-[32px]">
            <h1 className="font-[var(--font-heading)] text-[32px] font-bold leading-[40px] text-text-primary">
              Your Projects
            </h1>
            <Link href="/dashboard/pitches/create">
              <Button variant="primary">Create Project</Button>
            </Link>
          </div>

          {!pitches || pitches.length === 0 ? (
            <div className="text-center py-[80px]">
              <p className="text-[16px] leading-[24px] text-text-secondary">
                Nothing here. Time to fix that.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
              {pitches.map((pitch, i) => (
                <Link key={pitch.id} href={`/dashboard/pitches/${pitch.id}/edit`}>
                  <div
                    style={{
                      animationDelay: `${i * 80}ms`,
                    }}
                    className="animate-fade-up opacity-0 [animation-fill-mode:forwards]"
                  >
                    <PitchCard
                      title={pitch.logline}
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
