"use client";

import * as React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartTooltip } from "./chart-tooltip";

interface DonutChartProps {
  data: { name: string; value: number; color: string }[];
  height?: number;
  centerValue?: React.ReactNode;
  centerLabel?: string;
}

export function DonutChart({ data, height = 220, centerValue, centerLabel }: DonutChartProps) {
  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Tooltip content={<ChartTooltip />} />
          <Pie
            data={data}
            innerRadius={62}
            outerRadius={88}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      {(centerValue || centerLabel) && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          {centerValue && <div className="text-2xl font-semibold">{centerValue}</div>}
          {centerLabel && (
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{centerLabel}</div>
          )}
        </div>
      )}
    </div>
  );
}
