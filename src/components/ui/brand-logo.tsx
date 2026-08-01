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
      src="/stratifit-main-logo.png"
      alt={alt}
      width={1592}
      height={227}
      priority={priority}
      className={cn("h-auto w-full object-contain", className)}
    />
  );
}
