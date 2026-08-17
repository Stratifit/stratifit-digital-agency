import { getPublicTestimonials } from "@/features/testimonials/queries";
import { getPublicSectionSetting } from "@/features/section-settings/queries";
import { getLocale } from "@/lib/i18n/get-locale";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";
import {
  ReviewSummaryBand,
  REVIEW_SUMMARY_DEFAULTS,
} from "./review-summary-band";
import { TestimonialsCarousel } from "./testimonials-carousel";

export async function TestimonialsSection() {
  const locale = await getLocale();
  const [testimonials, settings] = await Promise.all([
    getPublicTestimonials(8),
    getPublicSectionSetting("testimonials"),
  ]);

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <>
    <Section>
      <Container>
        <SectionHeader settings={settings} locale={locale} />
        <Reveal className="mt-8">
          <ReviewSummaryBand
            locale={locale}
            {...settings?.review_summary}
            googleReviewsUrl={
              settings?.review_summary?.googleReviewsUrl ||
              REVIEW_SUMMARY_DEFAULTS.googleReviewsUrl
            }
          />
        </Reveal>
        <Reveal variant="card" className="mt-12" cardSelector="[data-testimonial-card]">
          <TestimonialsCarousel
            testimonials={testimonials}
            locale={locale}
          />
        </Reveal>
      </Container>
    </Section>
    <div aria-hidden="true" className="h-px w-full bg-white/5" />
    </>
  );
}
