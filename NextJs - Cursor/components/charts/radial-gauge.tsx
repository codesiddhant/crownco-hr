"use client";

import * as React from "react";
import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer
} from "recharts";

interface RadialGaugeProps {
  value: number;
  max?: number;
  color?: string;
  label?: string;
  size?: number;
}

export function RadialGauge({
  value,
  max = 100,
  color = "hsl(var(--primary))",
  label,
  size = 180
}: RadialGaugeProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const data = [{ name: "value", value: pct, fill: color }];
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          innerRadius="78%"
          outerRadius="100%"
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar
            background={{ fill: "hsl(var(--muted))" }}
            dataKey="value"
            cornerRadius={999}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-3xl font-semibold tracking-tight">{Math.round(value)}</div>
        {label && (
          <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
        )}
      </div>
    </div>
  );
}
