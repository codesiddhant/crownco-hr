"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function OtpPage() {
  const router = useRouter();
  const [digits, setDigits] = React.useState<string[]>(["", "", "", "", "", ""]);
  const refs = React.useRef<(HTMLInputElement | null)[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [resendCooldown, setResendCooldown] = React.useState(28);

  React.useEffect(() => {
    refs.current[0]?.focus();
    const id = setInterval(() => setResendCooldown((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  const onChange = (i: number, v: string) => {
    const char = v.slice(-1);
    if (char && !/[0-9]/.test(char)) return;
    const next = [...digits];
    next[i] = char;
    setDigits(next);
    if (char && i < 5) refs.current[i + 1]?.focus();
  };

  const onKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const onPaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!text) return;
    const next = Array(6).fill("");
    text.split("").forEach((c, i) => (next[i] = c));
    setDigits(next);
    refs.current[Math.min(text.length, 5)]?.focus();
  };

  const verify = async () => {
    if (digits.some((d) => !d)) {
      toast.error("Enter all 6 digits");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success("OTP verified");
    router.push("/onboarding");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight">Verify your email</h1>
        <p className="text-sm text-muted-foreground">
          We've sent a 6-digit code to your email. Enter it below.
        </p>
      </div>

      <div className="flex gap-2" onPaste={onPaste}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            value={d}
            onChange={(e) => onChange(i, e.target.value)}
            onKeyDown={(e) => onKey(i, e)}
            inputMode="numeric"
            maxLength={1}
            className={cn(
              "h-14 w-12 rounded-xl border bg-background text-center text-2xl font-semibold tabular-nums shadow-soft outline-none ring-focus transition-all",
              d ? "border-primary text-primary" : "border-input"
            )}
          />
        ))}
      </div>

      <Button variant="brand" className="w-full" size="lg" onClick={verify} disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & continue"}
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        Didn't receive the code?{" "}
        <button
          disabled={resendCooldown > 0}
          onClick={() => {
            setResendCooldown(28);
            toast.success("Code resent");
          }}
          className={cn(
            "font-medium",
            resendCooldown > 0 ? "text-muted-foreground" : "text-primary hover:underline"
          )}
        >
          {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend"}
        </button>
      </div>
    </motion.div>
  );
}
