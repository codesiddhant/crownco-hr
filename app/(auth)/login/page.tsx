"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Fingerprint, Loader2, ScanFace, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppDispatch } from "@/lib/store/hooks";
import { login, setRole } from "@/lib/store/authSlice";
import { Checkbox } from "@/components/ui/checkbox";
import { avatarUrl } from "@/lib/utils";
import type { Role } from "@/types";
import { toast } from "sonner";

const ROLE_PRESETS: { role: Role; label: string; name: string; email: string }[] = [
  { role: "hr_admin", label: "HR Admin", name: "Ananya Sharma", email: "ananya.sharma@crownco.ai" },
  { role: "manager", label: "Team Manager", name: "Rohan Verma", email: "rohan.verma@crownco.ai" },
  { role: "employee", label: "Employee", name: "Priya Patel", email: "priya.patel@crownco.ai" },
  { role: "field", label: "Field Employee", name: "Aniket Kulkarni", email: "aniket.kulkarni@crownco.ai" },
  { role: "recruiter", label: "Recruiter", name: "Nisha Joshi", email: "nisha.joshi@crownco.ai" },
  { role: "super_admin", label: "Super Admin", name: "Vikram Kapoor", email: "vikram.kapoor@crownco.ai" }
];

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [role, setRoleLocal] = React.useState<Role>("hr_admin");
  const [showPwd, setShowPwd] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const preset = ROLE_PRESETS.find((p) => p.role === role)!;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    dispatch(
      login({
        user: {
          id: `u_${role}`,
          name: preset.name,
          email: preset.email,
          avatar: avatarUrl(preset.name),
          role
        },
        role
      })
    );
    dispatch(setRole(role));
    toast.success(`Welcome back, ${preset.name.split(" ")[0]}!`);

    const dest: Record<Role, string> = {
      hr_admin: "/hr/dashboard",
      manager: "/manager/dashboard",
      employee: "/employee/dashboard",
      field: "/field/dashboard",
      recruiter: "/recruiter/dashboard",
      super_admin: "/superadmin/organizations"
    };
    router.push(dest[role]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          Demo Mode · No real auth
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to access the Crownco workforce OS.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>Sign in as</Label>
          <Select value={role} onValueChange={(v) => setRoleLocal(v as Role)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROLE_PRESETS.map((p) => (
                <SelectItem key={p.role} value={p.role}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Work email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              defaultValue={preset.email}
              key={preset.email}
              placeholder="you@crownco.ai"
              className="pl-9"
              autoComplete="email"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password" className="text-xs font-medium text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type={showPwd ? "text" : "password"}
              defaultValue="crownco-demo"
              className="px-9"
            />
            <button
              type="button"
              onClick={() => setShowPwd((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox defaultChecked /> Remember me for 30 days
          </label>
        </div>

        <Button type="submit" variant="brand" className="w-full" size="lg" disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Continue
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" asChild>
            <Link href="/face-verify">
              <ScanFace className="h-4 w-4" />
              Face ID
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/biometric">
              <Fingerprint className="h-4 w-4" />
              Biometric
            </Link>
          </Button>
        </div>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        New organization?{" "}
        <Link href="/onboarding" className="font-medium text-primary hover:underline">
          Start onboarding
        </Link>
      </p>
    </motion.div>
  );
}
