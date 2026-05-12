"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Briefcase, Check, ChevronDown, Crown, MapPinned, ShieldCheck, Sparkles, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { login, setRole } from "@/lib/store/authSlice";
import { avatarUrl, cn } from "@/lib/utils";
import { ROLE_HOME, ROLE_TITLE } from "@/lib/navigation";
import type { Role } from "@/types";

const ROLE_OPTIONS: { role: Role; icon: React.ElementType; name: string; email: string }[] = [
  { role: "hr_admin", icon: Crown, name: "Ananya Sharma", email: "ananya.sharma@crownco.ai" },
  { role: "manager", icon: UsersRound, name: "Rohan Verma", email: "rohan.verma@crownco.ai" },
  { role: "employee", icon: Briefcase, name: "Priya Patel", email: "priya.patel@crownco.ai" },
  { role: "field", icon: MapPinned, name: "Aniket Kulkarni", email: "aniket.kulkarni@crownco.ai" },
  { role: "recruiter", icon: Sparkles, name: "Nisha Joshi", email: "nisha.joshi@crownco.ai" },
  { role: "super_admin", icon: ShieldCheck, name: "Vikram Kapoor", email: "vikram.kapoor@crownco.ai" }
];

export function RoleSwitcher() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentRole = useAppSelector((s) => s.auth.role);
  const current = ROLE_OPTIONS.find((r) => r.role === currentRole) ?? ROLE_OPTIONS[0];

  const switchTo = (r: (typeof ROLE_OPTIONS)[number]) => {
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
    router.push(ROLE_HOME[r.role]);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 px-2.5">
          <current.icon className="h-3.5 w-3.5" />
          <span className="hidden font-medium md:inline">{ROLE_TITLE[currentRole]}</span>
          <ChevronDown className="h-3.5 w-3.5 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>Switch demo role</DropdownMenuLabel>
        {ROLE_OPTIONS.map((r) => {
          const Icon = r.icon;
          const active = r.role === currentRole;
          return (
            <DropdownMenuItem
              key={r.role}
              className={cn("flex items-start gap-3 py-2", active && "bg-muted/60")}
              onClick={() => switchTo(r)}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-sm font-semibold">
                  {ROLE_TITLE[r.role]}
                  {active && <Check className="h-3.5 w-3.5 text-primary" />}
                </div>
                <div className="truncate text-xs text-muted-foreground">{r.name} · {r.email}</div>
              </div>
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/select-role")}>
          <Crown className="h-4 w-4" />
          Role launcher
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
