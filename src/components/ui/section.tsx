import * as React from "react";
import { cn } from "@/lib/cn";

export type SectionProps = React.HTMLAttributes<HTMLElement>;

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(
          "py-16 md:py-24 lg:py-32",
          className
        )}
        {...props}
      />
    );
  }
);

Section.displayName = "Section";
