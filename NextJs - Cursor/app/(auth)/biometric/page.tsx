"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Fingerprint, ArrowLeft, CheckCircle2, Shield } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function BiometricPage() {
  const router = useRouter();
  const [state, setState] = React.useState<"idle" | "scanning" | "done">("idle");

  const start = async () => {
    setState("scanning");
    await new Promise((r) => setTimeout(r, 1800));
    setState("done");
    toast.success("Biometric authentication successful");
    await new Promise((r) => setTimeout(r, 700));
    router.push("/hr/dashboard");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to login
      </Link>

      <div className="space-y-1.5 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Biometric login</h1>
        <p className="text-sm text-muted-foreground">
          Touch the fingerprint sensor to authenticate securely.
        </p>
      </div>

      <div className="mx-auto flex h-56 w-56 items-center justify-center">
        <div className="relative">
          {state === "scanning" && (
            <>
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-primary"
                animate={{ scale: [1, 1.4, 1.4], opacity: [0.6, 0, 0] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-primary"
                animate={{ scale: [1, 1.6, 1.6], opacity: [0.6, 0, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, delay: 0.4 }}
              />
            </>
          )}
          <motion.button
            onClick={start}
            disabled={state === "scanning" || state === "done"}
            whileTap={{ scale: 0.96 }}
            className="relative flex h-40 w-40 items-center justify-center rounded-full bg-brand-gradient shadow-glow-lg text-white"
          >
            {state === "done" ? (
              <CheckCircle2 className="h-16 w-16" />
            ) : (
              <Fingerprint className="h-20 w-20" strokeWidth={1.4} />
            )}
          </motion.button>
        </div>
      </div>

      <div className="text-center text-sm font-medium">
        {state === "idle" && "Tap to authenticate"}
        {state === "scanning" && "Reading fingerprint..."}
        {state === "done" && (
          <span className="text-success">Authenticated · Redirecting…</span>
        )}
      </div>

      <div className="flex items-center justify-center gap-2 rounded-xl border bg-card/60 p-2 text-xs text-muted-foreground">
        <Shield className="h-3.5 w-3.5 text-success" />
        Hardware-bound · Stored on device only
      </div>

      <Button variant="outline" className="w-full" asChild>
        <Link href="/login">Use password instead</Link>
      </Button>
    </motion.div>
  );
}
