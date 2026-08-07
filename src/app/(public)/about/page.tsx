import { pageMetadata } from "@/lib/seo";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { CountUp } from "@/components/ui/count-up";
import { ContactAwareLink } from "@/components/contact/contact-aware-link";
import {
  Bolt,
  Users,
  Globe,
  ChartBar,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export const metadata = pageMetadata({
  title: "About — Stratifit",
  description:
    "Learn about Stratifit, a premium digital agency for web, brand, AI, and growth.",
  path: "/about",
});

type IconName = "bolt" | "users" | "globe" | "chart" | "sparkles";

const ICONS: Record<IconName, LucideIcon> = {
  bolt: Bolt,
  users: Users,
  globe: Globe,
  chart: ChartBar,
  sparkles: Sparkles,
};

function AboutIcon({
  name,
  className,
}: {
  name: IconName;
  className?: string;
}) {
  const Icon = ICONS[name];
  return <Icon className={className} aria-hidden="true" />;
}

const STATS = [
  { icon: "bolt", value: "120+", label: "Projects Delivered" },
  { icon: "users", value: "45+", label: "Team Members" },
  { icon: "globe", value: "18", label: "Countries Served" },
  { icon: "chart", value: "98%", label: "Client Retention" },
] as const;

const VALUES = [
  {
    icon: "sparkles",
    title: "Precision",
    description:
      "Every pixel, every line of code, every strategy — executed with meticulous attention to detail.",
  },
  {
    icon: "bolt",
    title: "Innovation",
    description:
      "We push boundaries with emerging technologies and creative approaches that set you apart.",
  },
  {
    icon: "users",
    title: "Partnership",
    description:
      "We integrate as an extension of your team, aligned with your vision and committed to your success.",
  },
  {
    icon: "chart",
    title: "Results",
    description:
      "We measure everything. Every engagement is tied to real KPIs and tangible business outcomes.",
  },
] as const;

export default function AboutPage() {
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
              About
            </p>
            <h1 className="font-display text-4xl font-black leading-tight tracking-tight text-text-primary sm:text-5xl md:text-6xl md:leading-none lg:text-7xl">
              About <span className="text-primary">Stratifit</span>
            </h1>
            <p className="mt-3 max-w-2xl border-l-2 border-primary/50 pl-4 text-base leading-relaxed text-text-muted sm:pl-6 sm:text-lg md:text-xl">
              We are a premium digital agency that builds brands, scales
              businesses, and engineers growth through strategy, design, and
              technology.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="pb-20">
        <Container width="md">
          <Reveal className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-2 rounded-card border border-white/5 bg-card-dark p-6 text-center transition-all duration-300 hover:border-primary/20"
              >
                <AboutIcon name={stat.icon} className="size-6 text-primary" />
                <div className="font-display text-2xl font-black tracking-tight text-text-primary md:text-3xl">
                  <CountUp value={stat.value} className="tabular-nums" />
                </div>
                <span className="text-xs font-medium uppercase tracking-wider text-text-subtle">
                  {stat.label}
                </span>
              </div>
            ))}
          </Reveal>
        </Container>
      </section>

      <section className="pb-4">
        <Container width="md">
          <Reveal className="mb-16">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Our Mission
            </h2>
            <p className="border-l-2 border-primary/30 pl-4 text-base leading-relaxed text-text-secondary sm:pl-6 md:text-lg">
              To empower ambitious brands with the strategy, design, and
              technology they need to dominate their markets.
            </p>
          </Reveal>

          <Reveal className="mb-16">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Our Story
            </h2>
            <p className="border-l-2 border-primary/30 pl-4 text-base leading-relaxed text-text-secondary sm:pl-6 md:text-lg">
              Founded with a vision to bridge the gap between premium branding
              and technical execution, Stratifit has grown from a boutique
              design studio into a full-scale digital agency. Today, we partner
              with startups and enterprises alike — delivering brand
              identities, web platforms, AI automation systems, and growth
              engines that transform how businesses operate and scale.
            </p>
          </Reveal>

          <Reveal className="mb-16">
            <h2 className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              What We Stand For
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {VALUES.map((value) => (
                <div
                  key={value.title}
                  className="flex gap-4 rounded-card border border-white/5 bg-card-dark p-6 transition-all duration-300 hover:border-primary/20"
                >
                  <AboutIcon
                    name={value.icon}
                    className="mt-1 size-6 shrink-0 text-primary"
                  />
                  <div>
                    <h3 className="mb-2 font-display text-lg font-bold text-text-primary">
                      {value.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-text-muted">
                      {value.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal className="mb-16">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Our Team
            </h2>
            <p className="border-l-2 border-primary/30 pl-4 text-base leading-relaxed text-text-secondary sm:pl-6 md:text-lg">
              We are strategists, designers, engineers, and marketers who share
              a common obsession: building exceptional digital experiences. Our
              team brings together decades of combined expertise from top
              agencies, startups, and Fortune 500 companies — united by a
              passion for craftsmanship and a commitment to client success.
            </p>
          </Reveal>

          <Reveal className="border-t border-white/10 py-8 text-center">
            <h2 className="mb-4 font-display text-2xl font-black tracking-tight text-text-primary md:text-3xl">
              Ready to Work <span className="text-primary">Together?</span>
            </h2>
            <p className="mb-6 text-sm text-text-muted">
              Let&rsquo;s build something exceptional.
            </p>
            <ContactAwareLink href="/#contact" size="large">
              Start Your Project
            </ContactAwareLink>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
