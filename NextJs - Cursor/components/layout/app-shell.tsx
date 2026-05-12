"use client";

import * as React from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { PageTransition } from "./page-transition";
import { CommandPalette } from "@/components/command-palette";
import { NotificationDrawer } from "@/components/notifications/notification-drawer";
import { AIAssistant } from "@/components/ai-assistant";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh bg-background">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar />
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
      <CommandPalette />
      <NotificationDrawer />
      <AIAssistant />
    </div>
  );
}
