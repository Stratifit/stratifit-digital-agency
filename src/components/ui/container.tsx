import * as React from "react";
import { cn } from "@/lib/cn";

export type ContainerWidth = "sm" | "md" | "lg" | "xl";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: ContainerWidth;
}

const widthClasses: Record<ContainerWidth, string> = {
  sm: "max-w-[var(--container-sm)]",
  md: "max-w-[var(--container-md)]",
  lg: "max-w-[var(--container-lg)]",
  xl: "max-w-[var(--container-xl)]",
};

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, width = "lg", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "mx-auto w-full px-6 lg:px-8",
          widthClasses[width],
          className
        )}
        {...props}
      />
    );
  }
);

Container.displayName = "Container";
