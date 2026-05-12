"use client";

import * as React from "react";
import {
  Activity,
  Award,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Trophy,
  Users
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { SectionCard } from "@/components/shared/section-card";
import { DataTable } from "@/components/shared/data-table";
import { UserCell } from "@/components/shared/user-cell";
import { Badge } from "@/components/ui/badge";
import { useDataset } from "@/hooks/use-dataset";
import { ColumnDef } from "@tanstack/react-table";
import { SeriesBarChart } from "@/components/charts/bar-chart";
import { SeriesAreaChart } from "@/components/charts/area-chart";
import type { Employee } from "@/types";
import { cn } from "@/lib/utils";

export default function HRPerformancePage() {
  const ds = useDataset();
  const avgScore = Math.round(ds.employees.reduce((s, e) => s + e.performanceScore, 0) / ds.employees.length);
  const topCount = ds.employees.filter((e) => e.performanceScore >= 80).length;
  const lowCount = ds.employees.filter((e) => e.performanceScore < 50).length;
  const consistentCount = ds.employees.filter((e) => e.consistencyScore >= 80).length;

  // Department performance
  const depts = ["Sales", "Support", "HR", "Engineering"].map((d) => {
    const emps = ds.employees.filter((e) => e.department === d);
    return {
      dept: d,
      avgScore: Math.round(emps.reduce((s, e) => s + e.performanceScore, 0) / Math.max(1, emps.length)),
      count: emps.length
    };
  });

  // Score distribution
  const dist = [
    { range: "90-100", count: ds.employees.filter((e) => e.performanceScore >= 90).length },
    { range: "80-89", count: ds.employees.filter((e) => e.performanceScore >= 80 && e.performanceScore < 90).length },
    { range: "70-79", count: ds.employees.filter((e) => e.performanceScore >= 70 && e.performanceScore < 80).length },
    { range: "60-69", count: ds.employees.filter((e) => e.performanceScore >= 60 && e.performanceScore < 70).length },
    { range: "<60", count: ds.employees.filter((e) => e.performanceScore < 60).length }
  ];

  const columns = React.useMemo<ColumnDef<Employee>[]>(() => [
    {
      id: "name",
      header: "Employee",
      accessorKey: "fullName",
      cell: ({ row }) => <UserCell name={row.original.fullName} avatar={row.original.avatar} sub={row.original.designation} />
    },
    { accessorKey: "department", header: "Dept" },
    {
      accessorKey: "performanceScore",
      header: "Performance",
      cell: ({ getValue }) => {
        const v = getValue<number>();
        return (
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
              <div className={cn("h-full",
                v >= 80 ? "bg-success" : v >= 60 ? "bg-warning" : "bg-destructive"
              )} style={{ width: `${v}%` }} />
            </div>
            <span className="text-sm font-medium tabular-nums">{v}</span>
          </div>
        );
      }
    },
    { accessorKey: "productivityScore", header: "Productivity" },
    { accessorKey: "consistencyScore", header: "Consistency" },
    {
      accessorKey: "burnoutRisk",
      header: "Burnout",
      cell: ({ getValue }) => {
        const v = getValue<number>();
        return (
          <Badge variant={v > 70 ? "destructive" : v > 40 ? "warning" : "success"} className="text-[10px]">
            {v}%
          </Badge>
        );
      }
    }
  ], []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Performance Intelligence"
        description="Real productivity, not just attendance"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Avg score" value={avgScore} suffix="/100" format="number" icon={Activity} accent="primary" />
        <KpiCard label="Top performers" value={topCount} format="number" icon={Trophy} accent="success" />
        <KpiCard label="Need coaching" value={lowCount} format="number" icon={TrendingDown} accent="destructive" />
        <KpiCard label="Consistent" value={consistentCount} format="number" icon={Award} accent="info" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Department performance">
          <SeriesBarChart
            data={depts}
            xKey="dept"
            series={[{ key: "avgScore", label: "Avg score", color: "hsl(var(--primary))" }]}
            height={240}
          />
        </SectionCard>

        <SectionCard title="Score distribution">
          <SeriesBarChart
            data={dist}
            xKey="range"
            series={[{ key: "count", label: "Employees", color: "hsl(var(--accent))" }]}
            height={240}
          />
        </SectionCard>
      </div>

      <SectionCard
        title="Employee performance leaderboard"
        description="Sortable, filterable, searchable"
      >
        <DataTable
          data={[...ds.employees].sort((a, b) => b.performanceScore - a.performanceScore).slice(0, 100)}
          columns={columns}
          searchKeys={["fullName" as keyof typeof ds.employees[0]]}
          searchPlaceholder="Search employees..."
        />
      </SectionCard>
    </div>
  );
}
