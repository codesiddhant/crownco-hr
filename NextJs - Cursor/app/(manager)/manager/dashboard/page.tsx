"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  ClipboardList,
  Crown,
  Flame,
  Gauge,
  PhoneCall,
  Sparkles,
  TrendingUp,
  Users,
  UsersRound,
  Workflow,
  CheckCircle2
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { SectionCard } from "@/components/shared/section-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { SeriesAreaChart } from "@/components/charts/area-chart";
import { SeriesBarChart } from "@/components/charts/bar-chart";
import { useDataset } from "@/hooks/use-dataset";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setLeaveStatus } from "@/lib/store/dataSlice";
import { setAiOpen } from "@/lib/store/uiSlice";
import { cn, initials } from "@/lib/utils";
import { motion } from "framer-motion";
import { StatusPill } from "@/components/shared/status-pill";
import { toast } from "sonner";

export default function ManagerDashboardPage() {
  const ds = useDataset();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const me = ds.employees.find((e) => e.fullName === user?.name) ?? ds.employees.find((e) => e.role === "manager") ?? ds.employees[0];

  const team = ds.employees.filter((e) => e.manager === me.id || (e.department === me.department && e.branchId === me.branchId && e.id !== me.id));
  const teamSlice = team.length > 0 ? team : ds.employees.filter((e) => e.department === me.department).slice(0, 14);
  const teamIds = new Set(teamSlice.map((e) => e.id));
  const teamLeaves = ds.leaves.filter((l) => teamIds.has(l.employeeId));
  const pendingLeaves = teamLeaves.filter((l) => l.status === "pending");
  const teamTasks = ds.tasks.filter((t) => teamIds.has(t.assigneeId));

  const today = new Date().toISOString().slice(0, 10);
  const todayAtt = ds.attendance.filter((a) => a.date === today && teamIds.has(a.employeeId));
  const present = todayAtt.filter((a) => a.status === "present" || a.status === "late").length;
  const avgProd =
    teamSlice.length > 0
      ? Math.round(teamSlice.reduce((s, e) => s + e.productivityScore, 0) / teamSlice.length)
      : 0;
  const avgPerf =
    teamSlice.length > 0
      ? Math.round(teamSlice.reduce((s, e) => s + e.performanceScore, 0) / teamSlice.length)
      : 0;

  // 14-day team trend
  const trend = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return {
      date: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
      productivity: Math.round(avgProd + (Math.random() - 0.5) * 14),
      attendance: Math.round(85 + Math.random() * 12)
    };
  });

  // Team task distribution
  const taskByStatus = ["todo", "in_progress", "review", "done", "blocked"].map((s) => ({
    status: s.replace("_", " "),
    count: teamTasks.filter((t) => t.status === s).length
  }));

  // 1:1 schedule (upcoming)
  const oneOnOnes = teamSlice.slice(0, 4).map((m, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return { id: `1_1_${m.id}`, person: m, scheduledAt: date };
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${me.firstName}'s team`}
        description={`${me.department} · ${ds.branches.find((b) => b.id === me.branchId)?.name}`}
        badge={`${teamSlice.length} direct reports`}
        actions={
          <>
            <Button variant="outline" size="sm" asChild>
              <Link href="/manager/approvals">
                <ClipboardList className="h-4 w-4" />
                Approvals
                <Badge variant="warning" className="ml-1 px-1.5 text-[10px]">
                  {pendingLeaves.length}
                </Badge>
              </Link>
            </Button>
            <Button variant="brand" size="sm" onClick={() => dispatch(setAiOpen(true))}>
              <Sparkles className="h-4 w-4" />
              Ask AI about team
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Team size" value={teamSlice.length} format="number" icon={Users} accent="primary" hint={`${teamSlice.filter((e) => e.status === "active").length} active`} />
        <KpiCard label="Present today" value={present} format="number" icon={CheckCircle2} accent="success" hint={`${todayAtt.filter((a) => a.status === "late").length} late · ${todayAtt.filter((a) => a.status === "on_leave").length} on leave`} />
        <KpiCard label="Team productivity" value={avgProd} icon={Gauge} accent="info" delta={4.2} deltaLabel="WoW" />
        <KpiCard label="Pending approvals" value={pendingLeaves.length} format="number" icon={ClipboardList} accent="warning" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard
          className="lg:col-span-2"
          title="Team performance trend"
          description="Productivity & attendance · 14 days"
          icon={<TrendingUp className="h-4 w-4" />}
        >
          <SeriesAreaChart
            data={trend}
            xKey="date"
            series={[
              { key: "productivity", label: "Productivity", color: "hsl(var(--primary))" },
              { key: "attendance", label: "Attendance %", color: "hsl(var(--success))" }
            ]}
            height={240}
          />
        </SectionCard>

        <SectionCard
          title="Task distribution"
          description={`${teamTasks.length} tasks across team`}
          icon={<Workflow className="h-4 w-4" />}
        >
          <SeriesBarChart
            data={taskByStatus}
            xKey="status"
            horizontal
            series={[{ key: "count", label: "Tasks", color: "hsl(var(--primary))" }]}
            height={220}
          />
        </SectionCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard
          className="lg:col-span-2"
          title="Pending approvals"
          description="Review with AI impact analysis"
          icon={<ClipboardList className="h-4 w-4" />}
        >
          <div className="space-y-2">
            {pendingLeaves.slice(0, 6).map((l) => {
              const emp = ds.employees.find((e) => e.id === l.employeeId);
              if (!emp) return null;
              const replacements = l.replacementSuggestions.slice(0, 3);
              return (
                <div key={l.id} className="rounded-2xl border bg-card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={emp.avatar} alt={emp.fullName} />
                        <AvatarFallback>{initials(emp.fullName)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold">{emp.fullName}</div>
                        <div className="truncate text-xs text-muted-foreground">
                          {emp.designation}
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px] uppercase">
                            {l.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {l.days}d · {l.from} → {l.to}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={cn(
                          "text-2xl font-bold tabular-nums",
                          l.aiRiskScore > 70 ? "text-destructive" : l.aiRiskScore > 40 ? "text-warning" : "text-success"
                        )}
                      >
                        {l.aiRiskScore}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        AI risk
                      </div>
                    </div>
                  </div>
                  {replacements.length > 0 && (
                    <div className="mt-3 rounded-xl bg-primary/5 p-2">
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                        <Sparkles className="h-3 w-3" /> AI replacement suggestions
                      </div>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {replacements.map((r) => {
                          const rep = ds.employees.find((e) => e.id === r);
                          if (!rep) return null;
                          return (
                            <div
                              key={r}
                              className="flex items-center gap-1 rounded-full border bg-card px-2 py-0.5 text-[10px]"
                            >
                              <Avatar className="h-4 w-4">
                                <AvatarImage src={rep.avatar} alt={rep.fullName} />
                              </Avatar>
                              {rep.firstName} {rep.lastName.slice(0, 1)}.
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  <div className="mt-3 flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="success"
                      className="flex-1"
                      onClick={() => {
                        dispatch(setLeaveStatus({ id: l.id, status: "approved" }));
                        toast.success("Leave approved");
                      }}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        dispatch(setLeaveStatus({ id: l.id, status: "rejected" }));
                        toast("Leave rejected");
                      }}
                    >
                      Reject
                    </Button>
                    <Button size="sm" variant="ghost" asChild>
                      <Link href="/manager/approvals">Details</Link>
                    </Button>
                  </div>
                </div>
              );
            })}
            {pendingLeaves.length === 0 && (
              <div className="rounded-2xl border border-dashed bg-muted/20 p-8 text-center">
                <CheckCircle2 className="mx-auto h-8 w-8 text-success" />
                <div className="mt-2 text-sm font-medium">All caught up</div>
                <div className="text-xs text-muted-foreground">No pending approvals</div>
              </div>
            )}
          </div>
        </SectionCard>

        <SectionCard
          title="Upcoming 1:1s"
          description="Auto-scheduled with AI agenda"
          icon={<UsersRound className="h-4 w-4" />}
        >
          <div className="space-y-2">
            {oneOnOnes.map((m) => (
              <div key={m.id} className="flex items-start gap-2 rounded-xl border bg-card p-2.5">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={m.person.avatar} alt={m.person.fullName} />
                  <AvatarFallback>{initials(m.person.fullName)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{m.person.fullName}</div>
                  <div className="text-xs text-muted-foreground">
                    {m.scheduledAt.toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short" })}
                    {" · 30 min"}
                  </div>
                </div>
                <Button variant="ghost" size="icon-sm">
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="My team"
        description="Performance scorecards"
        icon={<UsersRound className="h-4 w-4" />}
        actions={
          <Button variant="ghost" size="sm" asChild>
            <Link href="/manager/team">View all</Link>
          </Button>
        }
      >
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {teamSlice.slice(0, 9).map((e) => (
            <motion.div
              key={e.id}
              whileHover={{ y: -2 }}
              className="rounded-2xl border bg-card p-3"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={e.avatar} alt={e.fullName} />
                  <AvatarFallback>{initials(e.fullName)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{e.fullName}</div>
                  <div className="truncate text-xs text-muted-foreground">{e.designation}</div>
                </div>
                <StatusPill value={e.status} />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-xs font-semibold text-primary tabular-nums">{e.performanceScore}</div>
                  <div className="text-[10px] text-muted-foreground">Perf</div>
                </div>
                <div>
                  <div className="text-xs font-semibold tabular-nums">{e.productivityScore}</div>
                  <div className="text-[10px] text-muted-foreground">Prod</div>
                </div>
                <div>
                  <div className={cn("text-xs font-semibold tabular-nums", e.burnoutRisk > 60 ? "text-destructive" : "text-success")}>
                    {e.burnoutRisk}
                  </div>
                  <div className="text-[10px] text-muted-foreground">Burnout</div>
                </div>
              </div>
              <Progress value={e.performanceScore} className="mt-3 h-1.5" />
            </motion.div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
