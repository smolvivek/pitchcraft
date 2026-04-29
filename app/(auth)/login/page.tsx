"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: Record<string, string> = {};
    if (!email.trim()) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
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
        setErrors({ password: "Incorrect email or password" });
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setErrors({ general: "Something went wrong. Try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Heading */}
      <h1 className="font-heading text-[48px] leading-[1.0] tracking-[-0.02em] text-text-primary mb-[48px]">
        Welcome<br />
        <span className="italic">back.</span>
      </h1>

      {errors.general && (
        <div className="mb-[32px] border-l-2 border-pop pl-[16px]">
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-pop">{errors.general}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-[32px]">
        {/* Email field */}
        <div className="flex flex-col gap-[8px]">
          <label htmlFor="login-email" className="font-mono text-[9px] uppercase tracking-[0.2em] text-text-disabled">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className={`bg-transparent border-b text-text-primary text-[15px] py-[10px] outline-none placeholder:text-text-disabled transition-colors duration-[150ms] ${
              errors.email ? "border-pop" : "border-white/20 focus:border-white/60"
            }`}
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-pop">{errors.email}</p>
          )}
        </div>

        {/* Password field */}
        <div className="flex flex-col gap-[8px]">
          <div className="flex items-center justify-between">
            <label htmlFor="login-password" className="font-mono text-[9px] uppercase tracking-[0.2em] text-text-disabled">
              Password
            </label>
            <Link
              href="/reset-password"
              className="font-mono text-[9px] uppercase tracking-[0.15em] text-text-disabled hover:text-text-secondary transition-colors duration-[150ms]"
            >
              Reset password
            </Link>
          </div>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className={`bg-transparent border-b text-text-primary text-[15px] py-[10px] outline-none placeholder:text-text-disabled transition-colors duration-[150ms] ${
              errors.password ? "border-pop" : "border-white/20 focus:border-white/60"
            }`}
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-pop">{errors.password}</p>
          )}
        </div>

        {/* CTA */}
        <button
          type="submit"
          disabled={loading}
          className="mt-[8px] w-full bg-text-primary text-background font-heading text-[14px] uppercase tracking-[0.1em] font-bold py-[16px] hover:opacity-90 disabled:opacity-50 transition-opacity duration-[150ms] cursor-pointer"
        >
          {loading ? "Logging In..." : "Log In"}
        </button>
      </form>

      <div className="mt-[32px] pt-[32px] border-t border-white/5 text-center">
        <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-text-disabled">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-text-secondary hover:text-text-primary transition-colors duration-[150ms]"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
