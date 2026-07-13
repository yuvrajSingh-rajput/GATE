"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAllTests } from "@/hooks/queries/useTests";
import { useAttempts } from "@/hooks/queries/useAttempts";
import { Button } from "@/components/ui/button";
import { Clock, PlayCircle, BarChart2, CheckCircle2, ArrowRight, Search, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const fadeInUp: any = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const stagger: any = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

export default function MockTestsPage() {
  const { data: attempts, isLoading: isLoadingAttempts } = useAttempts();
  const { data: testManifest, isLoading: isLoadingTests } = useAllTests();
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState<"all" | "basic" | "advance">("all");
  const [sortBy, setSortBy] = useState<"newest" | "title">("newest");

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

  let displayTests = [...(testManifest || [])];

  // Search filter
  if (search) {
    const q = search.toLowerCase();
    displayTests = displayTests.filter(t => t.title.toLowerCase().includes(q));
  }

  // Level filter
  if (filterLevel !== "all") {
    displayTests = displayTests.filter(t => {
      const isAdvance = t.title.toLowerCase().includes("advance");
      return filterLevel === "advance" ? isAdvance : !isAdvance;
    });
  }

  // Sort
  displayTests.sort((a, b) => {
    if (sortBy === "title") return a.title.localeCompare(b.title);
    return b.id.localeCompare(a.id); // Defaulting to newest by ID sorting for now
  });

  return (
    <motion.div
      className="space-y-8 pb-12 max-w-7xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
      <motion.div variants={fadeInUp}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-md">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-heading text-3xl md:text-4xl tracking-tight">
            Mock <span className="gradient-text">Tests</span>
          </h1>
        </div>
        <p className="text-muted-foreground text-lg ml-13">
          Full-length timed exams to simulate the actual GATE CS environment.
        </p>
      </motion.div>

      <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-card border rounded-xl outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all text-sm"
          />
        </div>

        <select
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value as any)}
          className="w-full sm:w-auto px-4 py-2 bg-card border rounded-xl outline-none focus:border-accent/50 text-sm"
        >
          <option value="all">All Levels</option>
          <option value="basic">Basic Level</option>
          <option value="advance">Advance Level</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="w-full sm:w-auto px-4 py-2 bg-card border rounded-xl outline-none focus:border-accent/50 text-sm"
        >
          <option value="newest">Sort by Newest</option>
          <option value="title">Sort by Title</option>
        </select>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={stagger}
      >
        {displayTests.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <p className="text-muted-foreground">No tests match your criteria.</p>
          </div>
        ) : (
          displayTests.map((test) => {
            const attemptForTest = recentAttempts.find(a => a.testId === test.id);
            const isInProgress = attemptForTest?.status === "in-progress";
            const isCompleted = attemptForTest?.status === "submitted" || attemptForTest?.status === "auto-submitted";

            return (
              <motion.div
                key={test.id}
                variants={fadeInUp}
                className="group bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-accent/30 relative overflow-hidden"
              >
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
          })
        )}
      </motion.div>
    </motion.div>
  );
}
