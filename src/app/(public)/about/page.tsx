import { pageMetadata } from "@/lib/seo";
import { getLocale } from "@/lib/i18n/get-locale";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { getPublicAboutPage } from "@/features/about/queries";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { CountUp } from "@/components/ui/count-up";
import { ContactAwareLink } from "@/components/contact/contact-aware-link";
import { AboutIcon } from "@/components/ui/about-icon";

export const metadata = pageMetadata({
  title: "About — Stratifit",
  description:
    "Learn about Stratifit, a premium digital agency for web, brand, AI, and growth.",
  path: "/about",
});

export default async function AboutPage() {
  const locale = await getLocale();
  const about = await getPublicAboutPage();

  const eyebrow =
    resolveTranslation(about?.eyebrow_translations, locale) || "About";
  const title =
    resolveTranslation(about?.title_translations, locale) || "About ";
  const highlight =
    resolveTranslation(about?.highlight_translations, locale) || "Stratifit";
  const intro = resolveTranslation(about?.intro_translations, locale);
  const mission = about
    ? resolveTranslation(about.mission_translations, locale)
    : "";
  const story = about
    ? resolveTranslation(about.story_translations, locale)
    : "";
  const team = about ? resolveTranslation(about.team_translations, locale) : "";
  const stats = about?.stats ?? [];
  const values = about?.values ?? [];

  const ctaTitle =
    resolveTranslation(about?.cta_title_translations, locale) ||
    "Ready to Work ";
  const ctaHighlight =
    resolveTranslation(about?.cta_highlight_translations, locale) ||
    "Together?";
  const ctaDescription =
    resolveTranslation(about?.cta_description_translations, locale) ||
    "Let's build something exceptional.";
  const ctaLabel =
    resolveTranslation(about?.cta_label_translations, locale) ||
    "Start Your Project";
  const ctaHref = about?.cta_url || "/contact";

  return (
    <>
      <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-primary/10 opacity-30 blur-[120px]"
        />
        <Container className="relative z-10">
          <Reveal immediate variant="revealUp">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              {eyebrow}
            </p>
            <h1 className="font-display text-4xl font-black leading-tight tracking-tight text-text-primary sm:text-5xl md:text-6xl md:leading-none lg:text-7xl">
              {title}
              {highlight ? (
                <span className="text-primary">{highlight}</span>
              ) : null}
            </h1>
            {intro ? (
              <p className="mt-3 max-w-2xl border-l-2 border-primary/50 pl-4 text-base leading-relaxed text-text-muted sm:pl-6 sm:text-lg md:text-xl">
                {intro}
              </p>
            ) : null}
          </Reveal>
        </Container>
      </section>

      {stats.length > 0 ? (
        <section className="pb-20">
          <Container width="md">
            <Reveal className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-2 rounded-card border border-white/5 bg-card-dark p-6 text-center transition-all duration-300 hover:border-primary/20"
                >
                  <AboutIcon name={stat.icon} className="size-6 text-primary" />
                  <div className="font-display text-2xl font-black tracking-tight text-text-primary md:text-3xl">
                    <CountUp value={stat.value} className="tabular-nums" />
                  </div>
                  <span className="text-xs font-medium uppercase tracking-wider text-text-subtle">
                    {resolveTranslation(stat.label_translations, locale)}
                  </span>
                </div>
              ))}
            </Reveal>
          </Container>
        </section>
      ) : null}

      <section className="pb-4">
        <Container width="md">
          {mission ? (
            <Reveal className="mb-16">
              <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Our Mission
              </h2>
              <p className="border-l-2 border-primary/30 pl-4 text-base leading-relaxed text-text-secondary sm:pl-6 md:text-lg">
                {mission}
              </p>
            </Reveal>
          ) : null}

          {story ? (
            <Reveal className="mb-16">
              <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Our Story
              </h2>
              <p className="border-l-2 border-primary/30 pl-4 text-base leading-relaxed text-text-secondary sm:pl-6 md:text-lg">
                {story}
              </p>
            </Reveal>
          ) : null}

          {values.length > 0 ? (
            <Reveal className="mb-16">
              <h2 className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                What We Stand For
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {values.map((value, index) => (
                  <div
                    key={index}
                    className="flex gap-4 rounded-card border border-white/5 bg-card-dark p-6 transition-all duration-300 hover:border-primary/20"
                  >
                    <AboutIcon
                      name={value.icon}
                      className="mt-1 size-6 shrink-0 text-primary"
                    />
                    <div>
                      <h3 className="mb-2 font-display text-lg font-bold text-text-primary">
                        {resolveTranslation(value.title_translations, locale)}
                      </h3>
                      <p className="text-sm leading-relaxed text-text-muted">
                        {resolveTranslation(
                          value.description_translations,
                          locale
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          ) : null}

          {team ? (
            <Reveal className="mb-16">
              <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Our Team
              </h2>
              <p className="border-l-2 border-primary/30 pl-4 text-base leading-relaxed text-text-secondary sm:pl-6 md:text-lg">
                {team}
              </p>
            </Reveal>
          ) : null}

          <Reveal className="border-t border-white/10 py-8 text-center">
            <h2 className="mb-4 font-display text-2xl font-black tracking-tight text-text-primary md:text-3xl">
              {ctaTitle}
              {ctaHighlight ? (
                <span className="text-primary">{ctaHighlight}</span>
              ) : null}
            </h2>
            <p className="mb-6 text-sm text-text-muted">{ctaDescription}</p>
            <ContactAwareLink href={ctaHref} size="large">
              {ctaLabel}
            </ContactAwareLink>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
