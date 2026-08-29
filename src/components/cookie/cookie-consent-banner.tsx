"use client";

import * as React from "react";
import { ShieldCheck, Settings } from "lucide-react";
import type { PublicCookieSettings } from "@/features/cookie-settings/queries";
import { t } from "@/lib/i18n/ui-strings";
import { Switch } from "@/components/ui/switch";

import {
  CONSENT_CHANGED_EVENT,
  CONSENT_COOKIE,
  CONSENT_MARKER,
  CONSENT_STORAGE_KEY,
  CONSENT_VERSION,
  readConsentRecord,
  type ConsentRecord,
} from "@/lib/analytics/consent";

const EDIT_EVENT = "stratifit:edit-cookie-consent";

function readConsent(): ConsentRecord | null {
  return readConsentRecord();
}

function writeConsent(record: ConsentRecord) {
  const serialized = JSON.stringify(record);
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, serialized);
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
  const [consent, setConsent] = React.useState<ConsentRecord | null>(() =>
    typeof window === "undefined" ? null : readConsent()
  );
  // Hydration-safe mounted flag: the banner must not render during SSR or
  // hydration, otherwise the client HTML diverges from the server and React
  // logs a hydration mismatch on every public page. useSyncExternalStore
  // renders the server snapshot (false) until hydration completes.
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const [editing, setEditing] = React.useState(false);
  const [settingsView, setSettingsView] = React.useState(false);
  const [choices, setChoices] = React.useState<Record<string, boolean>>({});
  const firstControlRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    const handleEdit = () => {
      const current = readConsent();
      setChoices(current ? { essential: true, analytics: current.analytics, marketing: current.marketing } : settings ? defaultChoices(settings) : { essential: true });
      setEditing(true);
      setSettingsView(true);
    };
    window.addEventListener(EDIT_EVENT, handleEdit);
    return () => window.removeEventListener(EDIT_EVENT, handleEdit);
  }, [settings]);

  const visible = Boolean(settings?.banner_enabled && mounted && (consent === null || editing));

  React.useEffect(() => {
    if (visible) firstControlRef.current?.focus();
  }, [visible, settingsView]);

  // Do not render the banner during SSR or hydration. This prevents a saved
  // visitor's consent prompt from flashing for a frame on every page load.
  if (!mounted) return null;

  if (!settings || !visible) return null;

  function save(nextChoices: Record<string, boolean>) {
    const next: ConsentRecord = { version: CONSENT_VERSION, essential: true, analytics: nextChoices.analytics === true, marketing: nextChoices.marketing === true, updatedAt: new Date().toISOString() };
    writeConsent(next);
    setConsent(next);
    setEditing(false);
    setSettingsView(false);
    // Notify analytics (and any future integrations) so they can load or
    // stop immediately without requiring a page reload.
    window.dispatchEvent(new CustomEvent<ConsentRecord>(CONSENT_CHANGED_EVENT, { detail: next }));
  }

  function acceptAll() {
    if (!settings) return;
    save(Object.fromEntries(settings.categories.map((category) => [category.key, true])));
  }

  function essentialOnly() {
    if (!settings) return;
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
