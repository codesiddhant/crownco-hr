"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Copy, Sparkles, Building2, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Logo } from "@/components/branding/logo";

export default function InvitePage() {
  const [sending, setSending] = React.useState(false);

  const send = async () => {
    setSending(true);
    await new Promise((r) => setTimeout(r, 900));
    setSending(false);
    toast.success("Invites sent to 3 recipients");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight">Invite your team</h1>
        <p className="text-sm text-muted-foreground">
          Bulk-invite employees to your workspace. They'll receive an email + WhatsApp link.
        </p>
      </div>

      <div className="space-y-3">
        <Label>Emails</Label>
        <Textarea
          rows={3}
          defaultValue={"rohan.verma@crownco.ai\npriya.patel@crownco.ai\nvihaan.singh@crownco.ai"}
        />
        <p className="text-xs text-muted-foreground">One per line, or comma-separated.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Default role</Label>
          <Select defaultValue="employee">
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="employee">Employee</SelectItem>
              <SelectItem value="manager">Team Manager</SelectItem>
              <SelectItem value="hr_admin">HR Admin</SelectItem>
              <SelectItem value="field">Field Employee</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Department</Label>
          <Select defaultValue="sales">
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="sales">Sales</SelectItem>
              <SelectItem value="support">Support</SelectItem>
              <SelectItem value="hr">HR</SelectItem>
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="ops">Operations</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-2xl border bg-muted/30 p-4">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5" />
          Email preview
        </div>
        <div className="rounded-xl bg-card p-4 shadow-soft">
          <div className="mb-3 flex items-center justify-between">
            <Logo size={28} />
            <span className="text-xs text-muted-foreground">noreply@crownco.ai</span>
          </div>
          <div className="text-sm">
            <div className="font-medium">You're invited to join Crownco HR</div>
            <p className="mt-2 text-muted-foreground">
              Hi there, <strong>Ananya Sharma</strong> has invited you to join{" "}
              <strong>Crownco Realty Pvt Ltd</strong> on Crownco HR — the AI-powered workforce OS.
            </p>
            <Button size="sm" variant="brand" className="mt-3">
              Accept invite
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-4 shadow-soft">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium">Or share a public invite link</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText("https://crownco.ai/join/xT8aP2");
              toast.success("Link copied");
            }}
          >
            <Copy className="h-3.5 w-3.5" />
            Copy
          </Button>
        </div>
        <code className="block truncate rounded-lg bg-muted px-3 py-2 text-xs">
          https://crownco.ai/join/xT8aP2
        </code>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="ghost" asChild>
          <Link href="/hr/dashboard">Skip for now</Link>
        </Button>
        <Button variant="brand" onClick={send} disabled={sending}>
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4" /> Send invites</>}
        </Button>
      </div>
    </motion.div>
  );
}
