"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Briefcase, Building2, Crown, MapPinned, ShieldCheck, UsersRound, ArrowRight, Sparkles } from "lucide-react";
import { Logo } from "@/components/branding/logo";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn, avatarUrl } from "@/lib/utils";
import { useAppDispatch } from "@/lib/store/hooks";
import { login, setRole } from "@/lib/store/authSlice";
import type { Role } from "@/types";

const ROLES: {
  role: Role;
  name: string;
  email: string;
  title: string;
  desc: string;
  href: string;
  icon: React.ElementType;
  accent: string;
}[] = [
  {
    role: "hr_admin",
    name: "Ananya Sharma",
    email: "ananya.sharma@crownco.ai",
    title: "HR Admin",
    desc: "Workforce intelligence, attendance, leaves, payroll, rewards, compliance.",
    href: "/hr/dashboard",
    icon: Crown,
    accent: "from-primary to-info"
  },
  {
    role: "manager",
    name: "Rohan Verma",
    email: "rohan.verma@crownco.ai",
    title: "Team Manager",
    desc: "Team KPIs, approvals queue, performance, tasks, leave redistribution.",
    href: "/manager/dashboard",
    icon: UsersRound,
    accent: "from-accent to-info"
  },
  {
    role: "employee",
    name: "Priya Patel",
    email: "priya.patel@crownco.ai",
    title: "Employee",
    desc: "Attendance, leaves, tasks, performance, rewards, WhatsApp reports.",
    href: "/employee/dashboard",
    icon: Briefcase,
    accent: "from-success to-accent"
  },
  {
    role: "field",
    name: "Aniket Kulkarni",
    email: "aniket.kulkarni@crownco.ai",
    title: "Field Employee",
    desc: "Live tracking, visits, route playback, expense capture.",
    href: "/field/dashboard",
    icon: MapPinned,
    accent: "from-warning to-destructive"
  },
  {
    role: "recruiter",
    name: "Nisha Joshi",
    email: "nisha.joshi@crownco.ai",
    title: "Recruiter",
    desc: "Candidate pipeline, AI ranking, interviews, hiring analytics.",
    href: "/recruiter/dashboard",
    icon: Sparkles,
    accent: "from-info to-primary"
  },
  {
    role: "super_admin",
    name: "Vikram Kapoor",
    email: "vikram.kapoor@crownco.ai",
    title: "Super Admin",
    desc: "Multi-org, branches, billing, audit logs, system-wide settings.",
    href: "/superadmin/organizations",
    icon: ShieldCheck,
    accent: "from-foreground to-muted-foreground"
  }
];

export default function SelectRolePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const pickRole = (r: (typeof ROLES)[number]) => {
    dispatch(
      login({
        user: {
          id: `u_${r.role}`,
          name: r.name,
          email: r.email,
          avatar: avatarUrl(r.name),
          role: r.role
        },
        role: r.role
      })
    );
    dispatch(setRole(r.role));
    router.push(r.href);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background py-12">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="flex items-center justify-between">
          <Logo />
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Investor demo · pick a role to explore
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
            Welcome to <span className="text-gradient-brand">Crownco HR</span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground">
            Six role-based portals, 16+ modules, every workflow live with realistic mock data.
            Switch roles anytime from the top navbar once you're in.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ROLES.map((r, idx) => {
            const Icon = r.icon;
            return (
              <motion.div
                key={r.role}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <button
                  onClick={() => pickRole(r)}
                  className="group block w-full text-left"
                >
                  <Card className="relative h-full overflow-hidden p-6 transition-all hover:-translate-y-1 hover:shadow-elevated hover:border-primary/40">
                    <div
                      className={cn(
                        "pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br opacity-30 blur-2xl",
                        r.accent
                      )}
                    />
                    <div className="flex items-start justify-between">
                      <div
                        className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-glow",
                          r.accent
                        )}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                    </div>
                    <div className="mt-5">
                      <div className="text-lg font-semibold">{r.title}</div>
                      <div className="text-xs text-muted-foreground">{r.name}</div>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">{r.desc}</p>
                  </Card>
                </button>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-14 text-center text-xs text-muted-foreground">
          All data is generated locally and stored in your browser. No backend required.
        </div>
      </div>
    </div>
  );
}
