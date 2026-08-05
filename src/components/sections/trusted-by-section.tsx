import Image from "next/image";
import Link from "next/link";
import { getPublicTrustedLogos } from "@/features/trusted-logos/queries";
import { Container } from "@/components/ui/container";

export async function TrustedBySection() {
  const logos = await getPublicTrustedLogos();

  if (logos.length === 0) {
    return null;
  }

  return (
    <section className="border-b border-border bg-background">
      <Container className="py-10 md:py-14">
        <p className="mb-8 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-text-subtle">
          Trusted by ambitious businesses
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
          {logos.map((logo) => (
            <LogoItem key={logo.id} logo={logo} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function LogoItem({
  logo,
}: {
  logo: {
    id: string;
    name: string;
    image_url: string | null;
    href: string | null;
  };
}) {
  const content = logo.image_url ? (
    <span className="relative block h-8 w-32 opacity-50 grayscale transition-all duration-[var(--motion-medium)] ease-[var(--ease-standard)] hover:opacity-90 hover:grayscale-0">
      <Image
        src={logo.image_url}
        alt={`${logo.name} logo`}
        fill
        sizes="128px"
        className="object-contain"
      />
    </span>
  ) : (
    <span className="text-sm font-bold tracking-wide text-text-muted transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:text-text-secondary">
      {logo.name}
    </span>
  );

  if (logo.href) {
    return (
      <Link
        href={logo.href}
        target={logo.href.startsWith("http") ? "_blank" : undefined}
        rel={logo.href.startsWith("http") ? "noopener noreferrer" : undefined}
        className="inline-flex items-center"
        aria-label={logo.name}
      >
        {content}
      </Link>
    );
  }

  return (
    <span className="inline-flex items-center" aria-label={logo.name}>
      {content}
    </span>
  );
}
