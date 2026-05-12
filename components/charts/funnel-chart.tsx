"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface FunnelChartProps {
  data: { label: string; value: number; color?: string }[];
  unit?: string;
  className?: string;
}

export function FunnelChart({ data, unit, className }: FunnelChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {data.map((d, i) => {
        const w = (d.value / max) * 100;
        return (
          <div key={d.label} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium">{d.label}</span>
              <span className="text-muted-foreground">
                {d.value.toLocaleString("en-IN")}
                {unit && ` ${unit}`}
                {i > 0 && (
                  <span className="ml-2 text-xs">
                    ({Math.round((d.value / data[i - 1].value) * 100)}%)
                  </span>
                )}
              </span>
            </div>
            <div className="relative h-6 overflow-hidden rounded-lg bg-muted">
              <div
                className="h-full rounded-lg transition-all"
                style={{
                  width: `${w}%`,
                  background: d.color || `hsl(var(--primary) / ${0.4 + (i / data.length) * 0.5})`
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
