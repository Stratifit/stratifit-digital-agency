import Link from "next/link";
import { Container } from "@/components/ui/container";
import { LinkButton } from "@/components/ui/link-button";

export default function NotFound() {
  return (
    <Container className="flex min-h-[50vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">404</p>
      <h1 className="mt-4 font-display text-4xl font-black tracking-tight text-text-primary sm:text-5xl">
        Page not found
      </h1>
      <p className="mt-6 max-w-xl text-base leading-7 text-text-secondary">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <LinkButton href="/" size="large">
          Back to Home
        </LinkButton>
        <Link
          href="/contact"
          className="inline-flex h-[52px] items-center justify-center rounded-button border border-card-border bg-card-dark px-6 text-base font-medium text-text-primary transition-colors hover:border-primary/30"
        >
          Contact us
        </Link>
      </div>
    </Container>
  );
}
