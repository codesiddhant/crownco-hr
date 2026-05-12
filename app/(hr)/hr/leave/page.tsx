"use client";

import * as React from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, addMonths, subMonths } from "date-fns";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Users,
  ScrollText,
  Building2,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { SectionCard } from "@/components/shared/section-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useDataset } from "@/hooks/use-dataset";
import { useAppDispatch } from "@/lib/store/hooks";
import { setLeaveStatus } from "@/lib/store/dataSlice";
import { cn, initials } from "@/lib/utils";
import { toast } from "sonner";
import { StatusPill } from "@/components/shared/status-pill";
import { SeriesBarChart } from "@/components/charts/bar-chart";

export default function HRLeavePage() {
  const ds = useDataset();
  const dispatch = useAppDispatch();
  const [month, setMonth] = React.useState(new Date());

  const pending = ds.leaves.filter((l) => l.status === "pending");
  const approved = ds.leaves.filter((l) => l.status === "approved");
  const rejected = ds.leaves.filter((l) => l.status === "rejected");

  const start = startOfMonth(month);
  const end = endOfMonth(month);
  const days = eachDayOfInterval({ start, end });
  const firstDow = getDay(start);

  // For each day, count overlapping leaves
  const leavesForDay = (d: Date) => {
    const dayStr = d.toISOString().slice(0, 10);
    return ds.leaves.filter(
      (l) => l.status === "approved" && l.from <= dayStr && l.to >= dayStr
    );
  };

  // Type breakdown chart
  const types = ["casual", "sick", "earned", "comp_off", "unpaid"].map((t) => ({
    type: t,
    count: approved.filter((l) => l.type === t).length
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leave Management"
        description="Approvals, calendar, team overview & policies"
        actions={
          <Button variant="brand" size="sm">
            <ScrollText className="h-4 w-4" />
            Export report
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Pending approvals" value={pending.length} format="number" accent="warning" />
        <KpiCard label="Approved this month" value={approved.length} format="number" accent="success" />
        <KpiCard label="Rejected" value={rejected.length} format="number" accent="destructive" />
        <KpiCard label="Avg AI risk" value={Math.round(pending.reduce((s, l) => s + l.aiRiskScore, 0) / Math.max(1, pending.length))} accent="info" />
      </div>

      <Tabs defaultValue="approvals">
        <TabsList>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="team">Team overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="policy">Policy</TabsTrigger>
        </TabsList>

        <TabsContent value="approvals" className="space-y-3">
          {pending.slice(0, 10).map((l) => {
            const emp = ds.employees.find((e) => e.id === l.employeeId);
            if (!emp) return null;
            return (
              <SectionCard key={l.id}>
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="md:col-span-2 flex items-start gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={emp.avatar} alt={emp.fullName} />
                      <AvatarFallback>{initials(emp.fullName)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{emp.fullName}</span>
                        <Badge variant="outline" className="text-[10px] uppercase">{l.type}</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {emp.designation} · {emp.department} · {ds.branches.find((b) => b.id === emp.branchId)?.name}
                      </div>
                      <div className="mt-1.5 text-sm">
                        <strong>{l.from}</strong> → <strong>{l.to}</strong> · {l.days} days
                      </div>
                      <p className="mt-1 text-xs italic text-muted-foreground">"{l.reason}"</p>
                    </div>
                  </div>
                  <div className="rounded-2xl border bg-primary/[0.03] p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                        <Sparkles className="mr-1 inline h-3 w-3" /> AI Impact
                      </span>
                      <span
                        className={cn(
                          "text-xl font-bold tabular-nums",
                          l.aiRiskScore > 70 ? "text-destructive" : l.aiRiskScore > 40 ? "text-warning" : "text-success"
                        )}
                      >
                        {l.aiRiskScore}
                      </span>
                    </div>
                    <div className="mt-2 space-y-1 text-[11px]">
                      {l.aiSuggestions.slice(0, 2).map((s, i) => (
                        <div key={i} className="flex items-start gap-1">
                          <CheckCircle2 className="mt-0.5 h-3 w-3 text-success shrink-0" />
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 flex items-center gap-1">
                      {l.replacementSuggestions.slice(0, 3).map((r) => {
                        const rep = ds.employees.find((e) => e.id === r);
                        if (!rep) return null;
                        return (
                          <Avatar key={r} className="h-6 w-6 border-2 border-card">
                            <AvatarImage src={rep.avatar} alt={rep.fullName} />
                            <AvatarFallback className="text-[8px]">{initials(rep.fullName)}</AvatarFallback>
                          </Avatar>
                        );
                      })}
                      <span className="ml-1 text-[10px] text-muted-foreground">
                        replacements
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex justify-end gap-2 border-t pt-3">
                  <Button variant="outline" size="sm" onClick={() => {
                    dispatch(setLeaveStatus({ id: l.id, status: "rejected" }));
                    toast("Leave rejected");
                  }}>Reject</Button>
                  <Button variant="success" size="sm" onClick={() => {
                    dispatch(setLeaveStatus({ id: l.id, status: "approved" }));
                    toast.success("Leave approved with AI handover plan");
                  }}>
                    Approve with AI handover
                  </Button>
                </div>
              </SectionCard>
            );
          })}
        </TabsContent>

        <TabsContent value="calendar">
          <SectionCard
            title={format(month, "MMMM yyyy")}
            icon={<CalendarDays className="h-4 w-4" />}
            actions={
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon-sm" onClick={() => setMonth(subMonths(month, 1))}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon-sm" onClick={() => setMonth(addMonths(month, 1))}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            }
          >
            <TooltipProvider>
              <div className="grid grid-cols-7 gap-1 text-center">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <div key={d} className="py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {d}
                  </div>
                ))}
                {Array.from({ length: firstDow }).map((_, i) => (
                  <div key={`spacer-${i}`} />
                ))}
                {days.map((d) => {
                  const dayLeaves = leavesForDay(d);
                  const isToday = isSameDay(d, new Date());
                  return (
                    <Tooltip key={d.toISOString()}>
                      <TooltipTrigger asChild>
                        <button
                          className={cn(
                            "relative aspect-square rounded-xl border bg-card p-2 text-left transition-colors hover:border-primary/40",
                            isToday && "border-primary bg-primary/5"
                          )}
                        >
                          <div className="text-xs font-semibold">{d.getDate()}</div>
                          {dayLeaves.length > 0 && (
                            <div className="absolute bottom-1.5 right-1.5 flex items-center -space-x-1.5">
                              {dayLeaves.slice(0, 3).map((l) => {
                                const e = ds.employees.find((x) => x.id === l.employeeId);
                                if (!e) return null;
                                return (
                                  <Avatar key={l.id} className="h-5 w-5 border-2 border-card">
                                    <AvatarImage src={e.avatar} alt={e.fullName} />
                                    <AvatarFallback className="text-[7px]">
                                      {initials(e.fullName)}
                                    </AvatarFallback>
                                  </Avatar>
                                );
                              })}
                              {dayLeaves.length > 3 && (
                                <span className="ml-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
                                  +{dayLeaves.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </button>
                      </TooltipTrigger>
                      {dayLeaves.length > 0 && (
                        <TooltipContent>
                          <div className="space-y-1 text-xs">
                            <div className="font-semibold">{format(d, "EEE, dd MMM")}</div>
                            {dayLeaves.slice(0, 5).map((l) => {
                              const e = ds.employees.find((x) => x.id === l.employeeId);
                              return (
                                <div key={l.id}>
                                  {e?.fullName} · <span className="text-muted-foreground capitalize">{l.type}</span>
                                </div>
                              );
                            })}
                            {dayLeaves.length > 5 && <div className="text-muted-foreground">+{dayLeaves.length - 5} more</div>}
                          </div>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  );
                })}
              </div>
            </TooltipProvider>
          </SectionCard>
        </TabsContent>

        <TabsContent value="team" className="space-y-3">
          <SectionCard
            title="Team leave overview"
            description="Who's out this week"
            icon={<Users className="h-4 w-4" />}
          >
            <div className="grid gap-2 md:grid-cols-2">
              {approved.slice(0, 12).map((l) => {
                const emp = ds.employees.find((e) => e.id === l.employeeId);
                if (!emp) return null;
                return (
                  <div key={l.id} className="flex items-center gap-3 rounded-xl border bg-card p-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={emp.avatar} alt={emp.fullName} />
                      <AvatarFallback>{initials(emp.fullName)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{emp.fullName}</div>
                      <div className="truncate text-xs text-muted-foreground">
                        {l.type} · {l.from} → {l.to}
                      </div>
                    </div>
                    <Badge variant="success" className="text-[10px]">{l.days}d</Badge>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-3">
          <SectionCard title="Leave type distribution" description="Approved leaves by type">
            <SeriesBarChart
              data={types}
              xKey="type"
              series={[{ key: "count", label: "Count", color: "hsl(var(--primary))" }]}
              height={240}
            />
          </SectionCard>
        </TabsContent>

        <TabsContent value="policy">
          <SectionCard
            title="Leave Policy"
            description="Crownco HR · India operations"
            icon={<ScrollText className="h-4 w-4" />}
          >
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <h3 className="text-base font-semibold">Annual entitlements</h3>
              <ul className="space-y-1.5 text-sm">
                <li><strong>Casual leave:</strong> 12 days/year, max 3 consecutive</li>
                <li><strong>Sick leave:</strong> 12 days/year, accumulates up to 24</li>
                <li><strong>Earned leave:</strong> 22 days/year, can carry forward 30</li>
                <li><strong>Comp off:</strong> 1 day for every weekend worked</li>
                <li><strong>Maternity:</strong> 26 weeks paid (per Maternity Benefit Act)</li>
                <li><strong>Paternity:</strong> 15 days paid</li>
                <li><strong>Bereavement:</strong> 5 days paid for immediate family</li>
              </ul>
              <h3 className="mt-6 text-base font-semibold">Approval workflow</h3>
              <ol className="space-y-1.5 text-sm">
                <li>Employee submits leave request</li>
                <li>AI runs impact analysis (risk score, backup suggestions)</li>
                <li>Manager reviews within 24 hours</li>
                <li>HR approves (auto-approval if risk score &lt; 30)</li>
                <li>Calendar + payroll auto-updated</li>
              </ol>
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
