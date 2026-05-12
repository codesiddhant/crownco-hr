"use client";

import * as React from "react";
import { Building2, Globe2, TrendingUp, Users } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { SectionCard } from "@/components/shared/section-card";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ORGS = [
  { name: "Crownco Technologies", employees: 528, plan: "Enterprise", status: "active", mrr: 280000 },
  { name: "Realty Capital Group", employees: 142, plan: "Growth", status: "active", mrr: 92000 },
  { name: "Coastal Insurance Co", employees: 87, plan: "Growth", status: "trial", mrr: 0 },
  { name: "Pixel Labs", employees: 34, plan: "Startup", status: "active", mrr: 18000 },
  { name: "Northwind BPO", employees: 412, plan: "Enterprise", status: "active", mrr: 215000 }
];

export default function SuperAdminOrgsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Organizations" description="Platform-wide tenant management" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total orgs" value={ORGS.length} format="number" icon={Building2} accent="primary" />
        <KpiCard label="Total employees" value={ORGS.reduce((s, o) => s + o.employees, 0)} format="number" icon={Users} accent="info" />
        <KpiCard label="MRR" value={ORGS.reduce((s, o) => s + o.mrr, 0)} format="currency" icon={TrendingUp} accent="success" />
        <KpiCard label="Active" value={ORGS.filter((o) => o.status === "active").length} format="number" icon={Globe2} accent="warning" />
      </div>

      <SectionCard title="All organizations">
        <div className="space-y-2">
          {ORGS.map((o) => (
            <Card key={o.name} className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Building2 className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{o.name}</div>
                  <div className="text-xs text-muted-foreground">{o.employees} employees</div>
                </div>
                <Badge variant="outline" className="text-[10px]">{o.plan}</Badge>
                <Badge variant={o.status === "active" ? "success" : "warning"} className="text-[10px] capitalize">
                  {o.status}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
