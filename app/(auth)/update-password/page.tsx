"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/Input";
import { useRouter } from "next/navigation";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

    const newErrors: Record<string, string> = {};

    const passwordError = validatePassword(password);
    if (passwordError) newErrors.password = passwordError;

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setErrors({ general: error.message });
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setErrors({ general: "An unexpected error occurred" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface border border-border rounded-none p-[32px]">
      <h2 className="font-heading text-[24px] font-bold leading-[32px] text-text-primary mb-[16px]">
        Set new password
      </h2>
      <p className="text-[14px] leading-[24px] text-text-secondary mb-[24px]">
        Enter your new password below.
      </p>

      {errors.general && (
        <div className="mb-[24px] border-l-2 border-pop pl-[16px]">
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-pop">{errors.general}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-[16px]">
        <TextInput
          label="New Password"
          type="password"
          variant="underline"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          helpText="8+ characters, uppercase, lowercase, and number"
          required
        />

        <TextInput
          label="Confirm Password"
          type="password"
          variant="underline"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
          required
        />

        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          className="w-full mt-[8px]"
        >
          {loading ? "Updating..." : "Update password"}
        </Button>
      </form>
    </div>
  );
}
