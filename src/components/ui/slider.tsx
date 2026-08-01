"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export interface SliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onValueChange: (value: number) => void;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

export function Slider({
  value,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  disabled = false,
  className,
  ...rest
}: SliderProps) {
  const percent = max > min ? ((value - min) / (max - min)) * 100 : 0;

  return (
    <div
      className={cn(
        "relative h-6 w-full select-none touch-none",
        disabled && "opacity-60",
        className
      )}
    >
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(event) => onValueChange(Number(event.target.value))}
        aria-label={rest["aria-label"]}
        className="peer absolute inset-0 z-10 h-full w-full cursor-pointer appearance-none bg-transparent opacity-0 focus-visible:outline-none disabled:cursor-not-allowed"
      />

      <div
        aria-hidden="true"
        className="absolute left-0 top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full border border-card-border bg-card-dark peer-disabled:border-card-border-disabled peer-disabled:bg-card-disabled"
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-[var(--motion-fast)] ease-[var(--ease-standard)] peer-disabled:opacity-50"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div
        aria-hidden="true"
        className={cn(
          "absolute top-1/2 z-0 size-[18px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-white transition-[background-color,border-color,transform] duration-[var(--motion-fast)] ease-[var(--ease-standard)]",
          "peer-hover:scale-105 peer-hover:border-primary/40 peer-hover:bg-[#f7f7f7]",
          "peer-active:scale-95 peer-active:border-primary/60 peer-active:bg-[#e5e5e5]",
          "peer-focus-visible:outline-2 peer-focus-visible:outline-card-focus peer-focus-visible:outline-offset-2",
          "peer-disabled:border-white/10 peer-disabled:bg-[#2a2a2a] peer-disabled:opacity-60 peer-disabled:cursor-not-allowed"
        )}
        style={{ left: `${percent}%` }}
      />
    </div>
  );
}
