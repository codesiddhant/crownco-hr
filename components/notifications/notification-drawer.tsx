"use client";

import * as React from "react";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import {
  Bell,
  CheckCheck,
  Inbox,
  Megaphone,
  MessageCircle,
  Sparkles,
  Trophy,
  Settings,
  AlertTriangle,
  CheckCircle2,
  Phone
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/branding/logo";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setNotificationsOpen } from "@/lib/store/uiSlice";
import { markAllNotificationsRead, markNotificationRead } from "@/lib/store/dataSlice";
import { useDataset } from "@/hooks/use-dataset";
import { cn } from "@/lib/utils";

const TYPE_META: Record<string, { icon: React.ElementType; tone: string }> = {
  approval: { icon: CheckCircle2, tone: "text-info" },
  alert: { icon: AlertTriangle, tone: "text-warning" },
  mention: { icon: MessageCircle, tone: "text-primary" },
  ai_insight: { icon: Sparkles, tone: "text-info" },
  reward: { icon: Trophy, tone: "text-success" },
  system: { icon: Settings, tone: "text-muted-foreground" }
};

export function NotificationDrawer() {
  const open = useAppSelector((s) => s.ui.notificationsOpen);
  const dispatch = useAppDispatch();
  const ds = useDataset();
  const [tab, setTab] = React.useState("all");

  const filtered = React.useMemo(() => {
    if (tab === "all") return ds.notifications;
    if (tab === "unread") return ds.notifications.filter((n) => !n.read);
    return ds.notifications.filter((n) => n.type === tab);
  }, [tab, ds.notifications]);

  return (
    <Sheet open={open} onOpenChange={(v) => dispatch(setNotificationsOpen(v))}>
      <SheetContent side="right" className="w-full max-w-md p-0">
        <SheetHeader className="pb-3">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <Bell className="h-4 w-4" /> Notifications
            </SheetTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dispatch(markAllNotificationsRead())}
            >
              <CheckCheck className="h-4 w-4" /> Mark all read
            </Button>
          </div>
        </SheetHeader>
        <div className="px-6">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
              <TabsTrigger value="unread" className="flex-1">Unread</TabsTrigger>
              <TabsTrigger value="ai_insight" className="flex-1">AI</TabsTrigger>
              <TabsTrigger value="approval" className="flex-1">Approvals</TabsTrigger>
            </TabsList>
            <TabsContent value={tab}>
              <ScrollArea className="h-[calc(100vh-260px)] pr-1 -mr-1">
                <div className="space-y-2 py-2">
                  {filtered.length === 0 && (
                    <div className="rounded-2xl border border-dashed bg-muted/30 p-8 text-center">
                      <Inbox className="mx-auto h-8 w-8 text-muted-foreground" />
                      <div className="mt-2 text-sm font-medium">All caught up</div>
                      <div className="text-xs text-muted-foreground">No new notifications</div>
                    </div>
                  )}
                  {filtered.map((n) => {
                    const meta = TYPE_META[n.type];
                    const Icon = meta.icon;
                    return (
                      <motion.button
                        layout
                        key={n.id}
                        onClick={() => dispatch(markNotificationRead(n.id))}
                        className={cn(
                          "block w-full rounded-2xl border bg-card p-3 text-left shadow-soft transition-all hover:shadow-elevated",
                          !n.read && "border-primary/40 bg-primary/[0.03]"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted",
                              meta.tone
                            )}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <div className="truncate text-sm font-semibold">{n.title}</div>
                              {!n.read && (
                                <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                              )}
                            </div>
                            <div className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                              {n.message}
                            </div>
                            <div className="mt-1.5 flex items-center gap-2 text-[10px] text-muted-foreground">
                              <span>{formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}</span>
                              {n.actionLabel && (
                                <>
                                  <span>·</span>
                                  <span className="font-semibold text-primary">{n.actionLabel}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        <div className="border-t bg-muted/20 p-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            WhatsApp daily report preview
          </div>
          <Card className="p-3">
            <div className="flex items-center gap-2 border-b pb-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-success/15 text-success">
                <Phone className="h-3 w-3" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-semibold">Crownco HR · 7:00 PM</div>
                <div className="text-[10px] text-muted-foreground">WhatsApp business</div>
              </div>
            </div>
            <div className="mt-2 space-y-1 rounded-xl bg-success/10 p-2 text-xs">
              <div className="font-semibold">🎯 Your day at a glance</div>
              <div>📞 Calls: <strong>52</strong> · ⏱️ Talk time: <strong>2h 34m</strong></div>
              <div>✅ Leads qualified: <strong>6 / 9</strong> ratio (66%)</div>
              <div>🏆 Team rank: <strong>#4 of 18</strong></div>
              <div className="mt-1 text-muted-foreground">
                💡 Best window today: 11 AM–2 PM. Tomorrow: try 4-touch outbound.
              </div>
            </div>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}
