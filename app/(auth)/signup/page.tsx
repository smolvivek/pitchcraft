"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gdprConsent, setGdprConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSent, setResendSent] = useState(false);

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) return "Min 8 characters required";
    if (!/[A-Z]/.test(pwd)) return "Must contain an uppercase letter";
    if (!/[a-z]/.test(pwd)) return "Must contain a lowercase letter";
    if (!/[0-9]/.test(pwd)) return "Must contain a number";
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";

    const passwordError = validatePassword(password);
    if (passwordError) newErrors.password = passwordError;

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!gdprConsent) {
      newErrors.gdprConsent = "You must agree to the Terms of Service and Privacy Policy";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name.trim(),
            gdpr_consent: gdprConsent,
            marketing_consent: marketingConsent,
          },
        },
      });

      if (error) {
        setErrors({ general: error.message });
      } else {
        setSuccess(true);
      }
    } catch {
      setErrors({ general: "An unexpected error occurred" });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      const supabase = createClient();
      await supabase.auth.resend({ type: "signup", email });
      setResendSent(true);
    } catch {
      // fail silently
    } finally {
      setResendLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col">
        <h1 className="font-heading text-[40px] leading-[1.0] tracking-[-0.02em] text-text-primary mb-[32px]">
          Check your<br />
          <span className="italic">inbox.</span>
        </h1>
        <p className="text-[14px] leading-[24px] text-text-secondary mb-[12px]">
          We sent a confirmation link to{" "}
          <span className="text-text-primary">{email}</span>.
          Click the link to log in automatically.
        </p>
        <p className="text-[14px] leading-[20px] text-text-secondary mb-[40px]">
          Didn&apos;t receive it?{" "}
          {resendSent ? (
            <span className="text-pop font-mono text-[11px] uppercase tracking-[0.1em]">Resent.</span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resendLoading}
              className="text-text-secondary hover:text-text-primary underline disabled:opacity-50 transition-colors duration-[150ms] cursor-pointer"
            >
              {resendLoading ? "Sending..." : "Resend link"}
            </button>
          )}
        </p>
        <Link
          href="/login"
          className="w-full bg-text-primary text-background font-heading text-[14px] uppercase tracking-[0.1em] font-bold py-[16px] text-center hover:opacity-90 transition-opacity duration-[150ms]"
        >
          Back to log in
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Heading */}
      <h1 className="font-heading text-[48px] leading-[1.0] tracking-[-0.02em] text-text-primary mb-[48px]">
        Start<br />
        <span className="italic">building.</span>
      </h1>

      {errors.general && (
        <div className="mb-[32px] border-l-2 border-pop pl-[16px]">
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-pop">{errors.general}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-[28px]">
        {/* Name */}
        <div className="flex flex-col gap-[8px]">
          <label htmlFor="signup-name" className="font-mono text-[9px] uppercase tracking-[0.2em] text-text-disabled">
            Name
          </label>
          <input
            id="signup-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
            className="bg-transparent border-b border-white/20 focus:border-white/60 text-text-primary text-[15px] py-[10px] outline-none placeholder:text-text-disabled transition-colors duration-[150ms]"
            placeholder="Your name"
          />
          {errors.name && (
            <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-pop">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-[8px]">
          <label htmlFor="signup-email" className="font-mono text-[9px] uppercase tracking-[0.2em] text-text-disabled">
            Email
          </label>
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="bg-transparent border-b border-white/20 focus:border-white/60 text-text-primary text-[15px] py-[10px] outline-none placeholder:text-text-disabled transition-colors duration-[150ms]"
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-pop">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-[8px]">
          <label htmlFor="signup-password" className="font-mono text-[9px] uppercase tracking-[0.2em] text-text-disabled">
            Password
          </label>
          <input
            id="signup-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            className="bg-transparent border-b border-white/20 focus:border-white/60 text-text-primary text-[15px] py-[10px] outline-none placeholder:text-text-disabled transition-colors duration-[150ms]"
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-pop">{errors.password}</p>
          )}
          <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-text-disabled">
            8+ chars · uppercase · lowercase · number
          </p>
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-[8px]">
          <label htmlFor="signup-confirm-password" className="font-mono text-[9px] uppercase tracking-[0.2em] text-text-disabled">
            Confirm password
          </label>
          <input
            id="signup-confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            className="bg-transparent border-b border-white/20 focus:border-white/60 text-text-primary text-[15px] py-[10px] outline-none placeholder:text-text-disabled transition-colors duration-[150ms]"
            placeholder="••••••••"
          />
          {errors.confirmPassword && (
            <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-pop">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Consent */}
        <div className="flex flex-col gap-[12px] pt-[4px]">
          <label className="flex items-start gap-[12px] cursor-pointer">
            <input
              type="checkbox"
              checked={gdprConsent}
              onChange={(e) => setGdprConsent(e.target.checked)}
              required
              className="mt-[3px] accent-pop shrink-0"
            />
            <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-text-disabled leading-[18px]">
              I agree to the{" "}
              <a href="/terms" target="_blank" className="text-text-secondary hover:text-text-primary underline transition-colors">
                Terms
              </a>{" "}
              and{" "}
              <a href="/privacy" target="_blank" className="text-text-secondary hover:text-text-primary underline transition-colors">
                Privacy Policy
              </a>
            </span>
          </label>
          {errors.gdprConsent && (
            <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-pop -mt-[4px]">{errors.gdprConsent}</p>
          )}

          <label className="flex items-start gap-[12px] cursor-pointer">
            <input
              type="checkbox"
              checked={marketingConsent}
              onChange={(e) => setMarketingConsent(e.target.checked)}
              className="mt-[3px] accent-pop shrink-0"
            />
            <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-text-disabled leading-[18px]">
              Send occasional updates
            </span>
          </label>
        </div>

        {/* CTA */}
        <button
          type="submit"
          disabled={loading}
          className="mt-[8px] w-full bg-text-primary text-background font-heading text-[14px] uppercase tracking-[0.1em] font-bold py-[16px] hover:opacity-90 disabled:opacity-50 transition-opacity duration-[150ms] cursor-pointer"
        >
          {loading ? "Creating account..." : "Sign up"}
        </button>
      </form>

      <div className="mt-[32px] pt-[32px] border-t border-white/5 text-center">
        <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-text-disabled">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-text-secondary hover:text-text-primary transition-colors duration-[150ms]"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
