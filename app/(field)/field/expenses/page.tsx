"use client";

import * as React from "react";
import {
  Camera,
  CheckCircle2,
  Clock,
  Coffee,
  Fuel,
  PlusCircle,
  Receipt,
  Sparkles,
  Upload,
  Wifi
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { SectionCard } from "@/components/shared/section-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { cn, formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

const MOCK_EXPENSES = [
  { id: "e1", type: "fuel", merchant: "Indian Oil — Andheri", amount: 1240, date: "Today, 10:30 AM", status: "approved", icon: Fuel },
  { id: "e2", type: "food", merchant: "Cafe Coffee Day", amount: 320, date: "Today, 1:15 PM", status: "approved", icon: Coffee },
  { id: "e3", type: "fuel", merchant: "HP Petrol — Powai", amount: 1850, date: "Yesterday, 6:40 PM", status: "pending", icon: Fuel },
  { id: "e4", type: "data", merchant: "Airtel Recharge", amount: 549, date: "12 May 2025", status: "approved", icon: Wifi },
  { id: "e5", type: "food", merchant: "Domino's — BKC", amount: 487, date: "11 May 2025", status: "rejected", icon: Coffee }
];

const STATUS_TONE = {
  approved: "success",
  pending: "warning",
  rejected: "destructive"
} as const;

export default function FieldExpensesPage() {
  const [open, setOpen] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [step, setStep] = React.useState<"idle" | "extracting" | "extracted">("idle");
  const [extracted, setExtracted] = React.useState({
    merchant: "",
    amount: 0,
    date: "",
    category: ""
  });

  const totalThisMonth = MOCK_EXPENSES.reduce((s, e) => s + e.amount, 0);
  const pending = MOCK_EXPENSES.filter((e) => e.status === "pending").length;
  const approved = MOCK_EXPENSES.filter((e) => e.status === "approved").length;

  const startExtraction = () => {
    setUploading(true);
    setStep("extracting");
    setTimeout(() => {
      setExtracted({
        merchant: "Indian Oil Petroleum",
        amount: 1340,
        date: new Date().toISOString().slice(0, 10),
        category: "fuel"
      });
      setStep("extracted");
      setUploading(false);
    }, 2200);
  };

  const submit = () => {
    setOpen(false);
    setStep("idle");
    setExtracted({ merchant: "", amount: 0, date: "", category: "" });
    toast.success("Expense submitted for approval");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Expenses"
        description="Auto-extracted from receipts using AI"
        actions={
          <Button variant="brand" size="sm" onClick={() => setOpen(true)}>
            <PlusCircle className="h-4 w-4" />
            Add expense
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total this month" value={totalThisMonth} format="currency" icon={Receipt} accent="primary" />
        <KpiCard label="Approved" value={approved} format="number" icon={CheckCircle2} accent="success" />
        <KpiCard label="Pending" value={pending} format="number" icon={Clock} accent="warning" />
        <KpiCard label="Avg per visit" value={Math.round(totalThisMonth / 8)} format="currency" icon={Sparkles} accent="info" />
      </div>

      <SectionCard title="Recent expenses">
        <div className="space-y-2">
          {MOCK_EXPENSES.map((e) => {
            const Icon = e.icon;
            return (
              <Card key={e.id} className="p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">{e.merchant}</div>
                    <div className="text-xs text-muted-foreground">{e.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold tabular-nums">{formatCurrency(e.amount)}</div>
                    <Badge variant={STATUS_TONE[e.status as keyof typeof STATUS_TONE]} className="text-[10px] capitalize">
                      {e.status}
                    </Badge>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </SectionCard>

      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setStep("idle"); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add expense</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {step === "idle" && (
              <div className="space-y-3">
                <button
                  onClick={startExtraction}
                  className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/[0.03] p-8 transition-colors hover:bg-primary/[0.06]"
                >
                  <Camera className="h-10 w-10 text-primary" />
                  <span className="text-sm font-semibold text-primary">Tap to capture receipt</span>
                  <span className="text-[10px] text-muted-foreground">AI will auto-extract details</span>
                </button>
                <div className="text-center text-xs text-muted-foreground">or</div>
                <Button variant="outline" className="w-full" onClick={startExtraction}>
                  <Upload className="h-4 w-4" />
                  Upload image
                </Button>
              </div>
            )}

            {step === "extracting" && (
              <div className="space-y-4 py-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
                >
                  <Sparkles className="h-8 w-8 animate-pulse text-primary" />
                </motion.div>
                <div className="space-y-2">
                  <div className="text-sm font-semibold">AI extracting...</div>
                  <Progress value={75} className="h-2" />
                  <div className="space-y-1 text-[10px] text-muted-foreground">
                    <AnimatePresence mode="popLayout">
                      {["Reading merchant name...", "Detecting amount...", "Parsing date...", "Categorizing expense..."].map((step, i) => (
                        <motion.div
                          key={step}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.4 }}
                          className="flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="h-3 w-3 text-success" />
                          {step}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            )}

            {step === "extracted" && (
              <div className="space-y-3">
                <div className="rounded-2xl border border-success/30 bg-success/[0.04] p-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-success">
                    <CheckCircle2 className="h-3 w-3" />
                    AI extracted with 96% confidence
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Merchant</Label>
                  <Input value={extracted.merchant} onChange={(e) => setExtracted((s) => ({ ...s, merchant: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Amount (₹)</Label>
                  <Input
                    type="number"
                    value={extracted.amount}
                    onChange={(e) => setExtracted((s) => ({ ...s, amount: Number(e.target.value) }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label className="text-xs">Date</Label>
                    <Input
                      type="date"
                      value={extracted.date}
                      onChange={(e) => setExtracted((s) => ({ ...s, date: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Category</Label>
                    <Select value={extracted.category} onValueChange={(v) => setExtracted((s) => ({ ...s, category: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fuel">Fuel</SelectItem>
                        <SelectItem value="food">Food</SelectItem>
                        <SelectItem value="data">Data</SelectItem>
                        <SelectItem value="travel">Travel</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button variant="brand" className="w-full" onClick={submit}>
                  Submit expense
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
