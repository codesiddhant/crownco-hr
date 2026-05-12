"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Brain,
  CalendarDays,
  CheckCircle2,
  Clock,
  Crown,
  Flame,
  Gauge,
  Heart,
  LineChart,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  UserMinus,
  UserPlus,
  Users
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { SectionCard } from "@/components/shared/section-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { SeriesAreaChart } from "@/components/charts/area-chart";
import { SeriesBarChart } from "@/components/charts/bar-chart";
import { DonutChart } from "@/components/charts/donut-chart";
import { RadialGauge } from "@/components/charts/radial-gauge";
import { Heatmap } from "@/components/charts/heatmap";
import { useDataset } from "@/hooks/use-dataset";
import { useAppDispatch } from "@/lib/store/hooks";
import { setAiOpen } from "@/lib/store/uiSlice";
import { setLeaveStatus } from "@/lib/store/dataSlice";
import { cn, formatCompact, formatCurrency, initials } from "@/lib/utils";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { StatusPill } from "@/components/shared/status-pill";

export default function HRDashboardPage() {
  const ds = useDataset();
  const dispatch = useAppDispatch();

  const totalEmployees = ds.employees.length;
  const active = ds.employees.filter((e) => e.status === "active").length;
  const today = new Date().toISOString().slice(0, 10);
  const todayAtt = ds.attendance.filter((a) => a.date === today);
  const presentToday = todayAtt.filter((a) => a.status === "present" || a.status === "late").length;
  const lateToday = todayAtt.filter((a) => a.status === "late").length;
  const onLeave = todayAtt.filter((a) => a.status === "on_leave").length;
  const absentToday = todayAtt.filter((a) => a.status === "absent").length;

  const avgProductivity =
    Math.round(
      (ds.employees.reduce((s, e) => s + e.productivityScore, 0) / ds.employees.length) * 10
    ) / 10;
  const burnoutHigh = ds.employees.filter((e) => e.burnoutRisk >= 70).length;
  const attritionHigh = ds.employees.filter((e) => e.performanceScore < 55 && e.attendanceRate < 88).length;

  const totalCTC = ds.employees.reduce((s, e) => s + e.ctcINR, 0);

  // 30 day attendance trend
  const trend = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const dateStr = d.toISOString().slice(0, 10);
    const day = ds.attendance.filter((a) => a.date === dateStr);
    return {
      date: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
      present: day.filter((a) => a.status === "present").length,
      late: day.filter((a) => a.status === "late").length,
      onLeave: day.filter((a) => a.status === "on_leave").length
    };
  });

  // Department breakdown
  const byDept = new Map<string, number>();
  ds.employees.forEach((e) => byDept.set(e.department, (byDept.get(e.department) || 0) + 1));
  const deptData = Array.from(byDept.entries()).map(([name, value], i) => ({
    name,
    value,
    color: ["#2563eb", "#06b6d4", "#8b5cf6", "#10b981", "#f59e0b"][i % 5]
  }));

  // Salary distribution
  const salaryBuckets = [
    { range: "<5L", min: 0, max: 500000 },
    { range: "5–10L", min: 500000, max: 1000000 },
    { range: "10–20L", min: 1000000, max: 2000000 },
    { range: "20–30L", min: 2000000, max: 3000000 },
    { range: "30L+", min: 3000000, max: Infinity }
  ].map((b) => ({
    range: b.range,
    count: ds.employees.filter((e) => e.ctcINR >= b.min && e.ctcINR < b.max).length
  }));

  // Top / low performers
  const sortedByPerf = [...ds.employees].sort((a, b) => b.performanceScore - a.performanceScore);
  const topPerformers = sortedByPerf.slice(0, 5);
  const lowPerformers = sortedByPerf.slice(-5).reverse();

  // Heatmap: department × day-of-week attendance rate
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const depts = ["Sales", "Support", "HR", "Engineering", "Operations"];
  const heatmapData = depts.flatMap((d) =>
    days.map((day, dIdx) => ({
      x: day,
      y: d,
      value: Math.round(60 + Math.random() * 40 - (dIdx === 5 ? 18 : 0))
    }))
  );

  // Pending approvals
  const pendingLeaves = ds.leaves.filter((l) => l.status === "pending").slice(0, 5);

  // Activity feed (recent)
  const activity = [
    ...ds.leaves.slice(0, 3).map((l) => ({
      id: l.id,
      type: "leave",
      who: ds.employees.find((e) => e.id === l.employeeId)?.fullName ?? "Someone",
      avatar: ds.employees.find((e) => e.id === l.employeeId)?.avatar,
      message: `applied ${l.days}-day ${l.type} leave`,
      time: l.appliedAt,
      tone: "info"
    })),
    ...ds.rewards.slice(0, 3).map((r) => ({
      id: r.id,
      type: "reward",
      who: ds.employees.find((e) => e.id === r.employeeId)?.fullName ?? "Someone",
      avatar: ds.employees.find((e) => e.id === r.employeeId)?.avatar,
      message: `earned "${r.title}"`,
      time: r.awardedAt,
      tone: "success"
    }))
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 8);

  return (
    <div className="space-y-6">
      <PageHeader
        title="HR Operations Center"
        description="Real-time workforce intelligence across all branches."
        badge="Live"
        actions={
          <>
            <Button variant="outline" size="sm" asChild>
              <Link href="/hr/insights">
                <Sparkles className="h-4 w-4" />
                AI insights
              </Link>
            </Button>
            <Button variant="brand" size="sm" onClick={() => dispatch(setAiOpen(true))}>
              <Brain className="h-4 w-4" />
              Ask Crowny
            </Button>
          </>
        }
      />

      {/* KPI Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Total employees"
          value={totalEmployees}
          format="number"
          icon={Users}
          delta={2.4}
          deltaLabel="this month"
          accent="primary"
        />
        <KpiCard
          label="Present today"
          value={presentToday}
          format="number"
          icon={CheckCircle2}
          delta={-1.2}
          deltaLabel="vs yesterday"
          accent="success"
          hint={`${lateToday} late · ${onLeave} on leave · ${absentToday} absent`}
        />
        <KpiCard
          label="Productivity score"
          value={`${avgProductivity}`}
          icon={Gauge}
          delta={3.8}
          deltaLabel="week-over-week"
          accent="info"
        />
        <KpiCard
          label="Burnout alerts"
          value={burnoutHigh}
          format="number"
          icon={Flame}
          delta={-12.5}
          deltaLabel="↓ improving"
          accent="warning"
        />
      </div>

      {/* AI Insight Banner */}
      <SectionCard
        highlight
        icon={<Sparkles className="h-4 w-4" />}
        title="AI insights for today"
        description="Crownco AI scanned 12 signals across attendance, productivity and engagement."
        actions={
          <Button variant="brand" size="sm" onClick={() => dispatch(setAiOpen(true))}>
            Open assistant
            <ArrowRight className="h-4 w-4" />
          </Button>
        }
      >
        <div className="grid gap-3 md:grid-cols-3">
          {ds.aiInsights.slice(0, 3).map((insight) => {
            const toneClass = {
              critical: "text-destructive",
              warning: "text-warning",
              info: "text-info",
              success: "text-success"
            }[insight.severity];
            return (
              <motion.div
                key={insight.id}
                whileHover={{ y: -2 }}
                className="rounded-2xl border bg-card p-4"
              >
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
                  <span className={cn("flex h-6 w-6 items-center justify-center rounded-md bg-muted", toneClass)}>
                    <AlertTriangle className="h-3 w-3" />
                  </span>
                  <span className={toneClass}>{insight.severity}</span>
                </div>
                <div className="mt-2 text-sm font-semibold">{insight.title}</div>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{insight.body}</p>
                <div className="mt-3 inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  <Sparkles className="h-3 w-3" />
                  {insight.suggestion.slice(0, 60)}
                  {insight.suggestion.length > 60 && "…"}
                </div>
              </motion.div>
            );
          })}
        </div>
      </SectionCard>

      {/* Charts Grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard
          className="lg:col-span-2"
          title="Attendance trend"
          description="Last 30 days · across all branches"
          icon={<TrendingUp className="h-4 w-4" />}
          actions={
            <Tabs defaultValue="30d">
              <TabsList className="h-8">
                <TabsTrigger value="7d" className="px-2 text-xs">7D</TabsTrigger>
                <TabsTrigger value="30d" className="px-2 text-xs">30D</TabsTrigger>
                <TabsTrigger value="90d" className="px-2 text-xs">90D</TabsTrigger>
              </TabsList>
            </Tabs>
          }
        >
          <SeriesAreaChart
            data={trend}
            xKey="date"
            series={[
              { key: "present", label: "Present", color: "#10b981" },
              { key: "late", label: "Late", color: "#f59e0b" },
              { key: "onLeave", label: "On leave", color: "#8b5cf6" }
            ]}
            height={260}
          />
        </SectionCard>

        <SectionCard
          title="Department mix"
          description={`${ds.employees.length} across ${deptData.length} departments`}
          icon={<Users className="h-4 w-4" />}
        >
          <DonutChart
            data={deptData}
            centerValue={ds.employees.length}
            centerLabel="employees"
          />
          <div className="mt-3 space-y-1.5">
            {deptData.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                  {d.name}
                </div>
                <span className="font-semibold tabular-nums">{d.value}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Heatmap + Salary + Productivity gauge */}
      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard
          className="lg:col-span-2"
          title="Attendance heatmap"
          description="Avg attendance rate by department × day"
          icon={<CalendarDays className="h-4 w-4" />}
        >
          <Heatmap data={heatmapData} xLabels={days} yLabels={depts} max={100} cellSize={40} />
        </SectionCard>

        <SectionCard
          title="Productivity score"
          description="Org-wide weekly average"
          icon={<Gauge className="h-4 w-4" />}
        >
          <div className="flex flex-col items-center">
            <RadialGauge value={avgProductivity} color="hsl(var(--primary))" label="Score" />
            <div className="mt-2 flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-success" /> Sales +9%
              </div>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-warning" /> Support −3%
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard
          title="Salary distribution"
          description="CTC bands across all employees"
          icon={<LineChart className="h-4 w-4" />}
          className="lg:col-span-2"
        >
          <SeriesBarChart
            data={salaryBuckets}
            xKey="range"
            series={[{ key: "count", label: "Employees", color: "hsl(var(--primary))" }]}
            height={220}
          />
          <div className="mt-3 text-xs text-muted-foreground">
            Total annual payroll: <strong className="text-foreground">{formatCurrency(totalCTC)}</strong>
          </div>
        </SectionCard>

        <SectionCard
          title="Attrition risk"
          description="High-risk employees this quarter"
          icon={<UserMinus className="h-4 w-4" />}
          actions={<Badge variant="destructive">{attritionHigh}</Badge>}
        >
          <div className="space-y-2">
            {sortedByPerf.slice(-4).map((e) => (
              <div key={e.id} className="flex items-center gap-2 rounded-xl border bg-card p-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={e.avatar} alt={e.fullName} />
                  <AvatarFallback>{initials(e.fullName)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{e.fullName}</div>
                  <div className="truncate text-xs text-muted-foreground">{e.department}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold text-destructive">{100 - e.performanceScore}%</div>
                  <div className="text-[10px] text-muted-foreground">risk</div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Performers + Activity + Approvals */}
      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard
          title="Top performers"
          description="This quarter"
          icon={<Crown className="h-4 w-4" />}
          actions={
            <Button variant="ghost" size="sm" asChild>
              <Link href="/hr/performance">View all</Link>
            </Button>
          }
        >
          <div className="space-y-2">
            {topPerformers.map((e, i) => (
              <div key={e.id} className="flex items-center gap-2 rounded-xl border bg-card p-2.5">
                <div
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold",
                    i === 0
                      ? "bg-warning/20 text-warning"
                      : i === 1
                        ? "bg-muted-foreground/15 text-muted-foreground"
                        : "bg-secondary text-secondary-foreground"
                  )}
                >
                  {i + 1}
                </div>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={e.avatar} alt={e.fullName} />
                  <AvatarFallback>{initials(e.fullName)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{e.fullName}</div>
                  <div className="truncate text-xs text-muted-foreground">{e.designation}</div>
                </div>
                <Badge variant="success" className="text-xs">
                  {e.performanceScore}
                </Badge>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Pending approvals"
          description="Leaves & corrections awaiting your review"
          icon={<Clock className="h-4 w-4" />}
          actions={<Badge variant="warning">{ds.leaves.filter((l) => l.status === "pending").length}</Badge>}
        >
          <div className="space-y-2">
            {pendingLeaves.map((l) => {
              const emp = ds.employees.find((e) => e.id === l.employeeId);
              if (!emp) return null;
              return (
                <div key={l.id} className="rounded-xl border bg-card p-3">
                  <div className="flex items-start gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={emp.avatar} alt={emp.fullName} />
                      <AvatarFallback>{initials(emp.fullName)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="truncate text-sm font-semibold">{emp.fullName}</div>
                        <Badge variant="outline" className="text-[10px] uppercase">{l.type}</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {l.days}d · {l.from} → {l.to}
                      </div>
                      <div className="mt-1.5 flex items-center gap-2 text-[10px]">
                        <span className="text-muted-foreground">AI risk:</span>
                        <span
                          className={cn(
                            "font-semibold",
                            l.aiRiskScore > 70 ? "text-destructive" : l.aiRiskScore > 40 ? "text-warning" : "text-success"
                          )}
                        >
                          {l.aiRiskScore}/100
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5">
                    <Button
                      variant="success"
                      size="sm"
                      className="h-7 flex-1 text-xs"
                      onClick={() => {
                        dispatch(setLeaveStatus({ id: l.id, status: "approved" }));
                        toast.success("Leave approved");
                      }}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 flex-1 text-xs"
                      onClick={() => {
                        dispatch(setLeaveStatus({ id: l.id, status: "rejected" }));
                        toast("Leave rejected");
                      }}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard
          title="Realtime activity"
          description="Live employee actions"
          icon={<TrendingUp className="h-4 w-4" />}
        >
          <div className="space-y-3">
            {activity.map((a) => (
              <div key={a.id} className="flex items-start gap-2">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={a.avatar} />
                  <AvatarFallback>{initials(a.who)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1 text-xs">
                  <div className="font-medium leading-tight">
                    {a.who} <span className="font-normal text-muted-foreground">{a.message}</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {new Date(a.time).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </div>
                </div>
                {a.tone === "success" && <Sparkles className="mt-1 h-3.5 w-3.5 text-success" />}
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Bottom: Branch performance */}
      <SectionCard
        title="Branch comparison"
        description="Performance index across all branches"
        icon={<ShieldCheck className="h-4 w-4" />}
      >
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {ds.branches.map((b) => {
            const empCount = ds.employees.filter((e) => e.branchId === b.id).length;
            const branchEmps = ds.employees.filter((e) => e.branchId === b.id);
            const avgPerf =
              branchEmps.length === 0
                ? 0
                : Math.round(branchEmps.reduce((s, e) => s + e.performanceScore, 0) / branchEmps.length);
            return (
              <motion.div
                key={b.id}
                whileHover={{ y: -2 }}
                className="rounded-2xl border bg-card p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-semibold">{b.name}</div>
                    <div className="text-xs text-muted-foreground">{b.city}, {b.country}</div>
                  </div>
                  <Badge variant="outline" className="text-[10px]">{empCount} employees</Badge>
                </div>
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <div className="text-2xl font-semibold">{avgPerf}</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      avg performance
                    </div>
                  </div>
                  <div className={cn("flex items-center gap-1 text-xs font-semibold", avgPerf > 70 ? "text-success" : "text-warning")}>
                    {avgPerf > 70 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                    {avgPerf > 70 ? "+4.2%" : "-2.1%"}
                  </div>
                </div>
                <Progress value={avgPerf} className="mt-3" />
              </motion.div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
