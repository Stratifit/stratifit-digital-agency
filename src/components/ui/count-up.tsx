"use client";

import * as React from "react";
import { gsap, useGSAP } from "@/lib/animation/gsap";

function parseMetric(value: string): {
  prefix: string;
  number: number;
  suffix: string;
  decimals: number;
} | null {
  const match = /^([^\d]*)([\d.,]+)(.*)$/.exec(value);
  if (!match) return null;
  const raw = match[2].replace(/,/g, "");
  const decimals = raw.includes(".") ? raw.split(".")[1].length : 0;
  return {
    prefix: match[1],
    number: Number(raw),
    suffix: match[3],
    decimals,
  };
}

/**
 * Animated count-up for numeric metrics. Content starts at the final value so
 * it is always visible (failure-safe). Duration scales with the magnitude so
 * smaller numbers complete first — counters never finish in lockstep.
 * Reduced motion skips the animation.
 */
export function CountUp({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const [text, setText] = React.useState(value);
  const parsed = React.useMemo(() => parseMetric(value), [value]);

  useGSAP(
    () => {
      const el = ref.current;
      const metric = parsed;
      if (!el || !metric) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const duration = 0.5 + Math.min(1.2, (metric.number / 100) * 1.2);
      const state = { value: 0 };
      const tween = gsap.to(state, {
        value: metric.number,
        duration,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
        onUpdate: () => {
          setText(
            `${metric.prefix}${state.value.toFixed(metric.decimals)}${metric.suffix}`
          );
        },
        onComplete: () => {
          setText(value);
        },
      });
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { dependencies: [parsed, value] }
  );

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  );
}
