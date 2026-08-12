import * as React from "react";
import { cn } from "@/lib/cn";

export function FormCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-card border border-card-border bg-card-dark p-6 shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}
