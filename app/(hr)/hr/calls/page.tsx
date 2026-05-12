"use client";

import * as React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Filter,
  Frown,
  Headphones,
  Mic,
  Meh,
  PhoneCall,
  Play,
  Pause,
  ScanLine,
  Search,
  Smile,
  Sparkles,
  Target,
  TrendingUp,
  Volume2,
  Zap
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { SectionCard } from "@/components/shared/section-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useDataset } from "@/hooks/use-dataset";
import { cn, initials, formatDuration, formatNumber } from "@/lib/utils";
import { SeriesAreaChart } from "@/components/charts/area-chart";
import { SeriesBarChart } from "@/components/charts/bar-chart";
import { FunnelChart } from "@/components/charts/funnel-chart";
import { Heatmap } from "@/components/charts/heatmap";
import { motion } from "framer-motion";
import type { Call } from "@/types";

const SENTIMENT_COLOR = {
  positive: "text-success bg-success/10",
  neutral: "text-muted-foreground bg-muted",
  negative: "text-destructive bg-destructive/10"
};

const SENTIMENT_ICON = {
  positive: Smile,
  neutral: Meh,
  negative: Frown
};

const KEYWORDS_HIGHLIGHT: Record<string, string> = {
  "interested": "bg-success/20 text-success",
  "expensive": "bg-warning/20 text-warning",
  "competitor": "bg-warning/20 text-warning",
  "demo": "bg-info/20 text-info",
  "budget": "bg-info/20 text-info",
  "objection": "bg-destructive/20 text-destructive",
  "not interested": "bg-destructive/20 text-destructive",
  "callback": "bg-primary/20 text-primary",
  "follow up": "bg-primary/20 text-primary"
};

// Mock transcript segments for each call
const MOCK_TRANSCRIPT = (call: Call) => [
  { at: "0:00", speaker: "agent", text: `Hi ${call.customerName}, this is calling from Crownco. Is this a good time to talk?`, sentiment: "neutral" },
  { at: "0:08", speaker: "customer", text: "Yes, but please be quick. What is this about?", sentiment: "neutral" },
  { at: "0:15", speaker: "agent", text: "I wanted to share our new product offering specifically designed for businesses like yours. We're seeing 40% growth.", sentiment: "positive" },
  { at: "0:32", speaker: "customer", text: "That sounds expensive. We already have a competitor solution.", sentiment: "negative" },
  { at: "0:42", speaker: "agent", text: "I understand. We actually offer better pricing and a free 14-day trial. Can I schedule a demo?", sentiment: "positive" },
  { at: "1:01", speaker: "customer", text: "Maybe. Send me the details and I'll think about it. Call me back next week.", sentiment: "neutral" },
  { at: "1:18", speaker: "agent", text: "Perfect! I'll send a calendar invite for next Tuesday. Have a great day!", sentiment: "positive" }
];

export default function HRCallsPage() {
  const ds = useDataset();
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<Call | null>(null);
  const [playing, setPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          setPlaying(false);
          return 100;
        }
        return p + 2;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [playing]);

  const filtered = ds.calls.filter((c) =>
    !search || c.customerName.toLowerCase().includes(search.toLowerCase())
  );

  const totalTalkTime = ds.calls.reduce((s, c) => s + c.durationSec, 0);
  const qualifiedCalls = ds.calls.filter((c) => c.outcome === "qualified").length;
  const objectionCalls = ds.calls.filter((c) => c.hasObjection).length;
  const avgScore = Math.round(ds.calls.reduce((s, c) => s + c.aiScore, 0) / Math.max(1, ds.calls.length));

  // Daily call trend
  const trendByDay = Array.from({ length: 14 }, (_, i) => {
    const date = new Date(Date.now() - (13 - i) * 86400_000);
    const dayStr = date.toISOString().slice(0, 10);
    const dayCalls = ds.calls.filter((c) => c.startedAt.startsWith(dayStr));
    return {
      day: date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
      calls: dayCalls.length,
      talkTime: Math.round(dayCalls.reduce((s, c) => s + c.durationSec, 0) / 60),
      qualified: dayCalls.filter((c) => c.outcome === "qualified").length
    };
  });

  // Funnel
  const funnel = [
    { label: "Calls made", value: ds.calls.length },
    { label: "Connected", value: Math.round(ds.calls.length * 0.78) },
    { label: "Interested", value: ds.calls.filter((c) => c.outcome === "interested" || c.outcome === "qualified").length },
    { label: "Qualified", value: qualifiedCalls },
    { label: "Demos booked", value: Math.round(qualifiedCalls * 0.6) }
  ];

  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const HOURS = Array.from({ length: 12 }, (_, i) => `${i + 9}`);
  const heatmap = DAYS.flatMap((day, d) =>
    HOURS.map((hr, h) => ({
      x: hr,
      y: day,
      value: ds.calls.filter((c) => {
        const dt = new Date(c.startedAt);
        return dt.getDay() === d && dt.getHours() === (h + 9);
      }).length
    }))
  );

  // Top performers
  const topAgents = ds.employees
    .filter((e) => e.department === "Sales")
    .map((e) => ({
      emp: e,
      calls: ds.calls.filter((c) => c.employeeId === e.id).length,
      talkTime: ds.calls.filter((c) => c.employeeId === e.id).reduce((s, c) => s + c.durationSec, 0),
      qualified: ds.calls.filter((c) => c.employeeId === e.id && c.outcome === "qualified").length,
      avgScore: Math.round(ds.calls.filter((c) => c.employeeId === e.id).reduce((s, c) => s + c.aiScore, 0) / Math.max(1, ds.calls.filter((c) => c.employeeId === e.id).length))
    }))
    .sort((a, b) => b.qualified - a.qualified)
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calls & Meeting Analytics"
        description="AI-powered call quality, sentiment, and coaching insights"
        actions={
          <Button variant="brand" size="sm">
            <ScanLine className="h-4 w-4" />
            AI insights report
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Calls today" value={ds.calls.filter((c) => new Date(c.startedAt).toDateString() === new Date().toDateString()).length} format="number" icon={PhoneCall} accent="primary" />
        <KpiCard label="Total talk time" value={Math.round(totalTalkTime / 3600)} suffix="hr" format="number" icon={Volume2} accent="info" />
        <KpiCard label="Qualified leads" value={qualifiedCalls} format="number" icon={Target} accent="success" delta={12.4} />
        <KpiCard label="Avg AI quality" value={avgScore} suffix="/100" format="number" icon={Sparkles} accent="warning" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard title="Call activity trend" description="14-day call volume + talk time" className="lg:col-span-2">
          <SeriesAreaChart
            data={trendByDay}
            xKey="day"
            series={[
              { key: "calls", label: "Calls", color: "hsl(var(--primary))" },
              { key: "qualified", label: "Qualified", color: "hsl(var(--success))" }
            ]}
            height={260}
          />
        </SectionCard>

        <SectionCard title="Sales funnel" description="Lead-qualification ratio">
          <FunnelChart data={funnel} />
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Activity heatmap" description="Call volume by hour & day-of-week">
          <Heatmap data={heatmap} xLabels={HOURS} yLabels={DAYS} />
        </SectionCard>

        <SectionCard title="Team ranking" description="Top sales agents by qualified leads">
          <div className="space-y-2">
            {topAgents.slice(0, 6).map((a, i) => (
              <div key={a.emp.id} className="flex items-center gap-3 rounded-xl border bg-card p-3">
                <div className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold",
                  i === 0 ? "bg-warning/20 text-warning" :
                  i === 1 ? "bg-muted text-foreground" :
                  i === 2 ? "bg-amber-700/20 text-amber-700" :
                  "bg-muted text-muted-foreground"
                )}>
                  #{i + 1}
                </div>
                <Avatar className="h-9 w-9">
                  <AvatarImage src={a.emp.avatar} alt={a.emp.fullName} />
                  <AvatarFallback className="text-xs">{initials(a.emp.fullName)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{a.emp.fullName}</div>
                  <div className="text-[10px] text-muted-foreground">
                    {a.calls} calls · {Math.round(a.talkTime / 60)}m talk · {a.avgScore}/100
                  </div>
                </div>
                <Badge variant="success">{a.qualified} qual</Badge>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <Tabs defaultValue="recent">
        <TabsList>
          <TabsTrigger value="recent">Recent calls</TabsTrigger>
          <TabsTrigger value="objections">Objection detection</TabsTrigger>
          <TabsTrigger value="coaching">AI coaching</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative max-w-sm flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by customer..." className="pl-9" />
            </div>
            <Button size="sm" variant="outline"><Filter className="h-4 w-4" />Filter</Button>
          </div>

          <div className="space-y-2">
            {filtered.slice(0, 12).map((c) => {
              const emp = ds.employees.find((e) => e.id === c.employeeId);
              const SentimentIcon = SENTIMENT_ICON[c.sentiment];
              return (
                <Card
                  key={c.id}
                  className="cursor-pointer p-4 transition-all hover:border-primary/30 hover:shadow-elevated"
                  onClick={() => { setSelected(c); setProgress(0); setPlaying(false); }}
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={emp?.avatar} alt={emp?.fullName} />
                      <AvatarFallback>{initials(emp?.fullName || "AG")}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{c.customerName}</span>
                        <Badge variant="outline" className="text-[10px]">{c.outcome.replace("_", " ")}</Badge>
                        <span className={cn("flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px]", SENTIMENT_COLOR[c.sentiment])}>
                          <SentimentIcon className="h-2.5 w-2.5" />
                          {c.sentiment}
                        </span>
                        {c.hasObjection && (
                          <Badge variant="warning" className="text-[10px]">
                            <AlertTriangle className="mr-1 h-2.5 w-2.5" />
                            Objection
                          </Badge>
                        )}
                      </div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {emp?.fullName} · {c.customerPhone} · {new Date(c.startedAt).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium tabular-nums">{formatDuration(c.durationSec)}</div>
                      <div className="text-xs text-muted-foreground">{c.aiScore}/100</div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="objections" className="space-y-3">
          <SectionCard
            title="Objection detection"
            description="Calls where customer raised concerns"
            icon={<AlertTriangle className="h-4 w-4 text-warning" />}
          >
            <div className="space-y-2">
              {ds.calls.filter((c) => c.hasObjection).slice(0, 10).map((c) => {
                const emp = ds.employees.find((e) => e.id === c.employeeId);
                return (
                  <Card key={c.id} className="p-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={emp?.avatar} alt={emp?.fullName} />
                        <AvatarFallback className="text-xs">{initials(emp?.fullName || "")}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{emp?.fullName}</span>
                          <span className="text-xs text-muted-foreground">→ {c.customerName}</span>
                        </div>
                        <div className="mt-0.5 flex flex-wrap gap-1">
                          {c.keywords.filter((k) => ["expensive", "competitor", "not interested", "objection"].some((o) => k.includes(o))).slice(0, 3).map((k) => (
                            <span key={k} className={cn("rounded px-1.5 py-0.5 text-[10px]", KEYWORDS_HIGHLIGHT[k] || "bg-warning/10 text-warning")}>
                              "{k}"
                            </span>
                          ))}
                        </div>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => { setSelected(c); setProgress(0); }}>
                        Review
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="coaching" className="space-y-3">
          <SectionCard
            title="AI Sales Coach"
            description="Personalized coaching tips for each agent"
            icon={<Sparkles className="h-4 w-4 text-primary" />}
          >
            <div className="grid gap-3 md:grid-cols-2">
              {topAgents.slice(0, 6).map((a, i) => (
                <div key={a.emp.id} className="rounded-2xl border bg-card p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={a.emp.avatar} alt={a.emp.fullName} />
                      <AvatarFallback>{initials(a.emp.fullName)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-semibold">{a.emp.fullName}</div>
                      <div className="text-[10px] text-muted-foreground">AI score: {a.avgScore}/100</div>
                    </div>
                  </div>
                  <div className="mt-3 rounded-xl bg-primary/[0.04] p-3">
                    <div className="flex items-start gap-1.5">
                      <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                      <p className="text-xs text-primary">
                        {[
                          "Your calls average 2:30 — try opening with a stronger value prop in first 20s. Top closers see 25% lift.",
                          "You handle price objections well but rarely ask for the commitment. Add a closing question in last 30s.",
                          "Sentiment dips when customer mentions competitor. Practice the 'feel-felt-found' framework next.",
                          "Best window: 11 AM – 2 PM (28% higher qualify rate). Schedule key calls then.",
                          "You spoke 67% of the time — target 40-50%. Listening signals trust.",
                          "Follow-up SLA averaged 4.2 hours this week. Aim for under 1 hour to boost conversion."
                        ][i]}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>

      {/* Call Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        {selected && (
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <PhoneCall className="h-5 w-5 text-primary" />
                Call analysis — {selected.customerName}
              </DialogTitle>
              <DialogDescription>
                {ds.employees.find((e) => e.id === selected.employeeId)?.fullName} · {selected.customerPhone} ·{" "}
                {new Date(selected.startedAt).toLocaleString("en-IN")}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Audio player UI */}
              <Card className="bg-gradient-to-br from-primary/10 via-card to-accent/10 p-4">
                <div className="flex items-center gap-4">
                  <Button
                    size="icon"
                    variant="brand"
                    className="h-12 w-12 rounded-full"
                    onClick={() => setPlaying((p) => !p)}
                  >
                    {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                  </Button>
                  <div className="flex-1">
                    <div className="flex items-end gap-0.5 h-10 mb-1">
                      {Array.from({ length: 60 }).map((_, i) => {
                        const isPlayed = (i / 60) * 100 < progress;
                        const heightSeed = Math.sin(i * 0.5) * Math.cos(i * 0.3);
                        const height = 30 + Math.abs(heightSeed) * 70;
                        return (
                          <motion.div
                            key={i}
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{ delay: i * 0.01 }}
                            className={cn(
                              "flex-1 rounded-sm transition-colors",
                              isPlayed ? "bg-primary" : "bg-muted-foreground/20"
                            )}
                            style={{ height: `${height}%` }}
                          />
                        );
                      })}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground tabular-nums">
                      <span>{formatDuration(Math.round((progress / 100) * selected.durationSec))}</span>
                      <span>{formatDuration(selected.durationSec)}</span>
                    </div>
                  </div>
                  <Headphones className="h-5 w-5 text-muted-foreground" />
                </div>
              </Card>

              {/* AI Scorecard */}
              <div className="grid gap-3 md:grid-cols-4">
                <Card className="p-3">
                  <div className="text-[10px] uppercase text-muted-foreground">AI Quality</div>
                  <div className="mt-1 text-2xl font-bold text-primary tabular-nums">{selected.aiScore}</div>
                  <Progress value={selected.aiScore} className="mt-1 h-1.5" />
                </Card>
                <Card className="p-3">
                  <div className="text-[10px] uppercase text-muted-foreground">Sentiment</div>
                  <div className={cn("mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs", SENTIMENT_COLOR[selected.sentiment])}>
                    {React.createElement(SENTIMENT_ICON[selected.sentiment], { className: "h-3 w-3" })}
                    {selected.sentiment}
                  </div>
                </Card>
                <Card className="p-3">
                  <div className="text-[10px] uppercase text-muted-foreground">Outcome</div>
                  <div className="mt-1 text-sm font-semibold capitalize">{selected.outcome.replace("_", " ")}</div>
                </Card>
                <Card className="p-3">
                  <div className="text-[10px] uppercase text-muted-foreground">Duration</div>
                  <div className="mt-1 text-sm font-semibold tabular-nums">{formatDuration(selected.durationSec)}</div>
                </Card>
              </div>

              {/* Transcript */}
              <Card className="p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <Mic className="h-4 w-4" />
                  AI Transcript
                </div>
                <div className="space-y-2">
                  {MOCK_TRANSCRIPT(selected).map((seg, i) => (
                    <div key={i} className="flex gap-3">
                      <span className="w-12 text-[10px] text-muted-foreground tabular-nums pt-1">{seg.at}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={seg.speaker === "agent" ? "default" : "outline"} className="text-[9px] uppercase">
                            {seg.speaker}
                          </Badge>
                          <span className={cn("h-1.5 w-1.5 rounded-full",
                            seg.sentiment === "positive" ? "bg-success" :
                            seg.sentiment === "negative" ? "bg-destructive" : "bg-muted-foreground"
                          )} />
                        </div>
                        <p className="mt-1 text-sm">
                          {seg.text.split(" ").map((word, j) => {
                            const lower = word.toLowerCase().replace(/[.,!?]/g, "");
                            const matchedKey = Object.keys(KEYWORDS_HIGHLIGHT).find((k) => lower === k.toLowerCase() || (k.includes(" ") && seg.text.toLowerCase().includes(k)));
                            const cls = matchedKey ? KEYWORDS_HIGHLIGHT[matchedKey] : null;
                            return (
                              <React.Fragment key={j}>
                                {cls ? (
                                  <span className={cn("rounded px-1 py-0.5", cls)}>{word}</span>
                                ) : word}{" "}
                              </React.Fragment>
                            );
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* AI Summary & Coaching */}
              <Card className="border-primary/30 bg-primary/[0.03] p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <Sparkles className="h-4 w-4" />
                  Crowny's analysis & coaching
                </div>
                <div className="mt-2 space-y-2 text-xs">
                  <div className="flex items-start gap-1.5">
                    <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-success" />
                    <span>Customer showed initial interest but raised cost objection at 0:32</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-success" />
                    <span>Agent handled objection well with trial offer counter-pitch</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-warning" />
                    <span>Missed opportunity to ask discovery questions about budget</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <Zap className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                    <span><strong>Action:</strong> Schedule demo and send pricing brochure within 2 hours</span>
                  </div>
                </div>
              </Card>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
