"use client";

import * as React from "react";
import {
  CheckCircle2,
  Compass,
  MapPin,
  Navigation,
  PhoneCall,
  Receipt,
  Route as RouteIcon,
  Sparkles,
  Timer,
  TrendingUp,
  Users
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { SectionCard } from "@/components/shared/section-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LiveTrackMap } from "@/components/maps/live-track-map-client";
import { useDataset } from "@/hooks/use-dataset";
import { useAppSelector } from "@/lib/store/hooks";

export default function FieldDashboardPage() {
  const ds = useDataset();
  const user = useAppSelector((s) => s.auth.user);
  const me = ds.employees.find((e) => e.fullName === user?.name) ?? ds.employees[0];
  const myVisits = ds.fieldVisits.filter((v) => v.employeeId === me.id);
  const today = new Date().toDateString();
  const todayVisits = myVisits.filter((v) => new Date(v.arrivedAt).toDateString() === today);

  // Simulated current location around Mumbai
  const currentLat = 19.076 + (Math.random() - 0.5) * 0.04;
  const currentLng = 72.8777 + (Math.random() - 0.5) * 0.04;

  const visits = myVisits.slice(0, 6).map((v) => ({
    id: v.id,
    name: v.customerName,
    lat: v.lat,
    lng: v.lng,
    time: new Date(v.arrivedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
  }));

  const route: [number, number][] = [
    [currentLat, currentLng],
    ...visits.slice(0, 4).map((v) => [v.lat, v.lng] as [number, number])
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Hi, ${user?.name?.split(" ")[0] || "Field"}`}
        description="Your day on the road"
        actions={
          <Button variant="brand" size="sm">
            <MapPin className="h-4 w-4" />
            Start visit
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Visits today" value={todayVisits.length} format="number" icon={MapPin} accent="primary" />
        <KpiCard label="Distance traveled" value={42.6} suffix="km" format="number" icon={RouteIcon} accent="info" />
        <KpiCard label="Time on field" value="6h 14m" icon={Timer} accent="success" />
        <KpiCard label="Expenses pending" value={3} format="number" icon={Receipt} accent="warning" />
      </div>

      <SectionCard
        title="Live route"
        description="Your visits and current location"
        icon={<Navigation className="h-4 w-4 text-primary" />}
      >
        <div className="overflow-hidden rounded-2xl border">
          <LiveTrackMap
            employees={[{
              id: me.id,
              name: me.fullName,
              lat: currentLat,
              lng: currentLng,
              color: "#10B981",
              status: "On the way to next visit"
            }]}
            visits={visits}
            route={route}
            center={[currentLat, currentLng]}
            height={420}
          />
        </div>
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Upcoming visits" icon={<MapPin className="h-4 w-4" />}>
          <div className="space-y-2">
            {myVisits.slice(0, 5).map((v, i) => (
              <Card key={v.id} className="p-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary text-sm font-bold">
                    {i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold">{v.customerName}</div>
                    <div className="truncate text-xs text-muted-foreground">{v.customerAddress}</div>
                    <div className="mt-1 flex gap-2 text-[10px]">
                      <Badge variant="outline">{v.outcome}</Badge>
                      <span className="text-muted-foreground">{v.durationMin}m duration</span>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Navigation className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="AI route suggestions"
          icon={<Sparkles className="h-4 w-4 text-primary" />}
        >
          <div className="space-y-3">
            <div className="rounded-2xl border border-success/30 bg-success/[0.04] p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-success">
                <CheckCircle2 className="h-4 w-4" />
                Optimized route saves 14km
              </div>
              <p className="mt-1 text-xs text-success/80">
                Switching visit order: ABC Realty → XYZ Corp → DEF Industries reduces total travel by 38 minutes.
              </p>
              <Button size="sm" variant="outline" className="mt-2">Apply</Button>
            </div>
            <div className="rounded-2xl border border-warning/30 bg-warning/[0.04] p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-warning">
                <Timer className="h-4 w-4" />
                Heavy traffic ahead at 4 PM
              </div>
              <p className="mt-1 text-xs">
                Plan to leave PQR Industries before 3:30 PM to avoid 25-min delay.
              </p>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
