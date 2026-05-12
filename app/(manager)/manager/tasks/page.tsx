"use client";

import * as React from "react";
import { CheckCircle2, ListTodo, Hourglass, AlertTriangle, PlusCircle, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { SectionCard } from "@/components/shared/section-card";
import { KanbanBoard } from "@/components/tasks/kanban-board";
import { TaskDrawer } from "@/components/tasks/task-drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { useDataset } from "@/hooks/use-dataset";
import { initials } from "@/lib/utils";
import type { Task } from "@/types";

export default function ManagerTasksPage() {
  const ds = useDataset();
  const teamIds = new Set(ds.employees.slice(0, 14).map((e) => e.id));
  const teamTasks = ds.tasks.filter((t) => teamIds.has(t.assigneeId));
  const [selected, setSelected] = React.useState<Task | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team tasks"
        description="Track team kanban, SLA, and AI workload suggestions"
        actions={
          <Button variant="brand" size="sm">
            <PlusCircle className="h-4 w-4" />
            Assign task
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Team tasks" value={teamTasks.length} format="number" icon={ListTodo} accent="primary" />
        <KpiCard label="Active" value={teamTasks.filter((t) => t.status === "in_progress").length} format="number" icon={Hourglass} accent="info" />
        <KpiCard label="Completed" value={teamTasks.filter((t) => t.status === "done").length} format="number" icon={CheckCircle2} accent="success" />
        <KpiCard label="Breached" value={teamTasks.filter((t) => t.slaBreached).length} format="number" icon={AlertTriangle} accent="destructive" />
      </div>

      <Tabs defaultValue="board">
        <TabsList>
          <TabsTrigger value="board">Kanban</TabsTrigger>
          <TabsTrigger value="by-member">By member</TabsTrigger>
          <TabsTrigger value="ai">AI suggestions</TabsTrigger>
        </TabsList>

        <TabsContent value="board">
          <KanbanBoard tasks={teamTasks} onSelect={(t) => { setSelected(t); setDrawerOpen(true); }} />
        </TabsContent>

        <TabsContent value="by-member" className="space-y-3">
          {ds.employees.slice(0, 8).map((emp) => {
            const tasks = teamTasks.filter((t) => t.assigneeId === emp.id);
            return (
              <Card key={emp.id} className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={emp.avatar} alt={emp.fullName} />
                    <AvatarFallback>{initials(emp.fullName)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{emp.fullName}</div>
                    <div className="text-xs text-muted-foreground">{tasks.length} tasks · {tasks.filter((t) => t.status === "done").length} done</div>
                  </div>
                  <div className="flex gap-2">
                    {["todo", "in_progress", "review", "done"].map((s) => {
                      const count = tasks.filter((t) => t.status === s).length;
                      return (
                        <div key={s} className="text-center">
                          <div className="text-xs font-bold tabular-nums">{count}</div>
                          <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{s.replace("_", " ")}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="ai" className="space-y-3">
          <SectionCard
            title="Workload distribution suggestions"
            description="AI detected unbalanced workload"
            icon={<Sparkles className="h-4 w-4 text-primary" />}
          >
            <div className="space-y-2">
              <div className="rounded-2xl border border-warning/30 bg-warning/[0.03] p-4">
                <div className="text-sm font-semibold">⚠ Workload imbalance detected</div>
                <p className="mt-1 text-xs">
                  <span className="text-warning">Aanya Sharma</span> has 14 open tasks while{" "}
                  <span className="text-info">Rohan Mehta</span> has only 3. Crowny suggests
                  redistributing 4 tasks to balance.
                </p>
                <Button size="sm" variant="outline" className="mt-2">Apply suggestion</Button>
              </div>
              <div className="rounded-2xl border border-primary/30 bg-primary/[0.03] p-4">
                <div className="text-sm font-semibold">SLA risk alerts</div>
                <p className="mt-1 text-xs">3 tasks at risk of breaching SLA in next 6 hours. Auto-escalation activated for 1.</p>
                <Button size="sm" variant="outline" className="mt-2">View tasks</Button>
              </div>
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>

      <TaskDrawer task={selected} open={drawerOpen} onOpenChange={setDrawerOpen} />
    </div>
  );
}
