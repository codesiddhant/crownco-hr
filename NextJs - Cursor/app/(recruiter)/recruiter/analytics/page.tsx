"use client";

import { Briefcase, Clock, Target, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { SectionCard } from "@/components/shared/section-card";
import { useDataset } from "@/hooks/use-dataset";
import { SeriesAreaChart } from "@/components/charts/area-chart";
import { FunnelChart } from "@/components/charts/funnel-chart";

export default function RecruiterAnalyticsPage() {
  const ds = useDataset();

  const funnel = [
    { label: "Applied", value: ds.candidates.length },
    { label: "Screening", value: Math.round(ds.candidates.length * 0.55) },
    { label: "Interview", value: ds.candidates.filter((c) => ["interview", "offer", "hired"].includes(c.stage)).length },
    { label: "Offer", value: ds.candidates.filter((c) => ["offer", "hired"].includes(c.stage)).length },
    { label: "Hired", value: ds.candidates.filter((c) => c.stage === "hired").length }
  ];

  const trend = Array.from({ length: 12 }, (_, i) => ({
    week: `W${i + 1}`,
    applied: Math.round(15 + Math.random() * 12),
    hired: Math.round(1 + Math.random() * 4)
  }));

  return (
    <div className="space-y-6">
      <PageHeader title="Recruitment analytics" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Time to hire" value="18 days" icon={Clock} accent="primary" />
        <KpiCard label="Offer accept rate" value={86} suffix="%" format="number" icon={Target} accent="success" />
        <KpiCard label="Open roles" value={24} format="number" icon={Briefcase} accent="info" />
        <KpiCard label="Cost per hire" value={42000} format="currency" icon={TrendingUp} accent="warning" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Hiring funnel">
          <FunnelChart data={funnel} />
        </SectionCard>
        <SectionCard title="Weekly trend">
          <SeriesAreaChart
            data={trend}
            xKey="week"
            series={[
              { key: "applied", label: "Applied", color: "hsl(var(--primary))" },
              { key: "hired", label: "Hired", color: "hsl(var(--success))" }
            ]}
            height={260}
          />
        </SectionCard>
      </div>
    </div>
  );
}
