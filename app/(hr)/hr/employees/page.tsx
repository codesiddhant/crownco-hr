"use client";

import * as React from "react";
import { Download, Filter, PlusCircle, Search } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { SectionCard } from "@/components/shared/section-card";
import { DataTable } from "@/components/shared/data-table";
import { UserCell } from "@/components/shared/user-cell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDataset } from "@/hooks/use-dataset";
import type { Employee } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { formatCurrency, initials } from "@/lib/utils";

export default function HREmployeesPage() {
  const ds = useDataset();

  const columns = React.useMemo<ColumnDef<Employee>[]>(() => [
    {
      id: "name",
      header: "Employee",
      accessorKey: "fullName",
      cell: ({ row }) => <UserCell
        name={row.original.fullName}
        avatar={row.original.avatar}
        sub={`${row.original.designation} · ${row.original.employeeCode}`}
      />
    },
    { accessorKey: "department", header: "Department" },
    {
      id: "branch",
      header: "Branch",
      cell: ({ row }) => ds.branches.find((b) => b.id === row.original.branchId)?.name
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const s = getValue<string>();
        return <Badge variant={s === "active" ? "success" : "warning"} className="text-[10px] capitalize">{s.replace("_", " ")}</Badge>;
      }
    },
    {
      accessorKey: "performanceScore",
      header: "Performance",
      cell: ({ getValue }) => <span className="font-medium tabular-nums">{getValue<number>()}/100</span>
    },
    {
      accessorKey: "ctcINR",
      header: "CTC",
      cell: ({ getValue }) => formatCurrency(getValue<number>())
    },
    {
      accessorKey: "workMode",
      header: "Mode",
      cell: ({ getValue }) => <Badge variant="outline" className="text-[10px] capitalize">{getValue<string>()}</Badge>
    }
  ], [ds.branches]);

  const stats = {
    total: ds.employees.length,
    active: ds.employees.filter((e) => e.status === "active").length,
    onLeave: ds.employees.filter((e) => e.status === "on_leave").length,
    probation: ds.employees.filter((e) => e.status === "probation").length
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employees"
        description={`${stats.total} employees across ${ds.branches.length} branches`}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="brand" size="sm">
              <PlusCircle className="h-4 w-4" />
              Invite
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total" value={stats.total} format="number" accent="primary" />
        <KpiCard label="Active" value={stats.active} format="number" accent="success" />
        <KpiCard label="On leave" value={stats.onLeave} format="number" accent="warning" />
        <KpiCard label="Probation" value={stats.probation} format="number" accent="info" />
      </div>

      <SectionCard title="All employees">
        <DataTable
          data={ds.employees}
          columns={columns}
          searchKeys={["fullName" as keyof typeof ds.employees[0]]}
          searchPlaceholder="Search by name..."
          enableExport
        />
      </SectionCard>
    </div>
  );
}
