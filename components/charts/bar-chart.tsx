"use client";

import * as React from "react";
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { ChartTooltip } from "./chart-tooltip";

interface SeriesBarChartProps {
  data: Record<string, number | string>[];
  xKey: string;
  series: { key: string; label: string; color: string }[];
  height?: number;
  stacked?: boolean;
  horizontal?: boolean;
  yFormatter?: (v: number) => string;
}

export function SeriesBarChart({
  data,
  xKey,
  series,
  height = 260,
  stacked = false,
  horizontal = false,
  yFormatter
}: SeriesBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart
        data={data}
        layout={horizontal ? "vertical" : "horizontal"}
        margin={{ top: 8, left: 0, right: 8, bottom: 0 }}
        barCategoryGap="22%"
      >
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        {horizontal ? (
          <>
            <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} tickFormatter={yFormatter} />
            <YAxis type="category" dataKey={xKey} stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} width={90} />
          </>
        ) : (
          <>
            <XAxis dataKey={xKey} stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} width={40} tickFormatter={yFormatter} />
          </>
        )}
        <Tooltip content={<ChartTooltip valueFormatter={yFormatter} />} cursor={{ fill: "hsl(var(--muted) / 0.3)" }} />
        {series.map((s) => (
          <Bar
            key={s.key}
            dataKey={s.key}
            name={s.label}
            fill={s.color}
            stackId={stacked ? "stack" : undefined}
            radius={[6, 6, 0, 0]}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
