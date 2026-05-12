"use client";

import * as React from "react";
import {
  AlertTriangle,
  ArrowRight,
  Brain,
  CheckCircle2,
  Compass,
  Heart,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Trophy,
  Users,
  Zap
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { SectionCard } from "@/components/shared/section-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDataset } from "@/hooks/use-dataset";
import { useAppDispatch } from "@/lib/store/hooks";
import { setAiOpen } from "@/lib/store/uiSlice";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const ICON_MAP = {
  burnout: AlertTriangle,
  performance: TrendingUp,
  workforce: Compass,
  attendance: Users,
  leave: Trophy,
  comms: Brain
};

const SEVERITY_TONE = {
  info: "border-info/30 bg-info/[0.04] text-info",
  success: "border-success/30 bg-success/[0.04] text-success",
  warning: "border-warning/30 bg-warning/[0.04] text-warning",
  critical: "border-destructive/30 bg-destructive/[0.04] text-destructive"
};

export default function HRInsightsPage() {
  const ds = useDataset();
  const dispatch = useAppDispatch();

  const critical = ds.aiInsights.filter((i) => i.severity === "critical").length;
  const warnings = ds.aiInsights.filter((i) => i.severity === "warning").length;
  const wins = ds.aiInsights.filter((i) => i.severity === "success").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Insights"
        description="Crowny's auto-generated workforce intelligence"
        actions={
          <Button variant="brand" size="sm" onClick={() => dispatch(setAiOpen(true))}>
            <Sparkles className="h-4 w-4" />
            Ask Crowny
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Critical alerts" value={critical} format="number" icon={AlertTriangle} accent="destructive" />
        <KpiCard label="Warnings" value={warnings} format="number" icon={Zap} accent="warning" />
        <KpiCard label="Positive trends" value={wins} format="number" icon={Trophy} accent="success" />
          <KpiCard label="Total insights" value={ds.aiInsights.length} format="number" icon={Brain} accent="primary" />
      </div>

      <div className="grid gap-4">
        {ds.aiInsights.map((insight, i) => {
          const Icon = ICON_MAP[insight.category as keyof typeof ICON_MAP] || Sparkles;
          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card className={cn("p-5 border-l-4", SEVERITY_TONE[insight.severity as keyof typeof SEVERITY_TONE])}>
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
                    insight.severity === "critical" && "bg-destructive/10 text-destructive",
                    insight.severity === "warning" && "bg-warning/10 text-warning",
                    insight.severity === "success" && "bg-success/10 text-success",
                    insight.severity === "info" && "bg-info/10 text-info"
                  )}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold">{insight.title}</h3>
                      <Badge variant="outline" className="text-[10px] uppercase">
                        {insight.category}
                      </Badge>
                      <Badge variant={
                        insight.severity === "critical" ? "destructive" :
                        insight.severity === "warning" ? "warning" :
                        insight.severity === "success" ? "success" : "info"
                      } className="text-[10px] uppercase">
                        {insight.severity}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{insight.body}</p>
                    {insight.suggestion && (
                      <div className="mt-3 rounded-xl bg-card/50 p-3">
                        <div className="flex items-center gap-1.5 text-xs font-semibold">
                          <ArrowRight className="h-3 w-3" />
                          Recommended action
                        </div>
                        <p className="mt-1 text-xs">{insight.suggestion}</p>
                      </div>
                    )}
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="brand">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Take action
                      </Button>
                      <Button size="sm" variant="outline">Dismiss</Button>
                      <Button size="sm" variant="ghost">Investigate further</Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
