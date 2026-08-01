import Image from "next/image";
import { cn } from "@/lib/cn";

export function BrandLogo({
  alt = "Stratifit",
  className,
  priority = false,
}: {
  alt?: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/stratifit-logo.svg"
      alt={alt}
      width={320}
      height={64}
      priority={priority}
      className={cn("h-auto w-full object-contain", className)}
    />
  );
}
