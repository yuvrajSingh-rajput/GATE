"use client";

import React from "react";
import Link from "next/link";
import { useAllTests } from "@/hooks/queries/useTests";
import { useAttempts } from "@/hooks/queries/useAttempts";
import { Button } from "@/components/ui/button";
import { Clock, PlayCircle, BarChart2, CheckCircle2, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const fadeInUp: any = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const stagger: any = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

export default function DashboardPage() {
  const { data: attempts, isLoading: isLoadingAttempts } = useAttempts();
  const { data: testManifest, isLoading: isLoadingTests } = useAllTests();

  if (isLoadingAttempts || isLoadingTests) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <Skeleton className="h-12 w-72 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-56 w-full rounded-2xl" />)}
        </div>
      </div>
    );
  }

  const recentAttempts = attempts?.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()) || [];

  return (
    <motion.div
      className="space-y-10 pb-12 max-w-7xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
      <motion.div variants={fadeInUp}>
        <h1 className="font-heading text-3xl md:text-4xl tracking-tight mb-2">
          Welcome <span className="gradient-text">back!</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Continue your preparation for GATE CS.
        </p>
      </motion.div>

      <motion.section variants={fadeInUp}>
        <div className="flex items-center justify-between mb-6">
          <div className="section-label">
            <span className="h-2 w-2 rounded-full bg-accent animate-[pulse-dot_2s_ease-in-out_infinite]" />
            <span className="section-label-text">Available Tests</span>
          </div>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={stagger}
        >
          {(testManifest || []).map((test) => {
            const attemptForTest = recentAttempts.find(a => a.testId === test.id);
            const isInProgress = attemptForTest?.status === "in-progress";
            const isCompleted = attemptForTest?.status === "submitted" || attemptForTest?.status === "auto-submitted";

            return (
              <motion.div
                key={test.id}
                variants={fadeInUp}
                className="group bg-card border border-border rounded-2xl p-6 shadow-md flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-accent/30 relative overflow-hidden"
              >
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="relative z-10 mb-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/20 bg-accent/5 mb-3">
                    <span className="h-1.5 w-1.5 rounded-full gradient-bg" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-accent">
                      {test.source}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold line-clamp-2 tracking-tight">{test.title}</h3>
                </div>

                <div className="relative z-10 flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{test.durationMinutes} mins</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{test.totalQuestions} Qs</span>
                  </div>
                </div>

                <div className="relative z-10 mt-auto">
                  {isInProgress ? (
                    <Link href={`/tests/${test.id}/attempt/${attemptForTest.id}`}>
                      <Button className="w-full bg-warning text-warning-foreground hover:bg-warning/90 rounded-xl h-10 transition-all duration-200 hover:-translate-y-0.5">
                        <PlayCircle className="w-4 h-4 mr-2" /> Resume Test
                      </Button>
                    </Link>
                  ) : isCompleted ? (
                    <div className="flex gap-2">
                      <Link href={`/results/${attemptForTest.id}`} className="flex-1">
                        <Button variant="outline" className="w-full rounded-xl h-10 border-accent/20 text-accent hover:bg-accent/5 hover:border-accent/40 transition-all duration-200">
                          <BarChart2 className="w-4 h-4 mr-2" /> Results
                        </Button>
                      </Link>
                      <Link href={`/tests/${test.id}/instructions`} className="flex-1">
                        <Button className="w-full gradient-bg text-white rounded-xl h-10 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)] active:scale-[0.98]">
                          Retake
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <Link href={`/tests/${test.id}/instructions`}>
                      <Button className="w-full gradient-bg text-white rounded-xl h-10 group/btn transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)] active:scale-[0.98]">
                        Start Test
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                      </Button>
                    </Link>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.section>
    </motion.div>
  );
}
