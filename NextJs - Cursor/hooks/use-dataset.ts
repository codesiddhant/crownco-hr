"use client";

import * as React from "react";
import { useAppSelector } from "@/lib/store/hooks";
import { getDataset, getHydrationDataset } from "@/lib/mock/service";
import type { SeedDataset } from "@/lib/mock/seed";

export function useDataset(): SeedDataset {
  useAppSelector((s) => s.data.optimisticVersion);
  const [live, setLive] = React.useState(false);

  React.useEffect(() => {
    setLive(true);
  }, []);

  if (!live) {
    return getHydrationDataset();
  }
  return getDataset();
}
