import { getPublicTestimonials } from "@/features/testimonials/queries";
import { getLocale } from "@/lib/i18n/get-locale";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";

export async function TestimonialsSection() {
  const locale = await getLocale();
  const testimonials = await getPublicTestimonials(3);

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
            What Our Clients Say
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="flex flex-col">
              <p className="flex-1 text-base leading-7 text-text-primary">
                &ldquo;{resolveTranslation(testimonial.quote_translations, locale)}&rdquo;
              </p>
              <div className="mt-6">
                <p className="font-medium text-text-primary">
                  {testimonial.person_name}
                </p>
                <p className="text-sm text-text-muted">
                  {resolveTranslation(testimonial.person_role_translations, locale)}
                  {testimonial.company_name
                    ? ` — ${testimonial.company_name}`
                    : ""}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}


