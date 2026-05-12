"use client";

import * as React from "react";
import {
  Activity,
  AlertTriangle,
  Brain,
  Frown,
  Heart,
  HeartPulse,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Users,
  Zap
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { SectionCard } from "@/components/shared/section-card";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useDataset } from "@/hooks/use-dataset";
import { cn, initials } from "@/lib/utils";
import { SeriesBarChart } from "@/components/charts/bar-chart";
import { SeriesAreaChart } from "@/components/charts/area-chart";
import { motion } from "framer-motion";

export default function HRHealthPage() {
  const ds = useDataset();
  const burnoutRisk = ds.employees.filter((e) => e.burnoutRisk > 70);
  const moderateRisk = ds.employees.filter((e) => e.burnoutRisk > 40 && e.burnoutRisk <= 70);
  const lowRisk = ds.employees.filter((e) => e.burnoutRisk <= 40);
  const avgBurnout = Math.round(ds.employees.reduce((s, e) => s + e.burnoutRisk, 0) / ds.employees.length);

  const deptBurnout = ["Sales", "Support", "HR", "Engineering"].map((d) => {
    const emps = ds.employees.filter((e) => e.department === d);
    return {
      dept: d,
      burnout: Math.round(emps.reduce((s, e) => s + e.burnoutRisk, 0) / Math.max(1, emps.length))
    };
  });

  const trend = Array.from({ length: 12 }, (_, i) => ({
    week: `W${i + 1}`,
    risk: Math.round(35 + Math.sin(i * 0.6) * 10 + i * 1.2)
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Health Monitoring"
        description="Operational wellness, burnout detection & anomalies"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Avg burnout risk" value={avgBurnout} suffix="%" format="number" icon={HeartPulse} accent="primary" />
        <KpiCard label="High risk" value={burnoutRisk.length} format="number" icon={AlertTriangle} accent="destructive" delta={2.4} deltaInverted />
        <KpiCard label="Moderate" value={moderateRisk.length} format="number" icon={Activity} accent="warning" />
        <KpiCard label="Healthy" value={lowRisk.length} format="number" icon={Heart} accent="success" delta={5.6} />
      </div>

      <Card className="border-destructive/30 bg-destructive/[0.04] p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0 text-destructive mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-destructive">{burnoutRisk.length} employees at high burnout risk</h3>
            <p className="mt-1 text-xs text-destructive/80">
              Crowny detected sustained overwork patterns. Consider 1:1s, leave encouragement, or workload redistribution.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Burnout trend" description="Last 12 weeks">
          <SeriesAreaChart
            data={trend}
            xKey="week"
            series={[{ key: "risk", label: "Avg risk %", color: "hsl(var(--destructive))" }]}
            height={260}
          />
        </SectionCard>

        <SectionCard title="By department">
          <SeriesBarChart
            data={deptBurnout}
            xKey="dept"
            series={[{ key: "burnout", label: "Avg risk %", color: "hsl(var(--warning))" }]}
            height={260}
          />
        </SectionCard>
      </div>

      <Tabs defaultValue="high">
        <TabsList>
          <TabsTrigger value="high">High risk ({burnoutRisk.length})</TabsTrigger>
          <TabsTrigger value="moderate">Moderate ({moderateRisk.length})</TabsTrigger>
          <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
        </TabsList>

        <TabsContent value="high" className="space-y-2">
          {burnoutRisk.slice(0, 10).map((emp, i) => (
            <motion.div
              key={emp.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card className="border-destructive/30 p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={emp.avatar} alt={emp.fullName} />
                    <AvatarFallback>{initials(emp.fullName)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{emp.fullName}</span>
                      <Badge variant="destructive" className="text-[10px]">{emp.burnoutRisk}% risk</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">{emp.designation} · {emp.department}</div>
                    <div className="mt-2 rounded-xl bg-primary/[0.04] p-2.5">
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-primary">
                        <Sparkles className="h-3 w-3" />
                        AI insight
                      </div>
                      <p className="mt-1 text-xs">
                        Working 60+ hours/week consistently for 3 weeks. Productivity has dropped 18%.
                        Suggest mandatory leave and 1:1 with manager.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button size="sm" variant="outline">Schedule 1:1</Button>
                    <Button size="sm" variant="brand">Suggest leave</Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="moderate" className="space-y-2">
          {moderateRisk.slice(0, 10).map((emp) => (
            <Card key={emp.id} className="p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={emp.avatar} alt={emp.fullName} />
                  <AvatarFallback>{initials(emp.fullName)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold">{emp.fullName}</div>
                  <div className="text-xs text-muted-foreground">{emp.designation}</div>
                </div>
                <div className="w-32">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase text-muted-foreground">Burnout</span>
                    <span className="text-xs font-bold tabular-nums">{emp.burnoutRisk}%</span>
                  </div>
                  <Progress value={emp.burnoutRisk} className="mt-1 h-1.5" />
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="anomalies" className="space-y-3">
          <SectionCard
            title="Behavioral anomalies"
            description="AI detected unusual patterns"
            icon={<Brain className="h-4 w-4 text-primary" />}
          >
            <div className="space-y-3">
              {[
                { type: "drop", title: "Productivity drop", emp: ds.employees[0], detail: "42% drop in 10 days. Increasing call fatigue." },
                { type: "spike", title: "Overtime spike", emp: ds.employees[1], detail: "Avg 3.2 hours OT/day for last 8 working days." },
                { type: "absence", title: "Irregular attendance", emp: ds.employees[2], detail: "5 late marks + 2 sick leaves in last 14 days." },
                { type: "communication", title: "Communication drop", emp: ds.employees[3], detail: "70% fewer messages in team channels this week." }
              ].map((a, i) => (
                <div key={i} className="flex items-start gap-3 rounded-2xl border bg-card p-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={a.emp.avatar} alt={a.emp.fullName} />
                    <AvatarFallback className="text-xs">{initials(a.emp.fullName)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{a.emp.fullName}</span>
                      <Badge variant="warning" className="text-[10px]">{a.title}</Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{a.detail}</p>
                  </div>
                  <Button size="sm" variant="ghost">Investigate</Button>
                </div>
              ))}
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
