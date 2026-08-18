import type { ComponentType } from "react";
import { HeroSection } from "@/components/sections/hero-section";
import { TechStackSection } from "@/components/sections/tech-stack-section";
import { ServicesSection } from "@/components/sections/services-section";
import { ProcessSection } from "@/components/sections/process-section";
import { WhyChooseUsSection } from "@/components/sections/why-choose-us-section";
import { InsightsSection } from "@/components/sections/insights-section";
import { PortfolioSection } from "@/components/sections/portfolio-section";
import { AcquisitionSection } from "@/components/sections/acquisition-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { PricingSection } from "@/components/sections/pricing-section";
import { FaqSection } from "@/components/sections/faq-section";
import { ContactSection } from "@/components/sections/contact-section";

export type SectionKey =
  | "hero"
  | "techStack"
  | "services"
  | "process"
  | "whyChooseUs"
  | "insights"
  | "portfolio"
  | "acquisition"
  | "testimonials"
  | "pricing"
  | "faq"
  | "contact";

export interface RegisteredSection {
  key: SectionKey;
  component: ComponentType<{ locale?: string }>;
}

export const HOMEPAGE_SECTION_KEYS: SectionKey[] = [
  "hero",
  "techStack",
  "services",
  "process",
  "whyChooseUs",
  "insights",
  "portfolio",
  "acquisition",
  "testimonials",
  "pricing",
  "faq",
  "contact",
];

export const sectionRegistry: Record<SectionKey, RegisteredSection> = {
  hero: { key: "hero", component: HeroSection },
  techStack: { key: "techStack", component: TechStackSection },
  services: { key: "services", component: ServicesSection },
  process: { key: "process", component: ProcessSection },
  whyChooseUs: { key: "whyChooseUs", component: WhyChooseUsSection },
  insights: { key: "insights", component: InsightsSection },
  portfolio: { key: "portfolio", component: PortfolioSection },
  acquisition: { key: "acquisition", component: AcquisitionSection },
  testimonials: { key: "testimonials", component: TestimonialsSection },
  pricing: { key: "pricing", component: PricingSection },
  faq: { key: "faq", component: FaqSection },
  contact: { key: "contact", component: ContactSection },
};
