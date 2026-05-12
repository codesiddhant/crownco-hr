"use client";

import * as React from "react";
import {
  Bell,
  Building2,
  Camera,
  CheckCircle2,
  Cpu,
  Globe2,
  KeySquare,
  Link2,
  Lock,
  MapPin,
  Plus,
  Save,
  Settings as SettingsIcon,
  Shield,
  ShieldCheck,
  Sparkles,
  Smartphone,
  Sliders,
  Trash,
  Users,
  Wifi,
  Workflow
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { GeofenceMap } from "@/components/maps/geofence-map-client";
import { useDataset } from "@/hooks/use-dataset";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initials } from "@/lib/utils";
import { toast } from "sonner";

export default function HRSettingsPage() {
  const ds = useDataset();
  const [wifiList, setWifiList] = React.useState([
    { id: "w1", ssid: "Crownco-HQ", bssid: "AA:BB:CC:DD:EE:01", branch: "Mumbai HQ", active: true },
    { id: "w2", ssid: "Crownco-Bengaluru", bssid: "AA:BB:CC:DD:EE:02", branch: "Bengaluru", active: true },
    { id: "w3", ssid: "Crownco-Delhi", bssid: "AA:BB:CC:DD:EE:03", branch: "Delhi NCR", active: true },
    { id: "w4", ssid: "Crownco-Pune-Guest", bssid: "AA:BB:CC:DD:EE:04", branch: "Pune", active: false }
  ]);
  const [radius, setRadius] = React.useState(200);
  const [selectedBranch, setSelectedBranch] = React.useState(ds.branches[0]);

  const integrations = [
    { name: "WhatsApp Business", status: "connected", icon: "💬" },
    { name: "Slack", status: "connected", icon: "💼" },
    { name: "Google Workspace", status: "connected", icon: "📧" },
    { name: "Zoom", status: "disconnected", icon: "🎥" },
    { name: "Microsoft 365", status: "disconnected", icon: "🪟" },
    { name: "Razorpay Payroll", status: "connected", icon: "💳" }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Configure organization, attendance, AI, and security"
        actions={
          <Button variant="brand" size="sm" onClick={() => toast.success("Settings saved")}>
            <Save className="h-4 w-4" />
            Save changes
          </Button>
        }
      />

      <Tabs defaultValue="org">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="org"><Building2 className="mr-1.5 h-3.5 w-3.5" />Organization</TabsTrigger>
          <TabsTrigger value="attendance"><Camera className="mr-1.5 h-3.5 w-3.5" />Attendance</TabsTrigger>
          <TabsTrigger value="ai"><Sparkles className="mr-1.5 h-3.5 w-3.5" />AI</TabsTrigger>
          <TabsTrigger value="security"><Shield className="mr-1.5 h-3.5 w-3.5" />Security</TabsTrigger>
          <TabsTrigger value="devices"><Smartphone className="mr-1.5 h-3.5 w-3.5" />Devices</TabsTrigger>
          <TabsTrigger value="permissions"><Users className="mr-1.5 h-3.5 w-3.5" />Permissions</TabsTrigger>
          <TabsTrigger value="integrations"><Link2 className="mr-1.5 h-3.5 w-3.5" />Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="org" className="space-y-3">
          <SectionCard title="Organization details">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Organization name</Label>
                <Input defaultValue="Crownco Technologies Pvt Ltd" />
              </div>
              <div className="space-y-2">
                <Label>Industry</Label>
                <Select defaultValue="saas">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="saas">SaaS / Software</SelectItem>
                    <SelectItem value="real_estate">Real Estate</SelectItem>
                    <SelectItem value="bfsi">BFSI</SelectItem>
                    <SelectItem value="bpo">BPO / Call Center</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Team size</Label>
                <Select defaultValue="251">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="51">51-250</SelectItem>
                    <SelectItem value="251">251-1000</SelectItem>
                    <SelectItem value="1001">1001+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Timezone</Label>
                <Select defaultValue="ist">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ist">Asia/Kolkata (IST)</SelectItem>
                    <SelectItem value="gst">Asia/Dubai (GST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Branches" actions={
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4" />
              Add branch
            </Button>
          }>
            <div className="space-y-2">
              {ds.branches.map((b) => (
                <div key={b.id} className="flex items-center gap-3 rounded-xl border bg-card p-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{b.name}</div>
                    <div className="text-xs text-muted-foreground">{b.address}</div>
                  </div>
                  <Badge variant="success" className="text-[10px]">Active</Badge>
                </div>
              ))}
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-3">
          <SectionCard title="Attendance methods" description="Enable/disable for your workforce">
            <div className="space-y-3">
              {[
                { label: "Geofence (GPS)", desc: "Auto check-in when entering office radius", on: true, icon: MapPin },
                { label: "WiFi attendance", desc: "Mark attendance via office WiFi", on: true, icon: Wifi },
                { label: "Live selfie + gesture", desc: "Anti-spoofing for remote/field staff", on: true, icon: Camera },
                { label: "Voice verification", desc: "Voiceprint-based attendance", on: false, icon: Sliders },
                { label: "Manual check-in", desc: "Allow employees to mark manually", on: false, icon: CheckCircle2 }
              ].map((m, i) => {
                const Icon = m.icon;
                return (
                  <div key={i} className="flex items-center justify-between rounded-xl border p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{m.label}</div>
                        <div className="text-xs text-muted-foreground">{m.desc}</div>
                      </div>
                    </div>
                    <Switch defaultChecked={m.on} />
                  </div>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard title="Geofence configurator" description="Adjust radius for each branch">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Branch</Label>
                  <Select value={selectedBranch.id} onValueChange={(v) => setSelectedBranch(ds.branches.find((b) => b.id === v) || ds.branches[0])}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {ds.branches.map((b) => (
                        <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Radius</Label>
                    <span className="text-xs tabular-nums">{radius}m</span>
                  </div>
                  <Slider
                    value={[radius]}
                    min={50}
                    max={500}
                    step={10}
                    onValueChange={(v) => setRadius(v[0])}
                  />
                </div>
              </div>
              <div className="overflow-hidden rounded-2xl border md:col-span-2">
                <GeofenceMap
                  branch={selectedBranch}
                  radius={radius}
                  height={300}
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="WiFi whitelist"
            description="Only these networks can auto-mark attendance"
            actions={
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4" />
                Add WiFi
              </Button>
            }
          >
            <div className="space-y-2">
              {wifiList.map((w) => (
                <div key={w.id} className="flex items-center gap-3 rounded-xl border bg-card p-3">
                  <Wifi className={`h-5 w-5 ${w.active ? "text-success" : "text-muted-foreground"}`} />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{w.ssid}</div>
                    <div className="text-[10px] font-mono text-muted-foreground">{w.bssid} · {w.branch}</div>
                  </div>
                  <Switch
                    checked={w.active}
                    onCheckedChange={(v) => setWifiList((l) => l.map((x) => x.id === w.id ? { ...x, active: v } : x))}
                  />
                  <Button size="icon" variant="ghost" className="h-7 w-7"><Trash className="h-3.5 w-3.5" /></Button>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Shift rules">
            <div className="grid gap-3 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Grace period (min)</Label>
                <Input type="number" defaultValue={15} />
              </div>
              <div className="space-y-2">
                <Label>Late after (min)</Label>
                <Input type="number" defaultValue={30} />
              </div>
              <div className="space-y-2">
                <Label>Half-day threshold (hrs)</Label>
                <Input type="number" defaultValue={4} />
              </div>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="ai">
          <SectionCard
            title="AI configuration"
            description="Crowny's behavior and intelligence"
            icon={<Sparkles className="h-4 w-4 text-primary" />}
          >
            <div className="space-y-4">
              {[
                { label: "AI Leave Impact Analysis", desc: "Risk score, replacement suggestions for every leave", on: true },
                { label: "Daily WhatsApp reports", desc: "Auto-send productivity reports to employees", on: true },
                { label: "Smart task suggestions", desc: "AI surfaces high-impact tasks", on: true },
                { label: "Burnout detection", desc: "Detect operational wellness anomalies", on: true },
                { label: "AI sales coaching", desc: "Real-time coaching tips for sales calls", on: true },
                { label: "Auto resume parsing", desc: "Extract candidate info from resumes", on: true },
                { label: "Mood detection", desc: "Voice tone + chat sentiment (beta)", on: false }
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl border p-3">
                  <div>
                    <div className="text-sm font-medium">{s.label}</div>
                    <div className="text-xs text-muted-foreground">{s.desc}</div>
                  </div>
                  <Switch defaultChecked={s.on} />
                </div>
              ))}
              <Separator />
              <div className="space-y-2">
                <Label>Model selection</Label>
                <Select defaultValue="crowny_v2">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="crowny_v2">Crowny v2 (Internal vLLM)</SelectItem>
                    <SelectItem value="gpt4">GPT-4 (Cloud)</SelectItem>
                    <SelectItem value="claude">Claude Sonnet (Cloud)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="security" className="space-y-3">
          <SectionCard title="Security policies" icon={<Lock className="h-4 w-4" />}>
            {[
              { label: "Two-factor authentication", desc: "Required for all admins", on: true },
              { label: "Biometric login", desc: "FaceID / TouchID on mobile", on: true },
              { label: "Device binding", desc: "Lock account to specific device", on: true },
              { label: "IP anomaly detection", desc: "Alert on suspicious logins", on: true },
              { label: "Session timeout (30 min)", desc: "Auto logout on inactivity", on: false }
            ].map((s, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl border p-3 mb-2">
                <div>
                  <div className="text-sm font-medium">{s.label}</div>
                  <div className="text-xs text-muted-foreground">{s.desc}</div>
                </div>
                <Switch defaultChecked={s.on} />
              </div>
            ))}
          </SectionCard>
        </TabsContent>

        <TabsContent value="devices">
          <SectionCard title="Bound devices">
            <div className="space-y-2">
              {ds.employees.slice(0, 8).map((e) => (
                <div key={e.id} className="flex items-center gap-3 rounded-xl border bg-card p-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={e.avatar} alt={e.fullName} />
                    <AvatarFallback className="text-xs">{initials(e.fullName)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{e.fullName}</div>
                    <div className="text-xs text-muted-foreground">
                      {Math.random() > 0.5 ? "iPhone 15 Pro" : "Pixel 8"} ·{" "}
                      Last seen {Math.floor(Math.random() * 60)}m ago
                    </div>
                  </div>
                  <Badge variant="success" className="text-[10px]">Bound</Badge>
                  <Button size="sm" variant="ghost">Unbind</Button>
                </div>
              ))}
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="permissions">
          <SectionCard title="Role permissions" description="Configure what each role can access">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-xs uppercase text-muted-foreground">
                    <th className="py-2 text-left">Permission</th>
                    <th className="py-2 text-center">Super Admin</th>
                    <th className="py-2 text-center">HR</th>
                    <th className="py-2 text-center">Manager</th>
                    <th className="py-2 text-center">Employee</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {["View all employees", "Approve leave", "Run payroll", "Award rewards",
                    "Edit settings", "Delete data", "View reports", "Export data"].map((p) => (
                    <tr key={p} className="border-b">
                      <td className="py-3">{p}</td>
                      <td className="text-center"><Switch defaultChecked /></td>
                      <td className="text-center"><Switch defaultChecked={!p.includes("Delete")} /></td>
                      <td className="text-center"><Switch defaultChecked={["Approve leave", "View reports"].includes(p)} /></td>
                      <td className="text-center"><Switch defaultChecked={false} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="integrations">
          <SectionCard title="Connected services">
            <div className="grid gap-3 md:grid-cols-2">
              {integrations.map((i) => (
                <Card key={i.name} className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{i.icon}</div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold">{i.name}</div>
                      <Badge variant={i.status === "connected" ? "success" : "outline"} className="mt-1 text-[10px] capitalize">
                        {i.status}
                      </Badge>
                    </div>
                    <Button size="sm" variant={i.status === "connected" ? "outline" : "brand"}>
                      {i.status === "connected" ? "Manage" : "Connect"}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
