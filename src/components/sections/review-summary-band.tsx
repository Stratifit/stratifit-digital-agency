import { ArrowUpRight, Users } from "lucide-react";

const GOOGLE_REVIEWS_URL =
  "https://www.google.com/maps/search/?api=1&query=Stratifit";

function StarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="size-4 text-primary"
    >
      <path
        fillRule="evenodd"
        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function Stars({ label }: { label: string }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={label}>
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon key={i} />
      ))}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

/**
 * Review summary band shown at the top of the reviews grid: an overall
 * client-satisfaction summary on the left and a Google Reviews summary with a
 * link to the full listing on the right.
 */
export function ReviewSummaryBand({
  rating = "4.9",
  verifiedReviews = 47,
  googleRating = "4.9",
  googleReviews = 18,
  googleReviewsUrl = GOOGLE_REVIEWS_URL,
}: {
  rating?: string;
  verifiedReviews?: number;
  googleRating?: string;
  googleReviews?: number;
  googleReviewsUrl?: string;
}) {
  return (
    <div className="flex flex-col divide-y divide-primary/15 overflow-hidden rounded-card border border-primary/25 bg-card-dark md:flex-row md:items-stretch md:divide-x md:divide-y-0">
      {/* Client satisfaction */}
      <div className="flex items-center gap-4 p-6 md:flex-1 md:p-8">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary">
          <Users className="size-5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-display text-2xl font-black tracking-tight text-text-primary">
              {rating}
            </span>
            <Stars label={`${rating} out of 5 stars`} />
          </div>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary">
            Client Satisfaction
          </p>
          <p className="mt-1 text-xs text-text-muted">
            Based on{" "}
            <span className="font-semibold text-primary">{verifiedReviews}</span>{" "}
            verified client reviews
          </p>
        </div>
      </div>

      {/* Google reviews */}
      <div className="flex items-center gap-4 p-6 md:flex-1 md:p-8">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/10">
          <GoogleIcon />
        </div>
        <div className="min-w-0">
          <p className="font-display text-sm font-bold text-text-primary">
            Google
          </p>
          <div className="flex items-center gap-2">
            <span className="font-display text-2xl font-black tracking-tight text-text-primary">
              {googleRating}
            </span>
            <Stars label={`${googleRating} out of 5 stars`} />
          </div>
          <p className="mt-1 text-xs text-text-muted">
            Based on{" "}
            <span className="font-semibold text-primary">{googleReviews}</span>{" "}
            Google reviews
          </p>
        </div>
      </div>

      {/* See all reviews CTA */}
      <a
        href={googleReviewsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-3 p-6 text-left transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-primary/5 focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-primary md:shrink-0 md:p-8"
      >
        <span className="flex flex-col">
          <span className="text-sm font-semibold text-text-primary">
            See all reviews
          </span>
          <span className="text-xs text-text-muted">on Google</span>
        </span>
        <ArrowUpRight
          className="size-4 shrink-0 text-primary transition-transform duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </a>
    </div>
  );
}
