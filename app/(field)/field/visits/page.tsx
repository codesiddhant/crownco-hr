"use client";

import * as React from "react";
import {
  Camera,
  CheckCircle2,
  Clock,
  FileSignature,
  MapPin,
  PlusCircle,
  QrCode,
  Sparkles,
  Timer,
  XCircle
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useDataset } from "@/hooks/use-dataset";
import { useAppSelector } from "@/lib/store/hooks";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { FieldVisit } from "@/types";
import { toast } from "sonner";

export default function FieldVisitsPage() {
  const ds = useDataset();
  const user = useAppSelector((s) => s.auth.user);
  const me = ds.employees.find((e) => e.fullName === user?.name) ?? ds.employees[0];
  const myVisits = ds.fieldVisits.filter((v) => v.employeeId === me.id);
  const [selected, setSelected] = React.useState<FieldVisit | null>(null);

  return (
    <div className="space-y-6">
      <PageHeader
        title="My visits"
        description="Customer visits with proof of attendance"
        actions={
          <Button variant="brand" size="sm">
            <PlusCircle className="h-4 w-4" />
            New visit
          </Button>
        }
      />

      <Tabs defaultValue="today">
        <TabsList>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="week">This week</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-3">
          {myVisits.slice(0, 5).map((v) => (
            <VisitCard key={v.id} visit={v} onClick={() => setSelected(v)} />
          ))}
        </TabsContent>

        <TabsContent value="week" className="space-y-3">
          {myVisits.slice(0, 12).map((v) => (
            <VisitCard key={v.id} visit={v} onClick={() => setSelected(v)} />
          ))}
        </TabsContent>

        <TabsContent value="all" className="space-y-3">
          {myVisits.map((v) => (
            <VisitCard key={v.id} visit={v} onClick={() => setSelected(v)} />
          ))}
        </TabsContent>
      </Tabs>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        {selected && <VisitDetail visit={selected} />}
      </Dialog>
    </div>
  );
}

function VisitCard({ visit, onClick }: { visit: FieldVisit; onClick: () => void }) {
  const completed = !!visit.leftAt;
  const proofCount = (visit.proof.selfie ? 1 : 0) + (visit.proof.signature ? 1 : 0) + (visit.proof.qr ? 1 : 0);
  return (
    <motion.div whileHover={{ y: -2 }}>
      <Card
        onClick={onClick}
        className="cursor-pointer p-4 transition-all hover:border-primary/30 hover:shadow-elevated"
      >
        <div className="flex items-start gap-3">
          <div className={cn(
            "flex h-12 w-12 items-center justify-center rounded-2xl",
            completed ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
          )}>
            {completed ? <CheckCircle2 className="h-6 w-6" /> : <Timer className="h-6 w-6" />}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">{visit.customerName}</span>
              <Badge variant={completed ? "success" : "warning"} className="text-[10px] capitalize">
                {completed ? "Completed" : "In progress"}
              </Badge>
              <Badge variant="outline" className="text-[10px] capitalize">{visit.outcome}</Badge>
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{visit.customerAddress}</span>
            </div>
            <div className="mt-2 flex items-center gap-3 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(visit.arrivedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                {visit.leftAt && ` → ${new Date(visit.leftAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`}
              </span>
              <span>{visit.durationMin} min</span>
              <span>{proofCount}/3 proofs</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function VisitDetail({ visit }: { visit: FieldVisit }) {
  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          {visit.customerName}
        </DialogTitle>
        <DialogDescription>{visit.customerAddress}</DialogDescription>
      </DialogHeader>

      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <ProofTile
            icon={Camera}
            label="Selfie"
            verified={visit.proof.selfie}
          />
          <ProofTile
            icon={FileSignature}
            label="Signature"
            verified={visit.proof.signature}
          />
          <ProofTile
            icon={QrCode}
            label="QR scan"
            verified={visit.proof.qr}
          />
        </div>

        <div className="rounded-2xl border bg-muted/30 p-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Arrived</span>
              <span className="font-medium">
                {new Date(visit.arrivedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Left</span>
              <span className="font-medium">
                {visit.leftAt ? new Date(visit.leftAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duration</span>
              <span className="font-medium tabular-nums">{visit.durationMin} min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Outcome</span>
              <Badge variant="outline" className="text-[10px] capitalize">{visit.outcome}</Badge>
            </div>
          </div>
        </div>

        {visit.notes && (
          <div className="rounded-2xl border bg-card p-3">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Visit notes
            </div>
            <p className="mt-1 text-sm">{visit.notes}</p>
          </div>
        )}

        <div className="rounded-2xl border border-primary/20 bg-primary/[0.03] p-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
            <Sparkles className="h-3 w-3" />
            AI summary
          </div>
          <p className="mt-1 text-xs">
            Visit was productive — customer showed interest in premium plan.
            Follow-up call scheduled for next week. No objections raised.
          </p>
        </div>
      </div>
    </DialogContent>
  );
}

function ProofTile({ icon: Icon, label, verified }: { icon: any; label: string; verified: boolean }) {
  return (
    <div className={cn(
      "rounded-2xl border p-3 text-center transition-colors",
      verified ? "border-success/30 bg-success/[0.04]" : "border-dashed bg-muted/20"
    )}>
      <Icon className={cn(
        "mx-auto h-6 w-6",
        verified ? "text-success" : "text-muted-foreground"
      )} />
      <div className="mt-1.5 text-[10px] font-bold uppercase tracking-wider">{label}</div>
      {verified ? (
        <CheckCircle2 className="mx-auto mt-1 h-3 w-3 text-success" />
      ) : (
        <XCircle className="mx-auto mt-1 h-3 w-3 text-muted-foreground" />
      )}
    </div>
  );
}
