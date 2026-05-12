"use client";

import dynamic from "next/dynamic";

export const GeofenceMap = dynamic(
  () => import("./geofence-map").then((m) => m.GeofenceMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[360px] items-center justify-center rounded-2xl border bg-muted/30 text-sm text-muted-foreground">
        Loading map...
      </div>
    )
  }
);
