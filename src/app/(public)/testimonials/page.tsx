import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocale } from "@/lib/i18n/get-locale";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { getPublicTestimonials } from "@/features/testimonials/queries";
import { getPublicSectionSetting } from "@/features/section-settings/queries";
import { pageMetadata } from "@/lib/seo";
import { Reveal } from "@/components/ui/reveal";
import { TestimonialCard } from "@/components/sections/testimonial-card";

export const metadata = pageMetadata({
  title: "Testimonials — Stratifit",
  description:
    "Don't take our word for it — hear from the brands we've helped scale.",
  path: "/testimonials",
});

function ArrowLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="size-5"
    >
      <path
        fillRule="evenodd"
        d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default async function TestimonialsPage() {
  const locale = await getLocale();
  const [testimonials, settings] = await Promise.all([
    getPublicTestimonials(50),
    getPublicSectionSetting("testimonials"),
  ]);

  if (testimonials.length === 0) {
    notFound();
  }

  const eyebrow =
    resolveTranslation(settings?.eyebrow_translations ?? null, locale) ??
    "Testimonials";
  const title =
    resolveTranslation(settings?.title_translations ?? null, locale) ??
    "What Our Clients";
  const highlight =
    resolveTranslation(settings?.highlight_translations ?? null, locale) ?? null;
  const description =
    resolveTranslation(settings?.description_translations ?? null, locale) ??
    "Don't take our word for it — hear from the brands we've helped scale.";

  return (
    <>
      {/* Back button */}
      <Link
        href="/"
        aria-label="Go back"
        className="fixed left-1 top-16 z-50 rounded-full bg-white/5 p-2 text-text-primary backdrop-blur-sm transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-white/10 lg:top-20"
      >
        <span className="transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:text-primary">
          <ArrowLeftIcon />
        </span>
      </Link>

      {/* Hero */}
      <section className="relative overflow-hidden pb-16 pt-32 md:pb-20 md:pt-40">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]"
        />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal immediate variant="revealUp">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              {eyebrow}
            </p>
            <h1 className="mb-4 font-display text-4xl font-black leading-tight tracking-tight text-text-primary sm:text-5xl md:text-6xl md:leading-none lg:text-7xl">
              {title}
              {highlight ? (
                <span className="text-primary"> {highlight}</span>
              ) : null}
            </h1>
            <p className="mt-3 max-w-2xl border-l-2 border-primary/50 pl-4 text-base leading-relaxed text-text-muted sm:pl-6 sm:text-lg md:text-xl">
              {description}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Testimonials grid */}
      <section className="pb-24 md:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                testimonial={testimonial}
                locale={locale}
                className="h-full"
              />
            ))}
          </Reveal>
        </div>
      </section>
    </>
  );
}
