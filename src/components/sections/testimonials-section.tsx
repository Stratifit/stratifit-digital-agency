import { getPublicTestimonials } from "@/features/testimonials/queries";
import { getPublicSectionSetting } from "@/features/section-settings/queries";
import { getLocale } from "@/lib/i18n/get-locale";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";
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
    <Section>
      <Container>
        <SectionHeader settings={settings} locale={locale} align="center" />
        <Reveal variant="card" className="mt-12">
          <TestimonialsCarousel
            testimonials={testimonials}
            locale={locale}
          />
        </Reveal>
      </Container>
    </Section>
  );
}
