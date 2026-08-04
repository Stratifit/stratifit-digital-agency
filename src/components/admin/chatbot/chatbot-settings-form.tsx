"use client";

import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  chatbotSettingsSchema,
  KNOWLEDGE_CATEGORIES,
  RESPONSE_STYLES,
  LEAD_CAPTURE_MODES,
  SUPPORTED_LOCALES,
  type ChatbotSettingsFormValues,
} from "@/features/chat/chat-admin-schemas";
import { updateChatbotSettings } from "@/features/chat/chat-admin-actions";
import type { AdminChatbotSettings } from "@/features/chat/chat-admin-queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/cn";

const LOCALE_NAMES: Record<string, string> = {
  en: "English",
  de: "German",
  fr: "French",
  es: "Spanish",
};

const STYLE_LABELS: Record<string, string> = {
  professional: "Professional",
  friendly: "Friendly",
  concise: "Concise",
};

const LEAD_MODE_LABELS: Record<string, string> = {
  after_resolution: "After the visitor's question is answered",
  immediately: "As soon as the chat starts",
  never: "Never capture leads in chat",
};

const CATEGORY_LABELS: Record<string, string> = {
  general: "General",
  services: "Services",
  pricing: "Pricing",
  process: "Process",
  support: "Support",
  about: "About",
};

function tr(v: Record<string, string> | null | undefined) {
  return { en: v?.en ?? "", de: v?.de ?? "", fr: v?.fr ?? "", es: v?.es ?? "" };
}

function toFormValues(settings: AdminChatbotSettings): ChatbotSettingsFormValues {
  return {
    is_enabled: settings.is_enabled,
    response_style:
      (settings.response_style as ChatbotSettingsFormValues["response_style"]) ??
      "professional",
    lead_capture_mode:
      (settings.lead_capture_mode as ChatbotSettingsFormValues["lead_capture_mode"]) ??
      "after_resolution",
    human_support_enabled: settings.human_support_enabled,
    allowed_categories: settings.allowed_categories?.length
      ? settings.allowed_categories
      : ["general"],
    welcome_message_translations: tr(settings.welcome_message_translations),
    offline_message_translations: tr(settings.offline_message_translations),
    escalation_message_translations: tr(settings.escalation_message_translations),
    fallback_message_translations: tr(settings.fallback_message_translations),
  };
}

function CategoryToggle({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={checked}
      className={cn(
        "rounded-button border px-3.5 py-2 text-xs font-medium transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        checked
          ? "border-primary bg-primary/10 text-primary"
          : "border-border bg-background text-text-secondary hover:border-card-border-hover hover:text-text-primary"
      )}
    >
      {label}
    </button>
  );
}

export function ChatbotSettingsForm({
  settings,
}: {
  settings: AdminChatbotSettings;
}) {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [saved, setSaved] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { isSubmitting },
  } = useForm<ChatbotSettingsFormValues>({
    resolver: zodResolver(chatbotSettingsSchema),
    defaultValues: toFormValues(settings),
  });

  const isEnabled = useWatch({ control, name: "is_enabled" });
  const humanSupportEnabled = useWatch({
    control,
    name: "human_support_enabled",
  });
  const allowedCategories = useWatch({ control, name: "allowed_categories" });

  function toggleCategory(category: string) {
    const current = getValues("allowed_categories");
    const next = current.includes(category)
      ? current.filter((c) => c !== category)
      : [...current, category];
    setValue("allowed_categories", next.length ? next : ["general"]);
  }

  async function onSubmit(values: ChatbotSettingsFormValues) {
    setServerError(null);
    setSaved(false);
    const result = await updateChatbotSettings(values);
    if (result.success) {
      setSaved(true);
    } else {
      setServerError(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Behavior */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center justify-between rounded-card border border-card-border bg-card-dark px-4 py-3.5 shadow-shadow-sm">
          <div>
            <p className="text-sm font-medium text-text-primary">Chatbot enabled</p>
            <p className="mt-0.5 text-xs text-text-muted">
              Turn the AI chat widget on or off.
            </p>
          </div>
          <Switch
            checked={isEnabled}
            onCheckedChange={(checked) => setValue("is_enabled", checked)}
            aria-label="Chatbot enabled"
          />
        </div>
        <div className="flex items-center justify-between rounded-card border border-card-border bg-card-dark px-4 py-3.5 shadow-shadow-sm">
          <div>
            <p className="text-sm font-medium text-text-primary">
              Human support handoff
            </p>
            <p className="mt-0.5 text-xs text-text-muted">
              Allow escalation to a human agent.
            </p>
          </div>
          <Switch
            checked={humanSupportEnabled}
            onCheckedChange={(checked) =>
              setValue("human_support_enabled", checked)
            }
            aria-label="Human support handoff enabled"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="response_style">Response style</Label>
          <Select id="response_style" {...register("response_style")}>
            {RESPONSE_STYLES.map((s) => (
              <option key={s} value={s}>
                {STYLE_LABELS[s] ?? s}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="lead_capture_mode">Lead capture</Label>
          <Select id="lead_capture_mode" {...register("lead_capture_mode")}>
            {LEAD_CAPTURE_MODES.map((m) => (
              <option key={m} value={m}>
                {LEAD_MODE_LABELS[m] ?? m}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Allowed categories */}
      <div className="rounded-card border border-card-border bg-card-dark p-5 shadow-shadow-sm">
        <Label className="mb-1 block">Categories the AI may answer from</Label>
        <p className="mb-3 text-xs text-text-muted">
          Select which knowledge categories the chatbot can draw from.
        </p>
        <div className="flex flex-wrap gap-2">
          {KNOWLEDGE_CATEGORIES.map((category) => (
            <CategoryToggle
              key={category}
              label={CATEGORY_LABELS[category] ?? category}
              checked={allowedCategories.includes(category)}
              onToggle={() => toggleCategory(category)}
            />
          ))}
        </div>
      </div>

      {/* Message translations */}
      <div className="space-y-6">
        {SUPPORTED_LOCALES.map((locale) => (
          <fieldset
            key={locale}
            className="rounded-card border border-card-border bg-card-dark p-5 shadow-shadow-sm"
          >
            <legend className="px-2 text-[10px] font-bold uppercase tracking-[0.28em] text-primary">
              {LOCALE_NAMES[locale]}
            </legend>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`welcome-${locale}`}>Welcome message</Label>
                <Input
                  id={`welcome-${locale}`}
                  placeholder="Hi! How can we help you today?"
                  {...register(`welcome_message_translations.${locale}`)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`offline-${locale}`}>Offline message</Label>
                <Textarea
                  id={`offline-${locale}`}
                  rows={2}
                  placeholder="Our team is offline right now…"
                  {...register(`offline_message_translations.${locale}`)}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`escalation-${locale}`}>
                    Escalation message
                  </Label>
                  <Textarea
                    id={`escalation-${locale}`}
                    rows={2}
                    placeholder="Let me connect you with a human…"
                    {...register(`escalation_message_translations.${locale}`)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`fallback-${locale}`}>Fallback message</Label>
                  <Textarea
                    id={`fallback-${locale}`}
                    rows={2}
                    placeholder="I'm not sure about that — ask our team."
                    {...register(`fallback_message_translations.${locale}`)}
                  />
                </div>
              </div>
            </div>
          </fieldset>
        ))}
      </div>

      {serverError ? (
        <p role="alert" className="rounded-card bg-error-soft px-3 py-2 text-sm text-error">
          {serverError}
        </p>
      ) : null}

      {saved ? (
        <p role="status" className="rounded-card bg-success-soft px-3 py-2 text-sm text-success">
          Saved successfully.
        </p>
      ) : null}

      <div className="flex gap-3">
        <Button type="submit" loading={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save Chatbot Settings"}
        </Button>
      </div>
    </form>
  );
}
