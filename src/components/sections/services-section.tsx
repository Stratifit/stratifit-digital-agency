import { getPublicServices } from "@/features/services/queries";
import { getPublicServicePages } from "@/features/service-pages/queries";
import { getPublicSectionSetting } from "@/features/section-settings/queries";
import { getLocale } from "@/lib/i18n/get-locale";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { t } from "@/lib/i18n/ui-strings";
import { ContactTrigger } from "@/components/contact/contact-trigger";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { ServiceCard } from "./service-card";

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="size-[18px] transition-transform duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-hover/link:translate-x-1"
    >
      <path
        fillRule="evenodd"
        d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/** Full-width CTA — spans the entire card. */
const FULL_CTA_CLASS =
  "group/link flex w-full items-center justify-center gap-2 rounded-button border border-transparent bg-primary py-4 text-sm font-bold text-text-inverse transition-[background-color,border-color,transform] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary-hover active:translate-y-0 active:border-primary/60 active:bg-primary-active focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-primary/35 focus-visible:outline-offset-2";

/** Compact CTA — smaller, left-aligned, no arrow. */
const COMPACT_CTA_CLASS =
  "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-button font-medium transition-[background-color,border-color,color,box-shadow,transform] duration-[var(--motion-fast)] ease-[var(--ease-standard)] focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-primary/35 focus-visible:outline-offset-2 border border-transparent bg-primary text-text-inverse hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary-hover active:translate-y-0 active:border-primary/60 active:bg-primary-active shadow-shadow-amber h-9 px-3.5 text-sm";

export async function ServicesSection() {
  const locale = await getLocale();
  const [services, settings, servicePages] = await Promise.all([
    getPublicServices(),
    getPublicSectionSetting("services"),
    getPublicServicePages(),
  ]);

  if (services.length === 0) {
    return null;
  }

  const pageSlugs = new Set(servicePages.map((p) => p.slug));

  return (
    <Section>
      <Container>
        <SectionHeader settings={settings} locale={locale} />

        <Reveal stagger variant="card" className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => {
            const ctaLabel =
              resolveTranslation(service.cta_label_translations, locale) ||
              t(locale, "learnMore");
            const ctaClassName =
              service.cta_style === "compact"
                ? COMPACT_CTA_CLASS
                : FULL_CTA_CLASS;

            return (
              <ServiceCard
                key={service.slug}
                service={service}
                locale={locale}
                cta={
                  pageSlugs.has(service.slug) ||
                  (service.cta_url && service.cta_url !== "/contact") ? (
                    <Link
                      href={
                        pageSlugs.has(service.slug)
                          ? `/services/${service.slug}`
                          : service.cta_url ?? "/contact"
                      }
                      className={ctaClassName}
                    >
                      {ctaLabel}
                      {service.cta_style === "compact" ? null : <ArrowIcon />}
                    </Link>
                  ) : (
                    <ContactTrigger className={ctaClassName}>
                      {ctaLabel}
                      {service.cta_style === "compact" ? null : <ArrowIcon />}
                    </ContactTrigger>
                  )
                }
              />
            );
          })}
        </Reveal>

      </Container>
      {/* 1px white separator at the end of the section */}
      <div aria-hidden="true" className="h-px w-full bg-white/5" />
    </Section>
  );
}

