import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Nav } from "@/components/layout/Nav";
import { createClient } from "@/lib/supabase/server";

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
    <>
      <Nav user={profile} />
      <Container className="py-[64px]">
        <div className="flex flex-col items-center text-center gap-[24px]">
          <h1 className="font-heading text-[32px] font-semibold leading-[40px] text-text-primary">
            Pitchcraft
          </h1>
          <p className="text-[16px] leading-[24px] text-text-secondary max-w-[480px]">
            Present, fund, and evolve your creative work.
          </p>
          <Link
            href="/design"
            className="inline-flex items-center justify-center px-[24px] py-[12px] bg-accent-btn text-white rounded-[4px] text-[14px] font-semibold leading-[20px] hover:bg-accent-btn-hover active:bg-accent-btn-active transition-colors duration-[200ms] ease-out"
          >
            View design system
          </Link>
        </div>
      </Container>
    </>
  );
}
