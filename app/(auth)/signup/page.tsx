"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { TextInput, Checkbox } from "@/components/ui/Input";
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

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(pwd)) return "Password must contain an uppercase letter";
    if (!/[a-z]/.test(pwd)) return "Password must contain a lowercase letter";
    if (!/[0-9]/.test(pwd)) return "Password must contain a number";
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Client-side validation
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

  if (success) {
    return (
      <div className="bg-surface border border-border rounded-[4px] p-[32px]">
        <h2 className="font-[var(--font-heading)] text-[24px] font-bold leading-[32px] text-text-primary mb-[16px]">
          Check your inbox
        </h2>
        <p className="text-[14px] leading-[24px] text-text-secondary mb-[24px]">
          We&apos;ve sent you a confirmation link. Please check your inbox and click the link to activate your account.
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
    <div className="bg-surface border border-border rounded-[4px] p-[32px]">
      <h2 className="font-[var(--font-heading)] text-[24px] font-bold leading-[32px] text-text-primary mb-[8px]">
        Start building
      </h2>
      <p className="text-[14px] leading-[20px] text-text-secondary mb-[24px]">
        Create your Pitchcraft account to build and share your first project.
      </p>

      {errors.general && (
        <div className="mb-[24px] p-[16px] bg-error/10 border border-error rounded-[4px]">
          <p className="text-[14px] leading-[20px] text-error">{errors.general}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-[16px]">
        <TextInput
          label="Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          required
        />

        <TextInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          required
        />

        <TextInput
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          helpText="8+ characters, uppercase, lowercase, and number"
          required
        />

        <TextInput
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
          required
        />

        <div className="flex flex-col gap-[12px] mt-[8px]">
          <Checkbox
            label={
              <>
                I agree to the{" "}
                <a href="/terms" target="_blank" className="text-link underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" target="_blank" className="text-link underline">
                  Privacy Policy
                </a>
              </>
            }
            checked={gdprConsent}
            onChange={(e) => setGdprConsent(e.target.checked)}
            required
          />
          {errors.gdprConsent && (
            <p className="text-[14px] leading-[20px] text-error -mt-[8px]">{errors.gdprConsent}</p>
          )}

          <Checkbox
            label="I want to receive occasional updates"
            checked={marketingConsent}
            onChange={(e) => setMarketingConsent(e.target.checked)}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          className="w-full mt-[8px]"
        >
          {loading ? "Signing up..." : "Sign up"}
        </Button>

        <div className="text-center mt-[8px]">
          <p className="text-[14px] leading-[20px] text-text-secondary">
            Already have an account?{" "}
            <Link href="/login" className="text-link hover:underline font-medium">
              Log in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
