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
const CONSENT_MARKER = "stratifit_cookie_consent_saved";

type ConsentRecord = {
  version: number;
  essential: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
};

function reviewedConsent(): ConsentRecord {
  return {
    version: CONSENT_VERSION,
    essential: true,
    analytics: false,
    marketing: false,
    updatedAt: new Date(0).toISOString(),
  };
}

function parseConsent(raw: string | null): ConsentRecord | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<ConsentRecord>;
    if (parsed.version !== CONSENT_VERSION || parsed.essential !== true) return null;
    if (typeof parsed.analytics !== "boolean" || typeof parsed.marketing !== "boolean") return null;
    if (typeof parsed.updatedAt !== "string" || !parsed.updatedAt) return null;
    return { version: CONSENT_VERSION, essential: true, analytics: parsed.analytics, marketing: parsed.marketing, updatedAt: parsed.updatedAt };
  } catch {
    return null;
  }
}

function readConsent(): ConsentRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = parseConsent(window.localStorage.getItem(STORAGE_KEY));
    if (stored) return stored;
    if (window.localStorage.getItem(CONSENT_MARKER) === "1") return reviewedConsent();
  } catch {
    // Continue with the cookie fallback.
  }
  try {
    const value = document.cookie.split(";").map((entry) => entry.trim()).find((entry) => entry.startsWith(`${CONSENT_COOKIE}=`));
    if (!value) return null;
    return parseConsent(decodeURIComponent(value.slice(CONSENT_COOKIE.length + 1))) ?? reviewedConsent();
  } catch {
    return null;
  }
}

function writeConsent(record: ConsentRecord) {
  const serialized = JSON.stringify(record);
  try {
    window.localStorage.setItem(STORAGE_KEY, serialized);
    window.localStorage.setItem(CONSENT_MARKER, "1");
  } catch {
    // Cookie fallback below remains available.
  }
  try {
    document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(serialized)}; Max-Age=31536000; Path=/; SameSite=Lax`;
  } catch {
    // In-memory state still prevents a repeat display in this session.
  }
}

function defaultChoices(settings: PublicCookieSettings) {
  return Object.fromEntries(settings.categories.map((category) => [category.key, category.essential])) as Record<string, boolean>;
}

export function CookieConsentBanner({ settings, locale = "en" }: { settings: PublicCookieSettings | null; locale?: string }) {
  const [consent, setConsent] = React.useState<ConsentRecord | null>(null);
  const [checked, setChecked] = React.useState(false);
  const [editing, setEditing] = React.useState(false);
  const [settingsView, setSettingsView] = React.useState(false);
  const [choices, setChoices] = React.useState<Record<string, boolean>>({});
  const firstControlRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    setConsent(readConsent());
    setChecked(true);
    const handleEdit = () => {
      const current = readConsent();
      setChoices(current ? { essential: true, analytics: current.analytics, marketing: current.marketing } : settings ? defaultChoices(settings) : { essential: true });
      setEditing(true);
      setSettingsView(true);
    };
    window.addEventListener(EDIT_EVENT, handleEdit);
    return () => window.removeEventListener(EDIT_EVENT, handleEdit);
  }, [settings]);

  const visible = Boolean(settings?.banner_enabled && checked && (consent === null || editing));

  React.useEffect(() => {
    if (visible) firstControlRef.current?.focus();
  }, [visible, settingsView]);

  if (!settings || !visible) return null;

  function save(nextChoices: Record<string, boolean>) {
    const next: ConsentRecord = { version: CONSENT_VERSION, essential: true, analytics: nextChoices.analytics === true, marketing: nextChoices.marketing === true, updatedAt: new Date().toISOString() };
    writeConsent(next);
    setConsent(next);
    setEditing(false);
    setSettingsView(false);
  }

  function acceptAll() {
    save(Object.fromEntries(settings.categories.map((category) => [category.key, true])));
  }

  function essentialOnly() {
    save(defaultChoices(settings));
  }

  function openSettings() {
    setChoices({ essential: true, analytics: consent?.analytics === true, marketing: consent?.marketing === true });
    setEditing(true);
    setSettingsView(true);
  }

  function closeSettings() {
    setEditing(false);
    setSettingsView(false);
  }

  return (
    <div role="region" aria-label={settings.title} className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-3xl rounded-2xl border border-border bg-card-dark/95 p-6 shadow-2xl backdrop-blur sm:bottom-6">
      {!settingsView ? (
        <>
          <div className="flex items-start gap-3"><div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10"><ShieldCheck className="size-5 text-primary" aria-hidden="true" /></div><div className="min-w-0"><h3 className="font-display text-base font-bold text-text-primary">{settings.title}</h3><p className="mt-1 text-xs leading-relaxed text-text-muted">{settings.text} <a href={settings.policy_url} className="text-primary underline">{t(locale, "cookiePolicy")}</a>.</p></div></div>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row"><button ref={firstControlRef} type="button" onClick={acceptAll} className="flex-1 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-text-inverse">{settings.acceptAllLabel}</button><button type="button" onClick={essentialOnly} className="flex-1 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-text-secondary">{settings.essentialOnlyLabel}</button><button type="button" onClick={openSettings} className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-text-muted"><Settings className="size-4" aria-hidden="true" /><span className="hidden sm:inline">{settings.settingsLabel}</span></button></div>
        </>
      ) : (
        <div className="space-y-4"><div className="flex items-start gap-3"><Settings className="mt-1 size-5 text-primary" aria-hidden="true" /><div><h3 className="font-display text-base font-bold text-text-primary">{settings.settingsLabel}</h3><p className="mt-1 text-xs leading-relaxed text-text-muted">{settings.text} <a href={settings.policy_url} className="text-primary underline">{t(locale, "cookiePolicy")}</a>.</p></div></div><div className="space-y-4 border-t border-border pt-4">{settings.categories.map((category) => <div key={category.key} className="flex items-start justify-between gap-4"><div><p className="text-sm font-medium text-text-primary">{category.name}</p>{category.description ? <p className="mt-0.5 text-xs text-text-muted">{category.description}</p> : null}</div><Switch checked={category.essential ? true : choices[category.key] === true} disabled={category.essential} aria-label={category.name} onCheckedChange={(next) => setChoices((previous) => ({ ...previous, [category.key]: next }))} /></div>)}</div><div className="flex flex-col gap-2 border-t border-border pt-4 sm:flex-row"><button ref={firstControlRef} type="button" onClick={() => save(choices)} className="flex-1 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-text-inverse">{settings.savePreferencesLabel}</button><button type="button" onClick={closeSettings} className="flex-1 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-text-secondary">{t(locale, "back")}</button></div></div>
      )}
    </div>
  );
}

export function requestCookieSettingsEdit() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(EDIT_EVENT));
}
