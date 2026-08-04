"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "@/actions/auth";
import { signInSchema, type SignInValues } from "@/features/auth/schemas";
import { BrandLogo } from "@/components/ui/brand-logo";
import { cn } from "@/lib/cn";

const REMEMBER_EMAIL_KEY = "stratifit-remember-email";

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cn("text-sm", className)}
      height="1em"
      width="1em"
    >
      <path
        fillRule="evenodd"
        d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="text-sm text-primary"
      height="1em"
      width="1em"
    >
      <path
        fillRule="evenodd"
        d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08Zm3.094 8.016a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="size-3"
    >
      <path
        fillRule="evenodd"
        d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

const fieldBase =
  "h-12 w-full rounded-card border border-field-border bg-field-bg px-4 text-sm text-field-text placeholder:text-field-placeholder outline-none transition-[border-color,background-color] duration-[var(--motion-fast)] ease-[var(--ease-standard)] focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(245,158,11,0.10)] aria-[invalid=true]:border-error/60";

export default function AdminLoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [rememberEmail, setRememberEmail] = React.useState(
    () =>
      typeof window !== "undefined" &&
      window.localStorage.getItem(REMEMBER_EMAIL_KEY) !== null
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  // Prefill the remembered email once on mount.
  React.useEffect(() => {
    try {
      const remembered = window.localStorage.getItem(REMEMBER_EMAIL_KEY);
      if (remembered) {
        setValue("email", remembered);
      }
    } catch {
      // Storage unavailable — ignore.
    }
  }, [setValue]);

  async function onSubmit(values: SignInValues) {
    setServerError(null);
    const result = await signIn(values);
    if (result.success) {
      try {
        if (rememberEmail) {
          window.localStorage.setItem(REMEMBER_EMAIL_KEY, values.email);
        } else {
          window.localStorage.removeItem(REMEMBER_EMAIL_KEY);
        }
      } catch {
        // Storage unavailable — ignore.
      }
      router.push("/admin/dashboard");
      router.refresh();
    } else {
      setServerError(result.error);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-24">
      {/* Ambient amber glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-[150px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[500px] rounded-full bg-primary/[0.03] blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header — Stratifit logo + intro */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 w-48 sm:w-52">
            <BrandLogo alt="Stratifit" priority />
          </div>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.28em] text-primary sm:text-xs">
            Admin Login
          </p>
          <h1 className="font-display text-3xl font-black tracking-tight text-text-primary">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            Sign in to manage the Stratifit dashboard.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-card border border-white/10 bg-card-dark p-7 shadow-2xl"
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-xs font-medium text-text-secondary sm:text-sm"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="admin@stratifit.com"
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={fieldBase}
                {...register("email")}
              />
              {errors.email ? (
                <p id="email-error" className="mt-1.5 text-xs text-error">
                  {errors.email.message}
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-xs font-medium text-text-secondary sm:text-sm"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                aria-invalid={errors.password ? true : undefined}
                aria-describedby={errors.password ? "password-error" : undefined}
                className={fieldBase}
                {...register("password")}
              />
              {errors.password ? (
                <p id="password-error" className="mt-1.5 text-xs text-error">
                  {errors.password.message}
                </p>
              ) : null}
            </div>

            {/* Remember me */}
            <label className="flex cursor-pointer select-none items-center gap-2.5">
              <span
                suppressHydrationWarning
                className={cn(
                  "flex size-4 shrink-0 items-center justify-center rounded border transition-all duration-150",
                  rememberEmail
                    ? "border-primary bg-primary text-text-inverse"
                    : "border-white/20"
                )}
              >
                {rememberEmail ? <CheckIcon /> : null}
              </span>
              <span className="text-xs text-text-muted">Remember me</span>
              <input
                type="checkbox"
                className="sr-only"
                checked={rememberEmail}
                suppressHydrationWarning
                onChange={(event) => setRememberEmail(event.target.checked)}
              />
            </label>
          </div>

          {serverError ? (
            <p
              role="alert"
              className="mt-4 rounded-lg bg-error-soft px-3 py-2 text-sm text-error"
            >
              {serverError}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="group mt-5 inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-button bg-primary px-5 text-sm font-bold text-text-inverse transition-[background-color,box-shadow,transform] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-[0_12px_32px_rgba(245,158,11,0.18)] focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-primary/35 focus-visible:outline-offset-2 active:translate-y-0 active:bg-primary-active disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Signing in…" : "Sign in"}
            <ArrowRightIcon className="transition-transform duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-hover:translate-x-1" />
          </button>

          <div className="mt-5 flex items-center justify-center gap-2 font-mono text-[10px] text-text-subtle sm:justify-start">
            <ShieldIcon />
            Built by Stratifit
          </div>
        </form>

        <p className="mt-6 text-center text-[10px] text-text-subtle">
          <Link
            href="/"
            className="transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:text-primary"
          >
            ← Back to site
          </Link>
        </p>
      </div>
    </main>
  );
}
