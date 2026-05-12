"use client";

import * as React from "react";
import { BookOpen, GraduationCap, Play, Sparkles, Trophy, Video } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const COURSES = [
  { title: "Objection Handling Masterclass", category: "Sales", duration: "2h 30m", progress: 65, ai_recommended: true, instructor: "Aanya Sharma" },
  { title: "Cold Call Opening Techniques", category: "Sales", duration: "45m", progress: 100, ai_recommended: false, instructor: "Rohan Mehta" },
  { title: "Customer Empathy 101", category: "Soft Skills", duration: "1h 15m", progress: 30, ai_recommended: true, instructor: "Priya Singh" },
  { title: "Time Management for Sales Pros", category: "Productivity", duration: "1h 45m", progress: 0, ai_recommended: true, instructor: "Karan Patel" },
  { title: "Email Pitch Writing", category: "Communication", duration: "55m", progress: 80, ai_recommended: false, instructor: "Maya Iyer" },
  { title: "Closing Techniques That Work", category: "Sales", duration: "2h 10m", progress: 0, ai_recommended: false, instructor: "Ravi Kumar" }
];

export default function EmployeeLearningPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Learning"
        description="AI-recommended courses based on your performance"
      />

      <SectionCard
        title="Personalized recommendations"
        description="Based on your call quality scores and recent objections"
        icon={<Sparkles className="h-4 w-4 text-primary" />}
      >
        <div className="rounded-2xl border border-primary/30 bg-primary/[0.04] p-4">
          <p className="text-sm">
            Your call quality dropped in objection handling this week.
            Crowny suggests the <strong>"Objection Handling Masterclass"</strong> to lift your score by 15+.
          </p>
        </div>
      </SectionCard>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {COURSES.map((c, i) => (
          <Card key={i} className="overflow-hidden hover:shadow-elevated transition-all">
            <div className="aspect-video bg-gradient-to-br from-primary/20 via-accent/20 to-warning/20 p-6 flex items-center justify-center relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <Play className="h-12 w-12 text-foreground/70" />
              </div>
              {c.ai_recommended && (
                <Badge className="absolute right-3 top-3 bg-primary text-primary-foreground text-[9px]">
                  <Sparkles className="mr-1 h-2.5 w-2.5" />
                  AI Pick
                </Badge>
              )}
              <span className="absolute right-3 bottom-3 rounded-md bg-card/90 px-2 py-0.5 text-[10px] font-medium backdrop-blur">
                {c.duration}
              </span>
            </div>
            <div className="p-4">
              <Badge variant="outline" className="text-[9px]">{c.category}</Badge>
              <h3 className="mt-1.5 text-sm font-semibold line-clamp-2">{c.title}</h3>
              <p className="mt-0.5 text-[11px] text-muted-foreground">By {c.instructor}</p>
              {c.progress > 0 && (
                <>
                  <div className="mt-3 flex items-center gap-2 text-[10px]">
                    <Progress value={c.progress} className="h-1.5 flex-1" />
                    <span className="font-bold tabular-nums">{c.progress}%</span>
                  </div>
                </>
              )}
              <Button size="sm" variant={c.progress > 0 ? "outline" : "brand"} className="mt-3 w-full">
                {c.progress === 100 ? "Completed" : c.progress > 0 ? "Continue" : "Start course"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
