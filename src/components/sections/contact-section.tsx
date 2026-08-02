import { getPublicServices } from "@/features/services/queries";
import { getPublicSectionSetting } from "@/features/section-settings/queries";
import { getLocale } from "@/lib/i18n/get-locale";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { ContactForm } from "@/components/forms/contact-form";

const TRUST_POINTS = [
  {
    title: "Response within 24 hours",
    description: "Every enquiry gets a personal reply.",
  },
  {
    title: "Free consultation",
    description: "Clear scope and roadmap before any commitment.",
  },
  {
    title: "No obligation",
    description: "Explore options with zero pressure.",
  },
  {
    title: "Multilingual team",
    description: "English, German, French, and Spanish.",
  },
];

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="size-4"
    >
      <path
        fillRule="evenodd"
        d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l4.894 4.893 8.48-12.72a.75.75 0 0 1 1.04-.208Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export async function ContactSection() {
  const locale = await getLocale();
  const [services, settings] = await Promise.all([
    getPublicServices(),
    getPublicSectionSetting("contact"),
  ]);

  return (
    <Section>
      <Container>
        <div className="overflow-hidden rounded-[32px] border border-card-border bg-card-dark">
          <div className="grid lg:grid-cols-2">
            <div className="flex flex-col p-8 sm:p-10 lg:border-r lg:border-card-border lg:p-12">
              <SectionHeader settings={settings} locale={locale} />
              <ul className="mt-2 grid gap-3 sm:grid-cols-2">
                {TRUST_POINTS.map((point) => (
                  <li
                    key={point.title}
                    className="flex items-start gap-3 rounded-[16px] border border-card-border bg-background/40 p-4"
                  >
                    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <CheckIcon />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">
                        {point.title}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-text-muted">
                        {point.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-8 sm:p-10 lg:p-12">
              <ContactForm services={services} locale={locale} />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
