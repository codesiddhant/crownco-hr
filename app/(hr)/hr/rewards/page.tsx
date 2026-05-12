"use client";

import * as React from "react";
import {
  Award,
  Crown,
  Gift,
  PlusCircle,
  Sparkles,
  Star,
  Trophy,
  Users,
  Zap,
  TrendingUp
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { SectionCard } from "@/components/shared/section-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useDataset } from "@/hooks/use-dataset";
import { useAppDispatch } from "@/lib/store/hooks";
import { awardReward } from "@/lib/store/dataSlice";
import { cn, formatNumber, formatCurrency, initials } from "@/lib/utils";
import { motion } from "framer-motion";
import { toast } from "sonner";
import type { RewardEvent } from "@/types";

export default function HRRewardsPage() {
  const ds = useDataset();
  const dispatch = useAppDispatch();
  const [awardOpen, setAwardOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    employeeId: "",
    type: "coins" as RewardEvent["type"],
    title: "",
    description: "",
    points: 500,
    valueINR: 0
  });

  const totalAwarded = ds.rewards.filter((r) => r.points > 0).reduce((s, r) => s + r.points, 0);
  const totalValue = ds.rewards.reduce((s, r) => s + (r.valueINR ?? 0), 0);
  const totalRecipients = new Set(ds.rewards.map((r) => r.employeeId)).size;

  const topEmployees = ds.employees
    .map((e) => ({
      emp: e,
      pts: ds.rewards.filter((r) => r.employeeId === e.id).reduce((s, r) => s + Math.max(0, r.points), 0)
    }))
    .sort((a, b) => b.pts - a.pts)
    .slice(0, 10);

  const submitAward = () => {
    if (!form.employeeId || !form.title) {
      toast.error("Please select employee and add title");
      return;
    }
    const reward: RewardEvent = {
      id: `rw_hr_${Date.now()}`,
      employeeId: form.employeeId,
      type: form.type,
      title: form.title,
      description: form.description || "Excellent work!",
      points: form.points,
      valueINR: form.valueINR > 0 ? form.valueINR : undefined,
      awardedAt: new Date().toISOString(),
      awardedBy: "HR Admin",
      icon: "Trophy"
    };
    dispatch(awardReward(reward));
    setAwardOpen(false);
    toast.success("Reward sent! Employee notified via WhatsApp.");
    setForm({
      employeeId: "",
      type: "coins",
      title: "",
      description: "",
      points: 500,
      valueINR: 0
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Rewards & Recognition"
        description="Reward, gamify, and motivate the workforce"
        actions={
          <Button variant="brand" onClick={() => setAwardOpen(true)}>
            <PlusCircle className="h-4 w-4" />
            Give reward
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total points awarded" value={totalAwarded} format="number" icon={Sparkles} accent="primary" />
        <KpiCard label="Total reward value" value={totalValue} format="currency" icon={Gift} accent="success" />
        <KpiCard label="Recipients" value={totalRecipients} format="number" icon={Users} accent="info" />
        <KpiCard label="Active challenges" value={4} format="number" icon={Trophy} accent="warning" />
      </div>

      <Tabs defaultValue="leaderboard">
        <TabsList>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="recent">Recent rewards</TabsTrigger>
          <TabsTrigger value="catalog">Gift card catalog</TabsTrigger>
          <TabsTrigger value="engine">AI motivation engine</TabsTrigger>
        </TabsList>

        <TabsContent value="leaderboard">
          <SectionCard title="Top performers — Company wide">
            <div className="space-y-2">
              {topEmployees.map((b, i) => (
                <motion.div
                  key={b.emp.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-3 rounded-2xl border bg-card p-3 hover:bg-muted/30"
                >
                  <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl font-bold",
                    i === 0 && "bg-gradient-to-br from-amber-400 to-yellow-500 text-amber-950",
                    i === 1 && "bg-gradient-to-br from-slate-300 to-slate-500 text-white",
                    i === 2 && "bg-gradient-to-br from-amber-600 to-orange-700 text-white",
                    i > 2 && "bg-muted text-muted-foreground"
                  )}>
                    {i === 0 ? <Crown className="h-5 w-5" /> : `#${i + 1}`}
                  </div>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={b.emp.avatar} alt={b.emp.fullName} />
                    <AvatarFallback>{initials(b.emp.fullName)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold">{b.emp.fullName}</div>
                    <div className="text-xs text-muted-foreground">
                      {b.emp.designation} · {b.emp.department}
                    </div>
                  </div>
                  <div className="hidden text-right md:block">
                    <div className="text-sm font-medium">{b.emp.performanceScore}/100</div>
                    <div className="text-[10px] text-muted-foreground">Performance</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold tabular-nums text-primary">{formatNumber(b.pts)}</div>
                    <div className="text-[10px] uppercase text-muted-foreground">XP</div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setForm((f) => ({ ...f, employeeId: b.emp.id }));
                      setAwardOpen(true);
                    }}
                  >
                    <Award className="h-4 w-4" />
                    Reward
                  </Button>
                </motion.div>
              ))}
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="recent" className="space-y-2">
          {ds.rewards.slice(0, 20).map((r) => {
            const emp = ds.employees.find((e) => e.id === r.employeeId);
            if (!emp) return null;
            return (
              <Card key={r.id} className="p-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={emp.avatar} alt={emp.fullName} />
                    <AvatarFallback>{initials(emp.fullName)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold">{emp.fullName}</div>
                    <div className="truncate text-xs text-muted-foreground">{r.title}</div>
                  </div>
                  <Badge variant={r.type === "gift_card" ? "success" : "default"} className="text-[10px] capitalize">
                    {r.type.replace("_", " ")}
                  </Badge>
                  <div className="text-right">
                    <div className={cn("text-sm font-bold", r.points > 0 ? "text-success" : "text-muted-foreground")}>
                      {r.points > 0 ? "+" : ""}{r.points} XP
                    </div>
                    {r.valueINR && (
                      <div className="text-[10px] text-muted-foreground">{formatCurrency(r.valueINR)}</div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="catalog">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ds.giftCards.map((card) => (
              <Card key={card.id} className="overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-primary/20 via-accent/20 to-warning/20 p-6">
                  <div className="flex h-full items-center justify-center text-3xl font-bold text-foreground/70">
                    {card.brand}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{card.title}</h3>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{formatNumber(card.pointsCost)} XP</span>
                    <span className="font-bold text-primary">{formatCurrency(card.valueINR)}</span>
                  </div>
                  <Badge variant={card.available ? "success" : "outline"} className="mt-2 text-[10px]">
                    {card.available ? "Available" : "Out of stock"}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="engine">
          <SectionCard
            title="AI Motivation Engine"
            description="Crowny generates personalized motivation messages for low performers"
            icon={<Sparkles className="h-4 w-4 text-primary" />}
          >
            <div className="space-y-3">
              {ds.employees.slice(0, 5).map((e, i) => (
                <div key={e.id} className="rounded-2xl border bg-card p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={e.avatar} alt={e.fullName} />
                      <AvatarFallback>{initials(e.fullName)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="text-sm font-semibold">{e.fullName}</div>
                      <div className="rounded-2xl bg-primary/[0.03] p-3 mt-2 text-sm italic">
                        {[
                          `"${e.fullName.split(" ")[0]}, you're just 12 calls away from your best week ever. One push and you'll unlock the 'Closer' badge worth ₹500."`,
                          `"Hey ${e.fullName.split(" ")[0]}! Your conversion ratio improved 15% this week. Keep this momentum and you'll be in the top 5 by Friday."`,
                          `"${e.fullName.split(" ")[0]}, your team needs your follow-up energy back. Last week you had 95% follow-up discipline - we know you can do it!"`,
                          `"Your morning call-quality scores are 23% higher than afternoon. Schedule your important calls before 11 AM to maximize your performance."`,
                          `"You're 3 days away from a 30-day perfect attendance streak. That unlocks ₹1500 worth of rewards!"`
                        ][i]}
                      </div>
                      <div className="mt-2 flex gap-2">
                        <Button size="sm" variant="outline">Send via WhatsApp</Button>
                        <Button size="sm" variant="ghost">Regenerate</Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>

      <Dialog open={awardOpen} onOpenChange={setAwardOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Give a reward</DialogTitle>
            <DialogDescription>Recognize outstanding work</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Employee</Label>
              <Select value={form.employeeId} onValueChange={(v) => setForm((f) => ({ ...f, employeeId: v }))}>
                <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
                <SelectContent className="max-h-72">
                  {ds.employees.slice(0, 80).map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.fullName} · {e.designation}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Reward type</Label>
              <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v as RewardEvent["type"] }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="badge">Achievement badge</SelectItem>
                  <SelectItem value="coins">Reward coins</SelectItem>
                  <SelectItem value="gift_card">Gift card</SelectItem>
                  <SelectItem value="bonus">Cash bonus</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                placeholder="e.g. Top closer of the week"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Note (optional)</Label>
              <Textarea
                rows={2}
                placeholder="Why this reward..."
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>XP points</Label>
                <Input
                  type="number"
                  value={form.points}
                  onChange={(e) => setForm((f) => ({ ...f, points: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Value (₹)</Label>
                <Input
                  type="number"
                  value={form.valueINR}
                  onChange={(e) => setForm((f) => ({ ...f, valueINR: Number(e.target.value) }))}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setAwardOpen(false)}>Cancel</Button>
              <Button variant="brand" onClick={submitAward}>
                <Sparkles className="h-4 w-4" />
                Send reward
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
