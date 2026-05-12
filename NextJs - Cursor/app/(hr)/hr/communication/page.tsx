"use client";

import * as React from "react";
import {
  AlertCircle,
  Cake,
  Megaphone,
  MessageSquare,
  PartyPopper,
  PlusCircle,
  Send,
  Sparkles,
  Trophy
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { KpiCard } from "@/components/shared/kpi-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useDataset } from "@/hooks/use-dataset";
import { cn, initials } from "@/lib/utils";
import { toast } from "sonner";
import { motion } from "framer-motion";

const CATEGORY_ICON = {
  company: Megaphone,
  policy: AlertCircle,
  celebration: PartyPopper,
  alert: AlertCircle,
  ai: Sparkles
};

const CATEGORY_TONE = {
  company: "primary",
  policy: "info",
  celebration: "success",
  alert: "warning",
  ai: "primary"
};

export default function HRCommunicationPage() {
  const ds = useDataset();
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({ title: "", body: "", category: "company" });

  // Birthdays this month (simulated)
  const birthdays = ds.employees.slice(0, 6).map((e) => ({
    ...e,
    bdayDate: `${10 + Math.floor(Math.random() * 18)} ${new Date().toLocaleDateString("en-IN", { month: "short" })}`
  }));

  const broadcast = () => {
    setOpen(false);
    toast.success("Announcement broadcasted to all employees");
    setForm({ title: "", body: "", category: "company" });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Internal Communications"
        description="Announcements, celebrations, and alerts"
        actions={
          <Button variant="brand" size="sm" onClick={() => setOpen(true)}>
            <PlusCircle className="h-4 w-4" />
            New announcement
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total announcements" value={ds.announcements.length} format="number" icon={Megaphone} accent="primary" />
        <KpiCard label="Birthdays this month" value={birthdays.length} format="number" icon={Cake} accent="success" />
        <KpiCard label="Polls active" value={3} format="number" icon={MessageSquare} accent="info" />
        <KpiCard label="Reach today" value={total(ds.employees.length, 0.87)} format="number" icon={Send} accent="warning" />
      </div>

      <Tabs defaultValue="announcements">
        <TabsList>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="birthdays">Birthdays</TabsTrigger>
          <TabsTrigger value="polls">Polls</TabsTrigger>
        </TabsList>

        <TabsContent value="announcements" className="space-y-3">
          {ds.announcements.slice(0, 10).map((a, i) => {
            const Icon = CATEGORY_ICON[a.category];
            return (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Card className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl",
                      `bg-${CATEGORY_TONE[a.category]}/10 text-${CATEGORY_TONE[a.category]}`)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold">{a.title}</h3>
                        <Badge variant="outline" className="text-[10px] capitalize">{a.category}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{a.body}</p>
                      <div className="mt-2 flex items-center gap-3 text-xs">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={a.authorAvatar} alt={a.author} />
                          <AvatarFallback className="text-[8px]">{initials(a.author)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{a.author}</span>
                        <span className="text-muted-foreground">·</span>
                        <span className="text-muted-foreground">
                          {new Date(a.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                        </span>
                        <div className="ml-auto flex items-center gap-2">
                          {a.reactions.slice(0, 3).map((r, ri) => (
                            <span key={ri} className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5">
                              <span>{r.emoji}</span>
                              <span className="text-[10px] tabular-nums">{r.count}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </TabsContent>

        <TabsContent value="birthdays" className="space-y-2">
          <SectionCard
            title="Birthdays this month"
            description="Auto-celebrate with team"
            icon={<Cake className="h-4 w-4 text-success" />}
          >
            <div className="grid gap-3 md:grid-cols-2">
              {birthdays.map((b) => (
                <Card key={b.id} className="overflow-hidden">
                  <div className="bg-gradient-to-br from-success/20 to-warning/20 p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 border-2 border-card">
                        <AvatarImage src={b.avatar} alt={b.fullName} />
                        <AvatarFallback>{initials(b.fullName)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-bold">{b.fullName}</div>
                        <div className="text-xs">{b.designation}</div>
                        <div className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-success">
                          <PartyPopper className="h-3 w-3" />
                          {b.bdayDate}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <Button size="sm" variant="outline" className="w-full">
                      <Cake className="h-3.5 w-3.5" />
                      Send wish
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="polls" className="space-y-3">
          {[
            { q: "Hybrid work model preference?", options: [{ label: "Full remote", pct: 32 }, { label: "Hybrid 2-3 days", pct: 54 }, { label: "Full office", pct: 14 }] },
            { q: "Best time for all-hands meeting?", options: [{ label: "Monday 10 AM", pct: 28 }, { label: "Thursday 3 PM", pct: 42 }, { label: "Friday 5 PM", pct: 30 }] }
          ].map((p, i) => (
            <Card key={i} className="p-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">{p.q}</h3>
                <Badge variant="info" className="text-[10px]">Active</Badge>
              </div>
              <div className="mt-3 space-y-2">
                {p.options.map((o) => (
                  <div key={o.label}>
                    <div className="flex justify-between text-xs">
                      <span>{o.label}</span>
                      <span className="font-bold tabular-nums">{o.pct}%</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div className="h-full bg-brand-gradient" style={{ width: `${o.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>New announcement</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Input
                placeholder="Title..."
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>
            <Textarea
              rows={5}
              placeholder="Write your announcement..."
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
            />
            <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="company">Company-wide</SelectItem>
                <SelectItem value="policy">Policy update</SelectItem>
                <SelectItem value="celebration">Celebration</SelectItem>
                <SelectItem value="alert">Alert</SelectItem>
              </SelectContent>
            </Select>
            <div className="rounded-2xl border border-primary/20 bg-primary/[0.03] p-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                <Sparkles className="h-3 w-3" />
                AI suggestion
              </div>
              <p className="mt-1 text-xs">Send between 10-11 AM for highest engagement (94% open rate).</p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="brand" onClick={broadcast}>
                <Send className="h-4 w-4" />
                Broadcast
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function total(base: number, factor: number) {
  return Math.round(base * factor);
}
