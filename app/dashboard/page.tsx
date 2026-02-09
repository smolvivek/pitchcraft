import { createClient } from "@/lib/supabase/server";
import { MonoText } from "@/components/ui/MonoText";
import { Nav } from "@/components/layout/Nav";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user profile from public.users
  const { data: profile } = await supabase
    .from("users")
    .select("name, email")
    .eq("auth_id", user.id)
    .single();

  return (
    <>
      <Nav user={profile} />
      <div className="min-h-screen bg-background">
        <div className="max-w-[1200px] mx-auto px-[24px] py-[40px]">
          <div className="bg-white border border-border rounded-[8px] p-[40px]">
            <h1 className="font-[var(--font-heading)] text-[32px] font-bold leading-[40px] text-text-primary mb-[24px]">
              Welcome, {profile?.name || "there"}
            </h1>

            <div className="mb-[32px]">
              <MonoText className="text-[14px] text-text-secondary">
                {profile?.email || user.email}
              </MonoText>
            </div>

            <p className="text-[14px] leading-[20px] text-text-secondary">
              This is a placeholder dashboard. Feature 3 will add pitch management here.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
