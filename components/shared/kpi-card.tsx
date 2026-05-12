"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, type LucideIcon } from "lucide-react";
import { cn, formatCompact, formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export interface KpiCardProps {
  label: string;
  value: number | string;
  icon?: LucideIcon;
  delta?: number;
  deltaLabel?: string;
  deltaInverted?: boolean;
  unit?: string;
  suffix?: string;
  prefix?: string;
  accent?: "primary" | "success" | "warning" | "destructive" | "info" | "accent";
  format?: "number" | "compact" | "raw" | "currency";
  loading?: boolean;
  hint?: string;
  className?: string;
}

const accentClasses = {
  primary: "from-primary/15 to-primary/0 text-primary",
  success: "from-success/15 to-success/0 text-success",
  warning: "from-warning/15 to-warning/0 text-warning",
  destructive: "from-destructive/15 to-destructive/0 text-destructive",
  info: "from-info/15 to-info/0 text-info",
  accent: "from-accent/15 to-accent/0 text-accent"
};

export function KpiCard({
  label,
  value,
  icon: Icon,
  delta,
  deltaLabel,
  deltaInverted,
  unit,
  suffix,
  prefix,
  accent = "primary",
  format = "raw",
  loading,
  hint,
  className
}: KpiCardProps) {
  const display =
    typeof value === "number"
      ? format === "compact"
        ? formatCompact(value)
        : format === "currency"
          ? formatCurrency(value)
          : format === "number"
            ? value.toLocaleString("en-IN")
            : String(value)
      : value;
  const deltaPositive = delta !== undefined && (deltaInverted ? delta < 0 : delta >= 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Card className={cn("relative overflow-hidden", className)}>
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-80",
            accentClasses[accent]
          )}
        />
        <CardContent className="relative p-5">
          <div className="flex items-start justify-between gap-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {label}
            </div>
            {Icon && (
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-xl bg-card shadow-soft",
                  accentClasses[accent].split(" ").pop()
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
            )}
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            {loading ? (
              <div className="h-8 w-24 animate-shimmer rounded-md bg-muted" />
            ) : (
              <span className="text-3xl font-semibold tracking-tight">
                {prefix && <span className="text-base text-muted-foreground">{prefix}</span>}
                {display}
                {(unit || suffix) && <span className="ml-1 text-base text-muted-foreground">{unit || suffix}</span>}
              </span>
            )}
          </div>
          {(delta !== undefined || hint) && (
            <div className="mt-2 flex items-center gap-2 text-xs">
              {delta !== undefined && (
                <div
                  className={cn(
                    "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-semibold",
                    deltaPositive ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
                  )}
                >
                  {delta >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                  {Math.abs(delta).toFixed(1)}%
                </div>
              )}
              {(deltaLabel || hint) && (
                <span className="text-muted-foreground">{deltaLabel || hint}</span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
