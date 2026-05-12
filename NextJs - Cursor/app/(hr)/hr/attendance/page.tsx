"use client";

import * as React from "react";
import {
  Camera,
  CheckCircle2,
  Clock,
  MapPin,
  Settings,
  Wifi,
  Mic,
  Smile,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  Loader2
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { SectionCard } from "@/components/shared/section-card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useDataset } from "@/hooks/use-dataset";
import { initials, cn } from "@/lib/utils";
import { GeofenceMap } from "@/components/maps/geofence-map-client";
import { WifiCheck } from "@/components/attendance/wifi-check";
import { SelfieModal } from "@/components/attendance/selfie-modal";
import { StatusPill } from "@/components/shared/status-pill";
import { SeriesAreaChart } from "@/components/charts/area-chart";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function HRAttendancePage() {
  const ds = useDataset();
  const [branchId, setBranchId] = React.useState(ds.branches[0].id);
  const branch = ds.branches.find((b) => b.id === branchId)!;
  const [radius, setRadius] = React.useState(branch.radiusMeters);
  const [selfieOpen, setSelfieOpen] = React.useState(false);
  const [voiceState, setVoiceState] = React.useState<"idle" | "listening" | "done">("idle");

  React.useEffect(() => {
    setRadius(branch.radiusMeters);
  }, [branchId, branch.radiusMeters]);

  const today = new Date().toISOString().slice(0, 10);
  const todayAtt = ds.attendance.filter((a) => a.date === today && a.branchId === branchId);
  const present = todayAtt.filter((a) => a.status === "present" || a.status === "late").length;
  const late = todayAtt.filter((a) => a.status === "late").length;
  const onLeave = todayAtt.filter((a) => a.status === "on_leave").length;
  const absent = todayAtt.filter((a) => a.status === "absent").length;

  const sources = ["geo", "wifi", "selfie", "voice", "manual"].map((s) => ({
    source: s,
    count: todayAtt.filter((a) => a.source === s).length
  }));

  const recent = ds.attendance
    .filter((a) => a.date === today && (a.status === "present" || a.status === "late"))
    .slice(0, 8);

  // 30-day trend
  const trend = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const dateStr = d.toISOString().slice(0, 10);
    const day = ds.attendance.filter((a) => a.date === dateStr && a.branchId === branchId);
    return {
      date: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
      present: day.filter((a) => a.status === "present").length,
      late: day.filter((a) => a.status === "late").length
    };
  });

  const runVoice = async () => {
    setVoiceState("listening");
    await new Promise((r) => setTimeout(r, 1800));
    setVoiceState("done");
    toast.success("Voice attendance verified · Voiceprint match 98.7%");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Smart Attendance"
        description="Geofence, WiFi, live selfie, voice & manual — all verified by AI."
        actions={
          <Select value={branchId} onValueChange={setBranchId}>
            <SelectTrigger className="w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ds.branches.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Present today" value={present} format="number" icon={CheckCircle2} accent="success" />
        <KpiCard label="Late arrivals" value={late} format="number" icon={Clock} accent="warning" />
        <KpiCard label="On leave" value={onLeave} format="number" icon={MapPin} accent="info" />
        <KpiCard label="Absent" value={absent} format="number" icon={AlertTriangle} accent="destructive" />
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="w-full overflow-x-auto md:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="geo">Geofence</TabsTrigger>
          <TabsTrigger value="wifi">WiFi</TabsTrigger>
          <TabsTrigger value="selfie">Live selfie</TabsTrigger>
          <TabsTrigger value="voice">Voice</TabsTrigger>
          <TabsTrigger value="rules">Shift rules</TabsTrigger>
          <TabsTrigger value="corrections">Corrections</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <SectionCard
              className="lg:col-span-2"
              title={`${branch.name} geofence`}
              description={`${radius}m radius · ${branch.address}`}
              icon={<MapPin className="h-4 w-4" />}
              actions={
                <Badge variant="info">
                  <ShieldCheck className="h-3 w-3" /> Active
                </Badge>
              }
            >
              <GeofenceMap branch={branch} radius={radius} height={320} />
            </SectionCard>

            <SectionCard
              title="Verification method mix"
              description="Today's distribution"
              icon={<Sparkles className="h-4 w-4" />}
            >
              <div className="space-y-2.5">
                {sources.map((s) => {
                  const total = sources.reduce((sum, x) => sum + x.count, 0) || 1;
                  const pct = Math.round((s.count / total) * 100);
                  const colors: Record<string, string> = {
                    geo: "bg-primary",
                    wifi: "bg-info",
                    selfie: "bg-accent",
                    voice: "bg-warning",
                    manual: "bg-muted-foreground"
                  };
                  return (
                    <div key={s.source}>
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="capitalize">{s.source}</span>
                        <span className="font-semibold">
                          {s.count} <span className="text-muted-foreground">({pct}%)</span>
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div className={cn("h-full", colors[s.source])} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </SectionCard>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <SectionCard
              className="lg:col-span-2"
              title="30-day attendance trend"
              description={branch.name}
              icon={<Clock className="h-4 w-4" />}
            >
              <SeriesAreaChart
                data={trend}
                xKey="date"
                series={[
                  { key: "present", label: "Present", color: "hsl(var(--success))" },
                  { key: "late", label: "Late", color: "hsl(var(--warning))" }
                ]}
                height={240}
              />
            </SectionCard>

            <SectionCard
              title="Live activity"
              description="Latest check-ins"
              icon={<CheckCircle2 className="h-4 w-4" />}
            >
              <div className="space-y-2">
                {recent.map((a) => {
                  const emp = ds.employees.find((e) => e.id === a.employeeId);
                  if (!emp) return null;
                  const sourceIcon: Record<string, React.ElementType> = {
                    geo: MapPin,
                    wifi: Wifi,
                    selfie: Camera,
                    voice: Mic,
                    manual: Settings
                  };
                  const Icon = sourceIcon[a.source] ?? MapPin;
                  return (
                    <div key={a.id} className="flex items-center gap-2 rounded-xl border bg-card p-2">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={emp.avatar} alt={emp.fullName} />
                        <AvatarFallback>{initials(emp.fullName)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-xs font-medium">{emp.fullName}</div>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Icon className="h-3 w-3" />
                          <span className="capitalize">{a.source}</span>
                          <span>· {a.checkIn}</span>
                          {a.selfieConfidence && <span>· {(a.selfieConfidence * 100).toFixed(1)}%</span>}
                        </div>
                      </div>
                      <StatusPill value={a.status} />
                    </div>
                  );
                })}
              </div>
            </SectionCard>
          </div>
        </TabsContent>

        {/* Geofence */}
        <TabsContent value="geo" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <SectionCard
              className="lg:col-span-2"
              title="Geofence configurator"
              description={`${branch.name} · radius ${radius}m`}
              icon={<MapPin className="h-4 w-4" />}
            >
              <GeofenceMap
                branch={branch}
                radius={radius}
                height={400}
                livePin={{ lat: branch.lat + 0.0006, lng: branch.lng - 0.0004, label: "Demo employee", inside: true }}
              />
            </SectionCard>

            <SectionCard
              title="Radius settings"
              description="Adjustable per branch"
              icon={<Settings className="h-4 w-4" />}
            >
              <div className="space-y-5">
                <div>
                  <Label className="mb-2 block">Office radius</Label>
                  <Slider
                    value={[radius]}
                    onValueChange={(v) => setRadius(v[0])}
                    min={50}
                    max={500}
                    step={10}
                  />
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>50m</span>
                    <span className="font-semibold text-foreground">{radius}m</span>
                    <span>500m</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-xl border bg-card p-3">
                    <div>
                      <div className="text-sm font-medium">Background validation</div>
                      <div className="text-xs text-muted-foreground">Re-verify every 15 min</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between rounded-xl border bg-card p-3">
                    <div>
                      <div className="text-sm font-medium">Anti-spoof detection</div>
                      <div className="text-xs text-muted-foreground">Block mock-location apps</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between rounded-xl border bg-card p-3">
                    <div>
                      <div className="text-sm font-medium">Late arrival auto-flag</div>
                      <div className="text-xs text-muted-foreground">After 10 min grace period</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <Button
                  variant="brand"
                  className="w-full"
                  onClick={() => toast.success("Geofence settings saved")}
                >
                  Save geofence
                </Button>
              </div>
            </SectionCard>
          </div>
        </TabsContent>

        {/* WiFi */}
        <TabsContent value="wifi" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <WifiCheck ssid={branch.wifi[0]?.ssid ?? "Crownco-HQ"} />
            <SectionCard
              title="WiFi whitelist"
              description={`${branch.wifi.length} networks for ${branch.name}`}
              icon={<Wifi className="h-4 w-4" />}
            >
              <div className="space-y-2">
                {branch.wifi.map((w) => (
                  <div key={w.bssid} className="flex items-center justify-between rounded-xl border bg-card p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Wifi className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{w.ssid}</div>
                        <div className="text-xs text-muted-foreground tabular-nums">{w.bssid}</div>
                      </div>
                    </div>
                    <Badge variant="success">Verified</Badge>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  <Wifi className="h-4 w-4" />
                  Add network
                </Button>
              </div>
            </SectionCard>
          </div>
        </TabsContent>

        {/* Selfie */}
        <TabsContent value="selfie" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <SectionCard
              title="Live selfie + gesture verification"
              description="For remote and field employees"
              icon={<Camera className="h-4 w-4" />}
            >
              <div className="aspect-video flex flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-muted/20 p-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Camera className="h-8 w-8" />
                </div>
                <div className="mt-3 text-base font-semibold">Try the selfie flow</div>
                <p className="mt-1 text-center text-sm text-muted-foreground">
                  Simulated camera + AI-powered liveness check with random gesture verification.
                </p>
                <Button
                  variant="brand"
                  size="lg"
                  className="mt-4"
                  onClick={() => setSelfieOpen(true)}
                >
                  <Camera className="h-4 w-4" />
                  Open selfie modal
                </Button>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                {[
                  { icon: Smile, label: "Smile detection" },
                  { icon: Camera, label: "Face match" },
                  { icon: ShieldCheck, label: "Liveness AI" }
                ].map((f) => {
                  const Icon = f.icon;
                  return (
                    <div key={f.label} className="rounded-xl border bg-card p-3 text-center">
                      <Icon className="mx-auto h-5 w-5 text-primary" />
                      <div className="mt-1 text-xs font-medium">{f.label}</div>
                    </div>
                  );
                })}
              </div>
            </SectionCard>

            <SectionCard
              title="AI confidence calibration"
              description="Threshold for auto-approval"
              icon={<Sparkles className="h-4 w-4" />}
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                    Minimum face match confidence
                  </Label>
                  <Slider defaultValue={[95]} min={70} max={99} step={1} />
                  <div className="text-xs text-muted-foreground">Current: 95%</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                    Minimum liveness score
                  </Label>
                  <Slider defaultValue={[90]} min={60} max={99} step={1} />
                  <div className="text-xs text-muted-foreground">Current: 90%</div>
                </div>
                <div className="flex items-center justify-between rounded-xl border bg-card p-3">
                  <div>
                    <div className="text-sm font-medium">Require gesture verification</div>
                    <div className="text-xs text-muted-foreground">Random prompt every time</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between rounded-xl border bg-card p-3">
                  <div>
                    <div className="text-sm font-medium">Auto-quarantine on suspicion</div>
                    <div className="text-xs text-muted-foreground">Flag for HR review</div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </SectionCard>
          </div>
        </TabsContent>

        {/* Voice */}
        <TabsContent value="voice" className="space-y-4">
          <SectionCard
            title="Voice attendance"
            description='Say "Mark attendance" — verified by voiceprint + location + device'
            icon={<Mic className="h-4 w-4" />}
          >
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border bg-gradient-to-br from-warning/10 to-primary/10 p-8">
                <div className="flex flex-col items-center">
                  <motion.button
                    onClick={runVoice}
                    disabled={voiceState === "listening"}
                    whileTap={{ scale: 0.95 }}
                    className="relative flex h-32 w-32 items-center justify-center rounded-full bg-warning text-warning-foreground shadow-glow"
                  >
                    {voiceState === "listening" ? (
                      <Loader2 className="h-12 w-12 animate-spin" />
                    ) : voiceState === "done" ? (
                      <CheckCircle2 className="h-14 w-14" />
                    ) : (
                      <Mic className="h-14 w-14" />
                    )}
                    {voiceState === "listening" && (
                      <>
                        <motion.span
                          className="absolute inset-0 rounded-full border-2 border-warning"
                          animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
                          transition={{ duration: 1.6, repeat: Infinity }}
                        />
                        <motion.span
                          className="absolute inset-0 rounded-full border-2 border-warning"
                          animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
                          transition={{ duration: 1.6, repeat: Infinity, delay: 0.4 }}
                        />
                      </>
                    )}
                  </motion.button>
                  <div className="mt-4 text-center text-sm">
                    {voiceState === "idle" && "Tap & say: \"Mark attendance\""}
                    {voiceState === "listening" && "Listening..."}
                    {voiceState === "done" && (
                      <span className="text-success font-semibold">Verified · 98.7% match</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Voiceprint match", v: "98.7%", tone: "success" },
                  { label: "Background noise filter", v: "Active", tone: "info" },
                  { label: "Location match", v: "Within 32m", tone: "success" },
                  { label: "Device binding", v: "✓ Bound", tone: "success" },
                  { label: "Replay attack check", v: "Pass", tone: "success" }
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between rounded-xl border bg-card p-3">
                    <span className="text-sm">{s.label}</span>
                    <Badge variant={s.tone as "success" | "info"}>{s.v}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>
        </TabsContent>

        {/* Shift rules */}
        <TabsContent value="rules" className="space-y-4">
          <SectionCard
            title="Shift configurations"
            description="Active shifts across the organization"
            icon={<Clock className="h-4 w-4" />}
          >
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {ds.shifts.map((s) => (
                <Card key={s.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">{s.name}</div>
                    <Badge variant="outline" className="text-[10px] uppercase">{s.type}</Badge>
                  </div>
                  <div className="mt-3 text-2xl font-semibold tabular-nums">
                    {s.start} – {s.end}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">Break: {s.breakMin} min</div>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {ds.employees.filter((e) => e.shiftId === s.id).length} employees
                    </span>
                    <button className="text-primary hover:underline">Edit</button>
                  </div>
                </Card>
              ))}
            </div>
          </SectionCard>
        </TabsContent>

        {/* Corrections */}
        <TabsContent value="corrections" className="space-y-4">
          <SectionCard
            title="Attendance correction requests"
            description="Employee-submitted regularization"
            icon={<AlertTriangle className="h-4 w-4" />}
          >
            <div className="space-y-2">
              {ds.attendance
                .filter((a) => a.flags && a.flags.length > 0)
                .slice(0, 8)
                .map((a) => {
                  const emp = ds.employees.find((e) => e.id === a.employeeId);
                  if (!emp) return null;
                  return (
                    <div key={a.id} className="flex items-center gap-3 rounded-xl border bg-card p-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={emp.avatar} alt={emp.fullName} />
                        <AvatarFallback>{initials(emp.fullName)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">{emp.fullName}</div>
                        <div className="text-xs text-muted-foreground">
                          {a.date} · {a.flags?.join(", ")}
                        </div>
                      </div>
                      <Button size="sm" variant="success">Approve</Button>
                      <Button size="sm" variant="outline">Reject</Button>
                    </div>
                  );
                })}
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>

      <SelfieModal
        open={selfieOpen}
        onOpenChange={setSelfieOpen}
        onComplete={(r) => {
          toast.success(`Attendance marked · AI confidence ${r.confidence}%`);
        }}
      />
    </div>
  );
}
