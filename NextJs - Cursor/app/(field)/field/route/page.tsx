"use client";

import * as React from "react";
import {
  Pause,
  Play,
  RotateCcw,
  Clock,
  MapPin,
  Navigation,
  Route as RouteIcon,
  Sparkles,
  Timer,
  TrendingUp
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { KpiCard } from "@/components/shared/kpi-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { LiveTrackMap } from "@/components/maps/live-track-map-client";
import { useDataset } from "@/hooks/use-dataset";
import { useAppSelector } from "@/lib/store/hooks";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function FieldRoutePage() {
  const ds = useDataset();
  const user = useAppSelector((s) => s.auth.user);
  const me = ds.employees.find((e) => e.fullName === user?.name) ?? ds.employees[0];
  const myVisits = ds.fieldVisits.filter((v) => v.employeeId === me.id).slice(0, 6);

  const [playing, setPlaying] = React.useState(false);
  const [position, setPosition] = React.useState(0);

  React.useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      setPosition((p) => {
        if (p >= 100) {
          setPlaying(false);
          return 100;
        }
        return p + 1;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [playing]);

  const routePoints: [number, number][] = myVisits.map((v) => [v.lat, v.lng]);
  const fullRoute: [number, number][] = routePoints.length > 0
    ? Array.from({ length: 30 }, (_, i) => {
        const idx = Math.floor((i / 30) * (routePoints.length - 1));
        const next = Math.min(idx + 1, routePoints.length - 1);
        const t = ((i / 30) * (routePoints.length - 1)) - idx;
        const lat = routePoints[idx][0] * (1 - t) + routePoints[next][0] * t;
        const lng = routePoints[idx][1] * (1 - t) + routePoints[next][1] * t;
        return [lat, lng];
      })
    : [];

  const playedIdx = Math.floor((position / 100) * fullRoute.length);
  const currentPos = fullRoute[Math.max(0, playedIdx - 1)] || fullRoute[0] || [19.076, 72.8777];

  const visits = myVisits.map((v) => ({
    id: v.id,
    name: v.customerName,
    lat: v.lat,
    lng: v.lng,
    time: new Date(v.arrivedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Route playback"
        description="Replay your day on the road"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Distance covered" value={48.4} suffix="km" format="number" icon={RouteIcon} accent="primary" />
        <KpiCard label="Time on field" value="7h 22m" icon={Timer} accent="info" />
        <KpiCard label="Visits made" value={myVisits.length} format="number" icon={MapPin} accent="success" />
        <KpiCard label="Efficiency" value={87} suffix="%" format="number" icon={TrendingUp} accent="warning" />
      </div>

      <SectionCard
        title="Route map"
        description="Drag the slider to scrub through your day"
        icon={<Navigation className="h-4 w-4 text-primary" />}
      >
        <div className="overflow-hidden rounded-2xl border">
          <LiveTrackMap
            employees={[{
              id: me.id,
              name: me.fullName,
              lat: currentPos[0],
              lng: currentPos[1],
              color: "#2563EB",
              status: `Playback ${position}%`
            }]}
            visits={visits.slice(0, Math.max(1, Math.ceil((position / 100) * visits.length)))}
            route={fullRoute.slice(0, playedIdx + 1)}
            center={currentPos}
            height={420}
          />
        </div>

        <div className="mt-4 space-y-3 rounded-2xl border bg-card p-4">
          <div className="flex items-center gap-3">
            <Button
              size="icon"
              variant="brand"
              className="h-10 w-10 rounded-full"
              onClick={() => setPlaying((p) => !p)}
            >
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
            </Button>
            <Button size="icon" variant="outline" onClick={() => { setPosition(0); setPlaying(false); }}>
              <RotateCcw className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <Slider
                value={[position]}
                max={100}
                step={1}
                onValueChange={(v) => setPosition(v[0])}
              />
              <div className="mt-1 flex justify-between text-[10px] text-muted-foreground tabular-nums">
                <span>8:00 AM</span>
                <span>{position}%</span>
                <span>7:30 PM</span>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Visit timeline" icon={<Clock className="h-4 w-4" />}>
        <div className="space-y-2">
          {myVisits.map((v, i) => {
            const reached = (position / 100) * myVisits.length > i;
            return (
              <motion.div
                key={v.id}
                animate={{
                  borderColor: reached ? "hsl(var(--success))" : "hsl(var(--border))",
                  opacity: reached ? 1 : 0.6
                }}
                className="flex items-center gap-3 rounded-xl border bg-card p-3"
              >
                <div className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold",
                  reached ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"
                )}>
                  {i + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">{v.customerName}</div>
                  <div className="truncate text-xs text-muted-foreground">{v.customerAddress}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs tabular-nums">
                    {new Date(v.arrivedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                  <div className="text-[10px] text-muted-foreground">{v.durationMin} min</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
