"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

type ToastType = "info" | "success" | "warning" | "error";

interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  description?: string;
  duration: number | null;
}

interface ToastInput {
  type?: ToastType;
  title?: string;
  description?: string;
  duration?: number;
}

interface ToastContextValue {
  toast: (input: ToastInput) => void;
  dismiss: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

const DEFAULT_DURATION = 5000;

const typeClasses: Record<ToastType, string> = {
  info: "border-info-border",
  success: "border-success-border",
  warning: "border-warning-border",
  error: "border-error-border",
};

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}) {
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    if (toast.duration == null || paused) return;
    const timer = setTimeout(() => onDismiss(toast.id), toast.duration);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, paused, onDismiss]);

  return (
    <div
      role={toast.type === "error" ? "alert" : "status"}
      className={cn(
        "pointer-events-auto w-full max-w-sm rounded-radius-md border bg-surface-elevated px-4 py-3 shadow-shadow-md",
        typeClasses[toast.type]
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          {toast.title ? (
            <p className="text-sm font-medium text-text-primary">
              {toast.title}
            </p>
          ) : null}
          {toast.description ? (
            <p className="mt-0.5 text-sm text-text-secondary">
              {toast.description}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          aria-label="Dismiss notification"
          onClick={() => onDismiss(toast.id)}
          className="shrink-0 rounded-radius-xs px-1.5 text-text-muted transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <svg
            className="size-4"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4 4l8 8M12 4l-8 8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const toast = React.useCallback(
    (input: ToastInput) => {
      const id = crypto.randomUUID();
      const type = input.type ?? "info";
      const duration =
        type === "error" ? null : (input.duration ?? DEFAULT_DURATION);
      setToasts((current) => [...current, { id, type, ...input, duration }]);
    },
    []
  );

  const value = React.useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-2 px-4 sm:items-end sm:px-6"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <ToastCard key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}
