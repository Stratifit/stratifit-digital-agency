"use client";

import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateCookieSettings } from "@/features/cookie-settings/mutations";
import {
  cookieSettingsSchema,
  type CookieSettingsFormValues,
} from "@/features/cookie-settings/schemas";
import type { AdminCookieSettings } from "@/features/cookie-settings/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { LocaleTabs, type EditorLocale } from "@/components/admin/locale-tabs";

type CategoryRow = NonNullable<CookieSettingsFormValues["categories"]>[number];

interface CategoryDefaults {
  key: string;
  essential: boolean;
  enabled: boolean;
  name_en: string;
  description_en: string;
}

interface RawCategory {
  key?: string;
  essential?: boolean;
  enabled?: boolean;
  name_translations?: Record<string, string>;
  description_translations?: Record<string, string>;
}

const CATEGORY_DEFAULTS: CategoryDefaults[] = [
  {
    key: "essential",
    essential: true,
    enabled: true,
    name_en: "Essential cookies",
    description_en: "Required for the website to function. Cannot be switched off.",
  },
  {
    key: "analytics",
    essential: false,
    enabled: true,
    name_en: "Analytics cookies",
    description_en:
      "Help us understand how visitors interact with the site. All data is aggregated and anonymous.",
  },
  {
    key: "marketing",
    essential: false,
    enabled: false,
    name_en: "Marketing cookies",
    description_en:
      "Used to show relevant advertising. Currently not in use unless you consent.",
  },
];

function buildDefaultValues(
  initial: AdminCookieSettings | null
): CookieSettingsFormValues {
  const tr = (
    value: Record<string, string> | undefined,
    fallback: string
  ) => ({
    en: value?.en ?? fallback,
    de: value?.de ?? "",
    fr: value?.fr ?? "",
    es: value?.es ?? "",
  });

  const storedCategories = (initial?.categories as unknown as RawCategory[] | null) ?? [];
  const categories: CategoryRow[] = CATEGORY_DEFAULTS.map((def) => {
    const stored = storedCategories.find((c) => c.key === def.key);
    return {
      key: def.key,
      essential: stored?.essential ?? def.essential,
      enabled: stored?.enabled ?? def.enabled,
      name_translations: tr(stored?.name_translations, def.name_en),
      description_translations: tr(
        stored?.description_translations,
        def.description_en
      ),
    };
  });

  return {
    banner_enabled: initial?.banner_enabled ?? true,
    policy_url: initial?.policy_url ?? "/cookie-policy",
    banner_title_translations: tr(
      initial?.banner_title_translations,
      "Cookie Preferences"
    ),
    banner_text_translations: tr(
      initial?.banner_text_translations,
      "We use cookies to enhance your browsing experience, analyze site traffic, and deliver personalized content."
    ),
    accept_all_label_translations: tr(
      initial?.accept_all_label_translations,
      "Accept All"
    ),
    essential_only_label_translations: tr(
      initial?.essential_only_label_translations,
      "Essential Only"
    ),
    settings_label_translations: tr(
      initial?.settings_label_translations,
      "Settings"
    ),
    save_preferences_label_translations: tr(
      initial?.save_preferences_label_translations,
      "Save Preferences"
    ),
    categories,
  };
}

const formSchema = cookieSettingsSchema;

export function CookieSettingsForm({
  initial,
}: {
  initial: AdminCookieSettings | null;
}) {
  const [locale, setLocale] = React.useState<EditorLocale>("en");
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [saved, setSaved] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof formSchema>, unknown, CookieSettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: buildDefaultValues(initial),
  });

  const bannerEnabled = useWatch({ control, name: "banner_enabled" });
  // One subscription for all categories keeps the per-row reads below
  // hook-rule-safe without watching inside the map callback.
  const categories = useWatch({ control, name: "categories" });

  async function onSubmit(values: CookieSettingsFormValues) {
    setServerError(null);
    setSaved(false);
    const result = await updateCookieSettings(values);
    if (result.success) {
      setSaved(true);
    } else {
      setServerError(result.error);
    }
  }

  const fieldError = (path: string) => {
    // errors is keyed by top-level name for nested paths; resolve manually.
    const parts = path.split(".");
    let node: Record<string, unknown> | undefined = errors as unknown as Record<
      string,
      unknown
    >;
    for (const part of parts) {
      if (!node || typeof node !== "object") return undefined;
      node = node[part] as Record<string, unknown> | undefined;
    }
    return (node as { message?: string } | undefined)?.message;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex items-center justify-between rounded-card border border-card-border bg-card-dark px-4 py-3.5 shadow-sm">
        <div>
          <p className="text-sm font-medium text-text-primary">
            Show cookie banner
          </p>
          <p className="mt-0.5 text-xs text-text-muted">
            Turn the consent banner off without losing your settings.
          </p>
        </div>
        <Switch
          checked={bannerEnabled}
          onCheckedChange={(next) => setValue("banner_enabled", next)}
          aria-label="Show cookie banner"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <p className="text-xs font-medium text-text-muted">Language</p>
          <LocaleTabs value={locale} onChange={setLocale} />
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`banner_title_translations-${locale}`}>Title</Label>
          <Input
            id={`banner_title_translations-${locale}`}
            placeholder="Cookie Preferences"
            {...register(`banner_title_translations.${locale}`)}
          />
          {fieldError(`banner_title_translations.${locale}`) ? (
            <p className="mt-1 text-xs text-error">
              {fieldError(`banner_title_translations.${locale}`)}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor={`banner_text_translations-${locale}`}>
            Banner text
          </Label>
          <Textarea
            id={`banner_text_translations-${locale}`}
            rows={3}
            placeholder="We use cookies to enhance your browsing experience…"
            {...register(`banner_text_translations.${locale}`)}
          />
          <p className="text-xs text-text-muted">
            The Cookie Policy link is appended automatically after this text.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={`accept_all_label_translations-${locale}`}>
              Accept All label
            </Label>
            <Input
              id={`accept_all_label_translations-${locale}`}
              placeholder="Accept All"
              {...register(`accept_all_label_translations.${locale}`)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`essential_only_label_translations-${locale}`}>
              Essential Only label
            </Label>
            <Input
              id={`essential_only_label_translations-${locale}`}
              placeholder="Essential Only"
              {...register(`essential_only_label_translations.${locale}`)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`settings_label_translations-${locale}`}>
              Settings label
            </Label>
            <Input
              id={`settings_label_translations-${locale}`}
              placeholder="Settings"
              {...register(`settings_label_translations.${locale}`)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`save_preferences_label_translations-${locale}`}>
              Save Preferences label
            </Label>
            <Input
              id={`save_preferences_label_translations-${locale}`}
              placeholder="Save Preferences"
              {...register(`save_preferences_label_translations.${locale}`)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="policy_url">Cookie Policy URL</Label>
          <Input
            id="policy_url"
            placeholder="/cookie-policy"
            {...register("policy_url")}
          />
          {fieldError("policy_url") ? (
            <p className="mt-1 text-xs text-error">
              {fieldError("policy_url")}
            </p>
          ) : null}
        </div>
      </div>

      <fieldset className="rounded-card border border-border bg-background p-5">
        <legend className="px-2 text-sm font-semibold text-text-primary">
          Cookie categories
        </legend>
        <p className="mb-4 text-xs text-text-muted">
          Each category can be turned on or off in the banner. Essential
          cookies are always active. Visitors only see enabled categories.
        </p>
        <div className="space-y-4">
          {CATEGORY_DEFAULTS.map((def, index) => {
            const enabled = categories?.[index]?.enabled ?? false;
            return (
              <div
                key={def.key}
                className="rounded-card border border-border bg-card-dark p-4"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="flex items-center gap-2 text-sm font-medium text-text-primary">
                    {def.name_en}
                    {def.essential ? (
                      <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                        Always active
                      </span>
                    ) : null}
                  </p>
                  <Switch
                    checked={enabled}
                    disabled={def.essential}
                    aria-label={`Enable ${def.name_en}`}
                    onCheckedChange={(next) =>
                      setValue(`categories.${index}.enabled`, next)
                    }
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor={`categories-${index}-name-${locale}`}
                      className="text-xs"
                    >
                      Name ({locale})
                    </Label>
                    <Input
                      id={`categories-${index}-name-${locale}`}
                      placeholder="Analytics cookies"
                      {...register(
                        `categories.${index}.name_translations.${locale}`
                      )}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor={`categories-${index}-description-${locale}`}
                      className="text-xs"
                    >
                      Description ({locale})
                    </Label>
                    <Textarea
                      id={`categories-${index}-description-${locale}`}
                      rows={2}
                      placeholder="Short description shown in the banner settings…"
                      {...register(
                        `categories.${index}.description_translations.${locale}`
                      )}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </fieldset>

      {serverError ? (
        <p
          role="alert"
          className="rounded-card bg-error-soft px-3 py-2 text-sm text-error"
        >
          {serverError}
        </p>
      ) : null}

      {saved ? (
        <p
          role="status"
          className="rounded-card bg-success-soft px-3 py-2 text-sm text-success"
        >
          Saved successfully.
        </p>
      ) : null}

      <Button type="submit" loading={isSubmitting}>
        {isSubmitting ? "Saving…" : "Save Cookie Settings"}
      </Button>
    </form>
  );
}
