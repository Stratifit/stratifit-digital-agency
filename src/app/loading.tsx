export default function Loading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4" role="status" aria-label="Loading">
        <span className="size-10 animate-spin rounded-full border-2 border-card-border border-t-primary" />
        <p className="text-sm font-medium text-text-muted">Loading…</p>
      </div>
    </div>
  );
}
