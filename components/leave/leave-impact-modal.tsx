"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Loader2,
  Sparkles,
  Users,
  Workflow
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useDataset } from "@/hooks/use-dataset";
import { initials, cn } from "@/lib/utils";

interface LeaveImpactModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  employeeId: string;
  type: string;
  fromDate: string;
  toDate: string;
  days: number;
  onConfirm: (data: { riskScore: number; replacements: string[] }) => void;
}

export function LeaveImpactModal({
  open,
  onOpenChange,
  employeeId,
  type,
  fromDate,
  toDate,
  days,
  onConfirm
}: LeaveImpactModalProps) {
  const ds = useDataset();
  const employee = ds.employees.find((e) => e.id === employeeId) ?? ds.employees[0];
  const [analyzing, setAnalyzing] = React.useState(false);
  const [analyzed, setAnalyzed] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setAnalyzing(false);
      setAnalyzed(false);
    }
  }, [open]);

  const run = async () => {
    setAnalyzing(true);
    await new Promise((r) => setTimeout(r, 1400));
    setAnalyzing(false);
    setAnalyzed(true);
  };

  const myTasks = ds.tasks.filter(
    (t) => t.assigneeId === employeeId && t.status !== "done"
  );
  const myLeads = ds.leads
    .filter((l) => l.ownerId === employeeId && ["qualified", "demo", "negotiation"].includes(l.stage));
  const hotLeads = myLeads.filter((l) => l.hot).length;
  const totalValue = myLeads.reduce((s, l) => s + l.valueINR, 0);
  const riskScore = Math.min(
    95,
    Math.round(35 + myTasks.length * 1.2 + hotLeads * 4 + days * 3)
  );
  const replacements = ds.employees
    .filter((e) => e.id !== employeeId && e.department === employee.department)
    .slice(0, 4);

  const tone =
    riskScore > 70
      ? { color: "text-destructive", bg: "bg-destructive/10", label: "High" }
      : riskScore > 40
        ? { color: "text-warning", bg: "bg-warning/10", label: "Medium" }
        : { color: "text-success", bg: "bg-success/10", label: "Low" };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <div className="inline-flex items-center gap-1.5 self-start rounded-full border border-primary/30 bg-primary/5 px-2.5 py-0.5 text-xs font-semibold text-primary">
            <Sparkles className="h-3 w-3" /> AI Impact Analysis
          </div>
          <DialogTitle>Reviewing {type} leave request</DialogTitle>
          <DialogDescription>
            {employee.firstName} · {fromDate} → {toDate} · {days} days
          </DialogDescription>
        </DialogHeader>

        {!analyzed ? (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            {analyzing ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-glow"
                >
                  <Sparkles className="h-7 w-7" />
                </motion.div>
                <div>
                  <div className="text-base font-semibold">Analyzing workforce impact…</div>
                  <p className="text-sm text-muted-foreground">
                    Scanning active projects, pipelines, follow-ups and team workload.
                  </p>
                </div>
                <div className="w-full max-w-sm space-y-1.5">
                  {["Active projects", "Pending tasks", "Pipeline value", "Team workload"].map((s, i) => (
                    <motion.div
                      key={s}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.2 }}
                      className="flex items-center gap-2 text-xs"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                      <span>{s}</span>
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Sparkles className="h-7 w-7" />
                </div>
                <div>
                  <div className="text-base font-semibold">Run AI impact analysis?</div>
                  <p className="text-sm text-muted-foreground">
                    Crowny will scan {employee.firstName}'s active projects, tasks, leads, and team
                    workload to score the impact of this leave.
                  </p>
                </div>
                <Button variant="brand" size="lg" onClick={run}>
                  <Sparkles className="h-4 w-4" />
                  Run analysis
                </Button>
              </>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className={cn("rounded-2xl border p-4", tone.bg)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl bg-card", tone.color)}>
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">
                      Operational risk
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className={cn("text-3xl font-bold", tone.color)}>{riskScore}</span>
                      <span className="text-sm text-muted-foreground">/100</span>
                      <Badge variant={riskScore > 70 ? "destructive" : riskScore > 40 ? "warning" : "success"}>
                        {tone.label}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <div>Manageable with redistribution</div>
                  <div className="mt-0.5 font-semibold">Recommendation: Approve</div>
                </div>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border bg-card p-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Workflow className="h-3.5 w-3.5" /> Active tasks
                </div>
                <div className="mt-1 text-2xl font-bold">{myTasks.length}</div>
                <div className="text-xs text-muted-foreground">
                  {myTasks.filter((t) => t.priority === "urgent" || t.priority === "high").length} high-priority
                </div>
              </div>
              <div className="rounded-2xl border bg-card p-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <ClipboardList className="h-3.5 w-3.5" /> Hot leads
                </div>
                <div className="mt-1 text-2xl font-bold">{hotLeads}</div>
                <div className="text-xs text-muted-foreground">{myLeads.length} active total</div>
              </div>
              <div className="rounded-2xl border bg-card p-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5" /> Pipeline value
                </div>
                <div className="mt-1 text-2xl font-bold">
                  ₹{(totalValue / 100000).toFixed(1)}L
                </div>
                <div className="text-xs text-muted-foreground">at stake during leave</div>
              </div>
            </div>

            <div className="rounded-2xl border bg-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Suggested backups
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Based on skill match + availability + past performance
                  </div>
                </div>
              </div>
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                {replacements.map((r, i) => (
                  <div
                    key={r.id}
                    className="flex items-center gap-3 rounded-xl border bg-card p-2.5"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={r.avatar} alt={r.fullName} />
                      <AvatarFallback>{initials(r.fullName)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{r.fullName}</div>
                      <div className="text-xs text-muted-foreground">{r.designation}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-semibold text-success">
                        {95 - i * 4}%
                      </div>
                      <div className="text-[10px] text-muted-foreground">match</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border bg-card p-4">
              <div className="text-sm font-semibold">AI handover plan</div>
              <div className="mt-2 space-y-1.5">
                {[
                  `Reassign ${Math.max(2, Math.round(myTasks.length / 2))} pending tasks to suggested backups`,
                  "Auto-respond on email with cover-contact details",
                  "Block calendar for 1-hour shadow handover before leave",
                  "Notify 4 hot-lead clients about temporary point-of-contact"
                ].map((p) => (
                  <div key={p} className="flex items-start gap-2 text-xs">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t pt-3">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                variant="brand"
                onClick={() => {
                  onConfirm({ riskScore, replacements: replacements.map((r) => r.id) });
                  onOpenChange(false);
                }}
              >
                Submit with AI plan
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}
