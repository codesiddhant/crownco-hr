"use client";

import * as React from "react";

interface ChartTooltipProps {
  active?: boolean;
  payload?: { name: string; value: number; color?: string; dataKey?: string }[];
  label?: string;
  valueFormatter?: (v: number) => string;
}

export function ChartTooltip({ active, payload, label, valueFormatter }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border bg-popover/95 px-3 py-2 text-xs shadow-elevated backdrop-blur">
      {label && <div className="mb-1 font-semibold">{label}</div>}
      <div className="space-y-0.5">
        {payload.map((p) => (
          <div key={p.dataKey || p.name} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: p.color || "currentColor" }}
              />
              <span className="capitalize text-muted-foreground">{p.name}</span>
            </div>
            <span className="font-semibold">
              {valueFormatter ? valueFormatter(p.value) : p.value.toLocaleString("en-IN")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
