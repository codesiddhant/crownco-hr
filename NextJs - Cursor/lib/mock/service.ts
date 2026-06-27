"use client";

import { buildSeedDataset, type SeedDataset } from "./seed";

const STORAGE_KEY = "crownco_hr_dataset_v2";

let cached: SeedDataset | null = null;
let memoryOnly = false;

/** Same shape as a fresh build, but stable for SSR + first client paint (no localStorage). */
let hydrationDataset: SeedDataset | null = null;

export function getHydrationDataset(): SeedDataset {
  if (!hydrationDataset) {
    hydrationDataset = buildSeedDataset();
  }
  return hydrationDataset;
}

function isBrowser() {
  return typeof window !== "undefined";
}

export function getDataset(): SeedDataset {
  if (cached) return cached;
  if (isBrowser() && !memoryOnly) {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        cached = JSON.parse(raw) as SeedDataset;
        return cached;
      }
    } catch {
      memoryOnly = true;
    }
  }
  cached = buildSeedDataset();
  persist();
  return cached;
}

export function persist() {
  if (!cached) return;
  if (!isBrowser() || memoryOnly) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cached));
  } catch {
    memoryOnly = true;
  }
}

export function resetDataset() {
  cached = null;
  if (isBrowser()) {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }
  return getDataset();
}

export function updateDataset(mutator: (ds: SeedDataset) => void) {
  const ds = getDataset();
  mutator(ds);
  persist();
  return ds;
}
