"use client";

import { Coins, CreditCard, FileText, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { SectionCard } from "@/components/shared/section-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SeriesAreaChart } from "@/components/charts/area-chart";
import { formatCurrency } from "@/lib/utils";

export default function SuperAdminBillingPage() {
  const revenue = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(Date.now() - (11 - i) * 30 * 86400_000).toLocaleDateString("en-IN", { month: "short" }),
    mrr: 250000 + i * 14000 + Math.floor(Math.random() * 20000)
  }));

  return (
    <div className="space-y-6">
      <PageHeader title="Billing & Revenue" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="MRR" value={628000} format="currency" icon={Coins} accent="primary" delta={12.4} />
        <KpiCard label="ARR" value={7536000} format="currency" icon={TrendingUp} accent="success" delta={18.2} />
        <KpiCard label="Active subs" value={42} format="number" icon={CreditCard} accent="info" />
        <KpiCard label="Outstanding" value={86000} format="currency" icon={FileText} accent="warning" />
      </div>

      <SectionCard title="Revenue trend">
        <SeriesAreaChart
          data={revenue}
          xKey="month"
          series={[{ key: "mrr", label: "MRR (₹)", color: "hsl(var(--success))" }]}
          height={280}
        />
      </SectionCard>

      <SectionCard title="Recent invoices">
        {[
          { org: "Crownco Technologies", amount: 280000, status: "paid", date: "May 2026" },
          { org: "Realty Capital Group", amount: 92000, status: "paid", date: "May 2026" },
          { org: "Northwind BPO", amount: 215000, status: "pending", date: "May 2026" }
        ].map((i, idx) => (
          <Card key={idx} className="p-3 mb-2">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <div className="text-sm font-medium">{i.org}</div>
                <div className="text-xs text-muted-foreground">{i.date}</div>
              </div>
              <div className="font-bold tabular-nums">{formatCurrency(i.amount)}</div>
              <Badge variant={i.status === "paid" ? "success" : "warning"} className="text-[10px] capitalize">
                {i.status}
              </Badge>
            </div>
          </Card>
        ))}
      </SectionCard>
    </div>
  );
}
