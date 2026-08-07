"use client";

import * as React from "react";
import Link from "next/link";
import type { PublicPricingPlan } from "@/features/pricing/queries";
import { ContactTrigger } from "@/components/contact/contact-trigger";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { cn } from "@/lib/cn";

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="mt-0.5 size-4 shrink-0 text-primary"
    >
      <path
        fillRule="evenodd"
        d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function PlanCard({
  plan,
  locale,
  mobile,
}: {
  plan: PublicPricingPlan;
  locale: string;
  mobile?: boolean;
}) {
  const features = (
    (plan.features_translations as Record<string, unknown> | null)?.[locale] ??
    (plan.features_translations as Record<string, unknown> | null)?.["en"] ??
    []
  ) as string[];

  const name = resolveTranslation(plan.name_translations, locale);
  const price = resolveTranslation(plan.price_label_translations, locale);
  const billing = resolveTranslation(plan.billing_label_translations, locale);
  const description = resolveTranslation(
    plan.description_translations,
    locale
  );
  const ctaLabel =
    resolveTranslation(plan.cta_label_translations, locale) || "Get Started";

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-card border bg-card-dark p-6 transition-all duration-[var(--motion-medium)] ease-[var(--ease-standard)] md:p-8",
        mobile
          ? "min-w-[280px] w-[80vw] max-w-[320px] h-[500px] shrink-0 snap-center"
          : "h-full",
        plan.is_featured
          ? "border-primary shadow-[0_0_30px_rgba(245,158,11,0.15)]"
          : "border-card-border hover:border-primary/20"
      )}
    >
      {plan.is_featured ? (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-black">
          Most Popular
        </div>
      ) : null}

      <h3 className={cn("mb-2 font-display font-bold text-text-primary", mobile ? "text-xl" : "text-2xl")}>
        {name}
      </h3>
      <div className="mb-1 flex items-baseline gap-1">
        <span className={cn("font-display font-black text-primary", mobile ? "text-2xl" : "text-3xl")}>
          {price}
        </span>
        {billing ? (
          <span className="text-xs font-bold uppercase text-text-subtle">
            {billing}
          </span>
        ) : null}
      </div>
      <p className={cn("text-sm text-text-muted", mobile ? "mb-6" : "mb-8")}>
        {description}
      </p>
      <div className={cn("h-px w-full bg-white/5", mobile ? "mb-5" : "mb-6")} />
      <ul className={cn("flex-1 space-y-3", mobile ? "mb-6 space-y-2.5" : "mb-8")}>
        {features.map((feature, index) => (
          <li
            key={index}
            className="flex items-start gap-3 text-sm text-text-tertiary"
          >
            <CheckIcon />
            {feature}
          </li>
        ))}
      </ul>
      {plan.cta_url && plan.cta_url !== "/contact" ? (
        <Link
          href={plan.cta_url}
          className={cn(
            "block w-full rounded-button py-3.5 text-center text-sm font-bold uppercase tracking-wide transition-all duration-[var(--motion-fast)] ease-[var(--ease-standard)]",
            plan.is_featured
              ? "border border-transparent bg-primary text-text-inverse shadow-lg shadow-primary/20 hover:bg-primary-hover active:bg-primary-active focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-primary/35 focus-visible:outline-offset-2"
              : "border border-primary text-primary hover:bg-primary/10"
          )}
        >
          {ctaLabel}
        </Link>
      ) : (
        <ContactTrigger
          className={cn(
            "block w-full rounded-button py-3.5 text-center text-sm font-bold uppercase tracking-wide transition-all duration-[var(--motion-fast)] ease-[var(--ease-standard)]",
            plan.is_featured
              ? "border border-transparent bg-primary text-text-inverse shadow-lg shadow-primary/20 hover:bg-primary-hover active:bg-primary-active focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-primary/35 focus-visible:outline-offset-2"
              : "border border-primary text-primary hover:bg-primary/10"
          )}
        >
          {ctaLabel}
        </ContactTrigger>
      )}
    </div>
  );
}

export function PricingPlans({
  plans,
  locale,
}: {
  plans: PublicPricingPlan[];
  locale: string;
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const featuredIndex = Math.max(
    0,
    plans.findIndex((plan) => plan.is_featured)
  );
  const [active, setActive] = React.useState(featuredIndex);

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const cards = Array.from(
      el.querySelectorAll<HTMLElement>("[data-plan-card]")
    );
    const card = cards[featuredIndex];
    if (!card) return;
    const elRect = el.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const target =
      el.scrollLeft +
      (cardRect.left - elRect.left) -
      (elRect.width - cardRect.width) / 2;
    el.scrollTo({ left: target, behavior: "auto" });
  }, [featuredIndex]);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-plan-card]"));
    let best = 0;
    let bestDistance = Infinity;
    cards.forEach((card, index) => {
      const cardRect = card.getBoundingClientRect();
      const mid = cardRect.left + cardRect.width / 2;
      const distance = Math.abs(mid - center);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = index;
      }
    });
    setActive(best);
  }

  return (
    <div>
      <div className="hidden gap-6 md:grid md:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => (
          <PlanCard key={plan.slug} plan={plan} locale={locale} />
        ))}
      </div>

      <div className="md:hidden">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="-mx-6 flex touch-pan-x touch-pan-y snap-x snap-mandatory gap-4 overflow-x-auto px-6 pt-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:-mx-8 lg:px-8"
        >
          {plans.map((plan) => (
            <div key={plan.slug} data-plan-card>
              <PlanCard plan={plan} locale={locale} mobile />
            </div>
          ))}
        </div>
        {plans.length > 1 ? (
          <div className="mt-3 flex items-center justify-center gap-1.5">
            {plans.map((plan, index) => (
              <span
                key={plan.slug}
                className={cn(
                  "size-1.5 rounded-full transition-colors duration-200 ease-out",
                  index === active ? "bg-primary" : "bg-white/20"
                )}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
