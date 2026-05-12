"use client";

import dynamic from "next/dynamic";

const LiveTrackMap = dynamic(() => import("./live-track-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-2xl bg-muted/30">
      <div className="text-sm text-muted-foreground">Loading map...</div>
    </div>
  )
});

export { LiveTrackMap };
