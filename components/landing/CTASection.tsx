"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function CTASection() {
  return (
    <section className="py-[120px] px-[24px]">
      <div className="max-w-[1200px] mx-auto text-center">
        <h2 className="font-[var(--font-heading)] text-[48px] md:text-[64px] font-semibold leading-[1.1] text-text-primary mb-[32px]">
          Your first project starts here.
        </h2>
        <Link href="/signup">
          <Button variant="primary">Get Started</Button>
        </Link>
      </div>
    </section>
  );
}
