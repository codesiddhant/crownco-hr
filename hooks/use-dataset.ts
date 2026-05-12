"use client";

import * as React from "react";
import { useAppSelector } from "@/lib/store/hooks";
import { getDataset } from "@/lib/mock/service";
import type { SeedDataset } from "@/lib/mock/seed";

export function useDataset(): SeedDataset {
  useAppSelector((s) => s.data.optimisticVersion);
  const [ds, setDs] = React.useState<SeedDataset | null>(null);

  React.useEffect(() => {
    setDs(getDataset());
  }, []);

  if (!ds) {
    return getDataset();
  }
  return getDataset();
}
