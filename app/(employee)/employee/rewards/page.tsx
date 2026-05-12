"use client";

import * as React from "react";
import {
  Award,
  Crown,
  Flame,
  Gift,
  Medal,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Wallet,
  Zap
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useDataset } from "@/hooks/use-dataset";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { redeemGiftCard } from "@/lib/store/dataSlice";
import { cn, formatNumber, initials, formatCurrency } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { CelebrationModal } from "@/components/rewards/celebration-modal";
import { toast } from "sonner";
import type { Achievement } from "@/types";

const TIER_COLORS = {
  bronze: "from-amber-600 to-orange-600 text-amber-50",
  silver: "from-slate-400 to-slate-500 text-white",
  gold: "from-amber-400 to-yellow-500 text-amber-950",
  platinum: "from-cyan-400 via-fuchsia-400 to-violet-500 text-white"
};

export default function EmployeeRewardsPage() {
  const ds = useDataset();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const me = ds.employees.find((e) => e.fullName === user?.name) ?? ds.employees[0];
  const [celebOpen, setCelebOpen] = React.useState(false);
  const [unlocked, setUnlocked] = React.useState<Achievement | null>(null);

  const myRewards = ds.rewards.filter((r) => r.employeeId === me.id);
  const totalPoints = myRewards.reduce((s, r) => s + r.points, 0);
  const totalEarnings = myRewards.reduce((s, r) => s + (r.valueINR ?? 0), 0);

  // Leaderboard
  const board = ds.employees
    .map((e) => ({
      emp: e,
      pts: ds.rewards.filter((r) => r.employeeId === e.id).reduce((s, r) => s + Math.max(0, r.points), 0)
    }))
    .sort((a, b) => b.pts - a.pts)
    .slice(0, 10);
  const myRank = board.findIndex((b) => b.emp.id === me.id) + 1 || ds.employees.length;

  const challenges = [
    { id: "c1", title: "Call streak", description: "Make 50+ calls every day for 5 days", progress: 38, target: 50, reward: 500, icon: Flame, color: "destructive" },
    { id: "c2", title: "Lead qualifier", description: "Qualify 15 leads this week", progress: 11, target: 15, reward: 800, icon: Target, color: "primary" },
    { id: "c3", title: "Perfect attendance", description: "Zero late marks for 30 days", progress: 22, target: 30, reward: 1500, icon: Star, color: "warning" },
    { id: "c4", title: "Team player", description: "Help 5 teammates close deals", progress: 3, target: 5, reward: 600, icon: Trophy, color: "success" }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Rewards & Recognition"
        description="Earn points, redeem rewards, climb the leaderboard"
        actions={
          <Button variant="brand" size="sm">
            <Wallet className="h-4 w-4" />
            Wallet
          </Button>
        }
      />

      <Card className="overflow-hidden border-0 bg-gradient-to-br from-primary via-primary to-accent text-primary-foreground">
        <div className="relative grid gap-6 p-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 text-sm opacity-90">
              <Sparkles className="h-4 w-4" />
              Reward wallet
            </div>
            <div className="mt-3 flex items-baseline gap-3">
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="text-6xl font-bold tabular-nums"
              >
                {formatNumber(Math.max(0, totalPoints))}
              </motion.span>
              <span className="text-xl opacity-80">XP</span>
            </div>
            <div className="mt-3 flex items-center gap-3 text-sm">
              <Badge className="bg-white/15 text-white border-white/20">
                Rank #{myRank} of {ds.employees.length}
              </Badge>
              <span className="opacity-90">{formatCurrency(totalEarnings)} earned in rewards</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <div className="text-xs opacity-80">Current streak</div>
              <div className="mt-1 flex items-center gap-2 text-2xl font-bold">
                <Flame className="h-6 w-6" />
                {me.streak} days
              </div>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <div className="text-xs opacity-80">Performance score</div>
              <div className="mt-1 text-2xl font-bold tabular-nums">{me.performanceScore}/100</div>
            </div>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="leaderboard">
        <TabsList>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="catalog">Redeem catalog</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="leaderboard">
          <SectionCard
            title="Top performers"
            description="This month's top earners"
            icon={<Trophy className="h-4 w-4 text-warning" />}
          >
            <div className="space-y-2">
              {board.map((b, i) => {
                const isMe = b.emp.id === me.id;
                return (
                  <motion.div
                    key={b.emp.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl border p-3 transition-colors",
                      isMe ? "border-primary bg-primary/5" : "bg-card hover:bg-muted/30"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-xl font-bold",
                        i === 0 && "bg-gradient-to-br from-amber-400 to-yellow-500 text-amber-950",
                        i === 1 && "bg-gradient-to-br from-slate-300 to-slate-500 text-white",
                        i === 2 && "bg-gradient-to-br from-amber-600 to-orange-700 text-white",
                        i > 2 && "bg-muted text-muted-foreground"
                      )}
                    >
                      {i === 0 ? <Crown className="h-5 w-5" /> : `#${i + 1}`}
                    </div>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={b.emp.avatar} alt={b.emp.fullName} />
                      <AvatarFallback>{initials(b.emp.fullName)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate font-semibold">{b.emp.fullName}</span>
                        {isMe && <Badge variant="default" className="text-[9px]">YOU</Badge>}
                      </div>
                      <div className="text-xs text-muted-foreground">{b.emp.designation}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold tabular-nums text-primary">
                        {formatNumber(b.pts)}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">XP</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="achievements">
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {(ds.achievements[me.id] ?? []).map((a: Achievement, i: number) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => {
                  if (a.unlocked) return;
                  setUnlocked({ ...a, unlocked: true });
                  setCelebOpen(true);
                }}
              >
                <Card className={cn(
                  "relative overflow-hidden p-5 transition-all cursor-pointer hover:shadow-elevated",
                  !a.unlocked && "opacity-60 hover:opacity-100"
                )}>
                  <div
                    className={cn(
                      "absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br opacity-20 blur-xl",
                      TIER_COLORS[a.tier]
                    )}
                  />
                  <div
                    className={cn(
                      "relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br shadow-soft",
                      TIER_COLORS[a.tier]
                    )}
                  >
                    {a.unlocked ? <Trophy className="h-7 w-7" /> : <Medal className="h-7 w-7 opacity-70" />}
                  </div>
                  <div className="mt-3 text-sm font-semibold">{a.name}</div>
                  <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2">{a.description}</p>
                  {!a.unlocked && (
                    <>
                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(a.progress / a.target) * 100}%` }}
                          transition={{ duration: 0.6, delay: i * 0.04 }}
                          className="h-full bg-brand-gradient"
                        />
                      </div>
                      <div className="mt-1 text-[10px] tabular-nums text-muted-foreground">
                        {a.progress} / {a.target}
                      </div>
                    </>
                  )}
                  {a.unlocked && (
                    <Badge variant="success" className="mt-3 text-[9px]">
                      Unlocked
                    </Badge>
                  )}
                  <div className="mt-2 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                    {a.tier} tier
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="challenges">
          <div className="grid gap-4 md:grid-cols-2">
            {challenges.map((c) => {
              const Icon = c.icon;
              const pct = (c.progress / c.target) * 100;
              return (
                <SectionCard key={c.id}>
                  <div className="flex items-start gap-3">
                    <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl", `bg-${c.color}/10 text-${c.color}`)}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold">{c.title}</span>
                        <Badge variant="default" className="text-[10px]">
                          +{c.reward} XP
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{c.description}</p>
                      <div className="mt-3 flex items-center gap-2">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            className="h-full bg-brand-gradient"
                          />
                        </div>
                        <span className="text-xs font-bold tabular-nums">
                          {c.progress}/{c.target}
                        </span>
                      </div>
                    </div>
                  </div>
                </SectionCard>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="catalog">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ds.giftCards.map((card) => {
              const canRedeem = Math.max(0, totalPoints) >= card.pointsCost && card.available;
              return (
                <Card key={card.id} className="overflow-hidden transition-all hover:shadow-elevated">
                  <div className="relative aspect-video bg-gradient-to-br from-primary/20 via-accent/20 to-warning/20">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-3xl font-bold tracking-wide text-foreground/70">
                        {card.brand}
                      </div>
                    </div>
                    <Badge className="absolute right-3 top-3 bg-white/90 text-foreground">
                      {formatCurrency(card.valueINR)}
                    </Badge>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold">{card.title}</h3>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Digital voucher · Auto-delivered to email
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm font-bold text-primary">
                        <Sparkles className="h-4 w-4" />
                        {formatNumber(card.pointsCost)} XP
                      </div>
                      <Button
                        size="sm"
                        variant={canRedeem ? "brand" : "outline"}
                        disabled={!canRedeem}
                        onClick={() => {
                          dispatch(redeemGiftCard({ employeeId: me.id, cardId: card.id }));
                          toast.success(`${card.title} redeemed! Check email in 5 min.`);
                        }}
                      >
                        <Gift className="h-4 w-4" />
                        Redeem
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-2">
          {myRewards.slice(0, 20).map((r) => (
            <Card key={r.id} className="p-3">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl",
                  r.points > 0 ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                )}>
                  {r.type === "badge" ? <Trophy className="h-5 w-5" /> :
                   r.type === "coins" ? <Zap className="h-5 w-5" /> :
                   r.type === "gift_card" ? <Gift className="h-5 w-5" /> :
                   <Star className="h-5 w-5" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">{r.title}</div>
                  <div className="truncate text-xs text-muted-foreground">{r.description}</div>
                </div>
                <div className="text-right">
                  <div className={cn(
                    "text-sm font-bold tabular-nums",
                    r.points > 0 ? "text-success" : "text-muted-foreground"
                  )}>
                    {r.points > 0 ? "+" : ""}{r.points} XP
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {new Date(r.awardedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <CelebrationModal
        open={celebOpen}
        onOpenChange={setCelebOpen}
        achievement={unlocked ? {
          name: unlocked.name,
          description: unlocked.description,
          tier: unlocked.tier,
          points: unlocked.tier === "platinum" ? 2000 : unlocked.tier === "gold" ? 1000 : unlocked.tier === "silver" ? 500 : 200
        } : undefined}
      />
    </div>
  );
}
