export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div
        className="flex flex-col items-center gap-4"
        role="status"
        aria-label="Loading"
      >
        <span className="relative flex size-12 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-primary/10" />
          <span className="size-10 animate-spin rounded-full border-2 border-card-border border-t-primary shadow-amber" />
        </span>
        <p className="text-sm font-medium text-text-muted">Loading…</p>
      </div>
    </div>
  );
}
