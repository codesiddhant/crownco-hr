"use client";

import * as React from "react";
import { Bell, Bot, Command, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setCommandOpen, setNotificationsOpen, setAiOpen } from "@/lib/store/uiSlice";
import { useDataset } from "@/hooks/use-dataset";
import { RoleSwitcher } from "./role-switcher";
import { BranchSwitcher } from "./branch-switcher";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";
import { MobileNav } from "./mobile-nav";

export function Topbar() {
  const dispatch = useAppDispatch();
  const ds = useDataset();
  const unread = ds.notifications.filter((n) => !n.read).length;

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        dispatch(setCommandOpen(true));
      }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        dispatch(setAiOpen(true));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dispatch]);

  return (
    <TooltipProvider delayDuration={120}>
      <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b bg-background/85 px-3 backdrop-blur-xl md:px-5">
        <MobileNav />
        <div className="flex-1">
          <button
            onClick={() => dispatch(setCommandOpen(true))}
            className="group flex w-full max-w-md items-center gap-2 rounded-xl border bg-card px-3 py-2 text-sm text-muted-foreground shadow-soft transition-colors hover:bg-muted/40 hover:text-foreground"
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search employees, tasks, leaves...</span>
            <span className="ml-auto hidden items-center gap-0.5 text-[10px] sm:flex">
              <kbd className="rounded border bg-muted px-1.5 py-0.5">⌘</kbd>
              <kbd className="rounded border bg-muted px-1.5 py-0.5">K</kbd>
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <BranchSwitcher />
          </div>
          <RoleSwitcher />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => dispatch(setAiOpen(true))}
                className="relative"
              >
                <Sparkles className="h-4 w-4 text-primary" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Ask Crowny (AI) · ⌘⇧A</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => dispatch(setNotificationsOpen(true))}
                className="relative"
              >
                <Bell className="h-4 w-4" />
                {unread > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-bold text-destructive-foreground">
                    {unread > 9 ? "9+" : unread}
                  </span>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Notifications</TooltipContent>
          </Tooltip>
          <ThemeToggle />
          <UserMenu />
        </div>
      </header>
    </TooltipProvider>
  );
}
