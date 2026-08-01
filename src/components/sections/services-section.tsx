import { getPublicServices } from "@/features/services/queries";
import { getLocale } from "@/lib/i18n/get-locale";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { ServiceIcon } from "@/components/ui/service-icon";

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="mt-[-1px] shrink-0 text-primary"
      style={{ width: 18, height: 18 }}
    >
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="text-lg transition-transform duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-hover/link:translate-x-1"
      style={{ width: 18, height: 18 }}
    >
      <path
        fillRule="evenodd"
        d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export async function ServicesSection() {
  const locale = await getLocale();
  const services = await getPublicServices();

  if (services.length === 0) {
    return null;
  }

  return (
    <Section>
      <Container>
        <div className="mb-10 md:mb-16">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-primary">
            Services
          </p>
          <h2 className="mb-3 font-display text-3xl font-black leading-tight tracking-tight text-text-primary sm:text-4xl md:text-5xl lg:text-6xl md:leading-none">
            Our Core <span className="text-primary">Services</span>
          </h2>
          <p className="mt-3 max-w-2xl border-l-2 border-primary/50 pl-4 text-sm leading-relaxed text-text-muted sm:pl-6 sm:text-base md:text-lg">
            Strategic solutions engineered to scale your digital presence with
            precision and luxury.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => {
            const deliverables = (
              (service.deliverables_translations as Record<string, unknown> | null)?.[
                locale
              ] ??
              (service.deliverables_translations as Record<string, unknown> | null)?.[
                "en"
              ] ??
              []
            ) as string[];

            const ctaLabel =
              resolveTranslation(service.cta_label_translations, locale) || "Learn More";

            return (
              <div
                key={service.slug}
                className="group relative flex flex-col overflow-hidden rounded-[10px] border border-card-border bg-card-dark p-6 shadow-shadow-lg transition-[border-color,transform,background-color] duration-[var(--motion-medium)] ease-[var(--ease-standard)] hover:-translate-y-0.5 hover:border-card-border-hover active:translate-y-0 active:border-card-border-active active:bg-card-active focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-card-focus focus-visible:outline-offset-2 md:p-8"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/5 blur-3xl transition-all duration-[var(--motion-medium)] ease-[var(--ease-standard)] group-hover:bg-primary/10"
                />

                <div className="relative z-10 flex flex-col gap-6">
                  <div className="flex size-14 items-center justify-center rounded-full border border-primary/30 bg-gradient-to-br from-primary/20 to-primary/5 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                    <ServiceIcon name={service.icon_name} />
                  </div>

                  <div>
                    <h3 className="mb-2 font-display text-2xl font-bold tracking-tight text-text-primary">
                      {resolveTranslation(service.title_translations, locale)}
                    </h3>
                    <p className="text-sm font-medium leading-relaxed text-text-muted">
                      {resolveTranslation(
                        service.short_description_translations,
                        locale
                      )}
                    </p>
                  </div>

                  <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent" />

                  {deliverables.length > 0 ? (
                    <div>
                      <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-primary opacity-90">
                        Key Deliverables
                      </p>
                      <ul className="space-y-3">
                        {deliverables.slice(0, 4).map((item, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckIcon />
                            <span className="text-sm font-medium text-text-tertiary">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  <div className="flex-1" />

                  <a
                    href={service.cta_url ?? "/contact"}
                    className="group/link mt-2 flex w-full items-center justify-center gap-2 rounded-[10px] border border-transparent bg-primary py-4 text-sm font-bold text-text-inverse transition-[background-color,border-color,transform] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary-bright active:translate-y-0 active:border-primary/60 active:bg-primary-deep focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-primary/60 focus-visible:outline-offset-2"
                  >
                    {ctaLabel}
                    <ArrowIcon />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}

