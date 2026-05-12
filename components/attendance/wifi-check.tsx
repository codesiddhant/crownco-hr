"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Shield, Wifi, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CHECKS = [
  { id: "ssid", label: "SSID matches whitelist", status: "ok" },
  { id: "bssid", label: "BSSID fingerprint verified", status: "ok" },
  { id: "vpn", label: "No VPN/Proxy detected", status: "ok" },
  { id: "fake", label: "Anti-spoofing check", status: "ok" },
  { id: "device", label: "Device fingerprint bound", status: "ok" },
  { id: "root", label: "Root/jailbreak scan", status: "ok" }
];

interface WifiCheckProps {
  ssid?: string;
  onComplete?: () => void;
}

export function WifiCheck({ ssid = "Crownco-HQ", onComplete }: WifiCheckProps) {
  const [step, setStep] = React.useState(-1);
  const [done, setDone] = React.useState(false);

  const run = async () => {
    setDone(false);
    for (let i = 0; i < CHECKS.length; i++) {
      setStep(i);
      await new Promise((r) => setTimeout(r, 380));
    }
    setDone(true);
    onComplete?.();
  };

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-3 border-b bg-gradient-to-br from-primary/5 to-info/5 p-4">
        <motion.div
          animate={done ? { scale: 1 } : { scale: [1, 1.1, 1] }}
          transition={{ duration: 1.4, repeat: done ? 0 : Infinity }}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-glow"
        >
          <Wifi className="h-5 w-5" />
        </motion.div>
        <div className="flex-1">
          <div className="text-sm font-semibold">
            Connected to <span className="text-primary">{ssid}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            BSSID: A4:B1:C2:D3:E4:01 · Signal: −48 dBm
          </div>
        </div>
        {done && (
          <Badge variant="success">
            <CheckCircle2 className="h-3 w-3" />
            Verified
          </Badge>
        )}
      </div>
      <div className="space-y-2 p-4">
        {CHECKS.map((c, i) => {
          const active = step === i;
          const finished = step > i || done;
          return (
            <div key={c.id} className="flex items-center justify-between rounded-xl border bg-card p-3">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full",
                    finished
                      ? "bg-success/15 text-success"
                      : active
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground"
                  )}
                >
                  {finished ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : active ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Shield className="h-3.5 w-3.5" />
                  )}
                </div>
                <span className="text-sm">{c.label}</span>
              </div>
              <span
                className={cn(
                  "text-[10px] font-semibold uppercase tracking-wider",
                  finished ? "text-success" : active ? "text-primary" : "text-muted-foreground"
                )}
              >
                {finished ? "Pass" : active ? "Checking…" : "Pending"}
              </span>
            </div>
          );
        })}
      </div>
      <div className="border-t p-4">
        <Button variant="brand" size="sm" className="w-full" onClick={run} disabled={step >= 0 && !done}>
          {step < 0 ? "Run WiFi verification" : done ? "Re-run check" : "Verifying..."}
        </Button>
      </div>
    </Card>
  );
}
