"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  Flag,
  Hourglass,
  MoreHorizontal,
  Paperclip,
  Sparkles,
  Timer,
  MessageSquare
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDataset } from "@/hooks/use-dataset";
import { useAppDispatch } from "@/lib/store/hooks";
import { updateTask } from "@/lib/store/dataSlice";
import { cn, initials } from "@/lib/utils";
import { toast } from "sonner";
import type { Task } from "@/types";

const COLUMNS: { id: Task["status"]; label: string; color: string }[] = [
  { id: "todo", label: "To do", color: "bg-muted" },
  { id: "in_progress", label: "In progress", color: "bg-info/10" },
  { id: "review", label: "Review", color: "bg-warning/10" },
  { id: "done", label: "Done", color: "bg-success/10" }
];

const PRIORITY_TONE: Record<Task["priority"], string> = {
  urgent: "text-destructive bg-destructive/10",
  high: "text-warning bg-warning/10",
  medium: "text-info bg-info/10",
  low: "text-muted-foreground bg-muted"
};

interface Props {
  tasks: Task[];
  onSelect?: (task: Task) => void;
}

export function KanbanBoard({ tasks, onSelect }: Props) {
  const ds = useDataset();
  const dispatch = useAppDispatch();
  const [draggedId, setDraggedId] = React.useState<string | null>(null);
  const [dragOver, setDragOver] = React.useState<string | null>(null);

  const grouped = COLUMNS.reduce((acc, c) => {
    acc[c.id] = tasks.filter((t) => t.status === c.id);
    return acc;
  }, {} as Record<Task["status"], Task[]>);

  const handleDrop = (status: Task["status"]) => {
    if (!draggedId) return;
    const t = tasks.find((x) => x.id === draggedId);
    if (t && t.status !== status) {
      dispatch(updateTask({
        id: draggedId,
        patch: { status, completedAt: status === "done" ? new Date().toISOString() : undefined }
      }));
      toast.success(`Task moved to ${COLUMNS.find((c) => c.id === status)?.label}`);
    }
    setDraggedId(null);
    setDragOver(null);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {COLUMNS.map((col) => {
        const colTasks = grouped[col.id];
        return (
          <div
            key={col.id}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(col.id);
            }}
            onDragLeave={() => setDragOver(null)}
            onDrop={() => handleDrop(col.id)}
            className={cn(
              "rounded-2xl border bg-card/50 p-3 transition-colors",
              dragOver === col.id && "border-primary bg-primary/5"
            )}
          >
            <div className="mb-3 flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <div className={cn("h-2 w-2 rounded-full", col.color, col.id === "todo" && "bg-muted-foreground", col.id === "in_progress" && "bg-info", col.id === "review" && "bg-warning", col.id === "done" && "bg-success")} />
                <span className="text-xs font-bold uppercase tracking-wider">{col.label}</span>
                <Badge variant="outline" className="text-[10px]">{colTasks.length}</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <AnimatePresence>
                {colTasks.map((t) => {
                  const assignee = ds.employees.find((e) => e.id === t.assigneeId);
                  const isOverdue = new Date(t.dueAt) < new Date() && t.status !== "done";
                  const slaHoursLeft = Math.round(
                    (new Date(t.createdAt).getTime() + t.slaHours * 3600_000 - Date.now()) / 3600_000
                  );
                  return (
                    <motion.div
                      key={t.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      draggable
                      onDragStart={() => setDraggedId(t.id)}
                      onDragEnd={() => setDraggedId(null)}
                      onClick={() => onSelect?.(t)}
                      whileHover={{ y: -2 }}
                      className={cn(
                        "cursor-grab active:cursor-grabbing rounded-xl border bg-card p-3 shadow-soft hover:border-primary/30 hover:shadow-elevated",
                        draggedId === t.id && "opacity-50",
                        t.slaBreached && "border-destructive/40 bg-destructive/[0.02]"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className={cn("text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded", PRIORITY_TONE[t.priority])}>
                          {t.priority}
                        </span>
                        {t.slaBreached ? (
                          <span className="flex items-center gap-1 rounded-full bg-destructive/10 px-1.5 py-0.5 text-[9px] font-bold text-destructive">
                            <AlertTriangle className="h-2.5 w-2.5" />
                            SLA breached
                          </span>
                        ) : isOverdue ? (
                          <span className="flex items-center gap-1 text-[9px] font-bold text-warning">
                            <Clock className="h-2.5 w-2.5" />
                            Overdue
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[9px] text-muted-foreground">
                            <Hourglass className="h-2.5 w-2.5" />
                            {slaHoursLeft}h left
                          </span>
                        )}
                      </div>
                      <h3 className="mt-2 text-sm font-semibold leading-snug line-clamp-2">
                        {t.title}
                      </h3>
                      {t.aiSuggestion && (
                        <div className="mt-2 flex items-start gap-1 rounded-lg bg-primary/[0.05] p-1.5">
                          <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                          <span className="text-[10px] leading-tight text-primary line-clamp-2">
                            {t.aiSuggestion}
                          </span>
                        </div>
                      )}
                      <div className="mt-2 flex flex-wrap gap-1">
                        {t.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="rounded bg-muted px-1.5 py-0.5 text-[9px] text-muted-foreground">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        {assignee && (
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={assignee.avatar} alt={assignee.fullName} />
                            <AvatarFallback className="text-[8px]">{initials(assignee.fullName)}</AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex items-center gap-2.5 text-[10px] text-muted-foreground">
                          {t.attachments > 0 && (
                            <span className="flex items-center gap-0.5">
                              <Paperclip className="h-3 w-3" />
                              {t.attachments}
                            </span>
                          )}
                          {t.comments > 0 && (
                            <span className="flex items-center gap-0.5">
                              <MessageSquare className="h-3 w-3" />
                              {t.comments}
                            </span>
                          )}
                          <span className="flex items-center gap-0.5">
                            <Calendar className="h-3 w-3" />
                            {new Date(t.dueAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </div>
  );
}
