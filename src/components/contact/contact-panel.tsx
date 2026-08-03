import { ContactForm } from "@/components/forms/contact-form";
import type { PublicServiceDetail } from "@/features/services/queries";
import { t } from "@/lib/i18n/ui-strings";
import { cn } from "@/lib/cn";

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
    <div className="grid grid-cols-3 divide-x divide-border rounded-xl border border-border px-2 py-3 sm:py-4">
      {badges.map((badge, idx) => (
        <div
          key={idx}
          className="flex items-start justify-center gap-2 px-2 text-center sm:gap-2.5"
        >
          <span className="mt-0.5 shrink-0 text-primary">{badge.icon}</span>
          <div className="min-w-0 text-left leading-snug">
            <p className="whitespace-nowrap text-[9px] font-semibold text-text-primary sm:text-[11px]">
              {badge.title}
            </p>
            <p className="mt-0.5 text-[8px] leading-[1.4] text-text-muted sm:text-[10px]">
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
}: {
  services: PublicServiceDetail[];
  locale: string;
  headerClassName?: string;
}) {
  return (
    <>
      <header className={cn("relative", headerClassName)}>
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
          {t(locale, "getInTouch")}
        </p>

        <h2 className="font-display text-xl font-black text-text-primary sm:text-2xl">
          {t(locale, "popupHeadingA")}{" "}
          <span className="text-primary">{t(locale, "popupHeadingB")}</span>
        </h2>

        <p className="mt-2.5 max-w-xl text-[11px] leading-4 text-text-secondary sm:mt-3 sm:text-sm sm:leading-6">
          {t(locale, "popupSubheading")}
        </p>
      </header>

      <div className="relative mt-6">
        <ContactForm services={services} locale={locale} compact />
      </div>

      <div className="relative pt-4 sm:pt-8 lg:pt-10">
        <TrustBadges locale={locale} />
      </div>
    </>
  );
}
