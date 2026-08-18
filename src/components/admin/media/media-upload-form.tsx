"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import {
  uploadMediaAsset,
  type MediaActionResult,
} from "@/features/media/mutations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";

const BUCKETS = [
  { value: "general-media", label: "General Media" },
  { value: "logos", label: "Logos" },
  { value: "portfolio-images", label: "Portfolio Images" },
  { value: "insights-images", label: "Insights Images" },
] as const;

const initialState: MediaActionResult | null = null;

async function uploadAction(
  _prevState: MediaActionResult | null,
  formData: FormData
): Promise<MediaActionResult> {
  try {
    return await uploadMediaAsset(formData);
  } catch {
    // Server actions can reject (request body limits, network errors) even
    // though uploadMediaAsset returns results; surface a message instead of
    // letting the error bubble into the page error boundary.
    return { success: false, error: "Upload failed. Please try again." };
  }
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending} disabled={pending}>
      {pending ? "Uploading..." : "Upload Asset"}
    </Button>
  );
}

export function MediaUploadForm() {
  const [state, formAction] = React.useActionState(uploadAction, initialState);
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <Card>
      <div className="mb-5">
        <h2 className="font-display text-lg font-semibold text-text-primary">
          Upload New Asset
        </h2>
        <p className="mt-1 text-sm text-text-secondary">
          Add images, logos, and visual assets to the media library.
        </p>
      </div>

      <form ref={formRef} action={formAction} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="media-file">File</Label>
          <input
            id="media-file"
            name="file"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/avif"
            required
            className="block w-full cursor-pointer rounded-input border border-card-border bg-card-dark text-sm text-text-secondary file:mr-4 file:cursor-pointer file:rounded-sm file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-text-inverse transition-[border-color] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-card-border-hover focus-visible:border-card-border-active focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-card-focus focus-visible:outline-offset-2"
          />
          <p className="text-xs text-text-muted">
            Max 10 MB. Allowed: JPG, PNG, WebP, GIF, SVG, AVIF.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="media-bucket">Bucket</Label>
            <Select id="media-bucket" name="bucket" defaultValue="general-media">
              {BUCKETS.map((bucket) => (
                <option key={bucket.value} value={bucket.value}>
                  {bucket.label}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="media-alt-text">Alt Text (English)</Label>
            <Input
              id="media-alt-text"
              name="alt_text"
              placeholder="Describe the image for accessibility"
            />
          </div>
        </div>

        {state && !state.success ? (
          <p
            role="alert"
            className="rounded-card bg-error-soft px-3 py-2 text-sm text-error"
          >
            {state.error}
          </p>
        ) : null}
        {state?.success ? (
          <p
            role="status"
            className="rounded-card bg-success-soft px-3 py-2 text-sm text-success"
          >
            Asset uploaded successfully.
          </p>
        ) : null}

        <SubmitButton />
      </form>
    </Card>
  );
}
