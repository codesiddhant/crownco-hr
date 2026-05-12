"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronsLeft, ChevronsRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/branding/logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NAV, ROLE_TITLE } from "@/lib/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { toggleSidebar, setAiOpen } from "@/lib/store/uiSlice";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function Sidebar() {
  const pathname = usePathname();
  const role = useAppSelector((s) => s.auth.role);
  const collapsed = useAppSelector((s) => s.ui.sidebarCollapsed);
  const dispatch = useAppDispatch();
  const groups = NAV[role] || [];

  return (
    <TooltipProvider delayDuration={120}>
      <aside
        className={cn(
          "hidden md:flex h-svh flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-300",
          collapsed ? "w-[72px]" : "w-[260px]"
        )}
      >
        <div className={cn("flex items-center justify-between px-4 py-5", collapsed && "justify-center px-2")}>
          <Logo showWordmark={!collapsed} size={collapsed ? 32 : 36} />
          {!collapsed && (
            <Button variant="ghost" size="icon-sm" onClick={() => dispatch(toggleSidebar())}>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className={cn("flex-1 overflow-y-auto px-3 pb-3 no-scrollbar", collapsed && "px-1.5")}>
          {groups.map((group, gi) => (
            <div key={group.label} className={cn(gi > 0 && "mt-5")}>
              {!collapsed && (
                <div className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.label}
                </div>
              )}
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  const Icon = item.icon;
                  const link = (
                    <Link
                      href={item.href}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-foreground/80 hover:bg-sidebar-accent hover:text-foreground"
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-y-1.5 left-0 w-1 rounded-full bg-primary"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      <Icon className={cn("h-4 w-4 shrink-0", active && "text-primary")} />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                      {!collapsed && item.badge && (
                        <Badge
                          variant={(item.badgeTone === "primary" ? "default" : item.badgeTone) || "default"}
                          className="ml-auto px-1.5 text-[10px]"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  );
                  return (
                    <li key={item.href}>
                      {collapsed ? (
                        <Tooltip>
                          <TooltipTrigger asChild>{link}</TooltipTrigger>
                          <TooltipContent side="right">{item.label}</TooltipContent>
                        </Tooltip>
                      ) : (
                        link
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className={cn("border-t p-3", collapsed && "px-2")}>
          <button
            onClick={() => dispatch(setAiOpen(true))}
            className={cn(
              "group flex w-full items-center gap-3 rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 via-info/10 to-accent/10 p-3 text-left shadow-soft transition-all hover:shadow-glow",
              collapsed && "justify-center p-2"
            )}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-glow animate-float">
              <Sparkles className="h-4 w-4" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <div className="text-sm font-semibold leading-tight">Ask Crowny</div>
                <div className="truncate text-[11px] text-muted-foreground">AI HR copilot</div>
              </div>
            )}
          </button>

          {collapsed && (
            <Button
              variant="ghost"
              size="icon-sm"
              className="mt-2 w-full"
              onClick={() => dispatch(toggleSidebar())}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          )}

          {!collapsed && (
            <div className="mt-3 px-1 text-[10px] text-muted-foreground">
              {ROLE_TITLE[role]} · Crownco HR
            </div>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}
