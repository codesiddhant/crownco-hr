"use client";

import * as React from "react";
import {
  Calculator,
  CheckCircle2,
  Coins,
  Download,
  FileText,
  Receipt,
  Sparkles,
  TrendingUp,
  Wallet
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { SectionCard } from "@/components/shared/section-card";
import { DataTable } from "@/components/shared/data-table";
import { UserCell } from "@/components/shared/user-cell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useDataset } from "@/hooks/use-dataset";
import { SeriesAreaChart } from "@/components/charts/area-chart";
import { SeriesBarChart } from "@/components/charts/bar-chart";
import { formatCurrency } from "@/lib/utils";
import type { Payslip } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";

export default function HRPayrollPage() {
  const ds = useDataset();
  const latestMonth = ds.payslips.slice(0, ds.employees.length);
  const totalPayout = latestMonth.reduce((s, p) => s + p.net, 0);
  const pendingCount = latestMonth.filter((p) => p.status === "pending").length;
  const processingCount = latestMonth.filter((p) => p.status === "processing").length;
  const paidCount = latestMonth.filter((p) => p.status === "paid").length;

  // Monthly trend
  const monthlyTrend = Array.from({ length: 6 }, (_, i) => {
    const monthsAgo = 5 - i;
    const date = new Date();
    date.setMonth(date.getMonth() - monthsAgo);
    const m = date.toLocaleDateString("en-IN", { month: "short" });
    const total = totalPayout * (0.92 + Math.random() * 0.16);
    return { month: m, payout: Math.round(total / 1000) };
  });

  // Department breakdown
  const deptBreakdown = ["Sales", "Support", "HR", "Engineering"].map((d) => {
    const empIds = new Set(ds.employees.filter((e) => e.department === d).map((e) => e.id));
    const total = latestMonth.filter((p) => empIds.has(p.employeeId)).reduce((s, p) => s + p.net, 0);
    return { dept: d, total: Math.round(total / 1000) };
  });

  const columns = React.useMemo<ColumnDef<Payslip>[]>(() => [
    {
      id: "employee",
      header: "Employee",
      cell: ({ row }) => {
        const emp = ds.employees.find((e) => e.id === row.original.employeeId);
        return emp ? <UserCell name={emp.fullName} avatar={emp.avatar} sub={emp.designation} /> : null;
      }
    },
    {
      id: "period",
      header: "Period",
      cell: ({ row }) => `${row.original.month} ${row.original.year}`
    },
    {
      accessorKey: "basic",
      header: "Basic",
      cell: ({ getValue }) => formatCurrency(getValue<number>())
    },
    {
      accessorKey: "incentives",
      header: "Incentives",
      cell: ({ getValue }) => formatCurrency(getValue<number>())
    },
    {
      accessorKey: "overtime",
      header: "OT",
      cell: ({ getValue }) => formatCurrency(getValue<number>())
    },
    {
      accessorKey: "tax",
      header: "Tax",
      cell: ({ getValue }) => formatCurrency(getValue<number>())
    },
    {
      accessorKey: "net",
      header: "Net pay",
      cell: ({ getValue }) => <span className="font-semibold tabular-nums">{formatCurrency(getValue<number>())}</span>
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const s = getValue<string>();
        return <Badge variant={s === "paid" ? "success" : s === "processing" ? "info" : "warning"} className="text-[10px] capitalize">{s}</Badge>;
      }
    }
  ], [ds.employees]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payroll"
        description="Attendance-linked salaries, incentives & disbursement"
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            <Button variant="brand" size="sm">
              <Calculator className="h-4 w-4" />
              Run payroll
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total payout" value={totalPayout} format="currency" icon={Wallet} accent="primary" />
        <KpiCard label="Paid" value={paidCount} format="number" icon={CheckCircle2} accent="success" />
        <KpiCard label="Processing" value={processingCount} format="number" icon={Coins} accent="info" />
        <KpiCard label="Pending" value={pendingCount} format="number" icon={FileText} accent="warning" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard title="Payout trend" description="Last 6 months (₹ in thousands)" className="lg:col-span-2">
          <SeriesAreaChart
            data={monthlyTrend}
            xKey="month"
            series={[{ key: "payout", label: "Total payout", color: "hsl(var(--primary))" }]}
            height={240}
          />
        </SectionCard>

        <SectionCard title="By department" description="Current month">
          <SeriesBarChart
            data={deptBreakdown}
            xKey="dept"
            series={[{ key: "total", label: "₹K", color: "hsl(var(--accent))" }]}
            height={240}
          />
        </SectionCard>
      </div>

      <Tabs defaultValue="payslips">
        <TabsList>
          <TabsTrigger value="payslips">Payslips</TabsTrigger>
          <TabsTrigger value="incentives">Incentives</TabsTrigger>
          <TabsTrigger value="reimbursements">Reimbursements</TabsTrigger>
        </TabsList>

        <TabsContent value="payslips">
          <SectionCard title="All payslips" description="Click row to view details">
            <DataTable
              data={ds.payslips.slice(0, 100)}
              columns={columns}
              enableExport
            />
          </SectionCard>
        </TabsContent>

        <TabsContent value="incentives">
          <SectionCard
            title="Performance-based incentives"
            icon={<Sparkles className="h-4 w-4 text-primary" />}
          >
            <div className="space-y-2">
              {ds.employees.slice(0, 10).map((e) => {
                const incentive = Math.round(e.performanceScore * 100);
                return (
                  <div key={e.id} className="flex items-center gap-3 rounded-xl border bg-card p-3">
                    <UserCell name={e.fullName} avatar={e.avatar} sub={e.designation} />
                    <div className="ml-auto text-right">
                      <div className="text-sm font-bold tabular-nums text-success">{formatCurrency(incentive)}</div>
                      <div className="text-[10px] text-muted-foreground">Auto-calculated</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="reimbursements">
          <SectionCard title="Pending reimbursement claims">
            <div className="space-y-2">
              {[
                { name: "Aanya Sharma", amount: 4250, type: "Travel", status: "pending" },
                { name: "Rohan Mehta", amount: 1680, type: "Food", status: "approved" },
                { name: "Priya Singh", amount: 2840, type: "Fuel", status: "pending" },
                { name: "Karan Patel", amount: 720, type: "Internet", status: "approved" }
              ].map((r, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl border bg-card p-3">
                  <Receipt className="h-5 w-5 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{r.type} reimbursement</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold tabular-nums">{formatCurrency(r.amount)}</div>
                    <Badge variant={r.status === "approved" ? "success" : "warning"} className="text-[10px] capitalize">{r.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
