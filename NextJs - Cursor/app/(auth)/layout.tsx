import * as React from "react";
import Link from "next/link";
import { Logo } from "@/components/branding/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-50" />
      <div className="pointer-events-none absolute -top-32 -right-24 h-[480px] w-[480px] rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-[480px] w-[480px] rounded-full bg-accent/20 blur-3xl" />

      <div className="relative grid min-h-screen lg:grid-cols-2">
        <aside className="hidden flex-col justify-between p-10 lg:flex">
          <Link href="/">
            <Logo size={42} />
          </Link>

          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                AI Workforce Operating System
              </div>
              <h2 className="mt-4 max-w-md text-3xl font-semibold tracking-tight">
                The HR platform built for{" "}
                <span className="text-gradient-brand">high-performance sales teams</span>.
              </h2>
              <p className="mt-3 max-w-md text-sm text-muted-foreground">
                Real attendance. AI-powered productivity. Smart rewards. Built for CRM,
                field-force, and operations — all running on Crownco's self-hosted AI stack.
              </p>
            </div>

            <div className="grid max-w-md grid-cols-2 gap-3">
              {[
                { label: "Active employees", value: "12,400+" },
                { label: "Daily AI insights", value: "320K" },
                { label: "Geofences", value: "850+" },
                { label: "Avg attendance accuracy", value: "99.4%" }
              ].map((s) => (
                <div key={s.label} className="rounded-xl border bg-card/50 p-3 backdrop-blur">
                  <div className="text-xl font-semibold tracking-tight">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>© 2026 Crownco</span>
            <span>·</span>
            <Link href="#" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="hover:text-foreground">
              Terms
            </Link>
          </div>
        </aside>

        <main className="relative flex items-center justify-center p-6 lg:p-10">
          <div className="absolute right-6 top-6 lg:hidden">
            <Logo size={32} />
          </div>
          <div className="w-full max-w-md">{children}</div>
        </main>
      </div>
    </div>
  );
}
