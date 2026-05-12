"use client";

import * as React from "react";
import { CalendarClock, MapPin, Sparkles, Video } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useDataset } from "@/hooks/use-dataset";
import { initials } from "@/lib/utils";

export default function RecruiterInterviewsPage() {
  const ds = useDataset();
  const interviewCandidates = ds.candidates.filter((c) => c.stage === "interview").slice(0, 10);

  return (
    <div className="space-y-6">
      <PageHeader title="Interviews" description="Scheduled interviews this week" />
      <SectionCard title="Upcoming">
        <div className="space-y-2">
          {interviewCandidates.map((c, i) => (
            <Card key={c.id} className="p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={c.avatar} alt={c.name} />
                  <AvatarFallback>{initials(c.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.role}</div>
                  <div className="mt-1 flex items-center gap-3 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CalendarClock className="h-3 w-3" />
                      {new Date(Date.now() + i * 86400_000).toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short" })} · 11:00 AM
                    </span>
                    <span className="flex items-center gap-1">
                      <Video className="h-3 w-3" />
                      Zoom call
                    </span>
                  </div>
                </div>
                <Badge variant="default">AI {c.aiScore}</Badge>
                <Button size="sm" variant="brand">Join</Button>
              </div>
            </Card>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
