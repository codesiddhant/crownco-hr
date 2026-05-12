"use client";

import * as React from "react";
import { CheckCircle2, Download, FileText, Receipt, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { SectionCard } from "@/components/shared/section-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Logo } from "@/components/branding/logo";
import { useDataset } from "@/hooks/use-dataset";
import { useAppSelector } from "@/lib/store/hooks";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/utils";
import { SeriesAreaChart } from "@/components/charts/area-chart";
import type { Payslip } from "@/types";
import { toast } from "sonner";

export default function EmployeePayslipsPage() {
  const ds = useDataset();
  const user = useAppSelector((s) => s.auth.user);
  const me = ds.employees.find((e) => e.fullName === user?.name) ?? ds.employees[0];
  const myPayslips = ds.payslips.filter((p) => p.employeeId === me.id);
  const latest = myPayslips[0];
  const [selected, setSelected] = React.useState<Payslip | null>(null);

  const yearly = myPayslips.reduce((s, p) => s + p.net, 0);
  const avgMonthly = Math.round(yearly / Math.max(1, myPayslips.length));

  const trend = myPayslips.slice(0, 12).reverse().map((p) => ({
    month: p.month.slice(0, 3),
    net: Math.round(p.net / 1000)
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="My payslips"
        description="Salary breakdown and history"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Last month net" value={latest?.net ?? 0} format="currency" icon={Wallet} accent="primary" />
        <KpiCard label="YTD gross" value={yearly} format="currency" icon={TrendingUp} accent="success" />
        <KpiCard label="Avg monthly" value={avgMonthly} format="currency" icon={Receipt} accent="info" />
        <KpiCard label="Total tax paid" value={Math.round(yearly * 0.18)} format="currency" icon={FileText} accent="warning" />
      </div>

      <SectionCard title="Net pay trend" description="Last 12 months (₹ in thousands)">
        <SeriesAreaChart
          data={trend}
          xKey="month"
          series={[{ key: "net", label: "Net pay", color: "hsl(var(--success))" }]}
          height={240}
        />
      </SectionCard>

      <SectionCard title="Payslip history">
        <div className="space-y-2">
          {myPayslips.slice(0, 12).map((p) => (
            <Card
              key={p.id}
              onClick={() => setSelected(p)}
              className="cursor-pointer p-4 transition-colors hover:border-primary/30"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Receipt className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold">{p.month} {p.year}</div>
                  <div className="text-xs text-muted-foreground">
                    Basic + HRA + Incentives + Bonus
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold tabular-nums">{formatCurrency(p.net)}</div>
                  <Badge variant={p.status === "paid" ? "success" : "info"} className="text-[10px] capitalize">
                    {p.status}
                  </Badge>
                </div>
                <Button size="icon" variant="ghost" onClick={(e) => {
                  e.stopPropagation();
                  toast.success(`Payslip ${p.month} ${p.year} downloaded`);
                }}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </SectionCard>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        {selected && (
          <DialogContent className="max-w-2xl p-0">
            <div className="bg-card">
              <div className="border-b bg-gradient-to-br from-primary/10 via-card to-accent/5 p-6">
                <div className="flex items-start justify-between">
                  <Logo size={32} />
                  <div className="text-right">
                    <Badge variant={selected.status === "paid" ? "success" : "info"} className="text-[10px] capitalize">{selected.status}</Badge>
                    <div className="mt-1 text-[10px] text-muted-foreground">#{selected.id}</div>
                  </div>
                </div>
                <h2 className="mt-4 text-xl font-bold">
                  Payslip — {selected.month} {selected.year}
                </h2>
                <p className="text-sm text-muted-foreground">{me.fullName} · {me.designation}</p>
                <p className="text-xs text-muted-foreground">{me.email}</p>
              </div>

              <div className="p-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-success mb-3">Earnings</h3>
                    <div className="space-y-2 text-sm">
                      <Row label="Basic" value={selected.basic} />
                      <Row label="HRA" value={selected.hra} />
                      <Row label="Allowances" value={selected.allowances} />
                      <Row label="Incentives" value={selected.incentives} highlight />
                      <Row label="Overtime" value={selected.overtime} />
                      <Row label="Bonus" value={selected.bonus} />
                      <Separator />
                      <Row
                        label="Gross"
                        value={selected.basic + selected.hra + selected.allowances + selected.incentives + selected.overtime + selected.bonus}
                        bold
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-destructive mb-3">Deductions</h3>
                    <div className="space-y-2 text-sm">
                      <Row label="PF (12%)" value={-selected.pf} />
                      <Row label="Income tax" value={-selected.tax} />
                      <Row label="Loan / Advance" value={-selected.loan} />
                      <Separator />
                      <Row label="Total deductions" value={-(selected.pf + selected.tax + selected.loan)} bold />
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="rounded-2xl border border-success/30 bg-success/[0.04] p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold uppercase tracking-wider text-success">Net Pay</span>
                    <span className="text-2xl font-bold tabular-nums text-success">
                      {formatCurrency(selected.net)}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex gap-2">
                  <Button variant="brand" className="flex-1" onClick={() => toast.success("Payslip downloaded")}>
                    <Download className="h-4 w-4" />
                    Download PDF
                  </Button>
                  <Button variant="outline" onClick={() => toast.success("Sent to email")}>
                    Email me
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}

function Row({ label, value, bold, highlight }: { label: string; value: number; bold?: boolean; highlight?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className={highlight ? "text-success" : "text-muted-foreground"}>{label}</span>
      <span className={`tabular-nums ${bold ? "font-bold" : ""} ${value < 0 ? "text-destructive" : ""}`}>
        {value < 0 ? "- " : ""}{formatCurrency(Math.abs(value))}
      </span>
    </div>
  );
}
