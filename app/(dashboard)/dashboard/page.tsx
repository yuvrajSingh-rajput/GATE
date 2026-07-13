"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useAllTests } from "@/hooks/queries/useTests";
import { useAttempts, useAllResults } from "@/hooks/queries/useAttempts";
import { useProfile } from "@/hooks/queries/useProfile";
import { Button } from "@/components/ui/button";
import { Clock, PlayCircle, BarChart2, CheckCircle2, ArrowRight, Target, Flame, TrendingUp } from "lucide-react";
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

function formatStudyTime(totalSeconds: number) {
  if (totalSeconds < 60) return `${totalSeconds}s`;
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  if (hrs > 0) return `${hrs}h ${mins}m`;
  return `${mins}m`;
}

export default function DashboardPage() {
  const { data: attempts, isLoading: isLoadingAttempts } = useAttempts();
  const { data: results, isLoading: isLoadingResults } = useAllResults();
  const { data: testManifest, isLoading: isLoadingTests } = useAllTests();
  const { data: profile, isLoading: isLoadingProfile } = useProfile();

  const isLoading = isLoadingAttempts || isLoadingTests || isLoadingResults || isLoadingProfile;

  const stats = useMemo(() => {
    if (!attempts || !results || !profile) return null;

    let questionsSolved = 0;
    let totalStudyTimeSeconds = 0;

    for (const attempt of attempts) {
      for (const ans of Object.values(attempt.answers)) {
        if (ans.status.includes("answered")) {
          questionsSolved++;
        }
        totalStudyTimeSeconds += ans.timeSpentSeconds || 0;
      }
    }

    let totalCorrect = 0;
    let totalQuestionsInResults = 0;
    const sectionStats: Record<string, { correct: number; total: number }> = {};

    for (const res of results) {
      totalCorrect += res.correctCount;
      totalQuestionsInResults += res.correctCount + res.incorrectCount + res.skippedCount;
      
      for (const [section, sStats] of Object.entries(res.sectionWise || {})) {
        if (!sectionStats[section]) sectionStats[section] = { correct: 0, total: 0 };
        sectionStats[section].correct += sStats.correct;
        sectionStats[section].total += (sStats.correct + sStats.incorrect + sStats.skipped);
      }
    }

    const accuracy = totalQuestionsInResults > 0 
      ? Math.round((totalCorrect / totalQuestionsInResults) * 100) 
      : 0;

    let weakSubjects: string[] = [];
    let strongSubjects: string[] = [];

    if (results.length > 0) {
      const sortedSections = Object.entries(sectionStats)
        .map(([name, s]) => ({ name, accuracy: s.total > 0 ? s.correct / s.total : 0 }))
        .sort((a, b) => a.accuracy - b.accuracy);
      
      weakSubjects = sortedSections.slice(0, 2).map(s => s.name);
      strongSubjects = sortedSections.slice(-2).reverse().map(s => s.name);
    }

    return {
      questionsSolved,
      accuracy,
      studyTime: formatStudyTime(totalStudyTimeSeconds),
      streak: profile.streak.current,
      weakSubjects,
      strongSubjects,
      hasAttempts: attempts.length > 0,
    };
  }, [attempts, results, profile]);

  if (isLoading || !stats) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <Skeleton className="h-12 w-72 rounded-xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-56 w-full rounded-2xl" />)}
        </div>
      </div>
    );
  }

  const recentAttempts = attempts?.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()) || [];
  const inProgressAttempt = recentAttempts.find(a => a.status === "in-progress");
  const activeTest = inProgressAttempt ? testManifest?.find(t => t.id === inProgressAttempt.testId) : null;

  return (
    <motion.div
      className="space-y-8 pb-12 max-w-7xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
      {/* ── Top Banner for In-Progress Attempt ── */}
      {inProgressAttempt && activeTest && (
        <motion.div variants={fadeInUp} className="bg-warning/10 border border-warning/30 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-warning opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-warning"></span>
              </span>
              <h2 className="font-bold text-warning-foreground text-lg">Test in Progress</h2>
            </div>
            <p className="text-warning-foreground/80 text-sm">
              You have an unfinished attempt for <strong>{activeTest.title}</strong>.
            </p>
          </div>
          <Link href={`/tests/${activeTest.id}/attempt/${inProgressAttempt.id}`} className="shrink-0 w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-warning text-warning-foreground hover:bg-warning/90 rounded-xl transition-all duration-200">
              <PlayCircle className="w-4 h-4 mr-2" /> Resume Test
            </Button>
          </Link>
        </motion.div>
      )}

      {/* ── Welcome Header ── */}
      <motion.div variants={fadeInUp}>
        <h1 className="font-heading text-3xl md:text-4xl tracking-tight mb-2">
          Welcome <span className="gradient-text">{profile?.name.split(' ')[0] || 'back'}!</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Continue your preparation for GATE CS.
        </p>
      </motion.div>

      {/* ── Stats Row ── */}
      <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4" variants={stagger}>
        {[
          { label: "Questions Solved", value: stats.questionsSolved, icon: Target, color: "text-blue-500" },
          { label: "Accuracy", value: `${stats.accuracy}%`, icon: CheckCircle2, color: "text-green-500" },
          { label: "Current Streak", value: `${stats.streak} days`, icon: Flame, color: "text-orange-500" },
          { label: "Study Time", value: stats.studyTime, icon: Clock, color: "text-purple-500" },
        ].map((stat, i) => (
          <motion.div key={i} variants={fadeInUp} className="bg-card border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{stat.label}</span>
            </div>
            <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Weak / Strong Subjects (Only if attempts exist) ── */}
      {stats.hasAttempts && (stats.weakSubjects.length > 0 || stats.strongSubjects.length > 0) && (
        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={stagger}>
          {stats.weakSubjects.length > 0 && (
            <motion.div variants={fadeInUp} className="bg-destructive/5 border border-destructive/10 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-destructive rotate-180" />
                <h3 className="font-bold text-destructive">Focus Areas (Weak Subjects)</h3>
              </div>
              <ul className="space-y-2">
                {stats.weakSubjects.map((s, i) => (
                  <li key={i} className="text-sm text-destructive/80 font-medium bg-destructive/10 px-3 py-1.5 rounded-lg inline-block mr-2">{s}</li>
                ))}
              </ul>
            </motion.div>
          )}
          {stats.strongSubjects.length > 0 && (
            <motion.div variants={fadeInUp} className="bg-green-500/5 border border-green-500/10 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <h3 className="font-bold text-green-700 dark:text-green-500">Strong Subjects</h3>
              </div>
              <ul className="space-y-2">
                {stats.strongSubjects.map((s, i) => (
                  <li key={i} className="text-sm text-green-700/80 dark:text-green-500/80 font-medium bg-green-500/10 px-3 py-1.5 rounded-lg inline-block mr-2">{s}</li>
                ))}
              </ul>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* ── Available Mock Tests ── */}
      <motion.section variants={fadeInUp}>
        <div className="flex items-center justify-between mb-6">
          <div className="section-label">
            <span className="h-2 w-2 rounded-full bg-accent animate-[pulse-dot_2s_ease-in-out_infinite]" />
            <span className="section-label-text">Available Mock Tests</span>
          </div>
          {stats.hasAttempts && (
            <Link href="/tests" className="text-sm text-accent hover:underline font-medium flex items-center">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          )}
        </div>

        {!stats.hasAttempts && (
          <p className="text-muted-foreground mb-6">Start with your first mock test.</p>
        )}

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={stagger}
        >
          {(testManifest || []).slice(0, 6).map((test) => {
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
          })}
        </motion.div>
      </motion.section>
    </motion.div>
  );
}
