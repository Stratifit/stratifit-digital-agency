"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  reviewSummarySchema,
  type ReviewSummaryFormValues,
} from "@/features/section-settings/schemas";
import { updateReviewSummary } from "@/features/section-settings/mutations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { REVIEW_SUMMARY_DEFAULTS } from "@/components/sections/review-summary-band";

interface ReviewSummaryEditorProps {
  /** Stored values, or null when the section row/band has no saved data yet. */
  current: ReviewSummaryFormValues | null;
}

/**
 * Reviews summary editor for the admin Testimonials page. Edits the ratings
 * and review counts shown at the top of the public reviews page and saves
 * them to `section_settings.review_summary` (testimonials section).
 */
export function ReviewSummaryEditor({ current }: ReviewSummaryEditorProps) {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [saved, setSaved] = React.useState(false);
  const [pending, startTransition] = React.useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReviewSummaryFormValues>({
    resolver: zodResolver(reviewSummarySchema),
    defaultValues: current ?? REVIEW_SUMMARY_DEFAULTS,
  });

  function onSubmit(values: ReviewSummaryFormValues) {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const result = await updateReviewSummary(values);
      if (!result.success) {
        setError(result.error);
        return;
      }
      setSaved(true);
      router.refresh();
    });
  }

  return (
    <div className="rounded-card border border-card-border bg-card-dark p-5 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-base font-semibold tracking-tight text-text-primary">
            Reviews summary
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            Ratings and review counts shown at the top of the reviews page.
          </p>
        </div>
        <Button
          type="button"
          variant="primary"
          size="small"
          loading={pending}
          onClick={handleSubmit(onSubmit)}
        >
          Save Reviews Summary
        </Button>
      </div>

      <form
        className="mt-4 space-y-4"
        onSubmit={handleSubmit(onSubmit)}
        aria-label="Reviews summary"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="review-rating">Client rating</Label>
            <Input
              id="review-rating"
              placeholder="4.9"
              aria-invalid={Boolean(errors.rating)}
              {...register("rating")}
            />
            {errors.rating ? (
              <p className="text-xs text-error">{errors.rating.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="review-verified">Verified client reviews</Label>
            <Input
              id="review-verified"
              type="number"
              min={0}
              placeholder="47"
              {...register("verifiedReviews", { valueAsNumber: true })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="review-google-rating">Google rating</Label>
            <Input
              id="review-google-rating"
              placeholder="4.9"
              aria-invalid={Boolean(errors.googleRating)}
              {...register("googleRating")}
            />
            {errors.googleRating ? (
              <p className="text-xs text-error">
                {errors.googleRating.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="review-google-count">Google reviews</Label>
            <Input
              id="review-google-count"
              type="number"
              min={0}
              placeholder="18"
              {...register("googleReviews", { valueAsNumber: true })}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="review-google-url">Google reviews URL</Label>
            <Input
              id="review-google-url"
              placeholder="https://www.google.com/maps/…"
              {...register("googleReviewsUrl")}
            />
          </div>
        </div>

        {error ? (
          <p
            role="alert"
            className="rounded-card bg-error-soft px-3 py-2 text-sm text-error"
          >
            {error}
          </p>
        ) : null}
        {saved ? (
          <p
            role="status"
            className="rounded-card bg-success-soft px-3 py-2 text-sm text-success"
          >
            Reviews summary saved.
          </p>
        ) : null}
      </form>
    </div>
  );
}
