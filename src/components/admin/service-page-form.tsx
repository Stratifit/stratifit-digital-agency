"use client";

import * as React from "react";
import { useFieldArray, useForm, type Control, type Path, type UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SUPPORTED_LOCALES } from "@/lib/i18n/resolve-translation";
import {
  servicePageSchema,
  type ServicePageFormValues,
} from "@/features/service-pages/schemas";
import { saveServicePage } from "@/features/service-pages/mutations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/cn";

type FormValues = z.input<typeof servicePageSchema>;
type Register = UseFormRegister<FormValues>;
type FormControl = Control<FormValues>;

const ICON_NAMES = [
  "spark",
  "search",
  "audit",
  "workshop",
  "positioning",
  "roadmap",
  "pen",
  "sketch",
  "refine",
  "final",
  "type",
  "color",
  "image",
  "pattern",
  "rules",
  "assets",
  "layout",
  "folder",
  "tag",
  "box",
  "book",
  "rocket",
  "chart",
  "chat",
  "mail",
  "phone",
  "database",
  "link",
  "grid",
  "globe",
  "key",
  "calendar",
];

function TranslationInputs({
  name,
  register,
  textarea = false,
  className,
}: {
  name: string;
  register: Register;
  textarea?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-3 sm:grid-cols-2", className)}>
      {SUPPORTED_LOCALES.map((locale) => {
        const field = register(`${name}.${locale}` as Path<FormValues>);
        return (
          <div key={locale} className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider text-text-muted">
              {locale.toUpperCase()}
            </Label>
            {textarea ? (
              <Textarea rows={2} {...field} />
            ) : (
              <Input {...field} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function IconSelect({ name, register }: { name: string; register: Register }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-wider text-text-muted">
        Icon
      </Label>
      <Select {...register(`${name}.icon` as Path<FormValues>)}>
        <option value="">Auto</option>
        {ICON_NAMES.map((icon) => (
          <option key={icon} value={icon}>
            {icon}
          </option>
        ))}
      </Select>
    </div>
  );
}

export function ServicePageForm({
  slug,
  initial,
}: {
  slug: string;
  initial: ServicePageFormValues | null;
}) {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [saved, setSaved] = React.useState(false);
  const [toolkitItems, setToolkitItems] = React.useState<string[]>(
    (initial?.toolkit ?? []).map(String)
  );

  const empty = {
    is_visible: true,
    hero_eyebrow_translations: {},
    hero_title_translations: {},
    hero_highlight_translations: {},
    hero_description_translations: {},
    hero_stats: [],
    why_title_translations: {},
    why_description_translations: {},
    why_badges: [],
    capabilities_title_translations: {},
    capabilities: [],
    deliverables_title_translations: {},
    deliverables: [],
    process_title_translations: {},
    process: [],
    toolkit_title_translations: {},
    toolkit: [],
    cta_title_translations: {},
    cta_subtitle_translations: {},
    cta_button_label_translations: {},
  };

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { isSubmitting },
  } = useForm<z.input<typeof servicePageSchema>>({
    resolver: zodResolver(servicePageSchema),
    defaultValues: initial ?? empty,
  });

  const stats = useFieldArray({ control, name: "hero_stats" });
  const badges = useFieldArray({ control, name: "why_badges" });
  const capabilities = useFieldArray({ control, name: "capabilities" });
  const deliverables = useFieldArray({ control, name: "deliverables" });
  const process = useFieldArray({ control, name: "process" });

  function updateToolkitItem(index: number, value: string) {
    const next = [...toolkitItems];
    next[index] = value;
    setToolkitItems(next);
    setValue("toolkit", next);
  }

  function addToolkitItem() {
    const next = [...toolkitItems, ""];
    setToolkitItems(next);
    setValue("toolkit", next);
  }

  function removeToolkitItem(index: number) {
    const next = toolkitItems.filter((_, i) => i !== index);
    setToolkitItems(next);
    setValue("toolkit", next);
  }

  async function onSubmit(values: z.input<typeof servicePageSchema>) {
    setServerError(null);
    setSaved(false);
    const result = await saveServicePage(slug, values as ServicePageFormValues);
    if (result.success) {
      setSaved(true);
    } else {
      setServerError(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
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

      {/* Visibility */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="is_visible"
          className="size-4 accent-[var(--primary)]"
          {...register("is_visible")}
        />
        <Label htmlFor="is_visible">Visible on the public site</Label>
      </div>

      {/* Hero */}
      <fieldset className="rounded-md border border-border bg-background p-5">
        <legend className="px-2 text-sm font-semibold text-text-primary">Hero</legend>
        <div className="space-y-5">
          <div className="space-y-2">
            <Label>Eyebrow</Label>
            <TranslationInputs name="hero_eyebrow_translations" register={register} />
          </div>
          <div className="space-y-2">
            <Label>Title</Label>
            <TranslationInputs name="hero_title_translations" register={register} />
          </div>
          <div className="space-y-2">
            <Label>Highlight (amber)</Label>
            <TranslationInputs name="hero_highlight_translations" register={register} />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <TranslationInputs name="hero_description_translations" register={register} textarea />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Hero Stats</Label>
              <Button type="button" size="small" variant="secondary" onClick={() => stats.append({ value: "", label_translations: {} })}>
                Add stat
              </Button>
            </div>
            {stats.fields.map((field, index) => (
              <div key={field.id} className="space-y-3 rounded-md border border-border-subtle p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs uppercase tracking-wider text-text-muted">Value</Label>
                    <Input {...register(`hero_stats.${index}.value`)} placeholder="120+" />
                  </div>
                </div>
                <TranslationInputs name={`hero_stats.${index}.label_translations`} register={register} />
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-text-muted">Description</Label>
                  <TranslationInputs name={`hero_stats.${index}.description_translations`} register={register} textarea />
                </div>
                <Button type="button" size="small" variant="destructive" onClick={() => stats.remove(index)}>
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>
      </fieldset>

      {/* Why it matters */}
      <fieldset className="rounded-md border border-border bg-background p-5">
        <legend className="px-2 text-sm font-semibold text-text-primary">Why It Matters</legend>
        <div className="space-y-5">
          <div className="space-y-2">
            <Label>Title</Label>
            <TranslationInputs name="why_title_translations" register={register} />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <TranslationInputs name="why_description_translations" register={register} textarea />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Stat Badges</Label>
              <Button type="button" size="small" variant="secondary" onClick={() => badges.append({ value: "", label_translations: {}, hint_translations: {} })}>
                Add badge
              </Button>
            </div>
            {badges.fields.map((field, index) => (
              <div key={field.id} className="space-y-3 rounded-md border border-border-subtle p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs uppercase tracking-wider text-text-muted">Value</Label>
                    <Input {...register(`why_badges.${index}.value`)} placeholder="2x" />
                  </div>
                </div>
                <TranslationInputs name={`why_badges.${index}.label_translations`} register={register} />
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-text-muted">Description</Label>
                  <TranslationInputs name={`why_badges.${index}.description_translations`} register={register} textarea />
                </div>
                <TranslationInputs name={`why_badges.${index}.hint_translations`} register={register} />
                <Button type="button" size="small" variant="destructive" onClick={() => badges.remove(index)}>
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>
      </fieldset>

      {/* Capabilities */}
      <fieldset className="rounded-md border border-border bg-background p-5">
        <legend className="px-2 text-sm font-semibold text-text-primary">Capabilities</legend>
        <div className="space-y-5">
          <div className="space-y-2">
            <Label>Section Title</Label>
            <TranslationInputs name="capabilities_title_translations" register={register} />
          </div>
          <div className="space-y-2">
            <Label>Section Description</Label>
            <TranslationInputs name="capabilities_description_translations" register={register} textarea />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Capability Cards</Label>
              <Button type="button" size="small" variant="secondary" onClick={() => capabilities.append({ title_translations: {}, description_translations: {}, steps: [] })}>
                Add capability
              </Button>
            </div>
            {capabilities.fields.map((field, index) => (
              <CapabilityEditor
                key={field.id}
                index={index}
                register={register}
                control={control}
                onRemove={() => capabilities.remove(index)}
              />
            ))}
          </div>
        </div>
      </fieldset>

      {/* Deliverables */}
      <fieldset className="rounded-md border border-border bg-background p-5">
        <legend className="px-2 text-sm font-semibold text-text-primary">Deliverables</legend>
        <div className="space-y-5">
          <div className="space-y-2">
            <Label>Section Title</Label>
            <TranslationInputs name="deliverables_title_translations" register={register} />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Deliverable Cards</Label>
              <Button type="button" size="small" variant="secondary" onClick={() => deliverables.append({ title_translations: {}, description_translations: {}, icon: "" })}>
                Add deliverable
              </Button>
            </div>
            {deliverables.fields.map((field, index) => (
              <div key={field.id} className="space-y-3 rounded-md border border-border-subtle p-4">
                <TranslationInputs name={`deliverables.${index}.title_translations`} register={register} />
                <TranslationInputs name={`deliverables.${index}.description_translations`} register={register} textarea />
                <div className="flex items-end gap-3">
                  <IconSelect name={`deliverables.${index}`} register={register} />
                  <Button type="button" size="small" variant="destructive" onClick={() => deliverables.remove(index)}>
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </fieldset>

      {/* Process */}
      <fieldset className="rounded-md border border-border bg-background p-5">
        <legend className="px-2 text-sm font-semibold text-text-primary">Process</legend>
        <div className="space-y-5">
          <div className="space-y-2">
            <Label>Section Title</Label>
            <TranslationInputs name="process_title_translations" register={register} />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Steps</Label>
              <Button type="button" size="small" variant="secondary" onClick={() => process.append({ number: process.fields.length + 1, title_translations: {}, description_translations: {}, icon: "" })}>
                Add step
              </Button>
            </div>
            {process.fields.map((field, index) => (
              <div key={field.id} className="space-y-3 rounded-md border border-border-subtle p-4">
                <div className="flex items-end gap-3">
                  <div className="w-24 space-y-1.5">
                    <Label className="text-xs uppercase tracking-wider text-text-muted">Number</Label>
                    <Input type="number" {...register(`process.${index}.number`, { valueAsNumber: true })} />
                  </div>
                  <IconSelect name={`process.${index}`} register={register} />
                  <Button type="button" size="small" variant="destructive" onClick={() => process.remove(index)}>
                    Remove
                  </Button>
                </div>
                <TranslationInputs name={`process.${index}.title_translations`} register={register} />
                <TranslationInputs name={`process.${index}.description_translations`} register={register} textarea />
              </div>
            ))}
          </div>
        </div>
      </fieldset>

      {/* Toolkit */}
      <fieldset className="rounded-md border border-border bg-background p-5">
        <legend className="px-2 text-sm font-semibold text-text-primary">Toolkit</legend>
        <div className="space-y-5">
          <div className="space-y-2">
            <Label>Section Title</Label>
            <TranslationInputs name="toolkit_title_translations" register={register} />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Tools</Label>
              <Button type="button" size="small" variant="secondary" onClick={addToolkitItem}>
                Add tool
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {toolkitItems.map((tool, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={tool}
                    onChange={(event) => updateToolkitItem(index, event.target.value)}
                    placeholder="Figma"
                  />
                  <Button type="button" size="small" variant="destructive" onClick={() => removeToolkitItem(index)}>
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </fieldset>

      {/* CTA */}
      <fieldset className="rounded-md border border-border bg-background p-5">
        <legend className="px-2 text-sm font-semibold text-text-primary">Final CTA</legend>
        <div className="space-y-5">
          <div className="space-y-2">
            <Label>Title</Label>
            <TranslationInputs name="cta_title_translations" register={register} />
          </div>
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <TranslationInputs name="cta_subtitle_translations" register={register} textarea />
          </div>
          <div className="space-y-2">
            <Label>Button Label</Label>
            <TranslationInputs name="cta_button_label_translations" register={register} />
          </div>
        </div>
      </fieldset>

      <div className="flex gap-3">
        <Button type="submit" loading={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save Service Page"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => window.history.back()}>
          Back
        </Button>
      </div>
    </form>
  );
}

function CapabilityEditor({
  index,
  register,
  control,
  onRemove,
}: {
  index: number;
  register: Register;
  control: FormControl;
  onRemove: () => void;
}) {
  const steps = useFieldArray({ control, name: `capabilities.${index}.steps` });

  return (
    <div className="space-y-3 rounded-md border border-border-subtle p-4">
      <div className="flex justify-end">
        <Button type="button" size="small" variant="destructive" onClick={onRemove}>
          Remove capability
        </Button>
      </div>
      <TranslationInputs name={`capabilities.${index}.title_translations`} register={register} />
      <TranslationInputs name={`capabilities.${index}.description_translations`} register={register} textarea />
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs uppercase tracking-wider text-text-muted">Steps</Label>
          <Button type="button" size="small" variant="secondary" onClick={() => steps.append({ label_translations: {}, icon: "" })}>
            Add step
          </Button>
        </div>
        {steps.fields.map((field, stepIndex) => (
          <div key={field.id} className="space-y-2 rounded-md border border-border-subtle p-3">
            <TranslationInputs name={`capabilities.${index}.steps.${stepIndex}.label_translations`} register={register} />
            <div className="flex items-end gap-3">
              <IconSelect name={`capabilities.${index}.steps.${stepIndex}`} register={register} />
              <Button type="button" size="small" variant="destructive" onClick={() => steps.remove(stepIndex)}>
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
