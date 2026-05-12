"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Brain,
  Camera,
  Gift,
  Map,
  Phone,
  ShieldCheck,
  Sparkles,
  Wifi,
  Workflow,
  Zap,
  Trophy,
  PhoneCall,
  Calendar,
  BarChart3
} from "lucide-react";
import { Logo } from "@/components/branding/logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const MODULES = [
  { icon: Map, name: "Geofence Attendance", desc: "Auto check-in via office radius" },
  { icon: Wifi, name: "WiFi Fencing", desc: "SSID + BSSID + anti-spoof" },
  { icon: Camera, name: "Live Selfie + Gesture", desc: "Liveness AI for remote staff" },
  { icon: Brain, name: "AI Productivity", desc: "Daily WhatsApp reports" },
  { icon: Sparkles, name: "AI HR Copilot", desc: "Leave impact, forecasting" },
  { icon: Trophy, name: "Rewards & Gamification", desc: "Gift cards, badges, leaderboards" },
  { icon: Workflow, name: "Tasks & SLA", desc: "Kanban, automations, AI suggestions" },
  { icon: PhoneCall, name: "Call Analytics", desc: "Transcription + AI coaching" },
  { icon: ShieldCheck, name: "Compliance & Audit", desc: "Device binding, IP anomalies" }
];

const LOGOS = ["Rippling", "Deel", "Zoho People", "HubSpot", "Salesforce", "ClickUp"];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[680px] w-[1200px] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />

      {/* Nav */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Logo />
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#modules" className="hover:text-foreground">Modules</a>
          <a href="#ai" className="hover:text-foreground">AI</a>
          <a href="#industries" className="hover:text-foreground">Industries</a>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button variant="brand" size="sm" asChild>
            <Link href="/select-role">
              Open demo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-16 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3 w-3" />
            AI Workforce Operating System · Now in private beta
          </div>
          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
            The HR platform that{" "}
            <span className="text-gradient-brand">runs your workforce</span>, not just records it.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">
            Crownco HR is an AI-powered HRMS built for sales, CRM, and field-force teams.
            Real attendance, AI productivity intelligence, gamified rewards, and an HR copilot —
            all on one platform.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button variant="brand" size="xl" asChild>
              <Link href="/select-role">
                Try interactive demo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link href="/onboarding">Start onboarding</Link>
            </Button>
          </div>
          <div className="mt-10 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <span>Inspired by:</span>
            {LOGOS.map((l) => (
              <span key={l} className="rounded-full border bg-card/50 px-2 py-0.5 backdrop-blur">
                {l}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Hero dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative mx-auto mt-16 max-w-5xl"
        >
          <div className="absolute -inset-12 -z-10 rounded-[36px] bg-brand-gradient opacity-20 blur-3xl" />
          <div className="overflow-hidden rounded-3xl border bg-card shadow-elevated">
            <div className="flex items-center gap-1.5 border-b bg-muted/40 px-4 py-2">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
              <span className="ml-3 text-xs text-muted-foreground">crownco.ai/hr/dashboard</span>
            </div>
            <div className="grid grid-cols-12 gap-3 p-4 text-left">
              <div className="col-span-3 space-y-2 rounded-2xl bg-muted/30 p-3">
                {["Dashboard", "Employees", "Attendance", "Leave", "Tasks", "Rewards", "Payroll", "Settings"].map(
                  (n, i) => (
                    <div
                      key={n}
                      className={
                        "rounded-lg px-2 py-1.5 text-xs " +
                        (i === 0
                          ? "bg-primary text-primary-foreground shadow-soft"
                          : "text-muted-foreground")
                      }
                    >
                      {n}
                    </div>
                  )
                )}
              </div>
              <div className="col-span-9 space-y-3">
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { l: "Active employees", v: "532", c: "text-primary" },
                    { l: "Productivity", v: "84.2", c: "text-success" },
                    { l: "Burnout risk", v: "5", c: "text-warning" },
                    { l: "Attrition risk", v: "8", c: "text-destructive" }
                  ].map((s) => (
                    <div key={s.l} className="rounded-xl border bg-card p-3">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {s.l}
                      </div>
                      <div className={"mt-1 text-xl font-semibold " + s.c}>{s.v}</div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-32 rounded-xl border bg-gradient-to-br from-primary/10 to-info/10 p-3 flex items-end gap-1">
                    {[3, 5, 4, 7, 6, 9, 8, 11, 10, 13, 12, 14].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-md bg-primary/70"
                        style={{ height: `${h * 6}px` }}
                      />
                    ))}
                  </div>
                  <div className="h-32 rounded-xl border bg-gradient-to-br from-accent/10 to-info/10 p-3">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      AI insight
                    </div>
                    <div className="mt-2 text-xs">
                      Bengaluru sales team conversion ↑ <strong className="text-success">14%</strong> this week.
                      Recommend rolling out the 4-touch sequence org-wide.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Zap,
              title: "3 attendance methods",
              desc: "Geofence, WiFi fencing, live selfie + gesture — all anti-spoof verified by AI."
            },
            {
              icon: Brain,
              title: "Daily AI reports",
              desc: "Every employee gets a WhatsApp summary at 7 PM: calls, conversions, ranking, coaching tips."
            },
            {
              icon: Gift,
              title: "Gamified rewards",
              desc: "Leaderboards, badges, gift cards. AI auto-distributes recognition to top performers."
            }
          ].map((f) => {
            const Icon = f.icon;
            return (
              <Card key={f.title} className="p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="mt-4 text-base font-semibold">{f.title}</div>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Modules */}
      <section id="modules" className="relative z-10 mx-auto max-w-7xl px-6 pb-24">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">16 modules. One platform.</h2>
          <p className="mt-2 text-muted-foreground">From attendance to attrition forecasting.</p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {MODULES.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.name}
                className="flex items-start gap-3 rounded-2xl border bg-card p-4 shadow-soft transition-shadow hover:shadow-elevated"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold">{m.name}</div>
                  <div className="text-xs text-muted-foreground">{m.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* AI band */}
      <section id="ai" className="relative z-10 mx-auto max-w-7xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/15 via-info/10 to-accent/15 p-10 text-center">
          <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
          <Brain className="mx-auto h-10 w-10 text-primary" />
          <h2 className="mt-4 text-3xl font-semibold tracking-tight">
            Built on Crownco's self-hosted AI stack
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Whisper for transcription, vLLM for inference, GPU-accelerated analytics — all private,
            all yours. No third-party AI ever sees your employee data.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button variant="brand" size="lg" asChild>
              <Link href="/select-role">
                Explore the demo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section id="industries" className="relative z-10 mx-auto max-w-7xl px-6 pb-24">
        <h3 className="mb-6 text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Built for high-performance teams
        </h3>
        <div className="flex flex-wrap justify-center gap-2">
          {[
            "Real Estate",
            "Sales Teams",
            "Call Centers",
            "Insurance",
            "Field Workforce",
            "Construction",
            "Logistics",
            "Recruitment Agencies",
            "Customer Support"
          ].map((i) => (
            <span
              key={i}
              className="rounded-full border bg-card px-4 py-1.5 text-sm shadow-soft"
            >
              {i}
            </span>
          ))}
        </div>
      </section>

      <footer className="relative z-10 border-t bg-muted/20">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-muted-foreground md:flex-row">
          <Logo showWordmark size={28} />
          <div className="flex items-center gap-4">
            <span>© 2026 Crownco</span>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Status</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
