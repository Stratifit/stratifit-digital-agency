"use client";

import type { CmsLanguage } from "@/lib/types/cms";
import type { CmsPricingSection, CmsPricingPackage } from "@/lib/types/pricing";
import { getPricingTranslation } from "@/lib/types/pricing";
import { CheckIcon } from "@/components/ui/icons";

interface PricingSectionClientProps {
  section: CmsPricingSection;
  locale: CmsLanguage;
}

export function PricingSectionClient({ section, locale }: PricingSectionClientProps) {
  const subtitle = getPricingTranslation(section.subtitleTranslations, locale);
  const title = getPricingTranslation(section.titleTranslations, locale);
  const description = getPricingTranslation(section.descriptionTranslations, locale);
  const packages = section.packages
    .filter((pkg) => pkg.active)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const titleParts = title.split(" ");
  const lastWord = titleParts.pop() ?? "";
  const precedingWords = titleParts.join(" ");

  return (
    <section className="bg-black py-20 md:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-10 md:mb-16">
          <p className="text-xs font-bold text-brand-gold uppercase tracking-[0.2em] mb-4 font-body">
            {subtitle}
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black leading-tight md:leading-none tracking-tight mb-3">
            {precedingWords.length > 0 && (
              <span className="text-white">{precedingWords} </span>
            )}
            <span className="text-brand-gold">{lastWord}</span>
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base md:text-body-md leading-relaxed max-w-2xl border-l-2 border-brand-gold/50 pl-4 sm:pl-6 mt-3 font-body">
            {description}
          </p>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg) => (
            <PricingCard key={pkg.id} pkg={pkg} locale={locale} />
          ))}
        </div>

        {/* Mobile Slider */}
        <div className="md:hidden">
          <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 sm:-mx-6 px-4 sm:px-6 snap-x snap-mandatory scrollbar-hide">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="min-w-[280px] w-[80vw] max-w-[320px] snap-center shrink-0"
              >
                <PricingCard pkg={pkg} locale={locale} />
              </div>
            ))}
          </div>

          {/* Mobile Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {packages.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 w-1.5 rounded-full transition-all duration-200 ease-out ${
                  i === 0 ? "bg-brand-gold" : "bg-white/20"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingCard({
  pkg,
  locale,
}: {
  pkg: CmsPricingPackage;
  locale: CmsLanguage;
}) {
  const name = getPricingTranslation(pkg.nameTranslations, locale);
  const description = getPricingTranslation(pkg.descriptionTranslations, locale);
  const price = pkg.price;
  const priceLabel = getPricingTranslation(pkg.priceLabelTranslations, locale);
  const buttonLabel = getPricingTranslation(pkg.buttonLabelTranslations, locale);

  const popularClasses = pkg.isPopular
    ? "border-brand-gold shadow-[0_0_30px_rgba(245,158,11,0.15)]"
    : "border-white/5 hover:border-brand-gold/20";

  return (
    <div
      className={`relative bg-surface-darkAlt rounded-2xl p-6 md:p-8 border flex flex-col ${popularClasses} transition-all h-full`}
    >
      {/* Most Popular Badge */}
      {pkg.isPopular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-gold text-surface-dark text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider whitespace-nowrap font-body">
          Most Popular
        </div>
      )}

      <h3 className="font-display font-bold text-2xl text-white mb-2">{name}</h3>
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-3xl font-display font-black text-brand-gold">{price}</span>
        {priceLabel && (
          <span className="text-xs font-bold text-neutral-500 uppercase font-body">
            {priceLabel}
          </span>
        )}
      </div>
      <p className="text-sm text-neutral-400 mb-8 font-body">{description}</p>

      <div className="h-px bg-white/5 w-full mb-6" />

      <ul className="space-y-3 mb-8 flex-1">
        {pkg.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-neutral-300 font-body">
            <CheckIcon className="text-brand-gold shrink-0 mt-0.5 w-5 h-5" />
            {getPricingTranslation(feature, locale)}
          </li>
        ))}
      </ul>

      <button
        type="button"
        className={`block w-full py-3.5 rounded-xl font-bold text-sm text-center transition-all uppercase tracking-wide font-body ${
          pkg.isPopular
            ? "bg-brand-gold text-surface-dark hover:bg-brand-gold-light shadow-lg shadow-brand-gold/20"
            : "border border-brand-gold text-brand-gold hover:bg-brand-gold/10"
        }`}
      >
        {buttonLabel}
      </button>
    </div>
  );
}
