"use client";

import * as React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Filter,
  Hourglass,
  Kanban,
  ListTodo,
  PlusCircle,
  Search,
  Sparkles,
  TrendingUp,
  Workflow,
  Zap
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { SectionCard } from "@/components/shared/section-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { KanbanBoard } from "@/components/tasks/kanban-board";
import { TaskDrawer } from "@/components/tasks/task-drawer";
import { useDataset } from "@/hooks/use-dataset";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { addTask } from "@/lib/store/dataSlice";
import { Card } from "@/components/ui/card";
import type { Task } from "@/types";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function HRTasksPage() {
  const ds = useDataset();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<Task | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    title: "",
    description: "",
    assigneeId: "",
    priority: "medium" as Task["priority"],
    dueAt: ""
  });

  const filtered = ds.tasks.filter((t) =>
    !search || t.title.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: ds.tasks.length,
    overdue: ds.tasks.filter((t) => new Date(t.dueAt) < new Date() && t.status !== "done").length,
    inProgress: ds.tasks.filter((t) => t.status === "in_progress").length,
    breached: ds.tasks.filter((t) => t.slaBreached).length
  };

  const automations = [
    { id: "a1", name: "Auto-escalate overdue tasks", trigger: "Task overdue by 4 hours", action: "Notify manager + AI suggests fix", enabled: true },
    { id: "a2", name: "SLA breach alert", trigger: "Task SLA exceeded", action: "Slack alert to team lead", enabled: true },
    { id: "a3", name: "Auto-assign by skill", trigger: "New task created", action: "Match best-fit employee", enabled: false },
    { id: "a4", name: "Daily standup digest", trigger: "Every weekday 9 AM", action: "Send WhatsApp summary", enabled: true },
    { id: "a5", name: "Stale task reminder", trigger: "No activity for 48h", action: "Crowny pings assignee", enabled: true }
  ];

  const createTask = () => {
    if (!form.title || !form.assigneeId) {
      toast.error("Title and assignee required");
      return;
    }
    const task: Task = {
      id: `task_new_${Date.now()}`,
      title: form.title,
      description: form.description,
      status: "todo",
      priority: form.priority,
      assigneeId: form.assigneeId,
      reporterId: ds.employees[0].id,
      createdAt: new Date().toISOString(),
      dueAt: form.dueAt || new Date(Date.now() + 7 * 86400_000).toISOString(),
      tags: ["new"],
      slaHours: 48,
      slaBreached: false,
      attachments: 0,
      comments: 0
    };
    dispatch(addTask(task));
    setCreateOpen(false);
    toast.success("Task created");
    setForm({ title: "", description: "", assigneeId: "", priority: "medium", dueAt: "" });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tasks & Workflow"
        description="Kanban board, AI suggestions, and automations"
        actions={
          <Button variant="brand" onClick={() => setCreateOpen(true)}>
            <PlusCircle className="h-4 w-4" />
            New task
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total tasks" value={stats.total} format="number" icon={ListTodo} accent="primary" />
        <KpiCard label="In progress" value={stats.inProgress} format="number" icon={Hourglass} accent="info" />
        <KpiCard label="Overdue" value={stats.overdue} format="number" icon={AlertTriangle} accent="warning" />
        <KpiCard label="SLA breached" value={stats.breached} format="number" icon={Zap} accent="destructive" />
      </div>

      <Tabs defaultValue="kanban">
        <TabsList>
          <TabsTrigger value="kanban">
            <Kanban className="mr-1.5 h-3.5 w-3.5" />
            Kanban
          </TabsTrigger>
          <TabsTrigger value="ai">
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            AI suggestions
          </TabsTrigger>
          <TabsTrigger value="automations">
            <Workflow className="mr-1.5 h-3.5 w-3.5" />
            Automations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="kanban" className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tasks..."
                className="pl-9"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
          <KanbanBoard tasks={filtered} onSelect={(t) => { setSelected(t); setDrawerOpen(true); }} />
        </TabsContent>

        <TabsContent value="ai" className="space-y-3">
          <SectionCard
            title="Crowny task suggestions"
            description="AI surfaces high-impact tasks needing attention"
            icon={<Sparkles className="h-4 w-4 text-primary" />}
          >
            <div className="space-y-3">
              {ds.tasks.filter((t) => t.aiSuggestion).slice(0, 6).map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-2xl border border-primary/20 bg-primary/[0.03] p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          t.priority === "urgent" ? "destructive" :
                          t.priority === "high" ? "warning" : "default"
                        } className="text-[10px]">
                          {t.priority}
                        </Badge>
                        <span className="text-sm font-semibold">{t.title}</span>
                      </div>
                      <div className="mt-2 flex items-start gap-1.5">
                        <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                        <p className="text-xs text-primary">{t.aiSuggestion}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => { setSelected(t); setDrawerOpen(true); }}>
                      Review
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="automations" className="space-y-3">
          <SectionCard
            title="Workflow automations"
            description="Trigger-based actions that run silently"
            icon={<Workflow className="h-4 w-4" />}
          >
            <div className="space-y-2">
              {automations.map((a) => (
                <Card key={a.id} className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${a.enabled ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                        <Workflow className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{a.name}</div>
                        <div className="text-xs text-muted-foreground">
                          <span className="text-primary">When:</span> {a.trigger} →{" "}
                          <span className="text-success">Do:</span> {a.action}
                        </div>
                      </div>
                    </div>
                    <Badge variant={a.enabled ? "success" : "outline"} className="text-[10px]">
                      {a.enabled ? "Active" : "Off"}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
            <Button variant="outline" className="mt-3 w-full" size="sm">
              <PlusCircle className="h-4 w-4" />
              Create automation
            </Button>
          </SectionCard>
        </TabsContent>
      </Tabs>

      <TaskDrawer task={selected} open={drawerOpen} onOpenChange={setDrawerOpen} />

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create task</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                placeholder="Task title..."
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Assignee</Label>
              <Select value={form.assigneeId} onValueChange={(v) => setForm((f) => ({ ...f, assigneeId: v }))}>
                <SelectTrigger><SelectValue placeholder="Select assignee" /></SelectTrigger>
                <SelectContent className="max-h-72">
                  {ds.employees.slice(0, 80).map((e) => (
                    <SelectItem key={e.id} value={e.id}>{e.fullName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={form.priority} onValueChange={(v) => setForm((f) => ({ ...f, priority: v as Task["priority"] }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Due date</Label>
                <Input
                  type="date"
                  value={form.dueAt}
                  onChange={(e) => setForm((f) => ({ ...f, dueAt: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button variant="brand" onClick={createTask}>Create task</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
