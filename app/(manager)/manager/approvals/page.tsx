"use client";

import * as React from "react";
import { Sparkles, AlertTriangle, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useDataset } from "@/hooks/use-dataset";
import { useAppDispatch } from "@/lib/store/hooks";
import { setLeaveStatus } from "@/lib/store/dataSlice";
import { cn, initials } from "@/lib/utils";
import { toast } from "sonner";

export default function ManagerApprovalsPage() {
  const ds = useDataset();
  const dispatch = useAppDispatch();
  const [tab, setTab] = React.useState("pending");

  const filtered = ds.leaves.filter((l) =>
    tab === "pending" ? l.status === "pending" : tab === "approved" ? l.status === "approved" : l.status === "rejected"
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Approvals"
        description="Leaves, attendance corrections, and reimbursements"
        badge={`${ds.leaves.filter((l) => l.status === "pending").length} pending`}
      />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="pending">Pending ({ds.leaves.filter((l) => l.status === "pending").length})</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        <TabsContent value={tab} className="space-y-3">
          {filtered.slice(0, 20).map((l) => {
            const emp = ds.employees.find((e) => e.id === l.employeeId);
            if (!emp) return null;
            return (
              <SectionCard key={l.id}>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="md:col-span-2">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={emp.avatar} alt={emp.fullName} />
                        <AvatarFallback>{initials(emp.fullName)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{emp.fullName}</span>
                          <Badge variant="outline" className="text-[10px] uppercase">{l.type}</Badge>
                          <Badge variant={l.halfDay ? "warning" : "default"} className="text-[10px]">
                            {l.halfDay ? "Half day" : `${l.days} days`}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {emp.designation} · {emp.department}
                        </div>
                        <div className="mt-2 text-sm">
                          <strong>{l.from}</strong> → <strong>{l.to}</strong>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground italic">"{l.reason}"</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl border bg-primary/[0.03] p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                        <Sparkles className="mr-1 inline h-3 w-3" /> AI Impact Analysis
                      </span>
                      <span
                        className={cn(
                          "text-xl font-bold tabular-nums",
                          l.aiRiskScore > 70 ? "text-destructive" : l.aiRiskScore > 40 ? "text-warning" : "text-success"
                        )}
                      >
                        {l.aiRiskScore}
                      </span>
                    </div>
                    <div className="mt-2 space-y-1.5 text-xs">
                      {l.aiSuggestions.slice(0, 3).map((s, i) => (
                        <div key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="mt-0.5 h-3 w-3 text-success shrink-0" />
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {l.status === "pending" && (
                  <div className="mt-4 flex items-center justify-end gap-2 border-t pt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        dispatch(setLeaveStatus({ id: l.id, status: "rejected" }));
                        toast("Leave rejected");
                      }}
                    >
                      Reject
                    </Button>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => {
                        dispatch(setLeaveStatus({ id: l.id, status: "approved" }));
                        toast.success("Leave approved · AI handover plan triggered");
                      }}
                    >
                      Approve with AI handover
                    </Button>
                  </div>
                )}
              </SectionCard>
            );
          })}
          {filtered.length === 0 && (
            <SectionCard contentClassName="py-16 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-success" />
              <div className="mt-3 text-sm font-semibold">No items here</div>
              <div className="text-xs text-muted-foreground">All caught up!</div>
            </SectionCard>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
