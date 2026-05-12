"use client";

import * as React from "react";
import {
  Area,
  AreaChart as RechartsAreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { ChartTooltip } from "./chart-tooltip";

interface SeriesAreaChartProps {
  data: Record<string, number | string>[];
  xKey: string;
  series: { key: string; label: string; color: string; gradient?: boolean }[];
  height?: number;
  yFormatter?: (v: number) => string;
  showGrid?: boolean;
}

export function SeriesAreaChart({
  data,
  xKey,
  series,
  height = 260,
  yFormatter,
  showGrid = true
}: SeriesAreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsAreaChart data={data} margin={{ top: 8, left: 0, right: 8, bottom: 0 }}>
        <defs>
          {series.map((s) => (
            <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={s.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />}
        <XAxis
          dataKey={xKey}
          stroke="hsl(var(--muted-foreground))"
          fontSize={11}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          tickFormatter={yFormatter}
          width={40}
        />
        <Tooltip content={<ChartTooltip valueFormatter={yFormatter} />} />
        {series.map((s) => (
          <Area
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.label}
            stroke={s.color}
            strokeWidth={2.2}
            fill={`url(#grad-${s.key})`}
            activeDot={{ r: 4 }}
            isAnimationActive
          />
        ))}
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
}
