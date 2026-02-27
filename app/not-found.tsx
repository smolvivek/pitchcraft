import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-[24px]">
      <div className="max-w-[400px] w-full text-center">
        <span className="font-[var(--font-mono)] text-[80px] leading-[1] font-medium text-border/60 block mb-[24px]">
          404
        </span>
        <h1 className="font-[var(--font-heading)] text-[24px] font-semibold leading-[32px] tracking-[-0.02em] text-text-primary mb-[8px]">
          Page not found
        </h1>
        <p className="font-[var(--font-body)] text-[14px] leading-[20px] text-text-secondary mb-[32px]">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/">
          <Button variant="primary">Back to Pitchcraft</Button>
        </Link>
      </div>
    </div>
  );
}
