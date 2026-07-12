"use client";

import React from "react";
import Link from "next/link";
import { useAllTests } from "@/hooks/queries/useTests";
import { useAttempts } from "@/hooks/queries/useAttempts";
import { Button } from "@/components/ui/button";
import { Clock, PlayCircle, BarChart2, CheckCircle2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { data: attempts, isLoading: isLoadingAttempts } = useAttempts();
  const { data: testManifest, isLoading: isLoadingTests } = useAllTests();

  if (isLoadingAttempts || isLoadingTests) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 w-full rounded-2xl" />)}
        </div>
      </div>
    );
  }

  // Get active or past attempts
  const recentAttempts = attempts?.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()) || [];

  return (
    <div className="space-y-10 pb-12 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back!</h1>
        <p className="text-muted-foreground">Continue your preparation for GATE CS.</p>
      </div>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold tracking-tight">Available Mock Tests</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(testManifest || []).map((test) => {
            const attemptForTest = recentAttempts.find(a => a.testId === test.id);
            const isInProgress = attemptForTest?.status === "in-progress";
            const isCompleted = attemptForTest?.status === "submitted" || attemptForTest?.status === "auto-submitted";

            return (
              <div key={test.id} className="bg-card border rounded-3xl p-6 shadow-sm flex flex-col hover:border-primary/50 transition-colors">
                <div className="mb-4">
                  <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-3">
                    {test.source}
                  </div>
                  <h3 className="text-lg font-bold line-clamp-2">{test.title}</h3>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{test.durationMinutes} mins</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{test.totalQuestions} Questions</span>
                  </div>
                </div>

                <div className="mt-auto">
                  {isInProgress ? (
                    <Link href={`/tests/${test.id}/attempt/${attemptForTest.id}`}>
                      <Button className="w-full bg-warning text-warning-foreground hover:bg-warning/90 shadow-glow">
                        <PlayCircle className="w-4 h-4 mr-2" /> Resume Test
                      </Button>
                    </Link>
                  ) : isCompleted ? (
                    <div className="flex gap-2">
                      <Link href={`/results/${attemptForTest.id}`} className="flex-1">
                        <Button variant="outline" className="w-full text-primary border-primary/20 hover:bg-primary/5">
                          <BarChart2 className="w-4 h-4 mr-2" /> View Results
                        </Button>
                      </Link>
                      <Link href={`/tests/${test.id}/instructions`} className="flex-1">
                        <Button className="w-full shadow-glow">
                          Retake
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <Link href={`/tests/${test.id}/instructions`}>
                      <Button className="w-full shadow-glow">
                        Start Test
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
