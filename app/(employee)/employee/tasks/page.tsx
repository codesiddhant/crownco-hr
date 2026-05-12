"use client";

import * as React from "react";
import { CheckCircle2, ListTodo, Hourglass, AlertTriangle, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { KanbanBoard } from "@/components/tasks/kanban-board";
import { TaskDrawer } from "@/components/tasks/task-drawer";
import { useDataset } from "@/hooks/use-dataset";
import { useAppSelector } from "@/lib/store/hooks";
import type { Task } from "@/types";

export default function EmployeeTasksPage() {
  const ds = useDataset();
  const user = useAppSelector((s) => s.auth.user);
  const me = ds.employees.find((e) => e.fullName === user?.name) ?? ds.employees[0];
  const myTasks = ds.tasks.filter((t) => t.assigneeId === me.id);
  const [selected, setSelected] = React.useState<Task | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  return (
    <div className="space-y-6">
      <PageHeader title="My tasks" description="Your assigned tasks and progress" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total" value={myTasks.length} format="number" icon={ListTodo} accent="primary" />
        <KpiCard label="In progress" value={myTasks.filter((t) => t.status === "in_progress").length} format="number" icon={Hourglass} accent="info" />
        <KpiCard label="Done" value={myTasks.filter((t) => t.status === "done").length} format="number" icon={CheckCircle2} accent="success" />
        <KpiCard label="Overdue" value={myTasks.filter((t) => new Date(t.dueAt) < new Date() && t.status !== "done").length} format="number" icon={AlertTriangle} accent="destructive" />
      </div>

      <KanbanBoard tasks={myTasks} onSelect={(t) => { setSelected(t); setDrawerOpen(true); }} />
      <TaskDrawer task={selected} open={drawerOpen} onOpenChange={setDrawerOpen} />
    </div>
  );
}
