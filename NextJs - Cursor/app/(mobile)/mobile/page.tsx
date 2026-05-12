"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Battery,
  Bell,
  CalendarDays,
  Camera,
  ChevronRight,
  Clock,
  Coins,
  Gift,
  Home,
  ListTodo,
  PhoneCall,
  Signal,
  Smartphone,
  Sparkles,
  Trophy,
  Wifi,
  Zap
} from "lucide-react";
import { Logo } from "@/components/branding/logo";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useDataset } from "@/hooks/use-dataset";
import { cn, initials } from "@/lib/utils";
import { useAppSelector } from "@/lib/store/hooks";

const MOBILE_SCREENS = [
  { id: "home", label: "Home", icon: Home },
  { id: "attendance", label: "Attendance", icon: Camera },
  { id: "leave", label: "Leave", icon: CalendarDays },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "productivity", label: "Stats", icon: Zap }
];

export default function MobileDemoPage() {
  const ds = useDataset();
  const user = useAppSelector((s) => s.auth.user);
  const me = ds.employees.find((e) => e.fullName === user?.name) ?? ds.employees[0];
  const [screen, setScreen] = React.useState("home");

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-primary/[0.04] py-12">
      <div className="container max-w-6xl">
        <div className="text-center mb-8">
          <Logo size={36} className="mx-auto" />
          <h1 className="mt-3 text-2xl font-bold">Mobile App Preview</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            iOS/Android companion app for Crownco HR
          </p>
          <div className="mt-3 flex justify-center gap-2 flex-wrap">
            {MOBILE_SCREENS.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => setScreen(s.id)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors",
                    screen === s.id ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:border-primary/30"
                  )}
                >
                  <Icon className="h-3 w-3" />
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center">
          <PhoneFrame>
            {screen === "home" && <HomeScreen me={me} />}
            {screen === "attendance" && <AttendanceScreen />}
            {screen === "leave" && <LeaveScreen />}
            {screen === "notifications" && <NotificationsScreen />}
            {screen === "productivity" && <ProductivityScreen me={me} />}
          </PhoneFrame>
        </div>

        <div className="mt-8 text-center">
          <Link href="/select-role">
            <Button variant="outline">
              Back to portals <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="relative h-[760px] w-[380px] rounded-[40px] bg-zinc-900 p-2 shadow-2xl shadow-primary/20"
    >
      <div className="relative h-full w-full overflow-hidden rounded-[32px] bg-card">
        {/* Status bar */}
        <div className="absolute left-0 right-0 top-0 z-30 flex items-center justify-between bg-card/90 px-6 pt-2 pb-1.5 text-[10px] backdrop-blur">
          <span className="font-bold tabular-nums">{new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false })}</span>
          <div className="absolute left-1/2 top-2 h-5 w-20 -translate-x-1/2 rounded-full bg-zinc-900" />
          <div className="flex items-center gap-1.5">
            <Signal className="h-3 w-3" />
            <Wifi className="h-3 w-3" />
            <Battery className="h-3 w-3" />
          </div>
        </div>
        <div className="h-full overflow-y-auto pt-9 pb-20">{children}</div>
        {/* Bottom dock */}
        <div className="absolute bottom-0 left-0 right-0 border-t bg-card/90 backdrop-blur">
          <div className="flex justify-around py-2">
            {[Home, Camera, ListTodo, Bell, Smartphone].map((Icon, i) => (
              <button key={i} className={cn("flex flex-col items-center gap-0.5 p-2", i === 0 && "text-primary")}>
                <Icon className="h-5 w-5" />
              </button>
            ))}
          </div>
          <div className="mx-auto mb-1 h-1 w-32 rounded-full bg-zinc-900" />
        </div>
      </div>
    </motion.div>
  );
}

function HomeScreen({ me }: { me: any }) {
  return (
    <div className="space-y-3 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Hi {me.firstName} 👋</p>
          <h2 className="text-lg font-bold">{new Date().toLocaleDateString("en-IN", { weekday: "long" })}</h2>
        </div>
        <Avatar className="h-10 w-10">
          <AvatarImage src={me.avatar} alt={me.fullName} />
          <AvatarFallback>{initials(me.fullName)}</AvatarFallback>
        </Avatar>
      </div>

      <Card className="bg-gradient-to-br from-primary to-accent text-primary-foreground p-4 border-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs opacity-90">Check-in status</p>
            <p className="text-lg font-bold">In office</p>
            <p className="text-xs opacity-80">09:24 AM · Mumbai HQ</p>
          </div>
          <Button size="sm" className="bg-white/15 text-white hover:bg-white/25 border-0">
            <Camera className="h-3.5 w-3.5" />
            Check out
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-2">
        {[
          { icon: PhoneCall, label: "Calls", value: "47", color: "primary" },
          { icon: ListTodo, label: "Tasks", value: "12", color: "warning" },
          { icon: Trophy, label: "Points", value: "1.2k", color: "success" }
        ].map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="p-3 text-center">
              <Icon className={`h-4 w-4 mx-auto text-${s.color}`} />
              <div className="mt-1 text-lg font-bold">{s.value}</div>
              <div className="text-[9px] text-muted-foreground">{s.label}</div>
            </Card>
          );
        })}
      </div>

      <Card className="p-3 bg-gradient-to-br from-success/10 to-primary/10">
        <div className="flex items-center gap-2 text-xs font-semibold text-success">
          <Sparkles className="h-3 w-3" />
          AI Daily Brief
        </div>
        <p className="mt-1 text-xs">
          Strong start! 12 calls before 11 AM. Focus next on hot lead "Sharma & Sons"
          — they showed interest yesterday.
        </p>
      </Card>

      <Card className="p-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase text-muted-foreground">Today's Goals</span>
          <span className="text-xs font-bold">68%</span>
        </div>
        <Progress value={68} className="mt-2 h-2" />
        <div className="mt-2 text-[10px] text-muted-foreground">
          47/70 calls · 9/12 follow-ups · 3/5 tasks
        </div>
      </Card>
    </div>
  );
}

function AttendanceScreen() {
  return (
    <div className="space-y-3 p-4">
      <h2 className="text-lg font-bold">Mark attendance</h2>
      <Card className="aspect-square overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-800 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full border-2 border-success/40"
            />
            <div className="h-32 w-32 rounded-full border-4 border-success/60" />
          </div>
        </div>
        <div className="absolute bottom-4 left-0 right-0 text-center text-white">
          <p className="text-xs font-bold">Smile slightly 😊</p>
          <p className="text-[10px] opacity-80">Hold still for 3 seconds</p>
        </div>
      </Card>
      <Card className="p-3">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-[10px] text-muted-foreground">Geo</div>
            <Badge variant="success" className="mt-1 text-[9px]">✓ Verified</Badge>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground">WiFi</div>
            <Badge variant="success" className="mt-1 text-[9px]">✓ Office</Badge>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground">Face</div>
            <Badge variant="warning" className="mt-1 text-[9px]">Scanning</Badge>
          </div>
        </div>
      </Card>
      <Button variant="brand" className="w-full">
        <Camera className="h-4 w-4" />
        Confirm attendance
      </Button>
    </div>
  );
}

function LeaveScreen() {
  return (
    <div className="space-y-3 p-4">
      <h2 className="text-lg font-bold">Leave balance</h2>
      <div className="grid grid-cols-2 gap-2">
        {[
          { type: "Casual", days: 9, total: 12, color: "primary" },
          { type: "Sick", days: 11, total: 12, color: "destructive" },
          { type: "Earned", days: 18, total: 22, color: "info" },
          { type: "Comp off", days: 3, total: 5, color: "warning" }
        ].map((b) => (
          <Card key={b.type} className="p-3">
            <div className="text-[10px] text-muted-foreground">{b.type}</div>
            <div className="mt-1 text-2xl font-bold">{b.days}</div>
            <div className="text-[9px] text-muted-foreground">of {b.total}</div>
            <Progress value={(b.days / b.total) * 100} className="mt-2 h-1" />
          </Card>
        ))}
      </div>
      <Button variant="brand" className="w-full">
        <CalendarDays className="h-4 w-4" />
        Apply leave
      </Button>
      <Card className="p-3 bg-primary/[0.04] border-primary/20">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
          <Sparkles className="h-3 w-3" />
          AI suggestion
        </div>
        <p className="mt-1 text-[11px]">
          You haven't taken leave in 47 days. Best time to plan: Jun 15-18 (low workload).
        </p>
      </Card>
    </div>
  );
}

function NotificationsScreen() {
  return (
    <div className="space-y-2 p-4">
      <h2 className="text-lg font-bold">Notifications</h2>
      {[
        { type: "ai", icon: Sparkles, title: "Daily report ready", body: "Tap to view today's productivity", time: "2m" },
        { type: "reward", icon: Trophy, title: "+200 XP earned!", body: "Top closer of the week", time: "1h" },
        { type: "task", icon: Bell, title: "Task overdue", body: "Follow-up: Sharma & Sons", time: "3h" },
        { type: "leave", icon: CalendarDays, title: "Leave approved", body: "May 22-24 confirmed by HR", time: "5h" }
      ].map((n, i) => {
        const Icon = n.icon;
        return (
          <Card key={i} className="p-3">
            <div className="flex items-start gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">{n.title}</span>
                  <span className="text-[9px] text-muted-foreground">{n.time}</span>
                </div>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{n.body}</p>
              </div>
            </div>
          </Card>
        );
      })}

      <Card className="p-3 bg-gradient-to-br from-success/10 to-emerald-500/10 border-success/20 mt-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-success">
          📱 WhatsApp report (auto-sent)
        </div>
        <p className="mt-1 text-[10px]">
          <strong>Today's Stats:</strong><br />
          🎯 47 calls · ⏱ 2h 18m talk time<br />
          ✨ 4 leads qualified (12% conv rate)<br />
          🏆 Rank: #3 in Sales team<br />
          💡 Tip: Try AI-suggested objection script
        </p>
      </Card>
    </div>
  );
}

function ProductivityScreen({ me }: { me: any }) {
  return (
    <div className="space-y-3 p-4">
      <h2 className="text-lg font-bold">My stats</h2>
      <Card className="p-4 bg-gradient-to-br from-primary to-accent text-primary-foreground border-0">
        <div className="text-xs opacity-90">Performance score</div>
        <div className="text-4xl font-bold tabular-nums">{me.performanceScore}/100</div>
        <div className="mt-2 flex items-center gap-2 text-xs">
          <Trophy className="h-3 w-3" />
          Rank #{Math.floor(Math.random() * 10) + 1} in your team
        </div>
      </Card>
      <div className="grid grid-cols-2 gap-2">
        <Card className="p-3">
          <PhoneCall className="h-4 w-4 text-primary" />
          <div className="mt-1 text-2xl font-bold">47</div>
          <div className="text-[10px] text-muted-foreground">Calls today</div>
        </Card>
        <Card className="p-3">
          <Clock className="h-4 w-4 text-info" />
          <div className="mt-1 text-2xl font-bold">2h 18m</div>
          <div className="text-[10px] text-muted-foreground">Talk time</div>
        </Card>
        <Card className="p-3">
          <Zap className="h-4 w-4 text-warning" />
          <div className="mt-1 text-2xl font-bold">4</div>
          <div className="text-[10px] text-muted-foreground">Qualified</div>
        </Card>
        <Card className="p-3">
          <Coins className="h-4 w-4 text-success" />
          <div className="mt-1 text-2xl font-bold">1,250</div>
          <div className="text-[10px] text-muted-foreground">XP earned</div>
        </Card>
      </div>
      <Card className="p-3 bg-primary/[0.04] border-primary/20">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
          <Sparkles className="h-3 w-3" />
          Coaching tip
        </div>
        <p className="mt-1 text-[11px]">
          You convert 28% more in the 11 AM – 1 PM window. Block this time for warm leads.
        </p>
      </Card>
    </div>
  );
}
