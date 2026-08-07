import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n/get-locale";
import {
  getPublicPortfolioDetail,
  getPublicPortfolioProjects,
} from "@/features/portfolio/queries";
import { getPublicServices } from "@/features/services/queries";
import { getPublicProcessSteps } from "@/features/process/queries";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { cn } from "@/lib/cn";
import { articleJsonLd, canonical, pageMetadata } from "@/lib/seo";
import { ContactAwareLink } from "@/components/contact/contact-aware-link";
import { Reveal } from "@/components/ui/reveal";
import { ProcessIcon } from "@/components/ui/process-icon";
import { RelatedProjects } from "@/components/work/related-projects";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const project = await getPublicPortfolioDetail(slug);
  if (!project) return {};
  const title = `${resolveTranslation(project.title_translations, locale)} — Stratifit`;
  const description = resolveTranslation(project.summary_translations, locale);
  return {
    ...pageMetadata({ title, description, path: `/work/${slug}` }),
    openGraph: {
      title,
      description,
      url: canonical(`/work/${slug}`),
      type: "article",
      siteName: "Stratifit",
    },
  };
}

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

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

function ArrowRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="size-5"
    >
      <path
        fillRule="evenodd"
        d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="size-5"
    >
      <path
        fillRule="evenodd"
        d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="size-5"
    >
      <path
        fillRule="evenodd"
        d="M3 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5H15v-18a.75.75 0 0 0 0-1.5H3ZM6.75 19.5v-2.25a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75ZM6 6.75A.75.75 0 0 1 6.75 6h.75a.75.75 0 0 1 0 1.5h-.75A.75.75 0 0 1 6 6.75ZM6.75 9a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM6 12.75a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 6a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75Zm-.75 3.75A.75.75 0 0 1 10.5 9h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 12a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM16.5 6.75v15h5.25a.75.75 0 0 0 0-1.5H21v-12a.75.75 0 0 0 0-1.5h-4.5Zm1.5 4.5a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Zm.75 2.25a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75v-.008a.75.75 0 0 0-.75-.75h-.008ZM18 17.25a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="size-5"
    >
      <path
        fillRule="evenodd"
        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="size-5"
    >
      <path
        fillRule="evenodd"
        d="M3 6a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3V6ZM3 15.75a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-2.25Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3v-2.25Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="size-5"
    >
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="size-4 text-primary"
    >
      <path
        fillRule="evenodd"
        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <div className="h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent" />
      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
        {children}
      </span>
      <div className="h-px flex-1 bg-gradient-to-l from-primary/40 to-transparent" />
    </div>
  );
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

interface FactCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function FactCard({ icon, label, value }: FactCardProps) {
  return (
    <div className="rounded-card border border-white/5 bg-card-dark p-5 md:p-6">
      <div className="mb-3 text-primary">{icon}</div>
      <div className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-text-subtle">
        {label}
      </div>
      <div className="text-sm font-medium leading-snug text-text-primary md:text-base">
        {value}
      </div>
    </div>
  );
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const [project, steps, relatedProjects, relatedServices] = await Promise.all([
    getPublicPortfolioDetail(slug),
    getPublicProcessSteps(),
    getPublicPortfolioProjects(6),
    getPublicServices(),
  ]);

  if (!project) {
    notFound();
  }

  const related = relatedProjects
    .filter((p) => p.slug !== slug)
    .filter(
      (p) =>
        !project.service_slugs.length ||
        p.service_slugs.some((s) => project.service_slugs.includes(s))
    )
    .slice(0, 3);
  const relatedVisible = related.length > 0 ? related : relatedProjects.filter((p) => p.slug !== slug).slice(0, 3);

  const deliverablesRaw =
    (project.deliverables_translations as Record<string, unknown> | null)?.[
      locale
    ] ??
    (project.deliverables_translations as Record<string, unknown> | null)?.[
      "en"
    ] ??
    [];
  const deliverables = deliverablesRaw as string[];

  const projectTitle = resolveTranslation(project.title_translations, locale);
  const projectSummary = resolveTranslation(project.summary_translations, locale);
  const challenge = resolveTranslation(project.challenge_translations, locale);
  const solution = resolveTranslation(project.solution_translations, locale);
  const resultsText = resolveTranslation(project.results_translations, locale);
  const serviceTitle = resolveTranslation(project.service_titles, locale);
  const categoryBadge = serviceTitle || deliverables[0] || "Case Study";
  const servicesJoined = deliverables.join(" · ");
  const launchYear = project.published_at
    ? new Date(project.published_at).getFullYear().toString()
    : "";

  const facts: FactCardProps[] = [];
  facts.push({ icon: <UserIcon />, label: "Client", value: project.client_name });
  if (serviceTitle) {
    facts.push({ icon: <BuildingIcon />, label: "Industry", value: serviceTitle });
  }
  if (launchYear) {
    facts.push({ icon: <ClockIcon />, label: "Year", value: launchYear });
  }
  if (servicesJoined) {
    facts.push({ icon: <GridIcon />, label: "Services", value: servicesJoined });
  }

  const factColumns =
    facts.length >= 4
      ? "md:grid-cols-4"
      : facts.length === 3
        ? "md:grid-cols-3"
        : "md:grid-cols-2";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            articleJsonLd({
              title: projectTitle,
              description: projectSummary,
              url: canonical(`/work/${slug}`),
              publishedAt: project.published_at,
            })
          ),
        }}
      />

      {/* Back button */}
      <Link
        href="/work"
        aria-label="Go back"
        className="fixed left-1 top-16 z-50 rounded-full bg-white/5 p-2 text-text-primary backdrop-blur-sm transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-white/10 lg:top-20"
      >
        <span className="transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:text-primary">
          <ArrowLeftIcon />
        </span>
      </Link>

      {/* Hero */}
      <section className="relative h-[60vh] overflow-hidden md:h-[70vh]">
        {project.featured_media_url ? (
          <Image
            src={project.featured_media_url}
            alt={projectTitle || project.client_name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-surface-soft via-background-deep to-background" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/70 to-black/10" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-5xl px-4 pb-10 sm:px-6 md:pb-16">
            <Reveal immediate variant="revealUp" className="max-w-3xl">
              <span className="mb-6 inline-block rounded bg-primary/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-text-inverse">
                {categoryBadge}
              </span>
              <h1 className="mb-4 font-display text-3xl font-black leading-[1.05] tracking-tight text-text-primary sm:text-4xl md:text-5xl md:leading-[0.95] lg:text-6xl xl:text-7xl">
                {projectTitle}
              </h1>
              <p className="text-base leading-relaxed text-text-secondary sm:text-lg md:text-xl">
                {projectSummary}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Fact bar */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal
            className={cn(
              "grid grid-cols-2 gap-3 sm:gap-4",
              factColumns
            )}
          >
            {facts.map((fact) => (
              <FactCard
                key={fact.label}
                icon={fact.icon}
                label={fact.label}
                value={fact.value}
              />
            ))}
          </Reveal>
        </div>
      </section>

      {/* Challenge */}
      {challenge ? (
        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <Reveal>
              <SectionLabel>Challenge</SectionLabel>
              <h2 className="mb-6 font-display text-2xl font-black tracking-tight leading-tight text-text-primary sm:text-3xl md:text-4xl">
                The Problem
              </h2>
              <p className="border-l-2 border-primary/30 pl-4 text-base leading-relaxed text-text-secondary sm:pl-6 md:text-lg">
                {challenge}
              </p>
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* Solution */}
      {solution ? (
        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <Reveal>
              <SectionLabel>Solution</SectionLabel>
              <h2 className="mb-6 font-display text-2xl font-black tracking-tight leading-tight text-text-primary sm:text-3xl md:text-4xl">
                What We Did
              </h2>
              <p className="border-l-2 border-primary/30 pl-4 text-base leading-relaxed text-text-secondary sm:pl-6 md:text-lg">
                {solution}
              </p>
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* Process */}
      {steps.length > 0 ? (
        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionLabel>Our Process</SectionLabel>
            <h2 className="mb-10 font-display text-2xl font-black tracking-tight leading-tight text-text-primary sm:text-3xl md:text-4xl">
              {steps.map((step, index) => (
                <span key={step.step_key}>
                  {index > 0 ? <span className="text-primary/60"> → </span> : null}
                  <span>{resolveTranslation(step.title_translations, locale)}</span>
                </span>
              ))}
            </h2>
            <Reveal className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
              {steps.map((step, index) => (
                <div
                  key={step.step_key}
                  className="relative rounded-card border border-white/5 bg-card-dark p-5 md:p-6"
                >
                  {index < steps.length - 1 ? (
                    <div
                      aria-hidden="true"
                      className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 text-lg text-primary/30 md:block"
                    >
                      <ArrowRightIcon />
                    </div>
                  ) : null}
                  <div className="mb-3 font-display text-xl font-black leading-none text-primary opacity-30 md:text-2xl">
                    {step.number.toString().padStart(2, "0")}
                  </div>
                  <ProcessIcon
                    name={step.icon_name}
                    className="mb-2 size-6 text-primary"
                  />
                  <h3 className="mb-1.5 text-sm font-bold text-text-primary md:text-base">
                    {resolveTranslation(step.title_translations, locale)}
                  </h3>
                  <p className="text-xs leading-relaxed text-text-muted md:text-[13px]">
                    {resolveTranslation(step.description_translations, locale)}
                  </p>
                </div>
              ))}
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* Results */}
      {project.metrics.length > 0 || resultsText ? (
        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <Reveal>
              <SectionLabel>Results</SectionLabel>
              <h2 className="mb-8 font-display text-2xl font-black tracking-tight leading-tight text-text-primary sm:text-3xl md:text-4xl">
                Numbers That <span className="text-primary">Moved</span>
              </h2>
              <div className="grid gap-4">
                {project.metrics.map((metric, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-card border border-white/5 bg-card-dark p-4"
                  >
                    <span className="mt-0.5 shrink-0 text-primary">
                      <CheckIcon />
                    </span>
                    <span className="text-sm font-medium leading-relaxed text-text-secondary md:text-base">
                      {resolveTranslation(metric.label_translations, locale)}{" "}
                      <strong className="font-bold text-primary">{metric.value}</strong>
                    </span>
                  </div>
                ))}
                {resultsText ? (
                  <p className="border-l-2 border-primary/30 pl-4 text-base leading-relaxed text-text-secondary sm:pl-6 md:text-lg">
                    {resultsText}
                  </p>
                ) : null}
              </div>
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* Testimonial */}
      {project.testimonial ? (
        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <Reveal className="relative overflow-hidden rounded-card-lg border border-white/5 bg-card-dark p-8 text-center md:p-12">
              <div className="mb-6 flex items-center justify-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} />
                ))}
              </div>
              <p className="mb-8 text-base font-medium italic leading-relaxed text-text-primary md:text-xl">
                &ldquo;
                {resolveTranslation(
                  project.testimonial.quote_translations,
                  locale
                )}
                &rdquo;
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full border border-primary/30 bg-primary/10 font-display text-sm font-bold text-primary">
                  {initials(project.testimonial.person_name)}
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-text-primary">
                    {project.testimonial.person_name}
                  </div>
                  <div className="text-xs text-text-subtle">
                    {resolveTranslation(
                      project.testimonial.person_role_translations,
                      locale
                    ) || project.testimonial.company_name}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* Gallery */}
      {project.gallery_urls.length > 0 ? (
        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionLabel>Gallery</SectionLabel>
            <h2 className="mb-10 font-display text-2xl font-black tracking-tight leading-tight text-text-primary sm:text-3xl md:text-4xl">
              Selected <span className="text-primary">Visuals</span>
            </h2>
            <Reveal className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
              {project.gallery_urls.map((url, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-card border border-white/5 transition-colors duration-[var(--motion-medium)] ease-[var(--ease-standard)] hover:border-primary/30"
                >
                  <Image
                    src={url}
                    alt={`${projectTitle} — visual ${index + 1}`}
                    width={1600}
                    height={1000}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>
              ))}
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* More work */}
      {relatedVisible.length > 0 ? (
        <section className="border-t border-border pt-16 md:pt-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionLabel>More Work</SectionLabel>
            <h2 className="mb-10 font-display text-2xl font-black tracking-tight leading-tight text-text-primary sm:text-3xl md:text-4xl">
              Similar <span className="text-primary">Case Studies</span>
            </h2>
            <RelatedProjects
              projects={relatedVisible}
              services={relatedServices}
              locale={locale}
            />
          </div>
        </section>
      ) : null}

      {/* Final CTA */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Reveal className="rounded-card-lg border border-white/5 bg-card-dark p-8 text-center sm:p-12">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
              Start Your Project
            </p>
            <h3 className="mb-3 font-display text-2xl font-black leading-tight text-text-primary sm:text-3xl md:text-4xl">
              Want an outcome like this?
            </h3>
            <p className="mx-auto mb-8 max-w-2xl text-sm leading-relaxed text-text-muted md:text-base">
              Same rigor, same playbook — applied to your business and measured by
              your metrics.
            </p>
            <ContactAwareLink
              href="/contact"
              className="group inline-flex items-center justify-center gap-3 rounded-button bg-primary px-8 py-4 text-base font-bold text-text-inverse shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-all duration-[var(--motion-medium)] ease-[var(--ease-standard)] hover:bg-primary-hover hover:shadow-[0_0_50px_rgba(245,158,11,0.5)] active:scale-95 sm:px-12 sm:py-5 sm:text-lg"
            >
              Start your project with Stratifit
              <span className="transition-transform duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-hover:translate-x-1">
                <ArrowRightIcon />
              </span>
            </ContactAwareLink>
          </Reveal>
        </div>
      </section>

    </>
  );
}
