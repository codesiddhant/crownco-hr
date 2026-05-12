"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface HeatmapProps {
  data: { x: string; y: string; value: number }[];
  xLabels: string[];
  yLabels: string[];
  max?: number;
  cellSize?: number;
  className?: string;
  valueFormatter?: (v: number) => string;
}

export function Heatmap({
  data,
  xLabels,
  yLabels,
  max,
  cellSize = 28,
  className,
  valueFormatter
}: HeatmapProps) {
  const lookup = React.useMemo(() => {
    const m = new Map<string, number>();
    data.forEach((d) => m.set(`${d.x}__${d.y}`, d.value));
    return m;
  }, [data]);
  const maxVal = max ?? Math.max(...data.map((d) => d.value), 1);

  return (
    <div className={cn("overflow-x-auto", className)}>
      <div className="inline-flex flex-col gap-1">
        <div className="grid" style={{ gridTemplateColumns: `60px repeat(${xLabels.length}, ${cellSize}px)` }}>
          <div />
          {xLabels.map((x) => (
            <div key={x} className="text-center text-[10px] uppercase tracking-wider text-muted-foreground">
              {x}
            </div>
          ))}
        </div>
        {yLabels.map((y) => (
          <div
            key={y}
            className="grid items-center"
            style={{ gridTemplateColumns: `60px repeat(${xLabels.length}, ${cellSize}px)` }}
          >
            <div className="pr-2 text-right text-[11px] text-muted-foreground">{y}</div>
            {xLabels.map((x) => {
              const v = lookup.get(`${x}__${y}`) ?? 0;
              const intensity = v / maxVal;
              const bg = `hsl(var(--primary) / ${0.08 + intensity * 0.7})`;
              return (
                <div
                  key={`${x}-${y}`}
                  title={`${y} · ${x}: ${valueFormatter ? valueFormatter(v) : v}`}
                  className="m-0.5 flex aspect-square items-center justify-center rounded-md text-[10px] font-semibold text-foreground/80 transition-transform hover:scale-110"
                  style={{ background: bg, width: cellSize - 4, height: cellSize - 4 }}
                >
                  {intensity > 0.25 && v > 0 ? (valueFormatter ? valueFormatter(v) : v) : ""}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
