"use client";

import * as React from "react";
import { BarChart3, Gauge, PhoneCall, Trophy, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { KpiCard } from "@/components/shared/kpi-card";
import { SeriesAreaChart } from "@/components/charts/area-chart";
import { SeriesBarChart } from "@/components/charts/bar-chart";
import { Heatmap } from "@/components/charts/heatmap";
import { FunnelChart } from "@/components/charts/funnel-chart";
import { useDataset } from "@/hooks/use-dataset";
import { useAppSelector } from "@/lib/store/hooks";

export default function ManagerAnalyticsPage() {
  const ds = useDataset();
  const user = useAppSelector((s) => s.auth.user);
  const me = ds.employees.find((e) => e.fullName === user?.name) ?? ds.employees[0];
  const team = ds.employees.filter((e) => e.department === me.department && e.branchId === me.branchId);
  const teamIds = new Set(team.map((e) => e.id));
  const calls = ds.calls.filter((c) => teamIds.has(c.employeeId));
  const totalCalls = calls.length;
  const totalTalkMin = Math.round(calls.reduce((s, c) => s + c.durationSec, 0) / 60);
  const qualified = calls.filter((c) => c.outcome === "qualified").length;
  const conv = totalCalls === 0 ? 0 : Math.round((qualified / totalCalls) * 100);

  const trend = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return {
      date: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
      calls: 40 + Math.round(Math.random() * 60),
      conv: 30 + Math.round(Math.random() * 30)
    };
  });

  const funnel = [
    { label: "Calls", value: totalCalls || 1200 },
    { label: "Connected", value: Math.round((totalCalls || 1200) * 0.72) },
    { label: "Qualified", value: Math.max(qualified, Math.round((totalCalls || 1200) * 0.18)) },
    { label: "Demo", value: Math.round((totalCalls || 1200) * 0.08) },
    { label: "Closed", value: Math.round((totalCalls || 1200) * 0.04) }
  ];

  // Performance by member (top 8)
  const memberBar = team
    .slice(0, 8)
    .map((e) => ({ name: e.firstName, productivity: e.productivityScore, perf: e.performanceScore }));

  // Hour-of-day heatmap
  const hours = ["9", "10", "11", "12", "13", "14", "15", "16", "17", "18"];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const hmap = days.flatMap((d) => hours.map((h) => ({ x: h, y: d, value: Math.round(20 + Math.random() * 80) })));

  return (
    <div className="space-y-6">
      <PageHeader title="Team analytics" description="Productivity, calls & conversion insights" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total calls (30d)" value={totalCalls} format="compact" icon={PhoneCall} accent="primary" />
        <KpiCard label="Talk time (mins)" value={totalTalkMin} format="compact" icon={Gauge} accent="info" />
        <KpiCard label="Qualified" value={qualified} format="compact" icon={Trophy} accent="success" />
        <KpiCard label="Conversion" value={`${conv}`} unit="%" icon={TrendingUp} accent="warning" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard
          className="lg:col-span-2"
          title="Activity trend"
          description="Calls and conversion ratio · 30 days"
          icon={<BarChart3 className="h-4 w-4" />}
        >
          <SeriesAreaChart
            data={trend}
            xKey="date"
            series={[
              { key: "calls", label: "Calls", color: "hsl(var(--primary))" },
              { key: "conv", label: "Conv %", color: "hsl(var(--success))" }
            ]}
            height={240}
          />
        </SectionCard>
        <SectionCard title="Sales funnel" description="Last 30 days">
          <FunnelChart data={funnel} />
        </SectionCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard className="lg:col-span-2" title="Activity heatmap" description="Best hours of the week">
          <Heatmap data={hmap} xLabels={hours} yLabels={days} cellSize={42} />
        </SectionCard>
        <SectionCard title="Member comparison" description="Top 8">
          <SeriesBarChart
            data={memberBar}
            xKey="name"
            horizontal
            series={[
              { key: "productivity", label: "Productivity", color: "hsl(var(--primary))" },
              { key: "perf", label: "Performance", color: "hsl(var(--accent))" }
            ]}
            height={260}
          />
        </SectionCard>
      </div>
    </div>
  );
}
