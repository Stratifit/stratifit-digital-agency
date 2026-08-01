import * as React from "react";
import { cn } from "@/lib/cn";

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(
          "animate-pulse rounded-radius-sm bg-surface-soft",
          className
        )}
        {...props}
      />
    );
  }
);

Skeleton.displayName = "Skeleton";
