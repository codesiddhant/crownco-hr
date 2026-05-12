"use client";

import * as React from "react";
import {
  Activity,
  Award,
  Bell,
  CalendarClock,
  CheckCircle2,
  Clock,
  PhoneCall,
  Sparkles,
  TrendingUp,
  Users
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDataset } from "@/hooks/use-dataset";
import { cn, initials } from "@/lib/utils";
import { motion } from "framer-motion";

interface ActivityItem {
  id: string;
  type: "check_in" | "leave" | "reward" | "call" | "task" | "alert";
  who: { name: string; avatar: string };
  text: string;
  time: string;
}

export default function HRActivityPage() {
  const ds = useDataset();
  const [tick, setTick] = React.useState(0);

  // Simulated real-time tick every 6s
  React.useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 6000);
    return () => clearInterval(t);
  }, []);

  const feed = React.useMemo<ActivityItem[]>(() => {
    const items: ActivityItem[] = [];
    ds.attendance.filter((a) => a.checkIn).slice(-10).reverse().forEach((a) => {
      const e = ds.employees.find((x) => x.id === a.employeeId);
      if (!e || !a.checkIn) return;
      items.push({
        id: `att_${a.id}`,
        type: "check_in",
        who: { name: e.fullName, avatar: e.avatar },
        text: `Checked in via ${a.source}${a.status === "late" ? " (late)" : ""}`,
        time: new Date(a.checkIn).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
      });
    });
    ds.leaves.slice(0, 6).forEach((l) => {
      const e = ds.employees.find((x) => x.id === l.employeeId);
      if (!e) return;
      items.push({
        id: `lv_${l.id}`,
        type: "leave",
        who: { name: e.fullName, avatar: e.avatar },
        text: `Applied for ${l.type} leave (${l.days} days)`,
        time: new Date(l.appliedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })
      });
    });
    ds.rewards.slice(0, 6).forEach((r) => {
      const e = ds.employees.find((x) => x.id === r.employeeId);
      if (!e || r.points < 0) return;
      items.push({
        id: `rw_${r.id}`,
        type: "reward",
        who: { name: e.fullName, avatar: e.avatar },
        text: `Earned "${r.title}" (+${r.points} XP)`,
        time: new Date(r.awardedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })
      });
    });
    ds.calls.slice(0, 8).forEach((c) => {
      const e = ds.employees.find((x) => x.id === c.employeeId);
      if (!e) return;
      items.push({
        id: `c_${c.id}`,
        type: "call",
        who: { name: e.fullName, avatar: e.avatar },
        text: `Call with ${c.customerName} — ${c.outcome.replace("_", " ")}`,
        time: new Date(c.startedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
      });
    });
    return items.sort(() => Math.random() - 0.5).slice(0, 24);
  }, [ds, tick]);

  const ICON_MAP = {
    check_in: Clock,
    leave: CalendarClock,
    reward: Award,
    call: PhoneCall,
    task: CheckCircle2,
    alert: Bell
  };
  const TONE_MAP = {
    check_in: "text-info bg-info/10",
    leave: "text-warning bg-warning/10",
    reward: "text-success bg-success/10",
    call: "text-primary bg-primary/10",
    task: "text-accent bg-accent/10",
    alert: "text-destructive bg-destructive/10"
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Activity feed"
        description="Realtime workforce activity"
        actions={
          <Badge variant="success" className="text-xs">
            <span className="mr-1 h-2 w-2 rounded-full bg-success animate-pulse" />
            Live
          </Badge>
        }
      />

      <SectionCard title="Recent activity" description="Auto-refreshes every 6 seconds">
        <div className="space-y-2">
          {feed.map((item, i) => {
            const Icon = ICON_MAP[item.type];
            return (
              <motion.div
                key={item.id + tick}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.02 }}
                className="flex items-start gap-3 rounded-xl border bg-card p-3"
              >
                <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", TONE_MAP[item.type])}>
                  <Icon className="h-4 w-4" />
                </div>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={item.who.avatar} alt={item.who.name} />
                  <AvatarFallback className="text-xs">{initials(item.who.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="text-sm">
                    <span className="font-semibold">{item.who.name}</span>
                    <span className="text-muted-foreground"> · {item.text}</span>
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground tabular-nums">{item.time}</span>
              </motion.div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
