"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, CheckCircle2, Loader2, ArrowLeft, ScanFace, Shield } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const STEPS = [
  { label: "Detecting face position", duration: 1200 },
  { label: "Liveness check — please blink", duration: 1500 },
  { label: "Matching against employee directory", duration: 1300 },
  { label: "Verifying device fingerprint", duration: 900 },
  { label: "Authenticating", duration: 800 }
];

export default function FaceVerifyPage() {
  const router = useRouter();
  const [step, setStep] = React.useState(-1);
  const [confidence, setConfidence] = React.useState(0);
  const [done, setDone] = React.useState(false);

  const start = async () => {
    setStep(0);
    setConfidence(0);
    for (let i = 0; i < STEPS.length; i++) {
      setStep(i);
      const start = Date.now();
      const target = STEPS[i].duration;
      while (Date.now() - start < target) {
        await new Promise((r) => setTimeout(r, 80));
        setConfidence((c) => Math.min(99.6, c + Math.random() * 3.5));
      }
    }
    setDone(true);
    setConfidence(99.6);
    toast.success("Face verified · Confidence 99.6%");
    await new Promise((r) => setTimeout(r, 800));
    router.push("/hr/dashboard");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to login
      </Link>

      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight">Face Verification</h1>
        <p className="text-sm text-muted-foreground">
          Position your face inside the frame. We'll handle the rest.
        </p>
      </div>

      <div className="relative mx-auto aspect-square max-w-sm overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/15 to-accent/15 p-6">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative flex h-full items-center justify-center">
          <div className="relative">
            <div className="relative h-44 w-44 rounded-full border-2 border-dashed border-primary/40 bg-card/40 backdrop-blur flex items-center justify-center">
              <ScanFace className="h-20 w-20 text-primary/80" strokeWidth={1.2} />
              {step >= 0 && !done && (
                <motion.div
                  initial={{ y: -80 }}
                  animate={{ y: 80 }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-glow"
                />
              )}
              {done && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -bottom-2 -right-2 flex h-12 w-12 items-center justify-center rounded-full bg-success text-success-foreground shadow-glow"
                >
                  <CheckCircle2 className="h-6 w-6" />
                </motion.div>
              )}
            </div>
          </div>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2 rounded-xl border bg-card/80 p-2 backdrop-blur text-xs">
            <Shield className="h-3.5 w-3.5 text-success" />
            <span className="text-muted-foreground">End-to-end encrypted · No images stored</span>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step >= 0 && (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                {done ? (
                  <CheckCircle2 className="h-4 w-4 text-success" />
                ) : (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                )}
                <span className="font-medium">{done ? "Verified" : STEPS[step]?.label}</span>
              </div>
              <span className="font-semibold tabular-nums text-primary">{confidence.toFixed(1)}%</span>
            </div>
            <Progress value={confidence} indicatorClass="bg-brand-gradient" />
          </motion.div>
        )}
      </AnimatePresence>

      <Button variant="brand" className="w-full" size="lg" onClick={start} disabled={step >= 0 && !done}>
        {step < 0 ? (
          <>
            <Camera className="h-4 w-4" />
            Start verification
          </>
        ) : done ? (
          "Redirecting..."
        ) : (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Verifying...
          </>
        )}
      </Button>
    </motion.div>
  );
}
