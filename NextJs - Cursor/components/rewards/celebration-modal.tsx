"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Sparkles, X, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  achievement?: {
    name: string;
    description: string;
    tier: "bronze" | "silver" | "gold" | "platinum";
    points: number;
  };
}

const TIER_COLORS = {
  bronze: "from-amber-600 via-amber-500 to-orange-600",
  silver: "from-slate-400 via-slate-300 to-slate-500",
  gold: "from-amber-400 via-yellow-300 to-amber-500",
  platinum: "from-cyan-400 via-fuchsia-400 to-violet-500"
};

export function CelebrationModal({ open, onOpenChange, achievement }: Props) {
  React.useEffect(() => {
    if (!open || typeof window === "undefined") return;
    let cancelled = false;
    const fire = async () => {
      try {
        const m = await import("canvas-confetti");
        if (cancelled) return;
        const confetti = m.default;
        const duration = 2500;
        const end = Date.now() + duration;
        const colors = ["#2563EB", "#06B6D4", "#8B5CF6", "#F59E0B", "#10B981"];
        (function frame() {
          confetti({
            particleCount: 4,
            angle: 60,
            spread: 70,
            origin: { x: 0, y: 0.7 },
            colors
          });
          confetti({
            particleCount: 4,
            angle: 120,
            spread: 70,
            origin: { x: 1, y: 0.7 },
            colors
          });
          if (Date.now() < end) requestAnimationFrame(frame);
        })();
      } catch {
        /* canvas-confetti unavailable, gracefully skip */
      }
    };
    fire();
    return () => {
      cancelled = true;
    };
  }, [open]);

  if (!achievement) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md overflow-hidden bg-gradient-to-br from-card via-card to-primary/5 p-0">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-3 top-3 z-10 rounded-full bg-card/80 p-1.5 text-muted-foreground backdrop-blur hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative px-6 pb-6 pt-12 text-center">
          <AnimatePresence>
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: Math.cos((i / 12) * Math.PI * 2) * 140,
                  y: Math.sin((i / 12) * Math.PI * 2) * 140
                }}
                transition={{
                  duration: 1.6,
                  delay: 0.1 + i * 0.04,
                  ease: "easeOut"
                }}
                className="absolute left-1/2 top-1/3 h-2 w-2 rounded-full bg-primary"
              />
            ))}
          </AnimatePresence>

          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
            className="relative mx-auto mb-4 h-24 w-24"
          >
            <div
              className={cn(
                "absolute inset-0 rounded-full bg-gradient-to-br blur-2xl opacity-60",
                TIER_COLORS[achievement.tier]
              )}
            />
            <div
              className={cn(
                "relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br shadow-xl ring-4 ring-card",
                TIER_COLORS[achievement.tier]
              )}
            >
              <Trophy className="h-12 w-12 text-white drop-shadow-lg" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary"
          >
            Achievement unlocked
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-2 text-2xl font-bold"
          >
            {achievement.name}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground"
          >
            {achievement.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary"
          >
            <Sparkles className="h-4 w-4" />+{achievement.points} XP
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-6 flex gap-2"
          >
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button variant="brand" className="flex-1">
              <Award className="h-4 w-4" />
              Share win
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
