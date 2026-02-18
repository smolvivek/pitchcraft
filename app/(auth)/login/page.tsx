"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/Input";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError("Invalid email or password");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-border rounded-[4px] p-[32px]">
      <h2 className="font-[var(--font-heading)] text-[24px] font-bold leading-[32px] text-text-primary mb-[24px]">
        Welcome back
      </h2>

      {error && (
        <div className="mb-[24px] p-[16px] bg-error/10 border border-error rounded-[4px]">
          <p className="text-[14px] leading-[20px] text-error">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-[16px]">
        <TextInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <TextInput
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="text-right">
          <Link
            href="/reset-password"
            className="text-[14px] leading-[20px] text-link hover:underline font-medium"
          >
            Reset password
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          className="w-full"
        >
          {loading ? "Logging in..." : "Log in"}
        </Button>

        <div className="text-center mt-[8px]">
          <p className="text-[14px] leading-[20px] text-text-secondary">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-link hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
