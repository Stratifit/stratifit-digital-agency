import { ContactForm } from "@/components/forms/contact-form";
import type { PublicServiceDetail } from "@/features/services/queries";
import { t } from "@/lib/i18n/ui-strings";
import { cn } from "@/lib/cn";

function SparklesIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-4"
    >
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0z" />
      <path d="M20 3v4" />
      <path d="M22 5h-4" />
      <path d="M4 17v2" />
      <path d="M5 18H3" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-3.5"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-3.5"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function ZapIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-3.5"
    >
      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
    </svg>
  );
}

function TrustBadges({ locale }: { locale: string }) {
  const badges = [
    {
      icon: <ShieldCheckIcon />,
      title: t(locale, "trustNoSpam"),
      desc: t(locale, "trustNoSpamDesc"),
    },
    {
      icon: <LockIcon />,
      title: t(locale, "trustPrivate"),
      desc: t(locale, "trustPrivateDesc"),
    },
    {
      icon: <ZapIcon />,
      title: t(locale, "trustQuickResponse"),
      desc: t(locale, "trustQuickResponseDesc"),
    },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 rounded-card border border-border bg-surface-soft/50 px-4 py-4 sm:px-6">
      {badges.map((badge, idx) => (
        <div
          key={idx}
          className="flex items-center gap-2.5"
        >
          <span className="flex size-8 items-center justify-center rounded-lg border border-border bg-card-dark text-text-muted">
            {badge.icon}
          </span>
          <div className="leading-snug">
            <p className="text-[11px] font-semibold text-text-primary sm:text-xs">
              {badge.title}
            </p>
            <p className="mt-px text-[9px] leading-[1.4] text-text-muted sm:text-[11px]">
              {badge.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * The shared contact panel content — header, form, and trust badges.
 * Used by the contact popup and the /contact page so both stay in sync.
 */
export function ContactPanel({
  services,
  locale,
  headerClassName,
  compact = false,
}: {
  services: PublicServiceDetail[];
  locale: string;
  headerClassName?: string;
  /** Compact sizing for narrow surfaces such as the chat panel. */
  compact?: boolean;
}) {
  return (
    <>
      <header className={cn("relative", headerClassName)}>
        <div className="mb-3 mt-2 flex items-center gap-2 sm:mb-4 sm:mt-0">
          <span
            className={cn(
              "flex items-center justify-center rounded-lg border border-border bg-surface-soft text-text-muted",
              compact ? "size-6" : "size-7 sm:size-9"
            )}
          >
            <SparklesIcon />
          </span>
          <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-text-muted sm:text-xs">
            {t(locale, "getInTouch")}
          </span>
        </div>

        <h2
          className={cn(
            "font-display font-bold leading-[1.06] tracking-[-0.03em] text-text-primary",
            compact
              ? "text-2xl sm:text-3xl"
              : "text-[25px] sm:text-4xl lg:text-5xl"
          )}
        >
          {t(locale, "popupHeadingA")}{" "}
          <span className="text-primary">{t(locale, "popupHeadingB")}</span>
        </h2>

        <p
          className={cn(
            "mt-2.5 max-w-xl text-text-secondary",
            compact
              ? "text-sm leading-relaxed"
              : "text-[11px] leading-4 sm:mt-3 sm:text-sm sm:leading-6"
          )}
        >
          {t(locale, "popupSubheading")}
        </p>
      </header>

      <div className={cn("relative", compact ? "mt-4" : "mt-6 sm:mt-10")}>
        <ContactForm services={services} locale={locale} compact />
      </div>

      <div className={cn("relative", compact ? "pt-4" : "pt-4 sm:pt-8 lg:pt-10")}>
        <TrustBadges locale={locale} />
      </div>
    </>
  );
}
