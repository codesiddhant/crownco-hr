"use client";

import * as React from "react";
import {
  Briefcase,
  CalendarClock,
  FileText,
  PlusCircle,
  ScanLine,
  Search,
  Sparkles,
  Star,
  TrendingUp,
  UserCheck,
  UserPlus
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { SectionCard } from "@/components/shared/section-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useDataset } from "@/hooks/use-dataset";
import { useAppDispatch } from "@/lib/store/hooks";
import { updateDataset } from "@/lib/mock/service";
import { bumpVersion } from "@/lib/store/dataSlice";
import { cn, formatCurrency, initials } from "@/lib/utils";
import { SeriesBarChart } from "@/components/charts/bar-chart";
import { FunnelChart } from "@/components/charts/funnel-chart";
import { motion } from "framer-motion";
import type { Candidate } from "@/types";
import { toast } from "sonner";

const STAGES: { id: Candidate["stage"]; label: string; color: string }[] = [
  { id: "applied", label: "Applied", color: "bg-muted" },
  { id: "screening", label: "Screening", color: "bg-info/10" },
  { id: "interview", label: "Interview", color: "bg-warning/10" },
  { id: "offer", label: "Offer", color: "bg-primary/10" },
  { id: "hired", label: "Hired", color: "bg-success/10" }
];

export default function HRRecruitmentPage() {
  const ds = useDataset();
  const dispatch = useAppDispatch();
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<Candidate | null>(null);
  const [draggedId, setDraggedId] = React.useState<string | null>(null);
  const [dragOver, setDragOver] = React.useState<string | null>(null);

  const filtered = ds.candidates.filter((c) =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.role.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = STAGES.reduce((acc, s) => {
    acc[s.id] = filtered.filter((c) => c.stage === s.id);
    return acc;
  }, {} as Record<Candidate["stage"], Candidate[]>);

  const handleDrop = (stage: Candidate["stage"]) => {
    if (!draggedId) return;
    updateDataset((d) => {
      const c = d.candidates.find((x) => x.id === draggedId);
      if (c) c.stage = stage;
    });
    dispatch(bumpVersion());
    toast.success(`Moved to ${stage}`);
    setDraggedId(null);
    setDragOver(null);
  };

  const stats = {
    total: ds.candidates.length,
    interviewing: ds.candidates.filter((c) => c.stage === "interview").length,
    offers: ds.candidates.filter((c) => c.stage === "offer").length,
    hired: ds.candidates.filter((c) => c.stage === "hired").length
  };

  const funnel = STAGES.map((s) => ({
    label: s.label,
    value: ds.candidates.filter((c) => c.stage === s.id || ["interview", "offer", "hired"].indexOf(c.stage) > ["interview", "offer", "hired"].indexOf(s.id)).length
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Recruitment"
        description="AI-ranked candidate pipeline"
        actions={
          <Button variant="brand" size="sm">
            <PlusCircle className="h-4 w-4" />
            Add candidate
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total candidates" value={stats.total} format="number" icon={UserCheck} accent="primary" />
        <KpiCard label="In interviews" value={stats.interviewing} format="number" icon={CalendarClock} accent="info" />
        <KpiCard label="Offers extended" value={stats.offers} format="number" icon={Briefcase} accent="warning" />
        <KpiCard label="Hired" value={stats.hired} format="number" icon={UserPlus} accent="success" />
      </div>

      <Tabs defaultValue="pipeline">
        <TabsList>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="ranked">AI ranked</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative max-w-sm flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search candidates..."
                className="pl-9"
              />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {STAGES.map((col) => {
              const items = grouped[col.id];
              return (
                <div
                  key={col.id}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(col.id); }}
                  onDragLeave={() => setDragOver(null)}
                  onDrop={() => handleDrop(col.id)}
                  className={cn(
                    "rounded-2xl border bg-card/50 p-2 transition-colors",
                    dragOver === col.id && "border-primary bg-primary/5"
                  )}
                >
                  <div className="mb-2 flex items-center justify-between px-1">
                    <span className="text-xs font-bold uppercase tracking-wider">{col.label}</span>
                    <Badge variant="outline" className="text-[10px]">{items.length}</Badge>
                  </div>
                  <div className="space-y-2">
                    {items.slice(0, 8).map((c) => (
                      <motion.div
                        key={c.id}
                        layout
                        draggable
                        onDragStart={() => setDraggedId(c.id)}
                        onDragEnd={() => setDraggedId(null)}
                        onClick={() => setSelected(c)}
                        whileHover={{ y: -2 }}
                        className={cn(
                          "cursor-grab active:cursor-grabbing rounded-xl border bg-card p-3 shadow-soft hover:border-primary/30",
                          draggedId === c.id && "opacity-50"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={c.avatar} alt={c.name} />
                            <AvatarFallback className="text-[10px]">{initials(c.name)}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-xs font-semibold">{c.name}</div>
                            <div className="truncate text-[10px] text-muted-foreground">{c.role}</div>
                          </div>
                          <Badge variant="default" className="text-[9px]">{c.aiScore}</Badge>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-[9px] text-muted-foreground">
                          <span>{c.experienceYears}y exp</span>
                          <span>{c.noticePeriod}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="ranked">
          <SectionCard
            title="Top candidates by AI score"
            icon={<Sparkles className="h-4 w-4 text-primary" />}
          >
            <div className="space-y-2">
              {ds.candidates.sort((a, b) => b.aiScore - a.aiScore).slice(0, 12).map((c, i) => (
                <Card key={c.id} className="p-3 cursor-pointer hover:border-primary/30" onClick={() => setSelected(c)}>
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg font-bold text-xs",
                      i < 3 ? "bg-warning/20 text-warning" : "bg-muted text-muted-foreground"
                    )}>
                      #{i + 1}
                    </div>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={c.avatar} alt={c.name} />
                      <AvatarFallback>{initials(c.name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold">{c.name}</div>
                      <div className="text-xs text-muted-foreground">{c.role} · {c.experienceYears} years</div>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {c.skills.slice(0, 3).map((s) => (
                          <span key={s} className="rounded bg-muted px-1.5 py-0.5 text-[9px]">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-primary">
                        <Sparkles className="h-3 w-3" />
                        <span className="text-2xl font-bold tabular-nums">{c.aiScore}</span>
                      </div>
                      <Badge variant="outline" className="mt-0.5 text-[9px] capitalize">{c.stage}</Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard title="Hiring funnel">
              <FunnelChart data={funnel} />
            </SectionCard>
            <SectionCard title="Candidates by role">
              <SeriesBarChart
                data={Array.from(new Set(ds.candidates.map((c) => c.role))).slice(0, 6).map((r) => ({
                  role: r.split(" ")[0],
                  count: ds.candidates.filter((c) => c.role === r).length
                }))}
                xKey="role"
                series={[{ key: "count", label: "Count", color: "hsl(var(--primary))" }]}
                height={260}
              />
            </SectionCard>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        {selected && (
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={selected.avatar} alt={selected.name} />
                  <AvatarFallback>{initials(selected.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <DialogTitle>{selected.name}</DialogTitle>
                  <DialogDescription>{selected.role}</DialogDescription>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px]">{selected.experienceYears}y exp</Badge>
                    <Badge variant="outline" className="text-[10px]">{selected.noticePeriod}</Badge>
                    <Badge variant="default" className="text-[10px] capitalize">{selected.stage}</Badge>
                  </div>
                </div>
                <div className="ml-auto text-center">
                  <div className="flex items-center justify-center gap-1 text-primary">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-3xl font-bold tabular-nums">{selected.aiScore}</span>
                  </div>
                  <div className="text-[10px] uppercase text-muted-foreground">AI score</div>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4">
              <Card className="border-primary/30 bg-primary/[0.03] p-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                  <ScanLine className="h-3.5 w-3.5" />
                  AI resume analysis · 91% confidence
                </div>
                <p className="mt-2 text-sm">
                  <strong>Strong match.</strong> Candidate has {selected.experienceYears} years of experience in {selected.role}.
                  Skills align with role requirements (4/5 matched). Notice period of {selected.noticePeriod} fits hiring timeline.
                  Previous companies suggest enterprise sales background. Estimated retention: 24 months+.
                </p>
              </Card>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border bg-card p-3">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Communication score
                  </div>
                  <div className="mt-1 text-2xl font-bold text-success">88/100</div>
                  <Progress value={88} className="mt-1 h-1.5" />
                </div>
                <div className="rounded-2xl border bg-card p-3">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Skill match
                  </div>
                  <div className="mt-1 text-2xl font-bold text-info">80%</div>
                  <Progress value={80} className="mt-1 h-1.5" />
                </div>
              </div>

              <div>
                <h4 className="mb-2 text-xs font-bold uppercase tracking-wider">Skills</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selected.skills.map((s) => (
                    <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-[10px] uppercase text-muted-foreground">Current CTC</div>
                  <div className="font-bold tabular-nums">{formatCurrency(selected.currentCTC)}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-muted-foreground">Expected CTC</div>
                  <div className="font-bold tabular-nums">{formatCurrency(selected.expectedCTC)}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-muted-foreground">Email</div>
                  <div className="truncate">{selected.email}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-muted-foreground">Phone</div>
                  <div>{selected.phone}</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4" />
                  View resume
                </Button>
                <Button variant="outline" size="sm">
                  <CalendarClock className="h-4 w-4" />
                  Schedule interview
                </Button>
                <Button variant="brand" size="sm" className="ml-auto">
                  Move to next stage
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
