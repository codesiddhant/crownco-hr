"use client";

import * as React from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  ArrowRight,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Clock,
  Coins,
  Flame,
  Gauge,
  Gift,
  GraduationCap,
  Loader2,
  LogIn,
  LogOut,
  MapPin,
  PhoneCall,
  Sparkles,
  Star,
  Trophy,
  TrendingUp,
  Wallet,
  Workflow
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { SectionCard } from "@/components/shared/section-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { useDataset } from "@/hooks/use-dataset";
import { useAppSelector } from "@/lib/store/hooks";
import { RadialGauge } from "@/components/charts/radial-gauge";
import { SeriesAreaChart } from "@/components/charts/area-chart";
import { motion } from "framer-motion";
import { cn, formatCurrency, initials, formatDuration } from "@/lib/utils";
import { StatusPill } from "@/components/shared/status-pill";
import { toast } from "sonner";

export default function EmployeeDashboardPage() {
  const ds = useDataset();
  const user = useAppSelector((s) => s.auth.user);
  const me = ds.employees.find((e) => e.fullName === user?.name) ?? ds.employees[0];
  const balance = ds.leaveBalances.find((b) => b.employeeId === me.id);
  const myTasks = ds.tasks.filter((t) => t.assigneeId === me.id);
  const myCalls = ds.calls.filter((c) => c.employeeId === me.id).slice(0, 10);
  const myRewards = ds.rewards.filter((r) => r.employeeId === me.id);
  const myPayslip = ds.payslips.find((p) => p.employeeId === me.id);
  const myAchievements = ds.achievements[me.id] ?? [];

  const [checkedIn, setCheckedIn] = React.useState(true);
  const [verifying, setVerifying] = React.useState(false);

  const totalPoints = myRewards.reduce((s, r) => s + r.points, 0);
  const totalRewardsValue = myRewards.reduce((s, r) => s + (r.valueINR ?? 0), 0);

  const rank =
    ds.employees
      .sort((a, b) => b.performanceScore - a.performanceScore)
      .findIndex((e) => e.id === me.id) + 1;

  // 7-day productivity sparkline data
  const trend = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      day: d.toLocaleDateString("en-IN", { weekday: "short" }),
      productivity: Math.round(me.productivityScore + (Math.random() - 0.5) * 14),
      target: 80
    };
  });

  const meetings = ds.meetings.slice(0, 4);
  const leaderboard = [...ds.employees]
    .filter((e) => e.branchId === me.branchId)
    .sort((a, b) => b.performanceScore - a.performanceScore)
    .slice(0, 5);

  const punchIn = async () => {
    setVerifying(true);
    await new Promise((r) => setTimeout(r, 1000));
    setVerifying(false);
    setCheckedIn(true);
    toast.success("Check-in successful · Geofence + face verified");
  };

  const punchOut = async () => {
    setCheckedIn(false);
    toast("Check-out recorded");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${me.firstName}`}
        description={`${me.designation} · ${me.department}`}
        badge="Today's workspace"
        actions={
          <>
            <Button variant="outline" size="sm" asChild>
              <Link href="/employee/payslips">
                <Wallet className="h-4 w-4" />
                View payslip
              </Link>
            </Button>
            <Button variant="brand" size="sm" asChild>
              <Link href="/employee/attendance">
                <CalendarCheck className="h-4 w-4" />
                Mark attendance
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Attendance Hero */}
        <SectionCard
          className="lg:col-span-2 overflow-hidden"
          contentClassName="!p-0"
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/15 via-info/10 to-accent/15 p-6">
            <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  {format(new Date(), "EEEE, dd MMM yyyy")}
                </div>
                <h2 className="mt-1 text-2xl font-semibold">
                  {checkedIn ? "You're checked in" : "Ready to start your day?"}
                </h2>
                <div className="mt-2 flex items-center gap-3 text-sm">
                  <Badge variant="success">
                    <CheckCircle2 className="h-3 w-3" />
                    {checkedIn ? "On-site · Mumbai HQ" : "Not checked in"}
                  </Badge>
                  <span className="text-muted-foreground">
                    Shift: 09:30 – 18:30
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-3 text-xs">
                  <div className="rounded-xl border bg-card/60 px-3 py-2 backdrop-blur">
                    <div className="text-muted-foreground">Check-in</div>
                    <div className="font-semibold tabular-nums">
                      {checkedIn ? "09:22 AM" : "—"}
                    </div>
                  </div>
                  <div className="rounded-xl border bg-card/60 px-3 py-2 backdrop-blur">
                    <div className="text-muted-foreground">Worked</div>
                    <div className="font-semibold tabular-nums">
                      {checkedIn ? "6h 18m" : "—"}
                    </div>
                  </div>
                  <div className="rounded-xl border bg-card/60 px-3 py-2 backdrop-blur">
                    <div className="text-muted-foreground">Source</div>
                    <div className="font-semibold">Geo + Face</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {checkedIn ? (
                  <Button variant="destructive" size="lg" onClick={punchOut}>
                    <LogOut className="h-4 w-4" />
                    Check out
                  </Button>
                ) : (
                  <Button variant="brand" size="lg" onClick={punchIn} disabled={verifying}>
                    {verifying ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <LogIn className="h-4 w-4" />
                        Check in
                      </>
                    )}
                  </Button>
                )}
                <Button variant="outline" size="lg" asChild>
                  <Link href="/employee/attendance">
                    <MapPin className="h-4 w-4" />
                    Selfie
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Performance gauge */}
        <SectionCard
          title="Performance score"
          description={`Rank #${rank} of ${ds.employees.length}`}
          icon={<Gauge className="h-4 w-4" />}
        >
          <div className="flex flex-col items-center">
            <RadialGauge value={me.performanceScore} color="hsl(var(--primary))" label="Score" />
            <div className="mt-3 grid w-full grid-cols-3 gap-2">
              <div className="rounded-xl border bg-card p-2 text-center">
                <div className="text-sm font-semibold text-success">+8%</div>
                <div className="text-[10px] text-muted-foreground">WoW</div>
              </div>
              <div className="rounded-xl border bg-card p-2 text-center">
                <div className="text-sm font-semibold">{me.productivityScore}</div>
                <div className="text-[10px] text-muted-foreground">Productivity</div>
              </div>
              <div className="rounded-xl border bg-card p-2 text-center">
                <div className="text-sm font-semibold">{me.attendanceRate.toFixed(0)}%</div>
                <div className="text-[10px] text-muted-foreground">Attendance</div>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* KPI Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Reward points"
          value={Math.abs(totalPoints)}
          format="number"
          icon={Coins}
          accent="warning"
          hint={`${myRewards.length} rewards earned`}
        />
        <KpiCard
          label="Tasks open"
          value={myTasks.filter((t) => t.status !== "done").length}
          format="number"
          icon={Workflow}
          accent="info"
          hint={`${myTasks.filter((t) => t.status === "done").length} completed`}
        />
        <KpiCard
          label="Leave balance"
          value={(balance?.casual ?? 0) + (balance?.earned ?? 0) + (balance?.sick ?? 0)}
          format="number"
          icon={CalendarDays}
          accent="success"
          unit="days"
        />
        <KpiCard
          label="Calls this week"
          value={myCalls.length}
          format="number"
          icon={PhoneCall}
          accent="primary"
          delta={12}
          deltaLabel="vs last week"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Productivity trend */}
        <SectionCard
          className="lg:col-span-2"
          title="Your productivity"
          description="7-day trend with target line"
          icon={<TrendingUp className="h-4 w-4" />}
        >
          <SeriesAreaChart
            data={trend}
            xKey="day"
            series={[
              { key: "productivity", label: "Score", color: "hsl(var(--primary))" },
              { key: "target", label: "Target", color: "hsl(var(--success))" }
            ]}
            height={220}
          />
        </SectionCard>

        {/* Motivation card */}
        <SectionCard
          title="Your AI coach"
          description="Personalized insight"
          icon={<Sparkles className="h-4 w-4" />}
          highlight
        >
          <div className="space-y-2 text-sm">
            <div className="rounded-xl bg-primary/5 p-3">
              <div className="flex items-start gap-2">
                <Flame className="mt-0.5 h-4 w-4 text-warning" />
                <div>
                  <div className="font-medium">You're on a 6-day streak!</div>
                  <div className="text-xs text-muted-foreground">
                    One more day to unlock the 7-Day Streak badge.
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-info/5 p-3">
              <div className="flex items-start gap-2">
                <Sparkles className="mt-0.5 h-4 w-4 text-info" />
                <div>
                  <div className="font-medium">Best time: 11 AM – 2 PM</div>
                  <div className="text-xs text-muted-foreground">
                    Your conversion is 18% higher in this window.
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-success/5 p-3">
              <div className="flex items-start gap-2">
                <Star className="mt-0.5 h-4 w-4 text-success" />
                <div>
                  <div className="font-medium">You're 4 calls away</div>
                  <div className="text-xs text-muted-foreground">
                    from the 100 Calls Crusader achievement.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Tasks + Meetings + WhatsApp report */}
      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard
          title="My tasks"
          description={`${myTasks.filter((t) => t.status !== "done").length} open · ${myTasks.filter((t) => t.priority === "urgent" || t.priority === "high").length} high-priority`}
          icon={<Workflow className="h-4 w-4" />}
          actions={
            <Button variant="ghost" size="sm" asChild>
              <Link href="/employee/tasks">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          }
        >
          <div className="space-y-2">
            {myTasks.slice(0, 5).map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-2 rounded-xl border bg-card p-3 transition-colors hover:border-primary/30"
              >
                <div
                  className={cn(
                    "h-2 w-2 rounded-full",
                    t.priority === "urgent"
                      ? "bg-destructive"
                      : t.priority === "high"
                        ? "bg-warning"
                        : t.priority === "medium"
                          ? "bg-info"
                          : "bg-muted-foreground"
                  )}
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{t.title}</div>
                  <div className="text-xs text-muted-foreground">
                    Due {format(new Date(t.dueAt), "dd MMM")} · SLA {t.slaHours}h
                  </div>
                </div>
                <StatusPill value={t.status} />
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Upcoming meetings"
          description="Next 7 days"
          icon={<Clock className="h-4 w-4" />}
        >
          <div className="space-y-2">
            {meetings.map((m) => (
              <div key={m.id} className="flex items-start gap-2 rounded-xl border bg-card p-2.5">
                <div className="flex flex-col items-center justify-center rounded-lg bg-primary/10 px-2 py-1 text-primary">
                  <div className="text-[10px] uppercase">
                    {format(new Date(m.startAt), "MMM")}
                  </div>
                  <div className="text-lg font-bold leading-tight">
                    {format(new Date(m.startAt), "dd")}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{m.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(m.startAt), "HH:mm")} – {format(new Date(m.endAt), "HH:mm")} ·{" "}
                    {m.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Today's AI report"
          description="Auto-delivered at 7 PM"
          icon={<Sparkles className="h-4 w-4" />}
        >
          <div className="overflow-hidden rounded-2xl border bg-gradient-to-br from-success/10 to-accent/10 p-3">
            <div className="flex items-center gap-2 border-b border-success/20 pb-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-success/20 text-success">
                <PhoneCall className="h-3.5 w-3.5" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-semibold">Crownco HR</div>
                <div className="text-[10px] text-muted-foreground">via WhatsApp</div>
              </div>
              <Badge variant="success" className="text-[10px]">Preview</Badge>
            </div>
            <div className="mt-2 space-y-1 text-xs">
              <div className="font-semibold">🎯 {me.firstName}, here's your day</div>
              <div>📞 Calls: <strong>{myCalls.length}</strong></div>
              <div>⏱️ Talk time: <strong>2h 34m</strong></div>
              <div>✅ Qualified: <strong>6 / 9</strong> (66%)</div>
              <div>🏆 Team rank: <strong>#{rank}</strong> of {ds.employees.filter((e) => e.branchId === me.branchId).length}</div>
              <div className="mt-2 rounded-lg bg-card/50 p-2 text-muted-foreground">
                💡 Tomorrow try the 4-touch outbound sequence — your peers see +14% conversion.
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Achievements + Leaderboard + Salary */}
      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard
          className="lg:col-span-2"
          title="Achievements"
          description={`${myAchievements.filter((a) => a.unlocked).length} unlocked · ${myAchievements.length - myAchievements.filter((a) => a.unlocked).length} in progress`}
          icon={<Trophy className="h-4 w-4" />}
          actions={
            <Button variant="ghost" size="sm" asChild>
              <Link href="/employee/rewards">View all</Link>
            </Button>
          }
        >
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {myAchievements.slice(0, 4).map((a) => (
              <motion.div
                key={a.id}
                whileHover={{ y: -4 }}
                className={cn(
                  "rounded-2xl border p-3 text-center",
                  a.unlocked ? "bg-gradient-to-br from-warning/10 to-warning/0 border-warning/30" : "bg-muted/30 opacity-70"
                )}
              >
                <div
                  className={cn(
                    "mx-auto flex h-12 w-12 items-center justify-center rounded-2xl",
                    a.unlocked ? "bg-warning text-warning-foreground shadow-glow" : "bg-muted text-muted-foreground"
                  )}
                >
                  <Trophy className="h-5 w-5" />
                </div>
                <div className="mt-2 text-xs font-semibold">{a.name}</div>
                <Progress value={(a.progress / a.target) * 100} className="mt-2 h-1" />
                <div className="mt-1 text-[10px] text-muted-foreground">
                  {a.progress} / {a.target}
                </div>
              </motion.div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Team leaderboard"
          description="Mumbai HQ"
          icon={<Trophy className="h-4 w-4" />}
          actions={
            <Button variant="ghost" size="sm" asChild>
              <Link href="/employee/rewards">Full board</Link>
            </Button>
          }
        >
          <div className="space-y-2">
            {leaderboard.map((e, i) => (
              <div
                key={e.id}
                className={cn(
                  "flex items-center gap-2 rounded-xl border p-2",
                  e.id === me.id && "border-primary/30 bg-primary/5"
                )}
              >
                <div
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold",
                    i === 0
                      ? "bg-warning/20 text-warning"
                      : i === 1
                        ? "bg-muted-foreground/15 text-muted-foreground"
                        : i === 2
                          ? "bg-accent/15 text-accent"
                          : "bg-secondary text-secondary-foreground"
                  )}
                >
                  {i + 1}
                </div>
                <Avatar className="h-7 w-7">
                  <AvatarImage src={e.avatar} alt={e.fullName} />
                  <AvatarFallback>{initials(e.fullName)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-medium">{e.fullName}</div>
                </div>
                <span className="text-xs font-semibold tabular-nums">{e.performanceScore}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Salary card */}
      <SectionCard
        title="Salary insights"
        description="May 2026"
        icon={<Wallet className="h-4 w-4" />}
        actions={
          <Button variant="ghost" size="sm" asChild>
            <Link href="/employee/payslips">
              View payslip
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        }
      >
        <div className="grid gap-3 md:grid-cols-4">
          <div className="rounded-2xl border bg-card p-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Net pay (this month)
            </div>
            <div className="mt-1 text-2xl font-semibold">
              {formatCurrency(myPayslip?.net ?? 0)}
            </div>
            <Badge variant="success" className="mt-2 text-[10px]">
              {myPayslip?.status === "paid" ? "Paid" : "Processing"}
            </Badge>
          </div>
          <div className="rounded-2xl border bg-card p-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">CTC</div>
            <div className="mt-1 text-2xl font-semibold">{formatCurrency(me.ctcINR)}</div>
            <div className="mt-1 text-xs text-muted-foreground">Annual</div>
          </div>
          <div className="rounded-2xl border bg-card p-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Incentives YTD
            </div>
            <div className="mt-1 text-2xl font-semibold text-success">
              {formatCurrency(48000)}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">+₹12K vs last quarter</div>
          </div>
          <div className="rounded-2xl border bg-card p-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Reimbursements
            </div>
            <div className="mt-1 text-2xl font-semibold">
              {formatCurrency(8400)}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">2 pending</div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
