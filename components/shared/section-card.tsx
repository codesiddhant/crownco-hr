"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  highlight?: boolean;
}

export function SectionCard({
  title,
  description,
  icon,
  actions,
  children,
  className,
  contentClassName,
  highlight
}: SectionCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-card shadow-soft",
        highlight && "border-primary/30 shadow-glow",
        className
      )}
    >
      {(title || actions) && (
        <div className="flex items-start justify-between gap-3 p-5 pb-3">
          <div className="flex items-start gap-3">
            {icon && (
              <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {icon}
              </div>
            )}
            <div>
              {title && <div className="text-base font-semibold tracking-tight">{title}</div>}
              {description && (
                <div className="mt-0.5 text-sm text-muted-foreground">{description}</div>
              )}
            </div>
          </div>
          {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </div>
      )}
      <div className={cn(title ? "px-5 pb-5" : "p-5", contentClassName)}>{children}</div>
    </div>
  );
}
