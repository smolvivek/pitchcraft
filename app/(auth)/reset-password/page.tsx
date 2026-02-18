"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/Input";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email.trim()) return;

    setLoading(true);

    try {
      const supabase = createClient();
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      // Always show success (don't reveal if email exists)
      setSuccess(true);
    } catch {
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white border border-border rounded-[4px] p-[32px]">
        <h2 className="font-[var(--font-heading)] text-[24px] font-bold leading-[32px] text-text-primary mb-[16px]">
          Check your inbox
        </h2>
        <p className="text-[14px] leading-[24px] text-text-secondary mb-[24px]">
          If an account exists with that email, we&apos;ve sent you a link to reset your password.
        </p>
        <Link href="/login">
          <Button variant="primary" className="w-full">
            Back to login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white border border-border rounded-[4px] p-[32px]">
      <h2 className="font-[var(--font-heading)] text-[24px] font-bold leading-[32px] text-text-primary mb-[16px]">
        Reset password
      </h2>
      <p className="text-[14px] leading-[24px] text-text-secondary mb-[24px]">
        Enter your email address and we&apos;ll send you a link to reset your password.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-[16px]">
        <TextInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          className="w-full"
        >
          {loading ? "Sending..." : "Send reset link"}
        </Button>

        <div className="text-center mt-[8px]">
          <Link
            href="/login"
            className="text-[14px] leading-[20px] text-link hover:underline font-medium"
          >
            Back to login
          </Link>
        </div>
      </form>
    </div>
  );
}
