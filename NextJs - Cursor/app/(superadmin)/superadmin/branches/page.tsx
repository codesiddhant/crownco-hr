"use client";

import { Building } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDataset } from "@/hooks/use-dataset";

export default function SuperAdminBranchesPage() {
  const ds = useDataset();
  return (
    <div className="space-y-6">
      <PageHeader title="Branches" description="All branches across organizations" />
      <SectionCard title="Branches" description={`${ds.branches.length} branches`}>
        <div className="grid gap-3 md:grid-cols-2">
          {ds.branches.map((b) => {
            const employeeCount = ds.employees.filter((e) => e.branchId === b.id).length;
            return (
              <Card key={b.id} className="p-4">
                <div className="flex items-start gap-3">
                  <Building className="h-6 w-6 text-primary mt-0.5" />
                  <div className="flex-1">
                    <div className="font-semibold">{b.name}</div>
                    <div className="text-xs text-muted-foreground">{b.address}</div>
                    <div className="mt-2 flex items-center gap-2 text-[10px]">
                      <Badge variant="default">{employeeCount} employees</Badge>
                      <Badge variant="outline">{b.city}</Badge>
                      <Badge variant="success">Live</Badge>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
