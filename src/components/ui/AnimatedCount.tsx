"use client";

import { useEffect, useMemo, useState } from "react";

interface AnimatedCountProps {
  value: number;
  durationMs?: number;
  className?: string;
}

export default function AnimatedCount({
  value,
  durationMs = 1200,
  className,
}: AnimatedCountProps) {
  const safeValue = Number.isFinite(value) ? Math.max(0, value) : 0;
  const [displayValue, setDisplayValue] = useState(0);
  const formatter = useMemo(() => new Intl.NumberFormat("en-US"), []);

  useEffect(() => {
    if (safeValue === 0) {
      setDisplayValue(0);
      return undefined;
    }

    let frameId: number;
    const duration = Math.max(600, durationMs);
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const nextValue = Math.round(safeValue * eased);
      setDisplayValue(nextValue);

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [safeValue, durationMs]);

  return <span className={className}>{formatter.format(displayValue)}</span>;
}
