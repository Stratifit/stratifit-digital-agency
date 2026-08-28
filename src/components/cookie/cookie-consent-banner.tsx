"use client";

import * as React from "react";
import { ShieldCheck, Settings } from "lucide-react";
import type { PublicCookieSettings } from "@/features/cookie-settings/queries";
import { t } from "@/lib/i18n/ui-strings";
import { Switch } from "@/components/ui/switch";

const STORAGE_KEY = "stratifit_cookie_consent";
const CONSENT_COOKIE = "stratifit_cookie_consent";
const CONSENT_VERSION = 1;

interface ConsentRecord {
  version: number;
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
}

function readConsent(): ConsentRecord | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<ConsentRecord>;
      if (
        parsed.version === CONSENT_VERSION &&
        typeof parsed.essential === "boolean" &&
        typeof parsed.updatedAt === "string"
      ) {
        return {
          version: CONSENT_VERSION,
          essential: true,
          analytics: parsed.analytics === true,
          marketing: parsed.marketing === true,
          updatedAt: parsed.updatedAt,
        };
      }
    }

    const cookie = document.cookie
      .split("; ")
      .find((entry) => entry.startsWith(`${CONSENT_COOKIE}=`))
      ?.slice(CONSENT_COOKIE.length + 1);
    if (!cookie) {
      return null;
    }
    const parsed = JSON.parse(decodeURIComponent(cookie)) as Partial<ConsentRecord>;
    if (
      parsed.version !== CONSENT_VERSION ||
      typeof parsed.essential !== "boolean" ||
      typeof parsed.updatedAt !== "string"
    ) {
      return null;
    }
    return {
      version: CONSENT_VERSION,
      essential: true,
      analytics: parsed.analytics === true,
      marketing: parsed.marketing === true,
      updatedAt: parsed.updatedAt,
    };
  } catch {
    return null;
  }
}

function writeConsent(record: ConsentRecord) {
  const serialized = JSON.stringify(record);
  try {
    window.localStorage.setItem(STORAGE_KEY, serialized);
  } catch {
    // Continue with the cookie fallback when localStorage is unavailable.
  }
  try {
    document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(serialized)}; Max-Age=31536000; Path=/; SameSite=Lax`;
  } catch {
    // Cookie storage may also be disabled; state still hides for this session.
  }
}

function buildDefaultChoices(settings: PublicCookieSettings) {
  const map: Record<string, boolean> = { essential: true };
  for (const category of settings.categories) {
    map[category.key] = category.essential ? true : false;
  }
  return map;
}

export function CookieConsentBanner({
  settings,
  locale = "en",
}: {
  settings: PublicCookieSettings | null;
  locale?: string;
}) {
  const [consent, setConsent] = React.useState<ConsentRecord | null>(() =>
    readConsent()
  );
  const [view, setView] = React.useState<"main" | "settings">("main");
  const [choices, setChoices] = React.useState<Record<string, boolean>>({});
  const firstControlRef = React.useRef<HTMLButtonElement>(null);

  // Derived: the banner shows only when enabled and no choice has been made.
  const show = Boolean(settings?.banner_enabled && consent === null);

  React.useEffect(() => {
    if (show) {
      firstControlRef.current?.focus();
    }
  }, [show, view]);

  if (!settings || !show) {
    return null;
  }

  const activeSettings = settings;

  function save(chosen: Record<string, boolean>) {
    const record: ConsentRecord = {
      version: CONSENT_VERSION,
      essential: true,
      analytics: chosen.analytics ?? false,
      marketing: chosen.marketing ?? false,
      updatedAt: new Date().toISOString(),
    };
    writeConsent(record);
    setConsent(record);
  }

  function acceptAll() {
    const all: Record<string, boolean> = { essential: true };
    for (const category of activeSettings.categories) {
      all[category.key] = true;
    }
    save(all);
  }

  function essentialOnly() {
    const minimal: Record<string, boolean> = { essential: true };
    for (const category of activeSettings.categories) {
      minimal[category.key] = category.essential;
    }
    save(minimal);
  }

  function openSettings() {
    setChoices((prev) =>
      Object.keys(prev).length > 0 ? prev : buildDefaultChoices(activeSettings)
    );
    setView("settings");
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Escape") {
      if (view === "settings") {
        setView("main");
      } else {
        save(buildDefaultChoices(activeSettings));
      }
    }
  }

  return (
    <div
      role="region"
      aria-label={settings.title}
      onKeyDown={handleKeyDown}
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-3xl rounded-2xl border border-border bg-card-dark/95 p-6 shadow-2xl backdrop-blur transition-[opacity,transform] duration-[var(--motion-fast)] ease-[var(--ease-standard)] motion-reduce:transition-none sm:bottom-6"
    >
      {view === "main" ? (
        <>
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
              <ShieldCheck className="size-5 text-primary" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h3 className="font-display text-base font-bold text-text-primary">
                {settings.title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-text-muted">
                {settings.text}{" "}
                <a
                  href={settings.policy_url}
                  className="text-primary underline transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:text-primary-light focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-primary/35 focus-visible:outline-offset-2"
                >
                  {t(locale, "cookiePolicy")}
                </a>
                .
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <button
              ref={firstControlRef}
              type="button"
              onClick={acceptAll}
              className="flex-1 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-text-inverse shadow-[0_0_20px_rgba(245,158,11,0.15)] transition-all duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-primary-hover active:scale-95 focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-primary/35 focus-visible:outline-offset-2 motion-reduce:transition-none"
            >
              {settings.acceptAllLabel}
            </button>
            <button
              type="button"
              onClick={essentialOnly}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-text-secondary transition-all duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-white/20 hover:text-text-primary active:scale-95 focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-primary/35 focus-visible:outline-offset-2 motion-reduce:transition-none"
            >
              {settings.essentialOnlyLabel}
            </button>
            <button
              type="button"
              onClick={openSettings}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-text-muted transition-all duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-white/20 hover:text-text-primary active:scale-95 focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-primary/35 focus-visible:outline-offset-2 motion-reduce:transition-none"
            >
              <Settings className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">{settings.settingsLabel}</span>
            </button>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
              <Settings className="size-5 text-primary" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h3 className="font-display text-base font-bold text-text-primary">
                {settings.settingsLabel}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-text-muted">
                {settings.text}{" "}
                <a
                  href={settings.policy_url}
                  className="text-primary underline transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:text-primary-light focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-primary/35 focus-visible:outline-offset-2"
                >
                  {t(locale, "cookiePolicy")}
                </a>
                .
              </p>
            </div>
          </div>

          <div className="space-y-4 border-t border-border pt-4">
            {settings.categories.map((category) => {
              const checked = category.essential
                ? true
                : (choices[category.key] ?? false);
              return (
                <div
                  key={category.key}
                  className="flex items-start justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text-primary">
                      {category.name}
                      {category.essential ? (
                        <span className="ml-2 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                          {t(locale, "alwaysActive")}
                        </span>
                      ) : null}
                    </p>
                    {category.description ? (
                      <p className="mt-0.5 text-xs leading-relaxed text-text-muted">
                        {category.description}
                      </p>
                    ) : null}
                  </div>
                  <Switch
                    checked={checked}
                    disabled={category.essential}
                    aria-label={category.name}
                    onCheckedChange={(next) =>
                      setChoices((prev) => ({
                        ...prev,
                        [category.key]: next,
                      }))
                    }
                  />
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-2 border-t border-border pt-4 sm:flex-row">
            <button
              ref={firstControlRef}
              type="button"
              onClick={() => save(choices)}
              className="flex-1 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-text-inverse shadow-[0_0_20px_rgba(245,158,11,0.15)] transition-all duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-primary-hover active:scale-95 focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-primary/35 focus-visible:outline-offset-2 motion-reduce:transition-none"
            >
              {settings.savePreferencesLabel}
            </button>
            <button
              type="button"
              onClick={() => setView("main")}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-text-secondary transition-all duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-white/20 hover:text-text-primary active:scale-95 focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-primary/35 focus-visible:outline-offset-2 motion-reduce:transition-none"
            >
              {t(locale, "back")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
