"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  MapPin,
  Users,
  Wifi,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

const STEPS = [
  { id: 1, label: "Organization", icon: Building2 },
  { id: 2, label: "First branch", icon: MapPin },
  { id: 3, label: "Attendance setup", icon: Wifi },
  { id: 4, label: "Invite team", icon: Users },
  { id: 5, label: "AI preferences", icon: Sparkles }
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = React.useState(1);
  const [done, setDone] = React.useState(false);

  const total = STEPS.length;
  const progress = (step / total) * 100;

  const next = () => {
    if (step < total) setStep((s) => s + 1);
    else {
      setDone(true);
      toast.success("Workspace ready! Loading dashboard...");
      setTimeout(() => router.push("/hr/dashboard"), 1100);
    }
  };
  const prev = () => step > 1 && setStep((s) => s - 1);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">
          Step {step} of {total}
        </div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          {STEPS[step - 1].label}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {STEPS.map((s) => (
          <div
            key={s.id}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-all",
              s.id <= step ? "bg-brand-gradient" : "bg-muted"
            )}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
            <div className="space-y-2">
              <Label>Company name</Label>
              <Input defaultValue="Crownco Realty Pvt Ltd" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Industry</Label>
                <Select defaultValue="real_estate">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="real_estate">Real Estate</SelectItem>
                    <SelectItem value="sales">Sales / CRM</SelectItem>
                    <SelectItem value="call_center">Call Center</SelectItem>
                    <SelectItem value="insurance">Insurance</SelectItem>
                    <SelectItem value="logistics">Logistics</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Team size</Label>
                <Select defaultValue="51_200">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1_10">1–10</SelectItem>
                    <SelectItem value="11_50">11–50</SelectItem>
                    <SelectItem value="51_200">51–200</SelectItem>
                    <SelectItem value="201_500">201–500</SelectItem>
                    <SelectItem value="500_plus">500+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Domain</Label>
              <div className="flex items-center gap-2">
                <Input defaultValue="crownco" />
                <span className="text-sm text-muted-foreground">.crownco.ai</span>
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="s2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
            <div className="space-y-2">
              <Label>Branch name</Label>
              <Input defaultValue="Mumbai HQ" />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input defaultValue="BKC, Bandra East, Mumbai 400051" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Country</Label>
                <Select defaultValue="IN"><SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IN">India</SelectItem>
                    <SelectItem value="AE">United Arab Emirates</SelectItem>
                    <SelectItem value="SG">Singapore</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Timezone</Label>
                <Select defaultValue="IST"><SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IST">IST (UTC+5:30)</SelectItem>
                    <SelectItem value="GST">GST (UTC+4)</SelectItem>
                    <SelectItem value="SGT">SGT (UTC+8)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="s3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Choose which attendance methods to enable for Mumbai HQ.
            </p>
            {[
              { id: "geo", label: "Geofencing", desc: "Auto check-in when entering office radius", default: true },
              { id: "wifi", label: "WiFi Fencing", desc: "Verify via office SSID + BSSID", default: true },
              { id: "selfie", label: "Live Selfie + Gesture", desc: "For remote / field employees", default: true },
              { id: "voice", label: "Voice Attendance", desc: "Voiceprint + location verification", default: false }
            ].map((m) => (
              <label
                key={m.id}
                className="flex items-start gap-3 rounded-2xl border bg-card p-4 shadow-soft cursor-pointer hover:border-primary/40 transition-colors"
              >
                <Checkbox defaultChecked={m.default} className="mt-1" />
                <div>
                  <div className="text-sm font-medium">{m.label}</div>
                  <div className="text-xs text-muted-foreground">{m.desc}</div>
                </div>
              </label>
            ))}
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="s4" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
            <div className="space-y-2">
              <Label>Invite by email</Label>
              <Input placeholder="rohan@crownco.ai, priya@crownco.ai..." defaultValue="rohan@crownco.ai, priya@crownco.ai" />
              <p className="text-xs text-muted-foreground">
                Separate multiple emails with commas. You can also import via CSV later.
              </p>
            </div>
            <div className="rounded-2xl border bg-primary/5 p-4">
              <div className="text-sm font-semibold">Default role for new invites</div>
              <Select defaultValue="employee">
                <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="manager">Team Manager</SelectItem>
                  <SelectItem value="hr_admin">HR Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div key="s5" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Enable AI features. You can change these anytime in Settings.
            </p>
            {[
              { id: "daily_reports", label: "Daily WhatsApp productivity reports", desc: "AI summary at 7 PM" },
              { id: "leave_impact", label: "AI Leave Impact Analysis", desc: "Auto risk score & replacements" },
              { id: "burnout", label: "Burnout Risk Detection", desc: "Proactive wellness alerts" },
              { id: "call_coach", label: "AI Sales Coach", desc: "Real-time call coaching tips" },
              { id: "forecast", label: "Workforce Forecasting", desc: "30-day attrition & hiring forecasts" }
            ].map((m) => (
              <label key={m.id} className="flex items-start gap-3 rounded-2xl border bg-card p-4 shadow-soft cursor-pointer hover:border-primary/40">
                <Checkbox defaultChecked className="mt-1" />
                <div>
                  <div className="text-sm font-medium">{m.label}</div>
                  <div className="text-xs text-muted-foreground">{m.desc}</div>
                </div>
              </label>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between gap-3">
        <Button variant="ghost" onClick={prev} disabled={step === 1}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button variant="brand" onClick={next} disabled={done}>
          {done ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Done
            </>
          ) : step === total ? (
            <>
              Finish
              <Check className="h-4 w-4" />
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
