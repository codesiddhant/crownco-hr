"use client";

import * as React from "react";
import { animate, useInView, useMotionValue, useTransform, motion } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  format?: (v: number) => string;
  className?: string;
}

export function AnimatedCounter({
  value,
  duration = 1.2,
  format = (v) => Math.round(v).toLocaleString("en-IN"),
  className
}: AnimatedCounterProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const display = useTransform(motionValue, (v) => format(v));

  React.useEffect(() => {
    if (!inView) return;
    const controls = animate(motionValue, value, { duration, ease: "easeOut" });
    return controls.stop;
  }, [inView, value, duration, motionValue]);

  return (
    <motion.span ref={ref} className={className}>
      {display}
    </motion.span>
  );
}
