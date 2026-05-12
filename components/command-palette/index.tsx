"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  LayoutDashboard,
  Camera,
  CalendarRange,
  Gift,
  Trophy,
  ScanFace,
  ArrowRight,
  PhoneCall,
  Users,
  Settings,
  Wallet,
  Receipt,
  Building2,
  TrendingUp,
  Crown,
  UsersRound,
  Briefcase,
  MapPinned,
  ShieldCheck,
  Bell
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut
} from "@/components/ui/command";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setAiOpen, setCommandOpen, setNotificationsOpen } from "@/lib/store/uiSlice";
import { login, setRole } from "@/lib/store/authSlice";
import { useDataset } from "@/hooks/use-dataset";
import { avatarUrl } from "@/lib/utils";
import { ROLE_HOME } from "@/lib/navigation";
import type { Role } from "@/types";

const NAV_ITEMS = [
  { label: "HR · Dashboard", href: "/hr/dashboard", icon: LayoutDashboard },
  { label: "HR · Employees", href: "/hr/employees", icon: Users },
  { label: "HR · Attendance", href: "/hr/attendance", icon: Camera },
  { label: "HR · Leave", href: "/hr/leave", icon: CalendarRange },
  { label: "HR · Tasks", href: "/hr/tasks", icon: TrendingUp },
  { label: "HR · Calls", href: "/hr/calls", icon: PhoneCall },
  { label: "HR · Rewards", href: "/hr/rewards", icon: Trophy },
  { label: "HR · Payroll", href: "/hr/payroll", icon: Wallet },
  { label: "HR · Settings", href: "/hr/settings", icon: Settings },
  { label: "Employee · Dashboard", href: "/employee/dashboard", icon: LayoutDashboard },
  { label: "Employee · Attendance", href: "/employee/attendance", icon: Camera },
  { label: "Employee · Leave", href: "/employee/leave", icon: CalendarRange },
  { label: "Employee · Tasks", href: "/employee/tasks", icon: TrendingUp },
  { label: "Employee · Payslips", href: "/employee/payslips", icon: Receipt },
  { label: "Manager · Dashboard", href: "/manager/dashboard", icon: LayoutDashboard },
  { label: "Manager · Approvals", href: "/manager/approvals", icon: ScanFace },
  { label: "Field · Visits", href: "/field/visits", icon: MapPinned },
  { label: "Recruiter · Pipeline", href: "/recruiter/dashboard", icon: Briefcase },
  { label: "Super Admin · Organizations", href: "/superadmin/organizations", icon: Building2 }
];

const QUICK_ACTIONS = [
  { id: "apply_leave", label: "Apply for leave", href: "/employee/leave", icon: CalendarRange },
  { id: "mark_attendance", label: "Mark attendance", href: "/employee/attendance", icon: Camera },
  { id: "face_verify", label: "Face verification", href: "/face-verify", icon: ScanFace },
  { id: "give_reward", label: "Give a reward", href: "/hr/rewards", icon: Gift }
];

const ROLE_OPTIONS: { role: Role; icon: React.ElementType; name: string; email: string }[] = [
  { role: "hr_admin", icon: Crown, name: "Ananya Sharma", email: "ananya.sharma@crownco.ai" },
  { role: "manager", icon: UsersRound, name: "Rohan Verma", email: "rohan.verma@crownco.ai" },
  { role: "employee", icon: Briefcase, name: "Priya Patel", email: "priya.patel@crownco.ai" },
  { role: "field", icon: MapPinned, name: "Aniket Kulkarni", email: "aniket.kulkarni@crownco.ai" },
  { role: "recruiter", icon: Sparkles, name: "Nisha Joshi", email: "nisha.joshi@crownco.ai" },
  { role: "super_admin", icon: ShieldCheck, name: "Vikram Kapoor", email: "vikram.kapoor@crownco.ai" }
];

export function CommandPalette() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const open = useAppSelector((s) => s.ui.commandOpen);
  const ds = useDataset();

  const go = (href: string) => {
    dispatch(setCommandOpen(false));
    router.push(href);
  };

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
    dispatch(setCommandOpen(false));
    router.push(ROLE_HOME[r.role]);
  };

  return (
    <CommandDialog open={open} onOpenChange={(v) => dispatch(setCommandOpen(v))}>
      <CommandInput placeholder="Search or type a command..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Quick actions">
          {QUICK_ACTIONS.map((a) => (
            <CommandItem key={a.id} onSelect={() => go(a.href)}>
              <a.icon className="h-4 w-4" />
              {a.label}
              <ArrowRight className="ml-auto h-3.5 w-3.5 opacity-40" />
            </CommandItem>
          ))}
          <CommandItem
            onSelect={() => {
              dispatch(setCommandOpen(false));
              dispatch(setAiOpen(true));
            }}
          >
            <Sparkles className="h-4 w-4 text-primary" />
            Ask Crowny (AI)
            <CommandShortcut>⌘⇧A</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              dispatch(setCommandOpen(false));
              dispatch(setNotificationsOpen(true));
            }}
          >
            <Bell className="h-4 w-4" />
            View notifications
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Switch role">
          {ROLE_OPTIONS.map((r) => (
            <CommandItem key={r.role} value={`switch role ${r.role} ${r.name}`} onSelect={() => switchTo(r)}>
              <r.icon className="h-4 w-4" />
              <span>Switch to {r.role.replace("_", " ")}</span>
              <span className="ml-auto text-xs text-muted-foreground">{r.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Navigate">
          {NAV_ITEMS.map((n) => (
            <CommandItem key={n.href} onSelect={() => go(n.href)}>
              <n.icon className="h-4 w-4" />
              {n.label}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Employees">
          {ds.employees.slice(0, 6).map((e) => (
            <CommandItem
              key={e.id}
              value={`employee ${e.fullName} ${e.email} ${e.department}`}
              onSelect={() => go(`/hr/employees`)}
            >
              <img src={e.avatar} className="h-5 w-5 rounded-full" alt={e.fullName} />
              <div className="flex-1 truncate">
                <div className="text-sm">{e.fullName}</div>
                <div className="truncate text-xs text-muted-foreground">
                  {e.designation} · {e.department}
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{e.employeeCode}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="AI prompts">
          {[
            "Who is at burnout risk?",
            "Today's productivity report",
            "Forecast attrition for next quarter",
            "Suggest rewards for top performers"
          ].map((p) => (
            <CommandItem
              key={p}
              onSelect={() => {
                dispatch(setCommandOpen(false));
                dispatch(setAiOpen(true));
              }}
            >
              <Sparkles className="h-4 w-4 text-primary" />
              {p}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
