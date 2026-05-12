import {
  BarChart3,
  Bell,
  Bot,
  Briefcase,
  Building,
  Building2,
  CalendarClock,
  CalendarDays,
  CalendarRange,
  Camera,
  ChartLine,
  Clipboard,
  ClipboardList,
  Coins,
  Compass,
  Crown,
  FileText,
  Gauge,
  Gift,
  Globe2,
  Heart,
  Home,
  Kanban,
  LayoutDashboard,
  LineChart,
  Map,
  MapPinned,
  Megaphone,
  PhoneCall,
  Receipt,
  Route,
  Settings,
  ShieldCheck,
  Sparkles,
  Trophy,
  TrendingUp,
  UserPlus,
  Users,
  UsersRound,
  Wallet,
  Wifi,
  Workflow,
  type LucideIcon
} from "lucide-react";
import type { Role } from "@/types";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  badgeTone?: "primary" | "success" | "warning" | "destructive" | "info";
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const NAV: Record<Role, NavGroup[]> = {
  hr_admin: [
    {
      label: "Workspace",
      items: [
        { label: "Overview", href: "/hr/dashboard", icon: LayoutDashboard },
        { label: "Insights", href: "/hr/insights", icon: Sparkles, badge: "AI", badgeTone: "primary" },
        { label: "Activity feed", href: "/hr/activity", icon: ChartLine }
      ]
    },
    {
      label: "People",
      items: [
        { label: "Employees", href: "/hr/employees", icon: Users },
        { label: "Recruitment", href: "/hr/recruitment", icon: UserPlus },
        { label: "Performance", href: "/hr/performance", icon: TrendingUp },
        { label: "Health monitor", href: "/hr/health", icon: Heart }
      ]
    },
    {
      label: "Operations",
      items: [
        { label: "Attendance", href: "/hr/attendance", icon: Camera },
        { label: "Leave", href: "/hr/leave", icon: CalendarRange },
        { label: "Tasks", href: "/hr/tasks", icon: Kanban },
        { label: "Calls & meetings", href: "/hr/calls", icon: PhoneCall }
      ]
    },
    {
      label: "Rewards & Payroll",
      items: [
        { label: "Rewards", href: "/hr/rewards", icon: Trophy },
        { label: "Payroll", href: "/hr/payroll", icon: Wallet }
      ]
    },
    {
      label: "Strategic",
      items: [
        { label: "Forecasting", href: "/hr/forecasting", icon: LineChart },
        { label: "Internal comms", href: "/hr/communication", icon: Megaphone },
        { label: "Compliance", href: "/hr/compliance", icon: ShieldCheck },
        { label: "Settings", href: "/hr/settings", icon: Settings }
      ]
    }
  ],
  employee: [
    {
      label: "Today",
      items: [
        { label: "Home", href: "/employee/dashboard", icon: Home },
        { label: "Attendance", href: "/employee/attendance", icon: Camera },
        { label: "My tasks", href: "/employee/tasks", icon: ClipboardList }
      ]
    },
    {
      label: "Me",
      items: [
        { label: "Performance", href: "/employee/performance", icon: Gauge },
        { label: "Leave", href: "/employee/leave", icon: CalendarDays },
        { label: "Rewards", href: "/employee/rewards", icon: Gift },
        { label: "Payslips", href: "/employee/payslips", icon: Receipt },
        { label: "Learning", href: "/employee/learning", icon: FileText }
      ]
    }
  ],
  manager: [
    {
      label: "Team",
      items: [
        { label: "Overview", href: "/manager/dashboard", icon: LayoutDashboard },
        { label: "My team", href: "/manager/team", icon: UsersRound },
        { label: "Approvals", href: "/manager/approvals", icon: ClipboardList, badge: "5", badgeTone: "warning" },
        { label: "Tasks", href: "/manager/tasks", icon: Kanban },
        { label: "Analytics", href: "/manager/analytics", icon: BarChart3 },
        { label: "Performance", href: "/manager/performance", icon: TrendingUp }
      ]
    }
  ],
  field: [
    {
      label: "Field",
      items: [
        { label: "Today", href: "/field/dashboard", icon: Home },
        { label: "Visits", href: "/field/visits", icon: MapPinned },
        { label: "Route playback", href: "/field/route", icon: Route },
        { label: "Expenses", href: "/field/expenses", icon: Receipt }
      ]
    }
  ],
  recruiter: [
    {
      label: "Hiring",
      items: [
        { label: "Pipeline", href: "/recruiter/dashboard", icon: Kanban },
        { label: "Candidates", href: "/recruiter/candidates", icon: Users },
        { label: "Interviews", href: "/recruiter/interviews", icon: CalendarClock },
        { label: "Analytics", href: "/recruiter/analytics", icon: BarChart3 }
      ]
    }
  ],
  super_admin: [
    {
      label: "Platform",
      items: [
        { label: "Organizations", href: "/superadmin/organizations", icon: Building2 },
        { label: "Branches", href: "/superadmin/branches", icon: Building },
        { label: "Billing", href: "/superadmin/billing", icon: Coins },
        { label: "Audit log", href: "/superadmin/audit", icon: FileText }
      ]
    }
  ]
};

export const ROLE_TITLE: Record<Role, string> = {
  hr_admin: "HR Admin",
  manager: "Team Manager",
  employee: "Employee",
  field: "Field",
  recruiter: "Recruiter",
  super_admin: "Super Admin"
};

export const ROLE_HOME: Record<Role, string> = {
  hr_admin: "/hr/dashboard",
  manager: "/manager/dashboard",
  employee: "/employee/dashboard",
  field: "/field/dashboard",
  recruiter: "/recruiter/dashboard",
  super_admin: "/superadmin/organizations"
};
