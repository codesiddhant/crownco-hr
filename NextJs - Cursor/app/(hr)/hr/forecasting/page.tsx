"use client";

import * as React from "react";
import {
  AlertTriangle,
  Compass,
  TrendingDown,
  TrendingUp,
  UserPlus,
  Users,
  Sparkles
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { SectionCard } from "@/components/shared/section-card";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDataset } from "@/hooks/use-dataset";
import { SeriesAreaChart } from "@/components/charts/area-chart";
import { SeriesBarChart } from "@/components/charts/bar-chart";
import { initials } from "@/lib/utils";

export default function HRForecastingPage() {
  const ds = useDataset();
  const total = ds.employees.length;
  const highAttritionRisk = ds.employees.filter((e) => e.attritionRisk > 60);
  const avgAttrition = Math.round(ds.employees.reduce((s, e) => s + e.attritionRisk, 0) / total);

  // 6-month staffing forecast
  const forecast = Array.from({ length: 6 }, (_, i) => ({
    month: new Date(Date.now() + i * 30 * 86400_000).toLocaleDateString("en-IN", { month: "short" }),
    current: total - Math.round(total * 0.02 * i),
    optimal: Math.round(total * (1 + 0.025 * i))
  }));

  // Hiring demand by department
  const hiringDemand = ["Sales", "Support", "HR", "Engineering"].map((d) => ({
    dept: d,
    open: Math.floor(Math.random() * 12) + 3
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Workforce Forecasting"
        description="AI-predicted attrition, staffing & hiring demand"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Attrition risk" value={avgAttrition} suffix="%" format="number" icon={TrendingDown} accent="warning" />
        <KpiCard label="High-risk employees" value={highAttritionRisk.length} format="number" icon={AlertTriangle} accent="destructive" />
        <KpiCard label="Open positions" value={hiringDemand.reduce((s, d) => s + d.open, 0)} format="number" icon={UserPlus} accent="primary" />
        <KpiCard label="Forecast confidence" value={87} suffix="%" format="number" icon={Sparkles} accent="success" />
      </div>

      <SectionCard title="Staffing forecast — Next 6 months" description="Current trajectory vs optimal headcount">
        <SeriesAreaChart
          data={forecast}
          xKey="month"
          series={[
            { key: "current", label: "Current trajectory", color: "hsl(var(--warning))" },
            { key: "optimal", label: "Optimal headcount", color: "hsl(var(--primary))" }
          ]}
          height={280}
        />
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Hiring demand by department">
          <SeriesBarChart
            data={hiringDemand}
            xKey="dept"
            series={[{ key: "open", label: "Positions to hire", color: "hsl(var(--accent))" }]}
            height={260}
          />
        </SectionCard>

        <SectionCard
          title="Top attrition risks"
          description="AI predicts these employees may leave in 90 days"
          icon={<TrendingDown className="h-4 w-4 text-destructive" />}
        >
          <div className="space-y-2">
            {ds.employees.sort((a, b) => b.attritionRisk - a.attritionRisk).slice(0, 6).map((emp) => (
              <Card key={emp.id} className="p-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={emp.avatar} alt={emp.fullName} />
                    <AvatarFallback className="text-xs">{initials(emp.fullName)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{emp.fullName}</div>
                    <div className="text-xs text-muted-foreground">{emp.designation}</div>
                  </div>
                  <Badge variant={emp.attritionRisk > 70 ? "destructive" : "warning"} className="text-[10px]">
                    {emp.attritionRisk}% risk
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="AI workforce insights"
        icon={<Sparkles className="h-4 w-4 text-primary" />}
      >
        <div className="grid gap-3 md:grid-cols-2">
          {[
            { icon: TrendingUp, title: "Sales team needs +14 hires", note: "Pipeline growth + attrition projection. Recommend Q2 hiring spree.", color: "primary" },
            { icon: Compass, title: "Skills gap in Engineering", note: "AI/ML capabilities low. Consider 4 senior hires + reskilling.", color: "warning" },
            { icon: Users, title: "Support team optimized", note: "Current headcount can handle 30% more tickets with automation.", color: "success" },
            { icon: AlertTriangle, title: "HR team understaffed", note: "Current 1:280 ratio. Industry best is 1:100. Hire 2 HRBPs.", color: "destructive" }
          ].map((c, i) => {
            const Icon = c.icon;
            return (
              <div key={i} className="rounded-2xl border bg-card p-4">
                <div className="flex items-start gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-${c.color}/10 text-${c.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{c.title}</div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{c.note}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
