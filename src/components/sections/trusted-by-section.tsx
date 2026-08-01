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
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {logos.map((logo) => (
            <span
              key={logo.id}
              className="text-sm font-medium text-text-muted"
            >
              {logo.name}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}
