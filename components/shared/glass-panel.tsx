import * as React from "react";
import { cn } from "@/lib/utils";

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "strong" | "subtle";
}

export function GlassPanel({ className, variant = "default", ...props }: GlassPanelProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-card/70 backdrop-blur-xl shadow-soft",
        variant === "strong" && "bg-card/85 backdrop-blur-2xl",
        variant === "subtle" && "bg-card/40 backdrop-blur-md",
        className
      )}
      {...props}
    />
  );
}
