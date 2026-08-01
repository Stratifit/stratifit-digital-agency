import { getPublicServices } from "@/features/services/queries";
import { getLocale } from "@/lib/i18n/get-locale";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

const ICONS: Record<string, string> = {
  // Brand Design — palette
  palette:
    "M12.16 3h-.32L9.21 8.25h5.58zM16.46 8.25h5.16L19 3h-5.16zM21.38 9.75h-8.63V20.1zM11.25 20.1V9.75H2.62zM7.54 8.25 10.16 3H5L2.38 8.25z",
  // Website Development — wrench/build
  code: "m16.24 11.51 1.57-1.57-3.75-3.75-1.57 1.57-4.14-4.13c-.78-.78-2.05-.78-2.83 0l-1.9 1.9c-.78.78-.78 2.05 0 2.83l4.13 4.13L3 17.25V21h3.75l4.76-4.76 4.13 4.13c.95.95 2.23.6 2.83 0l1.9-1.9c.78-.78.78-2.05 0-2.83zm-7.06-.44L5.04 6.94l1.89-1.9L8.2 6.31 7.02 7.5l1.41 1.41 1.19-1.19 1.45 1.45zm7.88 7.89-4.13-4.13 1.9-1.9 1.45 1.45-1.19 1.19 1.41 1.41 1.19-1.19 1.27 1.27zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34c-.47-.47-1.12-.29-1.41 0l-1.83 1.83 3.75 3.75z",
  // AI & Automation — code brackets
  brain: "M9.4 16.6 4.8 12l4.6-4.6L8 6l-6 6 6 6zm5.2 0 4.6-4.6-4.6-4.6L16 6l6 6-6 6z",
  // Growth & Marketing — rocket
  trendingup:
    "M9.19 6.35c-2.04 2.29-3.44 5.58-3.57 5.89L2 10.69l4.05-4.05c.47-.47 1.15-.68 1.81-.55zM11.17 17s3.74-1.55 5.89-3.7c5.4-5.4 4.5-9.62 4.21-10.57-.95-.3-5.17-1.19-10.57 4.21C8.55 9.09 7 12.83 7 12.83zm6.48-2.19c-2.29 2.04-5.58 3.44-5.89 3.57L13.31 22l4.05-4.05c.47-.47.68-1.15.55-1.81zM9 18c0 .83-.34 1.58-.88 2.12C6.94 21.3 2 22 2 22s.7-4.94 1.88-6.12A2.996 2.996 0 0 1 9 18m4-9c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2",
};

function ServiceIcon({ name }: { name: string | null }) {
  const key = (name ?? "").toLowerCase();
  const d = ICONS[key] ?? ICONS.palette;

  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-primary drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]"
      style={{ width: 30, height: 30 }}
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

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
                className="group relative flex flex-col overflow-hidden rounded-radius-card border border-white/5 bg-card-dark p-6 shadow-shadow-lg transition-all duration-[var(--motion-medium)] ease-[var(--ease-standard)] hover:border-primary/20 md:p-8"
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
                    className="group/link mt-2 flex w-full items-center justify-center gap-2 rounded-radius-md border border-white/10 bg-white/5 py-4 text-sm font-bold text-primary transition-all duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-primary/30 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
