"use client";

import * as React from "react";
import { Mail, Phone } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { DataTable } from "@/components/shared/data-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { StatusPill } from "@/components/shared/status-pill";
import { useDataset } from "@/hooks/use-dataset";
import { useAppSelector } from "@/lib/store/hooks";
import { initials } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";
import type { Employee } from "@/types";

export default function ManagerTeamPage() {
  const ds = useDataset();
  const user = useAppSelector((s) => s.auth.user);
  const me = ds.employees.find((e) => e.fullName === user?.name) ?? ds.employees.find((e) => e.role === "manager") ?? ds.employees[0];
  const team = ds.employees.filter((e) => (e.manager === me.id || (e.department === me.department && e.branchId === me.branchId)) && e.id !== me.id);

  const columns: ColumnDef<Employee>[] = [
    {
      header: "Employee",
      accessorKey: "fullName",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={row.original.avatar} alt={row.original.fullName} />
            <AvatarFallback>{initials(row.original.fullName)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-sm font-medium">{row.original.fullName}</div>
            <div className="text-xs text-muted-foreground">{row.original.designation}</div>
          </div>
        </div>
      )
    },
    { header: "Department", accessorKey: "department" },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => <StatusPill value={row.original.status} />
    },
    {
      header: "Performance",
      accessorKey: "performanceScore",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Progress value={row.original.performanceScore} className="h-1.5 w-20" />
          <span className="text-xs font-semibold tabular-nums">{row.original.performanceScore}</span>
        </div>
      )
    },
    {
      header: "Productivity",
      accessorKey: "productivityScore",
      cell: ({ row }) => <span className="text-sm font-medium">{row.original.productivityScore}</span>
    },
    {
      header: "Burnout",
      accessorKey: "burnoutRisk",
      cell: ({ row }) => {
        const v = row.original.burnoutRisk;
        return (
          <Badge variant={v > 70 ? "destructive" : v > 50 ? "warning" : "success"} className="text-[10px]">
            {v}
          </Badge>
        );
      }
    },
    {
      header: "Contact",
      accessorKey: "email",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Mail className="h-3.5 w-3.5" />
          <span className="truncate max-w-[180px]">{row.original.email}</span>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="My team"
        description={`${team.length} direct & cross-functional reports`}
      />
      <SectionCard>
        <DataTable
          columns={columns}
          data={team}
          searchKeys={["fullName", "email", "designation", "department"]}
          searchPlaceholder="Search by name, email, designation..."
          enableExport
          exportFileName="my-team.csv"
        />
      </SectionCard>
    </div>
  );
}
