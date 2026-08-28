"use client";

import * as React from "react";
import { ShieldCheck, Settings } from "lucide-react";
import type { PublicCookieSettings } from "@/features/cookie-settings/queries";
import { t } from "@/lib/i18n/ui-strings";
import { Switch } from "@/components/ui/switch";

const STORAGE_KEY = "stratifit_cookie_consent";
const CONSENT_COOKIE = "stratifit_cookie_consent";
const EDIT_EVENT = "stratifit:edit-cookie-consent";
const CONSENT_VERSION = 1;

interface ConsentRecord {
  version: number;
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
}

function parseConsent(raw: string | null): ConsentRecord | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<ConsentRecord>;
    if (typeof parsed.updatedAt !== "string") return null;
    if (parsed.version !== undefined && parsed.version !== CONSENT_VERSION) return null;
    if (parsed.essential !== undefined && typeof parsed.essential !== "boolean") return null;
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

function readConsent(): ConsentRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = parseConsent(window.localStorage.getItem(STORAGE_KEY));
    if (stored) return stored;
  } catch {
    // Fall back to the browser cookie.
  }
  try {
    const value = document.cookie
      .split(";")
      .map((entry) => entry.trim())
      .find((entry) => entry.startsWith(`${CONSENT_COOKIE}=`))
      ?.slice(CONSENT_COOKIE.length + 1);
    return parseConsent(value ? decodeURIComponent(value) : null);
  } catch {
    return null;
  }
}

function writeConsent(record: ConsentRecord) {
  const serialized = JSON.stringify(record);
  try {
    window.localStorage.setItem(STORAGE_KEY, serialized);
  } catch {
    // Cookie fallback below remains available.
  }
  try {
    document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(serialized)}; Max-Age=31536000; Path=/; SameSite=Lax`;
  } catch {
    // Storage may be disabled entirely; in-memory state still hides the banner.
  }
}

function buildDefaultChoices(settings: PublicCookieSettings) {
  const map: Record<string, boolean> = { essential: true };
  for (const category of settings.categories) {
    map[category.key] = category.essential;
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
  const [consent, setConsent] = React.useState<ConsentRecord | null>(() => readConsent());
  const [view, setView] = React.useState<"main" | "settings">("main");
  const [editing, setEditing] = React.useState(false);
  const [choices, setChoices] = React.useState<Record<string, boolean>>({});
  const firstControlRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    const handleEdit = () => {
      setChoices((previous) => {
        if (Object.keys(previous).length > 0) return previous;
        const current = readConsent();
        return current
          ? { essential: true, analytics: current.analytics, marketing: current.marketing }
          : settings
            ? buildDefaultChoices(settings)
            : { essential: true };
      });
      setEditing(true);
      setView("settings");
    };
    window.addEventListener(EDIT_EVENT, handleEdit);
    return () => window.removeEventListener(EDIT_EVENT, handleEdit);
  }, [settings]);

  const show = Boolean(settings?.banner_enabled && (consent === null || editing));

  React.useEffect(() => {
    if (show) firstControlRef.current?.focus();
  }, [show, view]);

  if (!settings || !show) return null;

  const activeSettings = settings;

  function save(chosen: Record<string, boolean>) {
    const record: ConsentRecord = {
      version: CONSENT_VERSION,
      essential: true,
      analytics: chosen.analytics === true,
      marketing: chosen.marketing === true,
      updatedAt: new Date().toISOString(),
    };
    writeConsent(record);
    setConsent(record);
    setEditing(false);
    setView("main");
  }

  function acceptAll() {
    const all: Record<string, boolean> = { essential: true };
    for (const category of activeSettings.categories) all[category.key] = true;
    save(all);
  }

  function essentialOnly() {
    const minimal: Record<string, boolean> = { essential: true };
    for (const category of activeSettings.categories) minimal[category.key] = category.essential;
    save(minimal);
  }

  function openSettings() {
    setChoices({
      essential: true,
      analytics: consent?.analytics === true,
      marketing: consent?.marketing === true,
    });
    setEditing(true);
    setView("settings");
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Escape") {
      if (editing && consent) {
        setEditing(false);
        setView("main");
      } else if (view === "settings") {
        setView("main");
      } else {
        essentialOnly();
      }
    }
  }

  return (
    <div role="region" aria-label={settings.title} onKeyDown={handleKeyDown} className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-3xl rounded-2xl border border-border bg-card-dark/95 p-6 shadow-2xl backdrop-blur transition-[opacity,transform] duration-[var(--motion-fast)] ease-[var(--ease-standard)] motion-reduce:transition-none sm:bottom-6">
      {view === "main" ? (
        <>
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10"><ShieldCheck className="size-5 text-primary" aria-hidden="true" /></div>
            <div className="min-w-0">
              <h3 className="font-display text-base font-bold text-text-primary">{settings.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-text-muted">{settings.text} <a href={settings.policy_url} className="text-primary underline">{t(locale, "cookiePolicy")}</a>.</p>
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <button ref={firstControlRef} type="button" onClick={acceptAll} className="flex-1 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-text-inverse">{settings.acceptAllLabel}</button>
            <button type="button" onClick={essentialOnly} className="flex-1 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-text-secondary">{settings.essentialOnlyLabel}</button>
            <button type="button" onClick={openSettings} className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-text-muted"><Settings className="size-4" aria-hidden="true" /><span className="hidden sm:inline">{settings.settingsLabel}</span></button>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <div className="flex items-start gap-3"><Settings className="mt-1 size-5 text-primary" aria-hidden="true" /><div><h3 className="font-display text-base font-bold text-text-primary">{settings.settingsLabel}</h3><p className="mt-1 text-xs leading-relaxed text-text-muted">{settings.text} <a href={settings.policy_url} className="text-primary underline">{t(locale, "cookiePolicy")}</a>.</p></div></div>
          <div className="space-y-4 border-t border-border pt-4">{settings.categories.map((category) => <div key={category.key} className="flex items-start justify-between gap-4"><div><p className="text-sm font-medium text-text-primary">{category.name}</p>{category.description ? <p className="mt-0.5 text-xs text-text-muted">{category.description}</p> : null}</div><Switch checked={category.essential ? true : choices[category.key] ?? false} disabled={category.essential} aria-label={category.name} onCheckedChange={(next) => setChoices((previous) => ({ ...previous, [category.key]: next }))} /></div>)}</div>
          <div className="flex flex-col gap-2 border-t border-border pt-4 sm:flex-row"><button ref={firstControlRef} type="button" onClick={() => save(choices)} className="flex-1 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-text-inverse">{settings.savePreferencesLabel}</button><button type="button" onClick={() => { setEditing(false); setView("main"); }} className="flex-1 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-text-secondary">{t(locale, "back")}</button></div>
        </div>
      )}
    </div>
  );
}

export function requestCookieSettingsEdit() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(EDIT_EVENT));
}
