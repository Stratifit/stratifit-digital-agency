"use client";

import * as React from "react";
import { useWatch, type Control, type FieldValues, type UseFormSetValue } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

/**
 * Admin editor for the three brand case-study phase documents:
 *
 *  - Discovery & Strategy  (portfolio_projects.strategy_translations)
 *    subtitle, tagline, headline, audience insights, brand challenges,
 *    positioning, messaging direction, identity direction.
 *  - Identity & Assets     (portfolio_projects.brand_system_translations)
 *    build intro, primary typeface + description, supporting sub-fonts,
 *    palette description, identity assets intro, visual applications intro.
 *  - Launch & Activation   (portfolio_projects.launch_translations)
 *    headline, section description, digital presence intro, physical
 *    touchpoints intro, brand guidelines intro.
 *
 * Each document is a per-locale JSONB merge; the active locale (LocaleTabs)
 * drives which slice the textarea/input edits, so every language can be filled
 * independently and existing locales are always preserved.
 */

const LOCALE_NAMES: Record<string, string> = {
  en: "English",
  de: "German",
  fr: "French",
  es: "Spanish",
};

const EMPTY_SUB_FONT = () => ({ name: "", usage: "" });

/* ------------------------------------------------------------------ */
/* Shared field primitives                                            */
/* ------------------------------------------------------------------ */

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {hint ? <p className="text-xs text-text-muted">{hint}</p> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Discovery & Strategy editor                                        */
/* ------------------------------------------------------------------ */

function StrategyEditor({
  value,
  onChange,
  locale,
}: {
  value: Record<string, string>;
  onChange: (next: Record<string, string>) => void;
  locale: string;
}) {
  const patch = (key: string) => (v: string) =>
    onChange({ ...value, [key]: v });

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label={`Subtitle (${LOCALE_NAMES[locale]})`}>
          <Textarea
            key={locale}
            rows={3}
            placeholder="Professional cleaning · eco-friendly products · trusted service…"
            value={value[locale] ?? ""}
            onChange={(e) => patch("subtitle")(e.target.value)}
          />
        </Field>
        <Field label={`Tagline (${LOCALE_NAMES[locale]})`}>
          <Input
            key={locale}
            placeholder="Clean Spaces. Better Living."
            value={value[locale] ?? ""}
            onChange={(e) => patch("tagline")(e.target.value)}
          />
        </Field>
      </div>

      <Field label={`Headline (${LOCALE_NAMES[locale]})`}>
        <Input
          key={locale}
          placeholder="CLEAN, PREMIUM STRUCTURE"
          value={value[locale] ?? ""}
          onChange={(e) => patch("headline")(e.target.value)}
        />
      </Field>

      <Field label={`Audience insights (${LOCALE_NAMES[locale]})`}>
        <Textarea
          key={locale}
          rows={4}
          placeholder="Who the brand serves and what they value…"
          value={value[locale] ?? ""}
          onChange={(e) => patch("audience")(e.target.value)}
        />
      </Field>

      <Field label={`Brand challenges (${LOCALE_NAMES[locale]})`}>
        <Textarea
          key={locale}
          rows={4}
          placeholder="What was missing or failing with the previous identity…"
          value={value[locale] ?? ""}
          onChange={(e) => patch("challenges")(e.target.value)}
        />
      </Field>

      <Field label={`Positioning (${LOCALE_NAMES[locale]})`}>
        <Textarea
          key={locale}
          rows={4}
          placeholder="How the brand should be defined in the market…"
          value={value[locale] ?? ""}
          onChange={(e) => patch("positioning")(e.target.value)}
        />
      </Field>

      <Field label={`Messaging direction (${LOCALE_NAMES[locale]})`}>
        <Textarea
          key={locale}
          rows={4}
          placeholder="The voice and tone the brand should use…"
          value={value[locale] ?? ""}
          onChange={(e) => patch("messaging")(e.target.value)}
        />
      </Field>

      <Field label={`Identity direction (${LOCALE_NAMES[locale]})`}>
        <Textarea
          key={locale}
          rows={4}
          placeholder="The creative direction for the mark and visual system…"
          value={value[locale] ?? ""}
          onChange={(e) => patch("identity")(e.target.value)}
        />
      </Field>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Identity & Assets editor                                          */
/* ------------------------------------------------------------------ */

type SubFont = { name: string; usage: string };

function SubFontsEditor({
  fonts,
  onChange,
  locale,
}: {
  fonts: SubFont[];
  onChange: (next: SubFont[]) => void;
  locale: string;
}) {
  function patch(index: number, patch: Partial<SubFont>) {
    const next = [...fonts];
    while (next.length <= index) next.push(EMPTY_SUB_FONT());
    next[index] = { ...next[index], ...patch };
    onChange(next);
  }
  function remove(index: number) {
    onChange(fonts.filter((_, i) => i !== index));
  }
  return (
    <div className="space-y-3">
      <p className="text-xs text-text-muted">
        Supporting typefaces under the primary face. The usage note can be one
        line per role, e.g. “Primary Display / Bold”.
      </p>
      {fonts.map((font, index) => (
        <div
          key={index}
          className="space-y-2 rounded-card border border-white/5 bg-background p-3"
        >
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-subtle">
              Sub-font {index + 1}
            </p>
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-xs text-text-muted transition-colors hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Remove
            </button>
          </div>
          <Input
            placeholder="Hanken Grotesk"
            value={font.name}
            onChange={(e) => patch(index, { name: e.target.value })}
          />
          <Textarea
            key={locale}
            rows={2}
            placeholder="Primary Display / Bold, Modern, Sharp"
            value={font.usage}
            onChange={(e) => patch(index, { usage: e.target.value })}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...fonts, EMPTY_SUB_FONT()])}
        className="rounded-button border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        + Add sub-font
      </button>
    </div>
  );
}

function BrandSystemEditor({
  value,
  onChange,
  locale,
}: {
  value: { [k: string]: unknown };
  onChange: (next: { [k: string]: unknown }) => void;
  locale: string;
}) {
  const str = (key: string): string =>
    typeof value[key] === "string" ? (value[key] as string) : "";
  const fonts: SubFont[] = Array.isArray(value.sub_fonts)
    ? (value.sub_fonts as SubFont[])
    : [];
  const patch = (key: string, val: unknown) => onChange({ ...value, [key]: val });

  return (
    <div className="space-y-4">
      <Field label={`Build intro (${LOCALE_NAMES[locale]})`}>
        <Textarea
          key={locale}
          rows={3}
          placeholder="A refined identity system that transforms the strategic direction into clear, consistent, scalable visual assets…"
          value={str("build_description")}
          onChange={(e) => patch("build_description", e.target.value)}
        />
      </Field>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label={`Primary typeface (${LOCALE_NAMES[locale]})`}>
          <Input
            key={locale}
            placeholder="Clenqo Sans"
            value={str("typeface")}
            onChange={(e) => patch("typeface", e.target.value)}
          />
        </Field>
        <Field label={`Typeface note (${LOCALE_NAMES[locale]})`}>
          <Textarea
            key={locale}
            rows={2}
            placeholder="A custom-tuned grotesque for maximum clarity…"
            value={str("typeface_description")}
            onChange={(e) => patch("typeface_description", e.target.value)}
          />
        </Field>
      </div>

      <Field label={`Palette description (${LOCALE_NAMES[locale]})`}>
        <Textarea
          key={locale}
          rows={3}
          placeholder="A refined palette built around clean neutrals and eco-driven accents…"
          value={str("palette_description")}
          onChange={(e) => patch("palette_description", e.target.value)}
        />
      </Field>

      <Field label="Supporting sub-fonts">
        <SubFontsEditor
          fonts={fonts}
          onChange={(next) => patch("sub_fonts", next)}
          locale={locale}
        />
      </Field>

      <Field label={`Identity assets intro (${LOCALE_NAMES[locale]})`}>
        <Textarea
          key={locale}
          rows={4}
          placeholder="Create supporting elements such as iconography, patterns, and layout rules…"
          value={str("identity_assets")}
          onChange={(e) => patch("identity_assets", e.target.value)}
        />
      </Field>

      <Field label={`Visual applications intro (${LOCALE_NAMES[locale]})`}>
        <Textarea
          key={locale}
          rows={4}
          placeholder="Apply the identity system across real-world touchpoints…"
          value={str("visual_applications")}
          onChange={(e) => patch("visual_applications", e.target.value)}
        />
      </Field>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Launch & Activation editor                                        */
/* ------------------------------------------------------------------ */

function LaunchEditor({
  value,
  onChange,
  locale,
}: {
  value: Record<string, string>;
  onChange: (next: Record<string, string>) => void;
  locale: string;
}) {
  const patch = (key: string) => (v: string) =>
    onChange({ ...value, [key]: v });

  return (
    <div className="space-y-4">
      <Field label={`Headline (${LOCALE_NAMES[locale]})`}>
        <Input
          key={locale}
          placeholder="Real-world rollout & activation"
          value={value[locale] ?? ""}
          onChange={(e) => patch("headline")(e.target.value)}
        />
      </Field>
      <Field label={`Description (${LOCALE_NAMES[locale]})`}>
        <Textarea
          key={locale}
          rows={3}
          placeholder="Introduce the refreshed identity across all core brand channels…"
          value={value[locale] ?? ""}
          onChange={(e) => patch("description")(e.target.value)}
        />
      </Field>
      <Field label={`Digital presence (${LOCALE_NAMES[locale]})`}>
        <Textarea
          key={locale}
          rows={3}
          placeholder="Apply the brand system to the website, social templates, and online assets…"
          value={value[locale] ?? ""}
          onChange={(e) => patch("intro")(e.target.value)}
        />
      </Field>
      <Field label={`Physical touchpoints (${LOCALE_NAMES[locale]})`}>
        <Textarea
          key={locale}
          rows={3}
          placeholder="Introduce the identity across uniforms, vehicles, packaging, and print…"
          value={value[locale] ?? ""}
          onChange={(e) => patch("physical")(e.target.value)}
        />
      </Field>
      <Field label={`Brand guidelines (${LOCALE_NAMES[locale]})`}>
        <Textarea
          key={locale}
          rows={3}
          placeholder="Deliver a scalable guideline system for logo, colour, typography, and layout…"
          value={value[locale] ?? ""}
          onChange={(e) => patch("guidelines")(e.target.value)}
        />
      </Field>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Root editor                                                       */
/* ------------------------------------------------------------------ */

function EditorBlock({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-card border border-white/5 bg-card-dark/60 p-4">
      <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-text-subtle">
        {title}
      </p>
      {hint ? <p className="mb-3 text-xs text-text-muted">{hint}</p> : null}
      {children}
    </div>
  );
}

export function PhaseDocumentsEditor({
  control,
  setValue,
  locale,
}: {
  control: Control<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
  locale: string;
}) {
  // Strategy
  const strategy = useWatch({ control, name: "strategy_translations" }) as Record<
    string,
    Record<string, string>
  > | null;
  const strategyValue = strategy?.[locale] ?? strategy?.en ?? {};

  // Brand system
  const brandSystem = useWatch({
    control,
    name: "brand_system_translations",
  }) as Record<string, { [k: string]: unknown }> | null;
  const brandSystemValue = brandSystem?.[locale] ?? brandSystem?.en ?? {};

  // Launch
  const launch = useWatch({ control, name: "launch_translations" }) as Record<
    string,
    Record<string, string>
  > | null;
  const launchValue = launch?.[locale] ?? launch?.en ?? {};

  return (
    <div className="space-y-4">
      <EditorBlock
        title="Discovery & Strategy"
        hint="The phase narrative — subtitle, tagline, headline, and the strategy detail blocks shown on the case study. Repeat copy per language."
      >
        <StrategyEditor
          value={strategyValue}
          onChange={(v) =>
            setValue("strategy_translations", {
              ...(strategy ?? {}),
              [locale]: v,
            })
          }
          locale={locale}
        />
      </EditorBlock>

      <EditorBlock
        title="Identity & Assets"
        hint="Build intro, primary typeface, supporting sub-fonts, palette description, and the touchpoint intros."
      >
        <BrandSystemEditor
          value={brandSystemValue}
          onChange={(v) =>
            setValue("brand_system_translations", {
              ...(brandSystem ?? {}),
              [locale]: v,
            })
          }
          locale={locale}
        />
      </EditorBlock>

      <EditorBlock
        title="Launch & Activation"
        hint="Headline, section description, and the digital / physical / guidelines callouts."
      >
        <LaunchEditor
          value={launchValue}
          onChange={(v) =>
            setValue("launch_translations", {
              ...(launch ?? {}),
              [locale]: v,
            })
          }
          locale={locale}
        />
      </EditorBlock>
    </div>
  );
}