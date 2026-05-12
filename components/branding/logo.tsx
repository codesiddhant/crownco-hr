import * as React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
  size?: number;
}

export function Logo({ className, showWordmark = true, size = 36 }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className="relative shrink-0 rounded-xl bg-brand-gradient shadow-glow flex items-center justify-center font-bold text-white"
        style={{ width: size, height: size, fontSize: size * 0.5 }}
      >
        <svg viewBox="0 0 24 24" fill="none" width={size * 0.62} height={size * 0.62}>
          <path
            d="M3 15.5L7 8L12 13L17 6L21 9.5V18H3V15.5Z"
            fill="white"
            fillOpacity="0.95"
            stroke="white"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <circle cx="18.5" cy="6" r="1.5" fill="white" />
        </svg>
      </div>
      {showWordmark && (
        <div className="flex flex-col leading-none">
          <span className="text-base font-semibold tracking-tight">Crownco</span>
          <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            HR · AI Workforce OS
          </span>
        </div>
      )}
    </div>
  );
}
