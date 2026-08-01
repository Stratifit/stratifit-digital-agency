import { getPublicServices } from "@/features/services/queries";
import { getLocale } from "@/lib/i18n/get-locale";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

function ServiceIcon({ name }: { name: string | null }) {
  const icon = (name ?? "").toLowerCase();

  const paths: Record<string, string> = {
    palette:
      "M12.16 3h-.32L9.21 8.25h5.58zM16.46 8.25h5.16L19 3h-5.16zM21.38 9.75h-8.63V20.1zM11.25 20.1V9.75H2.62zM7.54 8.25 10.16 3H5L2.38 8.25z",
    code: "M9.4 16.6 4.8 12l4.6-4.6L8 6l-6 6 6 6zm5.2 0 4.6-4.6-4.6-4.6L16 6l6 6-6 6z",
    brain:
      "M9.4 16.6 4.8 12l4.6-4.6L8 6l-6 6 6 6zm5.2 0 4.6-4.6-4.6-4.6L16 6l6 6-6 6z",
    robot:
      "M9.19 6.35c-2.04 2.29-3.44 5.58-3.57 5.89L2 10.69l4.05-4.05c.47-.47 1.15-.68 1.81-.55zM11.17 17s3.74-1.55 5.89-3.7c5.4-5.4 4.5-9.62 4.21-10.57-.95-.3-5.17-1.19-10.57 4.21C8.55 9.09 7 12.83 7 12.83zm6.48-2.19c-2.29 2.04-5.58 3.44-5.89 3.57L13.31 22l4.05-4.05c.47-.47.68-1.15.55-1.81zM9 18c0 .83-.34 1.58-.88 2.12C6.94 21.3 2 22 2 22s.7-4.94 1.88-6.12A2.996 2.996 0 0 1 9 18m4-9c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2",
    trendingup:
      "M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z",
    search: "M9.5 3a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM15.5 14l5 5-1.5 1.5-5-5z",
    map: "M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11z",
    rocket:
      "M9.19 6.35c-2.04 2.29-3.44 5.58-3.57 5.89L2 10.69l4.05-4.05c.47-.47 1.15-.68 1.81-.55zM11.17 17s3.74-1.55 5.89-3.7c5.4-5.4 4.5-9.62 4.21-10.57-.95-.3-5.17-1.19-10.57 4.21C8.55 9.09 7 12.83 7 12.83zm6.48-2.19c-2.29 2.04-5.58 3.44-5.89 3.57L13.31 22l4.05-4.05c.47-.47.68-1.15.55-1.81z",
    trendingup2:
      "M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z",
    bolt: "M13 2 3 14h7l-1 8 10-12h-7z",
    shield:
      "M12 2 4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5z",
    users:
      "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z",
    check:
      "M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",
  };

  const d = paths[icon] ?? paths.check;

  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-primary"
      style={{ width: 22, height: 22 }}
      aria-hidden="true"
    >
      <path d={d} />
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
          <p className="mt-3 max-w-2xl border-l-2 border-primary/50 pl-4 text-sm leading-relaxed text-text-secondary sm:pl-6 sm:text-base md:text-lg">
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
                className="group relative flex flex-col overflow-hidden rounded-radius-xl border border-border-subtle bg-surface p-6 shadow-shadow-lg transition-colors duration-[var(--motion-medium)] ease-[var(--ease-standard)] hover:border-border-interactive md:p-8"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/5 blur-3xl transition-colors duration-[var(--motion-medium)] ease-[var(--ease-standard)] group-hover:bg-primary/10"
                />

                <div className="relative z-10 flex flex-col gap-6">
                  <div className="flex size-14 items-center justify-center rounded-full border border-primary/30 bg-gradient-to-br from-primary/20 to-primary/5 shadow-shadow-amber">
                    <ServiceIcon name={service.icon_name} />
                  </div>

                  <div>
                    <h3 className="mb-2 font-display text-2xl font-bold tracking-tight text-text-primary">
                      {resolveTranslation(service.title_translations, locale)}
                    </h3>
                    <p className="text-sm font-medium leading-relaxed text-text-secondary">
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
                            <svg
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              aria-hidden="true"
                              className="mt-[-1px] shrink-0 text-primary"
                              style={{ width: 18, height: 18 }}
                            >
                              <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                            <span className="text-sm font-medium text-text-secondary">
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
                    className="group/link mt-2 flex w-full items-center justify-center gap-2 rounded-radius-md border border-border-subtle bg-white/5 py-4 text-sm font-bold text-primary transition-all duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-primary/30 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {ctaLabel}
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                      className="transition-transform duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-hover/link:translate-x-1"
                      style={{ width: 18, height: 18 }}
                    >
                      <path d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z" />
                    </svg>
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
