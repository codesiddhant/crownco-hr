"use client";

import * as React from "react";
import {
  Activity,
  CalendarDays,
  CalendarPlus,
  Clock,
  FileText,
  Heart,
  HelpCircle,
  PlusCircle,
  Sparkles,
  Stethoscope,
  TreePalm
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LeaveImpactModal } from "@/components/leave/leave-impact-modal";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useDataset } from "@/hooks/use-dataset";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { addLeave } from "@/lib/store/dataSlice";
import { cn, initials } from "@/lib/utils";
import { StatusPill } from "@/components/shared/status-pill";
import { motion } from "framer-motion";
import { toast } from "sonner";
import type { Leave } from "@/types";

const LEAVE_TYPES = [
  { id: "casual", label: "Casual", icon: TreePalm, accent: "text-primary" },
  { id: "sick", label: "Sick", icon: Stethoscope, accent: "text-destructive" },
  { id: "earned", label: "Earned", icon: CalendarDays, accent: "text-info" },
  { id: "comp_off", label: "Comp off", icon: Clock, accent: "text-warning" },
  { id: "emergency", label: "Emergency", icon: Activity, accent: "text-destructive" }
];

export default function EmployeeLeavePage() {
  const ds = useDataset();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const me = ds.employees.find((e) => e.fullName === user?.name) ?? ds.employees[0];
  const balance = ds.leaveBalances.find((b) => b.employeeId === me.id);
  const myLeaves = ds.leaves.filter((l) => l.employeeId === me.id);

  const [applyOpen, setApplyOpen] = React.useState(false);
  const [impactOpen, setImpactOpen] = React.useState(false);
  const [step, setStep] = React.useState(1);
  const [formData, setFormData] = React.useState({
    type: "casual",
    from: "",
    to: "",
    halfDay: false,
    reason: ""
  });

  const compute = () => {
    if (!formData.from || !formData.to) return 0;
    const from = new Date(formData.from);
    const to = new Date(formData.to);
    return Math.max(1, Math.round((to.getTime() - from.getTime()) / 86400000) + 1);
  };
  const days = compute();

  const submit = (result: { riskScore: number; replacements: string[] }) => {
    const id = `lv_new_${Date.now()}`;
    const lv: Leave = {
      id,
      employeeId: me.id,
      type: formData.type as Leave["type"],
      from: formData.from,
      to: formData.to,
      days,
      halfDay: formData.halfDay,
      reason: formData.reason || "Personal",
      status: "pending",
      appliedAt: new Date().toISOString(),
      aiRiskScore: result.riskScore,
      aiSuggestions: [
        "Reassign pending tasks to suggested backups",
        "Auto-respond on email with cover-contact",
        "Block calendar for shadow handover"
      ],
      replacementSuggestions: result.replacements
    };
    dispatch(addLeave(lv));
    setApplyOpen(false);
    setStep(1);
    setFormData({ type: "casual", from: "", to: "", halfDay: false, reason: "" });
    toast.success("Leave application submitted with AI handover plan");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My leave"
        description="Apply, track balance, and view your leave history"
        actions={
          <Button variant="brand" onClick={() => setApplyOpen(true)}>
            <PlusCircle className="h-4 w-4" />
            Apply for leave
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Casual", value: balance?.casual ?? 0, total: 12, icon: TreePalm, color: "primary" },
          { label: "Sick", value: balance?.sick ?? 0, total: 12, icon: Stethoscope, color: "destructive" },
          { label: "Earned", value: balance?.earned ?? 0, total: 22, icon: CalendarDays, color: "info" },
          { label: "Comp off", value: balance?.comp_off ?? 0, total: 5, icon: Clock, color: "warning" }
        ].map((b) => {
          const Icon = b.icon;
          return (
            <Card key={b.label} className="overflow-hidden">
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", `bg-${b.color}/10 text-${b.color}`)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    {b.value} / {b.total}
                  </Badge>
                </div>
                <div className="mt-3 text-3xl font-semibold tabular-nums">
                  {b.value}
                  <span className="text-base text-muted-foreground"> days</span>
                </div>
                <div className="text-xs text-muted-foreground">{b.label} leave available</div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(b.value / b.total) * 100}%` }}
                    transition={{ duration: 0.6 }}
                    className={cn("h-full", `bg-${b.color}`)}
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <SectionCard
        title="Quick leave types"
        description="One-click apply with pre-filled context"
        icon={<Sparkles className="h-4 w-4" />}
      >
        <div className="grid gap-3 md:grid-cols-5">
          {LEAVE_TYPES.map((t) => {
            const Icon = t.icon;
            return (
              <motion.button
                key={t.id}
                whileHover={{ y: -2 }}
                onClick={() => {
                  setFormData((f) => ({ ...f, type: t.id }));
                  setApplyOpen(true);
                }}
                className="rounded-2xl border bg-card p-4 text-left shadow-soft hover:border-primary/30 hover:shadow-elevated"
              >
                <Icon className={cn("h-6 w-6", t.accent)} />
                <div className="mt-2 text-sm font-semibold">{t.label}</div>
                <div className="text-xs text-muted-foreground">Apply now</div>
              </motion.button>
            );
          })}
        </div>
      </SectionCard>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All ({myLeaves.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({myLeaves.filter((l) => l.status === "pending").length})</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-2">
          {myLeaves.map((l) => (
            <Card key={l.id} className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <span className="text-[10px] uppercase">
                    {new Date(l.from).toLocaleDateString("en-IN", { month: "short" })}
                  </span>
                  <span className="text-lg font-bold leading-tight">
                    {new Date(l.from).getDate()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold capitalize">{l.type} leave</span>
                    <Badge variant="outline" className="text-[10px]">
                      {l.halfDay ? "Half day" : `${l.days} days`}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {l.from} → {l.to} · "{l.reason}"
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-[10px]">
                    <span className="text-muted-foreground">AI risk:</span>
                    <span
                      className={cn(
                        "font-semibold tabular-nums",
                        l.aiRiskScore > 70 ? "text-destructive" : l.aiRiskScore > 40 ? "text-warning" : "text-success"
                      )}
                    >
                      {l.aiRiskScore}/100
                    </span>
                  </div>
                </div>
                <StatusPill value={l.status} />
              </div>
            </Card>
          ))}
        </TabsContent>
        {["pending", "approved", "rejected"].map((s) => (
          <TabsContent key={s} value={s} className="space-y-2">
            {myLeaves.filter((l) => l.status === s).map((l) => (
              <Card key={l.id} className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <span className="text-[10px] uppercase">
                      {new Date(l.from).toLocaleDateString("en-IN", { month: "short" })}
                    </span>
                    <span className="text-lg font-bold">{new Date(l.from).getDate()}</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold capitalize">{l.type} leave · {l.days}d</div>
                    <div className="text-xs text-muted-foreground">{l.from} → {l.to}</div>
                  </div>
                  <StatusPill value={l.status} />
                </div>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Apply for leave</DialogTitle>
            <DialogDescription>
              Step {step} of 3 · AI will analyze workforce impact before submission
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={cn(
                  "h-1 flex-1 rounded-full",
                  s <= step ? "bg-brand-gradient" : "bg-muted"
                )}
              />
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Leave type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(v) => setFormData((f) => ({ ...f, type: v }))}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="sick">Sick</SelectItem>
                    <SelectItem value="earned">Earned</SelectItem>
                    <SelectItem value="comp_off">Comp off</SelectItem>
                    <SelectItem value="unpaid">Unpaid</SelectItem>
                    <SelectItem value="maternity">Maternity</SelectItem>
                    <SelectItem value="paternity">Paternity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>From date</Label>
                  <Input
                    type="date"
                    value={formData.from}
                    onChange={(e) => setFormData((f) => ({ ...f, from: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>To date</Label>
                  <Input
                    type="date"
                    value={formData.to}
                    onChange={(e) => setFormData((f) => ({ ...f, to: e.target.value }))}
                  />
                </div>
              </div>
              <div className="rounded-2xl border bg-muted/30 p-3 text-sm">
                <span className="text-muted-foreground">Total days:</span>{" "}
                <strong className="text-primary">{days}</strong>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setApplyOpen(false)}>Cancel</Button>
                <Button variant="brand" onClick={() => setStep(2)} disabled={!formData.from || !formData.to}>
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Reason for leave</Label>
                <Textarea
                  rows={3}
                  placeholder="Brief reason..."
                  value={formData.reason}
                  onChange={(e) => setFormData((f) => ({ ...f, reason: e.target.value }))}
                />
              </div>
              <label className="flex items-start gap-3 rounded-xl border bg-card p-3">
                <input
                  type="checkbox"
                  checked={formData.halfDay}
                  onChange={(e) => setFormData((f) => ({ ...f, halfDay: e.target.checked }))}
                  className="mt-1"
                />
                <div>
                  <div className="text-sm font-medium">Half day leave</div>
                  <div className="text-xs text-muted-foreground">Only morning or afternoon off</div>
                </div>
              </label>
              <div className="flex justify-between gap-2">
                <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                <Button variant="brand" onClick={() => setStep(3)}>Continue</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="rounded-2xl border bg-primary/[0.03] p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Ready for AI analysis
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Crowny will analyze impact on projects, pipeline, and team workload before submission.
                </p>
                <div className="mt-3 space-y-1 text-sm">
                  <div>
                    <span className="text-muted-foreground">Type:</span>{" "}
                    <strong className="capitalize">{formData.type}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Period:</span>{" "}
                    <strong>{formData.from} → {formData.to}</strong> ({days} days)
                  </div>
                  <div>
                    <span className="text-muted-foreground">Reason:</span>{" "}
                    <em>{formData.reason || "Personal"}</em>
                  </div>
                </div>
              </div>
              <div className="flex justify-between gap-2">
                <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
                <Button variant="brand" onClick={() => setImpactOpen(true)}>
                  <Sparkles className="h-4 w-4" />
                  Run AI impact analysis
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <LeaveImpactModal
        open={impactOpen}
        onOpenChange={setImpactOpen}
        employeeId={me.id}
        type={formData.type}
        fromDate={formData.from}
        toDate={formData.to}
        days={days}
        onConfirm={submit}
      />
    </div>
  );
}
