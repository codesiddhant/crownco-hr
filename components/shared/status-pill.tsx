"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const TONE: Record<string, string> = {
  active: "bg-success/15 text-success border-success/20",
  present: "bg-success/15 text-success border-success/20",
  approved: "bg-success/15 text-success border-success/20",
  paid: "bg-success/15 text-success border-success/20",
  on_leave: "bg-info/15 text-info border-info/20",
  pending: "bg-warning/15 text-warning border-warning/20",
  late: "bg-warning/15 text-warning border-warning/20",
  half_day: "bg-warning/15 text-warning border-warning/20",
  probation: "bg-info/15 text-info border-info/20",
  rejected: "bg-destructive/15 text-destructive border-destructive/20",
  absent: "bg-destructive/15 text-destructive border-destructive/20",
  terminated: "bg-destructive/15 text-destructive border-destructive/20",
  blocked: "bg-destructive/15 text-destructive border-destructive/20",
  cancelled: "bg-muted text-muted-foreground border-border",
  weekend: "bg-muted text-muted-foreground border-border",
  holiday: "bg-muted text-muted-foreground border-border",
  in_progress: "bg-primary/15 text-primary border-primary/20",
  done: "bg-success/15 text-success border-success/20",
  review: "bg-info/15 text-info border-info/20",
  todo: "bg-secondary text-secondary-foreground border-border",
  backlog: "bg-muted text-muted-foreground border-border",
  urgent: "bg-destructive/15 text-destructive border-destructive/20",
  high: "bg-warning/15 text-warning border-warning/20",
  medium: "bg-info/15 text-info border-info/20",
  low: "bg-muted text-muted-foreground border-border"
};

export function StatusPill({ value, className }: { value: string; className?: string }) {
  const tone = TONE[value] ?? "bg-muted text-muted-foreground border-border";
  const display = value.replace(/_/g, " ");
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold capitalize",
        tone,
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {display}
    </span>
  );
}
