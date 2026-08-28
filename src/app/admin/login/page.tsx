"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, signInWithGoogle } from "@/actions/auth";
import { signInSchema, type SignInValues } from "@/features/auth/schemas";
import { cn } from "@/lib/cn";
import { BrandLogo } from "@/components/ui/brand-logo";

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
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-3">
      <path
        fillRule="evenodd"
        d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.94l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

const fieldBase =
  "h-12 w-full rounded-card border border-field-border bg-field-bg px-4 text-sm text-field-text placeholder:text-field-placeholder outline-none transition-[border-color,background-color] duration-[var(--motion-fast)] ease-[var(--ease-standard)] focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(245,158,11,0.10)] aria-[invalid=true]:border-error/60";

export default function AdminLoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [googleError, setGoogleError] = React.useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
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

  async function handleGoogleSignIn() {
    setGoogleError(null);
    setIsGoogleLoading(true);
    // On success this redirects to Google; the awaited result only resolves
    // when the provider could not be started.
    const result = await signInWithGoogle();
    if (!result.success) {
      setGoogleError(result.error);
    }
    setIsGoogleLoading(false);
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

      <div className="relative z-10 w-full max-w-sm">
        {/* Header — brand logo + intro */}
        <div className="mb-9 flex flex-col items-center text-center">
          <Link
            href="/"
            aria-label="Back to the Stratifit website"
            className="inline-flex w-52 items-center justify-center rounded-card transition-transform duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:scale-[1.02] focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-primary/35 focus-visible:outline-offset-4"
          >
            <BrandLogo alt="Stratifit" />
          </Link>

          {/* Hairline divider framing the access badge */}
          <div className="mt-8 flex w-full items-center gap-4">
            <span
              aria-hidden="true"
              className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/25"
            />
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.06] px-4 py-1.5">
              <ShieldIcon />
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
                Admin Login
              </span>
            </span>
            <span
              aria-hidden="true"
              className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/25"
            />
          </div>

          <h1 className="mt-7 font-display text-3xl font-black tracking-tight text-text-primary sm:text-4xl">
            Welcome back
          </h1>
          <p className="mt-2.5 max-w-[280px] text-sm leading-relaxed text-text-muted">
            Sign in to continue to the Stratifit dashboard.
          </p>
        </div>

        <div className="rounded-card border border-white/10 bg-card-dark p-7 shadow-2xl">
          {/* Google sign-in */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="flex h-12 w-full items-center justify-center gap-3 rounded-button border border-white/10 bg-white text-sm font-semibold text-text-inverse transition-[background-color,transform] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-white/90 active:scale-[0.98] focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-primary/35 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <GoogleIcon />
            {isGoogleLoading ? "Redirecting…" : "Continue with Google"}
          </button>

          {googleError ? (
            <p
              role="alert"
              className="mt-3 rounded-lg bg-error-soft px-3 py-2 text-sm text-error"
            >
              {googleError}
            </p>
          ) : null}

          <div className="my-5 flex items-center gap-3">
            <span aria-hidden="true" className="h-px flex-1 bg-white/10" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-text-subtle">
              or sign in with email
            </span>
            <span aria-hidden="true" className="h-px flex-1 bg-white/10" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

            <div className="flex items-center justify-between gap-4">
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

              <Link
                href="/admin/forgot-password"
                className="text-xs font-medium text-text-muted transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Forgot password?
              </Link>
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
              className="group inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-button bg-primary px-5 text-sm font-bold text-text-inverse transition-[background-color,box-shadow,transform] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-[0_12px_32px_rgba(245,158,11,0.18)] focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-primary/35 focus-visible:outline-offset-2 active:translate-y-0 active:bg-primary-active disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Signing in…" : "Sign in"}
              <ArrowRightIcon className="transition-transform duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-hover:translate-x-1" />
            </button>
          </form>

          <div className="mt-5 flex items-center justify-center gap-2 font-mono text-[10px] text-text-subtle">
            <ShieldIcon />
            Built by Stratifit
          </div>
        </div>

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
