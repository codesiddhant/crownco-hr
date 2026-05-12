"use client";

import * as React from "react";
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  Flag,
  Hourglass,
  Link2,
  MessageSquare,
  Paperclip,
  Send,
  Sparkles,
  Timer,
  Trash,
  UserCheck
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useDataset } from "@/hooks/use-dataset";
import { useAppDispatch } from "@/lib/store/hooks";
import { updateTask } from "@/lib/store/dataSlice";
import { cn, initials } from "@/lib/utils";
import { motion } from "framer-motion";
import { toast } from "sonner";
import type { Task } from "@/types";

interface Props {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MOCK_COMMENTS = (assigneeName: string) => [
  {
    id: "c1",
    author: "Aanya Sharma",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aanya",
    text: "Started working on this — should be done by EOD tomorrow.",
    at: "2h ago"
  },
  {
    id: "c2",
    author: assigneeName,
    avatar: "",
    text: "@Aanya please share the latest data sheet, blocked without it",
    at: "1h ago"
  },
  {
    id: "c3",
    author: "Aanya Sharma",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aanya",
    text: "Sent via email. Also pinged on Slack.",
    at: "45m ago"
  }
];

export function TaskDrawer({ task, open, onOpenChange }: Props) {
  const ds = useDataset();
  const dispatch = useAppDispatch();
  const [comment, setComment] = React.useState("");
  const [comments, setComments] = React.useState<ReturnType<typeof MOCK_COMMENTS>>([]);

  React.useEffect(() => {
    if (task) {
      const assignee = ds.employees.find((e) => e.id === task.assigneeId);
      setComments(MOCK_COMMENTS(assignee?.fullName || "Assignee"));
    }
  }, [task, ds.employees]);

  if (!task) return null;
  const assignee = ds.employees.find((e) => e.id === task.assigneeId);
  const reporter = ds.employees.find((e) => e.id === task.reporterId);
  const isOverdue = new Date(task.dueAt) < new Date() && task.status !== "done";
  const slaTotal = task.slaHours;
  const slaElapsed = Math.max(0, (Date.now() - new Date(task.createdAt).getTime()) / 3600_000);
  const slaPct = Math.min(100, (slaElapsed / slaTotal) * 100);

  const sendComment = () => {
    if (!comment.trim()) return;
    setComments((c) => [
      ...c,
      {
        id: `c_${Date.now()}`,
        author: "You",
        avatar: "",
        text: comment.trim(),
        at: "Just now"
      }
    ]);
    setComment("");
    dispatch(updateTask({ id: task.id, patch: { comments: task.comments + 1 } }));
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full max-w-2xl overflow-y-auto p-0">
        <SheetHeader className="border-b bg-card/50 p-6 pb-4 backdrop-blur sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] uppercase">{task.id.split("_")[0]}</Badge>
            <Badge variant={
              task.priority === "urgent" ? "destructive" :
              task.priority === "high" ? "warning" :
              task.priority === "medium" ? "info" : "outline"
            } className="text-[10px] uppercase">{task.priority}</Badge>
            {task.slaBreached && (
              <Badge variant="destructive" className="text-[10px]">
                <AlertTriangle className="mr-1 h-3 w-3" /> SLA breached
              </Badge>
            )}
          </div>
          <SheetTitle className="text-xl">{task.title}</SheetTitle>
          <SheetDescription>{task.description}</SheetDescription>
        </SheetHeader>

        <div className="space-y-6 p-6">
          {task.aiSuggestion && (
            <div className="rounded-2xl border border-primary/20 bg-primary/[0.04] p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  AI Suggestion · Crowny
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed">{task.aiSuggestion}</p>
              <div className="mt-2 flex gap-2">
                <Button size="sm" variant="ghost" className="h-7 text-xs">Apply</Button>
                <Button size="sm" variant="ghost" className="h-7 text-xs">Regenerate</Button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Status</span>
              <Select value={task.status} onValueChange={(v) => {
                dispatch(updateTask({ id: task.id, patch: { status: v as Task["status"] } }));
                toast.success(`Status updated to ${v}`);
              }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="backlog">Backlog</SelectItem>
                  <SelectItem value="todo">To do</SelectItem>
                  <SelectItem value="in_progress">In progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Priority</span>
              <Select value={task.priority} onValueChange={(v) => {
                dispatch(updateTask({ id: task.id, patch: { priority: v as Task["priority"] } }));
              }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-3 rounded-2xl border bg-muted/20 p-4 sm:grid-cols-2">
            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Assignee</div>
              {assignee && (
                <div className="flex items-center gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={assignee.avatar} alt={assignee.fullName} />
                    <AvatarFallback className="text-[10px]">{initials(assignee.fullName)}</AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <div className="font-medium">{assignee.fullName}</div>
                    <div className="text-[10px] text-muted-foreground">{assignee.designation}</div>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Reporter</div>
              {reporter && (
                <div className="flex items-center gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={reporter.avatar} alt={reporter.fullName} />
                    <AvatarFallback className="text-[10px]">{initials(reporter.fullName)}</AvatarFallback>
                  </Avatar>
                  <div className="text-sm font-medium">{reporter.fullName}</div>
                </div>
              )}
            </div>
            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Due date</div>
              <div className={cn("flex items-center gap-1.5 text-sm", isOverdue && "text-destructive")}>
                <Calendar className="h-3.5 w-3.5" />
                {new Date(task.dueAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                {isOverdue && <span className="text-[10px]">(overdue)</span>}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">SLA</div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${slaPct}%` }}
                    className={cn(
                      "h-full",
                      slaPct > 90 ? "bg-destructive" : slaPct > 75 ? "bg-warning" : "bg-success"
                    )}
                  />
                </div>
                <span className="text-xs font-medium tabular-nums">{Math.round(slaPct)}%</span>
              </div>
            </div>
          </div>

          {task.tags.length > 0 && (
            <div>
              <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Tags</div>
              <div className="flex flex-wrap gap-1.5">
                {task.tags.map((t) => (
                  <Badge key={t} variant="outline" className="text-[10px]">#{t}</Badge>
                ))}
              </div>
            </div>
          )}

          <Separator />

          <div>
            <div className="flex items-center gap-2 text-sm font-semibold">
              <MessageSquare className="h-4 w-4" />
              Activity & Comments
            </div>
            <div className="mt-3 space-y-3">
              {comments.map((c) => (
                <div key={c.id} className="flex gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={c.avatar} alt={c.author} />
                    <AvatarFallback className="text-[10px]">{initials(c.author)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 rounded-xl border bg-card p-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold">{c.author}</span>
                      <span className="text-[10px] text-muted-foreground">{c.at}</span>
                    </div>
                    <p className="mt-1 text-sm">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-end gap-2">
              <Textarea
                rows={2}
                placeholder="Write a comment, @mention to notify"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <Button size="icon" variant="brand" onClick={sendComment}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-2 flex gap-2 text-xs text-muted-foreground">
              <button className="flex items-center gap-1 hover:text-foreground">
                <Paperclip className="h-3 w-3" /> Attach
              </button>
              <button className="flex items-center gap-1 hover:text-foreground">
                <Link2 className="h-3 w-3" /> Link
              </button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
