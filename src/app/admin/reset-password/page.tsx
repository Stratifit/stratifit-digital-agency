"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPassword } from "@/actions/auth";
import {
  resetPasswordSchema,
  type ResetPasswordValues,
} from "@/features/auth/schemas";
import { BrandLogo } from "@/components/ui/brand-logo";

const fieldBase =
  "h-12 w-full rounded-card border border-field-border bg-field-bg px-4 text-sm text-field-text placeholder:text-field-placeholder outline-none transition-[border-color,background-color] duration-[var(--motion-fast)] ease-[var(--ease-standard)] focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(245,158,11,0.10)] aria-[invalid=true]:border-error/60";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [done, setDone] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function onSubmit(values: ResetPasswordValues) {
    setServerError(null);
    const result = await resetPassword(values);
    if (result.success) {
      setDone(true);
      router.push("/admin/login");
      router.refresh();
    } else {
      setServerError(result.error);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-[150px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[500px] rounded-full bg-primary/[0.03] blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        <div className="mb-9 flex flex-col items-center text-center">
          <Link
            href="/"
            aria-label="Back to the Stratifit website"
            className="inline-flex w-52 items-center justify-center rounded-card transition-transform duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:scale-[1.02] focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-primary/35 focus-visible:outline-offset-4"
          >
            <BrandLogo alt="Stratifit" />
          </Link>
          <h1 className="mt-8 font-display text-3xl font-black tracking-tight text-text-primary sm:text-4xl">
            Set a new password
          </h1>
          <p className="mt-2.5 max-w-[280px] text-sm leading-relaxed text-text-muted">
            Choose a new password for your admin account.
          </p>
        </div>

        <div className="rounded-card border border-white/10 bg-card-dark p-7 shadow-2xl">
          {done ? (
            <div className="text-center">
              <p className="text-sm leading-relaxed text-text-secondary">
                Your password has been updated.
              </p>
              <Link
                href="/admin/login"
                className="mt-6 inline-flex h-11 items-center justify-center rounded-button bg-primary px-5 text-sm font-bold text-text-inverse transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-primary-hover focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-primary/35 focus-visible:outline-offset-2"
              >
                Sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-xs font-medium text-text-secondary sm:text-sm"
                >
                  New password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  aria-invalid={errors.password ? true : undefined}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                  className={fieldBase}
                  {...register("password")}
                />
                {errors.password ? (
                  <p id="password-error" className="mt-1.5 text-xs text-error">
                    {errors.password.message}
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-1.5 block text-xs font-medium text-text-secondary sm:text-sm"
                >
                  Confirm new password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  aria-invalid={errors.confirmPassword ? true : undefined}
                  aria-describedby={
                    errors.confirmPassword ? "confirm-error" : undefined
                  }
                  className={fieldBase}
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword ? (
                  <p id="confirm-error" className="mt-1.5 text-xs text-error">
                    {errors.confirmPassword.message}
                  </p>
                ) : null}
              </div>

              {serverError ? (
                <p
                  role="alert"
                  className="rounded-lg bg-error-soft px-3 py-2 text-sm text-error"
                >
                  {serverError}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-12 w-full items-center justify-center rounded-button bg-primary px-5 text-sm font-bold text-text-inverse transition-[background-color,box-shadow,transform] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-[0_12px_32px_rgba(245,158,11,0.18)] focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-primary/35 focus-visible:outline-offset-2 active:translate-y-0 active:bg-primary-active disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Updating…" : "Update password"}
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-[10px] text-text-subtle">
          <Link
            href="/admin/login"
            className="transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:text-primary"
          >
            ← Back to sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
