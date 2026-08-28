"use client";

import * as React from "react";
import Link from "next/link";
import type { PublicTestimonial } from "@/features/testimonials/queries";
import { cn } from "@/lib/cn";
import { t } from "@/lib/i18n/ui-strings";
import { TestimonialCard } from "./testimonial-card";

function ArrowIcon({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={cn("size-5", className)}><path d="M5 12h14m-5-5 5 5-5 5" /></svg>;
}

function ChevronLeftIcon() {
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-5"><path fillRule="evenodd" d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" /></svg>;
}

export function TestimonialsCarousel({ testimonials, locale }: { testimonials: PublicTestimonial[]; locale: string }) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState(0);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-testimonial-card]"));
    let best = 0;
    let bestDistance = Infinity;
    cards.forEach((card, index) => {
      const cardRect = card.getBoundingClientRect();
      const distance = Math.abs(cardRect.left + cardRect.width / 2 - center);
      if (distance < bestDistance) { bestDistance = distance; best = index; }
    });
    setActive(best);
  }

  function scrollByCard(direction: number) {
    scrollRef.current?.scrollBy({ left: direction * 380, behavior: "smooth" });
  }

  return <div>
    <div className="relative">
      <div ref={scrollRef} onScroll={handleScroll} className="-mx-6 flex touch-pan-x touch-pan-y overscroll-x-contain snap-x snap-proximity gap-8 overflow-x-auto px-6 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:-mx-8 lg:px-8">
        {testimonials.map((testimonial, index) => <div key={index} data-testimonial-card className="w-[300px] min-w-[300px] shrink-0 snap-center sm:w-[360px] md:w-[400px]"><TestimonialCard testimonial={testimonial} locale={locale} /></div>)}
      </div>
      <button type="button" aria-label={t(locale, "scrollLeft")} onClick={() => scrollByCard(-1)} className="absolute -left-20 top-1/2 z-10 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/70 text-white shadow-lg backdrop-blur-sm transition-all duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-primary hover:text-black md:flex"><ChevronLeftIcon /></button>
      <button type="button" aria-label={t(locale, "scrollRight")} onClick={() => scrollByCard(1)} className="absolute -right-20 top-1/2 z-10 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/70 text-white shadow-lg backdrop-blur-sm transition-all duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-primary hover:text-black md:flex"><ArrowIcon /></button>
    </div>
    <div className="relative mt-6 flex items-center justify-center gap-1.5">
      {testimonials.length > 1 ? testimonials.map((testimonial, index) => <span key={index} className={cn("size-2 rounded-full transition-colors duration-200 ease-out", index === active ? "bg-primary" : "border border-white/30 bg-transparent")} />) : null}
      <Link href="/testimonials" className="group absolute right-0 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-primary transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:brightness-110 sm:text-xs">{t(locale, "viewAllStories")}<span className="transition-transform group-hover:translate-x-0.5"><ArrowIcon className="size-4" /></span></Link>
    </div>
  </div>;
}
