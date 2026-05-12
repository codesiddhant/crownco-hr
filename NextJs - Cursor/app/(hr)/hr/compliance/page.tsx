"use client";

import * as React from "react";
import {
  Activity,
  Computer,
  Download,
  FileText,
  Lock,
  Search,
  ShieldCheck,
  Smartphone,
  Wifi
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { SectionCard } from "@/components/shared/section-card";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useDataset } from "@/hooks/use-dataset";
import { ColumnDef } from "@tanstack/react-table";
import type { AuditLog } from "@/types";

export default function HRCompliancePage() {
  const ds = useDataset();
  const columns = React.useMemo<ColumnDef<AuditLog>[]>(() => [
    { accessorKey: "actor", header: "Actor" },
    { accessorKey: "action", header: "Action" },
    { accessorKey: "resource", header: "Resource" },
    {
      accessorKey: "at",
      header: "Timestamp",
      cell: ({ getValue }) => new Date(getValue<string>()).toLocaleString("en-IN", {
        day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
      })
    },
    { accessorKey: "ip", header: "IP" },
    { accessorKey: "device", header: "Device" }
  ], []);

  const devices = ds.employees.slice(0, 10).map((e) => ({
    name: e.fullName,
    device: Math.random() > 0.5 ? "iPhone 15 Pro" : "Pixel 8",
    os: Math.random() > 0.5 ? "iOS 17.2" : "Android 14",
    bound: true,
    lastSeen: "Just now"
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Compliance & Security"
        description="Audit logs, device management & access control"
        actions={
          <Button variant="brand" size="sm">
            <Download className="h-4 w-4" />
            Export audit
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Audit events" value={ds.audit.length} format="number" icon={Activity} accent="primary" />
        <KpiCard label="Devices bound" value={ds.employees.length} format="number" icon={Smartphone} accent="info" />
        <KpiCard label="WiFi whitelist" value={12} format="number" icon={Wifi} accent="success" />
        <KpiCard label="Active sessions" value={Math.round(ds.employees.length * 0.84)} format="number" icon={Lock} accent="warning" />
      </div>

      <Tabs defaultValue="audit">
        <TabsList>
          <TabsTrigger value="audit">Audit log</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="access">Access control</TabsTrigger>
        </TabsList>

        <TabsContent value="audit">
          <SectionCard title="Audit log" description="Every sensitive action is logged">
            <DataTable
              data={ds.audit}
              columns={columns}
              searchKeys={["actor" as keyof typeof ds.audit[0], "action" as keyof typeof ds.audit[0]]}
              searchPlaceholder="Search audit log..."
              enableExport
            />
          </SectionCard>
        </TabsContent>

        <TabsContent value="devices" className="space-y-2">
          {devices.map((d, i) => (
            <div key={i} className="flex items-center gap-3 rounded-2xl border bg-card p-3">
              <Smartphone className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <div className="text-sm font-medium">{d.name}</div>
                <div className="text-xs text-muted-foreground">{d.device} · {d.os} · {d.lastSeen}</div>
              </div>
              <Badge variant={d.bound ? "success" : "warning"} className="text-[10px]">
                {d.bound ? "Bound" : "Pending"}
              </Badge>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="access">
          <SectionCard title="Role permissions matrix" icon={<ShieldCheck className="h-4 w-4" />}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-xs uppercase text-muted-foreground">
                    <th className="py-2 text-left">Permission</th>
                    <th className="py-2 text-center">Super Admin</th>
                    <th className="py-2 text-center">HR Admin</th>
                    <th className="py-2 text-center">Manager</th>
                    <th className="py-2 text-center">Employee</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {[
                    { perm: "View all employees", roles: [1, 1, 0.5, 0] },
                    { perm: "Approve leave", roles: [1, 1, 1, 0] },
                    { perm: "Run payroll", roles: [1, 1, 0, 0] },
                    { perm: "Award rewards", roles: [1, 1, 0.5, 0] },
                    { perm: "View own data", roles: [1, 1, 1, 1] },
                    { perm: "Manage settings", roles: [1, 1, 0, 0] },
                    { perm: "Delete data", roles: [1, 0, 0, 0] }
                  ].map((p) => (
                    <tr key={p.perm} className="border-b">
                      <td className="py-3">{p.perm}</td>
                      {p.roles.map((r, i) => (
                        <td key={i} className="text-center">
                          {r === 1 ? "✓" : r === 0.5 ? "○" : "—"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
