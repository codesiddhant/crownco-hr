"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, CheckCircle2, Eye, Hand, Loader2, Smile, Sparkles, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const GESTURES = [
  { id: "blink", label: "Blink twice", icon: Eye },
  { id: "smile", label: "Show a smile", icon: Smile },
  { id: "raise", label: "Raise right hand", icon: Hand }
];

const STEPS = [
  "Detecting face",
  "Liveness check",
  "Gesture verification",
  "Matching identity",
  "Geo + device check"
];

interface SelfieModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onComplete?: (result: { confidence: number; gesture: string }) => void;
}

export function SelfieModal({ open, onOpenChange, onComplete }: SelfieModalProps) {
  const [state, setState] = React.useState<"idle" | "running" | "done">("idle");
  const [step, setStep] = React.useState(0);
  const [confidence, setConfidence] = React.useState(0);
  const [gesture, setGesture] = React.useState(GESTURES[0]);

  React.useEffect(() => {
    if (open) {
      setState("idle");
      setStep(0);
      setConfidence(0);
      setGesture(GESTURES[Math.floor(Math.random() * GESTURES.length)]);
    }
  }, [open]);

  const start = async () => {
    setState("running");
    setConfidence(0);
    for (let i = 0; i < STEPS.length; i++) {
      setStep(i);
      const start = Date.now();
      while (Date.now() - start < 900) {
        await new Promise((r) => setTimeout(r, 70));
        setConfidence((c) => Math.min(99.3, c + Math.random() * 3));
      }
    }
    setConfidence(99.4);
    setState("done");
    onComplete?.({ confidence: 99.4, gesture: gesture.id });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0" hideClose>
        <div className="grid md:grid-cols-2">
          {/* Camera */}
          <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-primary/15 to-accent/15">
            <div className="absolute inset-0 grid-bg opacity-30" />
            <button
              onClick={() => onOpenChange(false)}
              className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-card/80 text-foreground backdrop-blur hover:bg-card"
            >
              <X className="h-3.5 w-3.5" />
            </button>

            <div className="absolute inset-0 flex items-center justify-center p-6">
              <div className="relative h-64 w-64">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/50 bg-card/40 backdrop-blur" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <gesture.icon className="h-28 w-28 text-primary/70" strokeWidth={1.1} />
                </div>
                {state === "running" && (
                  <>
                    <motion.div
                      initial={{ y: -120 }}
                      animate={{ y: 120 }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-x-0 top-1/2 h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-glow"
                    />
                    <motion.div
                      className="absolute -inset-4 rounded-full border-2 border-primary/60"
                      animate={{ scale: [1, 1.06, 1], opacity: [0.6, 0.2, 0.6] }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                    />
                  </>
                )}
                {state === "done" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -bottom-1 -right-1 flex h-14 w-14 items-center justify-center rounded-full bg-success text-success-foreground shadow-glow"
                  >
                    <CheckCircle2 className="h-7 w-7" />
                  </motion.div>
                )}
              </div>
            </div>

            <div className="absolute bottom-3 left-3 right-3">
              <Badge variant="info" className="w-full justify-center py-1.5">
                <gesture.icon className="h-3.5 w-3.5" />
                Please: {gesture.label}
              </Badge>
            </div>
          </div>

          {/* Status */}
          <div className="flex flex-col p-6">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Camera className="h-4 w-4" />
              </div>
              <div>
                <div className="text-base font-semibold">Live selfie attendance</div>
                <div className="text-xs text-muted-foreground">AI-powered liveness verification</div>
              </div>
            </div>

            <div className="mt-6 flex-1 space-y-3">
              {STEPS.map((s, i) => (
                <div key={s} className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full border text-xs",
                      state === "running" && step === i
                        ? "border-primary bg-primary/10 text-primary"
                        : state === "done" || (state === "running" && step > i)
                          ? "border-success bg-success text-success-foreground"
                          : "border-border text-muted-foreground"
                    )}
                  >
                    {state === "done" || (state === "running" && step > i) ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : state === "running" && step === i ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-sm",
                      state === "running" && step === i && "font-medium",
                      (state === "done" || (state === "running" && step > i)) && "text-muted-foreground line-through"
                    )}
                  >
                    {s}
                  </span>
                </div>
              ))}
            </div>

            {state !== "idle" && (
              <div className="mb-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-primary" />
                    AI confidence
                  </span>
                  <span className="font-semibold tabular-nums text-primary">
                    {confidence.toFixed(1)}%
                  </span>
                </div>
                <Progress value={confidence} indicatorClass="bg-brand-gradient" />
              </div>
            )}

            {state === "idle" && (
              <Button variant="brand" size="lg" className="w-full" onClick={start}>
                <Camera className="h-4 w-4" />
                Start verification
              </Button>
            )}
            {state === "running" && (
              <Button variant="brand" size="lg" className="w-full" disabled>
                <Loader2 className="h-4 w-4 animate-spin" />
                Verifying...
              </Button>
            )}
            {state === "done" && (
              <Button variant="success" size="lg" className="w-full" onClick={() => onOpenChange(false)}>
                <CheckCircle2 className="h-4 w-4" />
                Attendance marked
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
