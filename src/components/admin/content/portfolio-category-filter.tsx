"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { AdminServiceOption } from "@/features/content/admin-queries";

/**
 * Category filter for the portfolio list. A GET form so the selection is a
 * shareable URL (?category=brand-design); changing it submits immediately.
 */
export function PortfolioCategoryFilter({
  services,
}: {
  services: AdminServiceOption[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("category") ?? "";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <label
        htmlFor="portfolio-category-filter"
        className="text-sm font-medium text-text-secondary"
      >
        Section
      </label>
      <select
        id="portfolio-category-filter"
        value={current}
        onChange={(e) => {
          const value = e.target.value;
          const params = new URLSearchParams(searchParams.toString());
          if (value) params.set("category", value);
          else params.delete("category");
          router.push(`/admin/content/portfolio?${params.toString()}`);
          router.refresh();
        }}
        className="h-10 cursor-pointer appearance-none rounded-input border border-field-border bg-field-bg pl-3.5 pr-9 text-sm font-medium text-field-text transition-[border-color,background-color] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-field-border-hover focus-visible:border-primary focus-visible:outline-none focus-visible:outline-offset-2"
      >
        <option value="">All sections</option>
        {services.map((service) => (
          <option key={service.slug} value={service.slug}>
            {service.label}
          </option>
        ))}
      </select>
    </div>
  );
}