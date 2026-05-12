"use client";

import * as React from "react";
import {
  Activity,
  Award,
  Brain,
  Clock,
  Headphones,
  PhoneCall,
  PhoneIncoming,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Volume2,
  Zap
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { SectionCard } from "@/components/shared/section-card";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDataset } from "@/hooks/use-dataset";
import { useAppSelector } from "@/lib/store/hooks";
import { SeriesAreaChart } from "@/components/charts/area-chart";
import { SeriesBarChart } from "@/components/charts/bar-chart";
import { RadialGauge } from "@/components/charts/radial-gauge";
import { Heatmap } from "@/components/charts/heatmap";
import { formatDuration } from "@/lib/utils";

export default function EmployeePerformancePage() {
  const ds = useDataset();
  const user = useAppSelector((s) => s.auth.user);
  const me = ds.employees.find((e) => e.fullName === user?.name) ?? ds.employees[0];
  const myCalls = ds.calls.filter((c) => c.employeeId === me.id);
  const myLeads = ds.leads.filter((l) => l.ownerId === me.id);

  const todayCalls = myCalls.filter((c) => new Date(c.startedAt).toDateString() === new Date().toDateString());
  const qualified = myCalls.filter((c) => c.outcome === "qualified").length;
  const talkTime = myCalls.reduce((s, c) => s + c.durationSec, 0);
  const avgScore = Math.round(myCalls.reduce((s, c) => s + c.aiScore, 0) / Math.max(1, myCalls.length));

  // Daily trend
  const trend = Array.from({ length: 14 }, (_, i) => {
    const date = new Date(Date.now() - (13 - i) * 86400_000);
    const dayStr = date.toISOString().slice(0, 10);
    const dayCalls = myCalls.filter((c) => c.startedAt.startsWith(dayStr));
    return {
      day: date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
      calls: dayCalls.length,
      qualified: dayCalls.filter((c) => c.outcome === "qualified").length,
      talkMin: Math.round(dayCalls.reduce((s, c) => s + c.durationSec, 0) / 60)
    };
  });

  // Pipeline by stage
  const stages = ["new", "contacted", "qualified", "demo", "negotiation", "won"].map((s) => ({
    stage: s,
    count: myLeads.filter((l) => l.stage === s).length
  }));

  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const HOURS = Array.from({ length: 12 }, (_, i) => `${i + 9}`);
  const heatmap = DAYS.flatMap((day, d) =>
    HOURS.map((hr, h) => ({
      x: hr,
      y: day,
      value: myCalls.filter((c) => {
        const dt = new Date(c.startedAt);
        return dt.getDay() === d && dt.getHours() === (h + 9);
      }).length
    }))
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="My performance"
        description="Real-time productivity intelligence by AI"
        actions={
          <Badge variant="success" className="text-xs">
            <TrendingUp className="mr-1 h-3 w-3" />
            +{Math.round(Math.random() * 18 + 5)}% vs last week
          </Badge>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Today's calls" value={todayCalls.length} format="number" icon={PhoneCall} accent="primary" />
        <KpiCard label="Total talk time" value={Math.round(talkTime / 60)} suffix="min" format="number" icon={Volume2} accent="info" />
        <KpiCard label="Qualified leads" value={qualified} format="number" icon={Target} accent="success" />
        <KpiCard label="AI quality" value={avgScore} suffix="/100" format="number" icon={Sparkles} accent="warning" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard title="Activity trend" description="Last 14 days" className="lg:col-span-2">
          <SeriesAreaChart
            data={trend}
            xKey="day"
            series={[
              { key: "calls", label: "Calls", color: "hsl(var(--primary))" },
              { key: "qualified", label: "Qualified", color: "hsl(var(--success))" }
            ]}
            height={260}
          />
        </SectionCard>

        <SectionCard title="Performance gauge">
          <div className="flex flex-col items-center pt-4">
            <RadialGauge value={me.performanceScore} max={100} size={180} color="hsl(var(--primary))" label="Performance" />
            <div className="mt-3 text-xs text-muted-foreground">
              Rank #{ds.employees.sort((a, b) => b.performanceScore - a.performanceScore).findIndex((e) => e.id === me.id) + 1} of {ds.employees.length}
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="My pipeline" description="CRM leads by stage">
          <SeriesBarChart
            data={stages}
            xKey="stage"
            series={[{ key: "count", label: "Leads", color: "hsl(var(--primary))" }]}
            height={240}
          />
        </SectionCard>

        <SectionCard title="When I work best" description="Your activity heatmap">
          <Heatmap data={heatmap} xLabels={HOURS} yLabels={DAYS} />
        </SectionCard>
      </div>

      <SectionCard
        title="Crowny's coaching"
        description="AI-generated tips to improve your numbers"
        icon={<Brain className="h-4 w-4 text-primary" />}
      >
        <div className="grid gap-3 md:grid-cols-2">
          {[
            { icon: Clock, title: "Best window: 11 AM - 1 PM", note: "You convert 32% more in this window. Block this time for warm calls." },
            { icon: PhoneIncoming, title: "Follow-up gap = 3.8 hrs", note: "Top closers respond under 60 min. Use templated WhatsApp replies." },
            { icon: Target, title: "8 hot leads need attention", note: "These leads haven't been touched in 4+ days. Prioritize today." },
            { icon: Award, title: "Streak watch: 12 days", note: "Hit 50+ calls today to maintain your streak and earn ₹500 reward." }
          ].map((tip, i) => {
            const Icon = tip.icon;
            return (
              <div key={i} className="flex items-start gap-3 rounded-2xl border bg-card p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold">{tip.title}</div>
                  <p className="mt-1 text-xs text-muted-foreground">{tip.note}</p>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
