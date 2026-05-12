"use client";

import * as React from "react";
import {
  Camera,
  CheckCircle2,
  Clock,
  LogIn,
  LogOut,
  MapPin,
  Mic,
  Sparkles,
  Wifi,
  Calendar
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { KpiCard } from "@/components/shared/kpi-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useDataset } from "@/hooks/use-dataset";
import { useAppSelector } from "@/lib/store/hooks";
import { GeofenceMap } from "@/components/maps/geofence-map-client";
import { WifiCheck } from "@/components/attendance/wifi-check";
import { SelfieModal } from "@/components/attendance/selfie-modal";
import { StatusPill } from "@/components/shared/status-pill";
import { motion } from "framer-motion";
import { cn, formatDuration } from "@/lib/utils";
import { toast } from "sonner";

const METHODS = [
  {
    id: "geo",
    title: "Geofence",
    description: "Auto check-in via location",
    icon: MapPin,
    accent: "bg-primary/10 text-primary"
  },
  {
    id: "wifi",
    title: "WiFi",
    description: "Connect to office network",
    icon: Wifi,
    accent: "bg-info/10 text-info"
  },
  {
    id: "selfie",
    title: "Live selfie",
    description: "With gesture verification",
    icon: Camera,
    accent: "bg-accent/10 text-accent"
  },
  {
    id: "voice",
    title: "Voice",
    description: "Say 'Mark attendance'",
    icon: Mic,
    accent: "bg-warning/10 text-warning"
  }
];

export default function EmployeeAttendancePage() {
  const ds = useDataset();
  const user = useAppSelector((s) => s.auth.user);
  const me = ds.employees.find((e) => e.fullName === user?.name) ?? ds.employees[0];
  const branch = ds.branches.find((b) => b.id === me.branchId)!;
  const [selfieOpen, setSelfieOpen] = React.useState(false);

  const myAtt = ds.attendance.filter((a) => a.employeeId === me.id).slice(0, 30);
  const present30 = myAtt.filter((a) => a.status === "present").length;
  const late30 = myAtt.filter((a) => a.status === "late").length;
  const otMin = myAtt.reduce((s, a) => s + a.overtimeHours * 60, 0);

  const today = new Date().toISOString().slice(0, 10);
  const todayRecord = ds.attendance.find((a) => a.employeeId === me.id && a.date === today);

  return (
    <div className="space-y-6">
      <PageHeader
        title="My attendance"
        description="Mark, view history, and request corrections"
        badge={todayRecord?.status === "present" ? "Checked in" : "Not yet"}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Today's status" value={todayRecord?.status?.replace("_", " ") ?? "—"} icon={CheckCircle2} accent="success" />
        <KpiCard label="Present (30d)" value={present30} format="number" icon={Calendar} accent="primary" />
        <KpiCard label="Late this month" value={late30} format="number" icon={Clock} accent="warning" />
        <KpiCard
          label="Overtime (30d)"
          value={formatDuration(otMin)}
          icon={Clock}
          accent="info"
        />
      </div>

      <SectionCard
        title="Choose verification method"
        description="Pick how you want to mark attendance today"
        icon={<Sparkles className="h-4 w-4" />}
      >
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {METHODS.map((m) => {
            const Icon = m.icon;
            return (
              <motion.button
                key={m.id}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (m.id === "selfie") setSelfieOpen(true);
                  else toast.success(`Attendance marked via ${m.title}`);
                }}
                className="rounded-2xl border bg-card p-4 text-left shadow-soft transition-all hover:border-primary/40 hover:shadow-elevated"
              >
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", m.accent)}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="mt-3 text-sm font-semibold">{m.title}</div>
                <p className="mt-0.5 text-xs text-muted-foreground">{m.description}</p>
              </motion.button>
            );
          })}
        </div>
      </SectionCard>

      <Tabs defaultValue="map">
        <TabsList>
          <TabsTrigger value="map">Map view</TabsTrigger>
          <TabsTrigger value="wifi">WiFi check</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <SectionCard
              className="lg:col-span-2"
              title={`${branch.name} geofence`}
              description={`Radius: ${branch.radiusMeters}m · You are inside the zone`}
              icon={<MapPin className="h-4 w-4" />}
              actions={
                <Badge variant="success">
                  <CheckCircle2 className="h-3 w-3" /> Inside zone
                </Badge>
              }
            >
              <GeofenceMap
                branch={branch}
                radius={branch.radiusMeters}
                height={400}
                livePin={{
                  lat: branch.lat + 0.0005,
                  lng: branch.lng - 0.0003,
                  label: me.fullName,
                  inside: true
                }}
              />
            </SectionCard>

            <SectionCard
              title="Today's verification"
              description="What was checked"
              icon={<Sparkles className="h-4 w-4" />}
            >
              <div className="space-y-2">
                {[
                  { label: "GPS within radius", status: "✓", value: "32 m from center" },
                  { label: "WiFi SSID match", status: "✓", value: "Crownco-HQ" },
                  { label: "Device fingerprint", status: "✓", value: "Bound" },
                  { label: "Face recognition", status: "✓", value: "99.2% match" },
                  { label: "Liveness check", status: "✓", value: "Passed" }
                ].map((c) => (
                  <div key={c.label} className="flex items-center justify-between rounded-xl border bg-card p-2.5">
                    <div className="text-xs">
                      <div className="font-medium">{c.label}</div>
                      <div className="text-muted-foreground">{c.value}</div>
                    </div>
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </TabsContent>

        <TabsContent value="wifi">
          <WifiCheck ssid={branch.wifi[0]?.ssid ?? "Crownco-HQ"} />
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <SectionCard
            title="Attendance timeline"
            description="Last 30 working days"
            icon={<Calendar className="h-4 w-4" />}
          >
            <div className="space-y-2">
              {myAtt.slice(0, 12).map((a) => (
                <div
                  key={a.id}
                  className="flex items-center gap-3 rounded-xl border bg-card p-3"
                >
                  <div className="flex h-10 w-10 flex-col items-center justify-center rounded-lg bg-muted text-xs">
                    <span className="text-[10px] uppercase">
                      {new Date(a.date).toLocaleDateString("en-IN", { month: "short" })}
                    </span>
                    <span className="text-sm font-bold tabular-nums">
                      {new Date(a.date).toLocaleDateString("en-IN", { day: "2-digit" })}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <StatusPill value={a.status} />
                      {a.source !== "manual" && (
                        <Badge variant="outline" className="text-[10px] capitalize">
                          {a.source}
                        </Badge>
                      )}
                      {a.selfieConfidence && (
                        <Badge variant="info" className="text-[10px]">
                          {(a.selfieConfidence * 100).toFixed(0)}% confidence
                        </Badge>
                      )}
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {a.checkIn ? `${a.checkIn}` : "—"} → {a.checkOut ?? "—"} · {a.workHours}h
                      {a.overtimeHours > 0 && <span className="text-warning"> · +{a.overtimeHours}h OT</span>}
                    </div>
                  </div>
                  {a.flags && a.flags.length > 0 && (
                    <Button size="sm" variant="outline">
                      Request correction
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>

      <SelfieModal
        open={selfieOpen}
        onOpenChange={setSelfieOpen}
        onComplete={(r) => toast.success(`Attendance marked · ${r.confidence}% confidence`)}
      />
    </div>
  );
}
