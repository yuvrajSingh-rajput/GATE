"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import { useAttempt } from "@/hooks/queries/useAttempts";
import { useTest } from "@/hooks/queries/useTests";
import { computeScore } from "@/features/quiz-engine/lib/scoring";
import { Question } from "@/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Target, TrendingUp, CheckCircle, XCircle, MinusCircle, FileText, AlertCircle } from "lucide-react";
import Link from "next/link";
import { SolutionReport } from "@/features/results/components/SolutionReport";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const fadeInUp: any = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger: any = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export default function ResultsPage() {
  const { attemptId } = useParams();
  const [activeTab, setActiveTab] = React.useState<"overview" | "solutions">("overview");
  const { data: attempt, isLoading: attemptLoading } = useAttempt(attemptId as string);
  const { data: testData, isLoading: testLoading } = useTest(attempt?.testId || "");

  const result = useMemo(() => {
    if (!attempt || !testData) return null;
    return computeScore(attempt, testData.questions as Question[]);
  }, [attempt, testData]);

  if (attemptLoading || testLoading || !attempt || !result || !testData) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Skeleton className="h-[400px] w-full max-w-3xl rounded-xl" />
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-5xl mx-auto space-y-8 pb-12"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
      <motion.div className="flex items-center justify-between" variants={fadeInUp}>
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="font-heading text-2xl md:text-3xl tracking-tight">
              Test <span className="gradient-text">Results</span>
            </h1>
            <p className="text-muted-foreground">{testData.testMeta.title}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant={activeTab === "overview" ? "default" : "outline"}
            onClick={() => setActiveTab("overview")}
            className={cn(
              "rounded-lg",
              activeTab === "overview" && "gradient-bg text-white"
            )}
          >
            Overview
          </Button>
          <Button
            variant={activeTab === "solutions" ? "default" : "outline"}
            onClick={() => setActiveTab("solutions")}
            className={cn(
              "rounded-lg",
              activeTab === "solutions" && "gradient-bg text-white"
            )}
          >
            <FileText className="w-4 h-4 mr-2" />
            View Solutions
          </Button>
        </div>
      </motion.div>

      {activeTab === "overview" ? (
        <>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            variants={stagger}
          >
            {/* Total Score */}
            <motion.div
              className="bg-card border rounded-2xl p-6 shadow-md flex flex-col items-center justify-center text-center group hover:shadow-lg transition-shadow"
              variants={fadeInUp}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-secondary))" }}
              >
                <Target className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Total Score</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-foreground">{result.scoredMarks}</span>
                <span className="text-lg text-muted-foreground">/ {result.totalMarks}</span>
              </div>
            </motion.div>

            {/* Accuracy */}
            <motion.div
              className="bg-card border rounded-2xl p-6 shadow-md flex flex-col items-center justify-center text-center group hover:shadow-lg transition-shadow"
              variants={fadeInUp}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-secondary))" }}
              >
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Accuracy</p>
              <span className="text-4xl font-extrabold text-foreground">
                {Math.round(result.accuracy * 100)}%
              </span>
            </motion.div>

            {/* Questions Overview */}
            <motion.div
              className="bg-card border rounded-2xl p-6 shadow-md col-span-1 md:col-span-2 lg:col-span-2"
              variants={fadeInUp}
            >
              <h3 className="font-semibold mb-4">Questions Overview</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-success mb-2" />
                  <span className="text-2xl font-bold">{result.correctCount}</span>
                  <span className="text-xs text-muted-foreground uppercase font-mono tracking-wider">Correct</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <XCircle className="w-8 h-8 text-destructive mb-2" />
                  <span className="text-2xl font-bold">{result.incorrectCount}</span>
                  <span className="text-xs text-muted-foreground uppercase font-mono tracking-wider">Incorrect</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <MinusCircle className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-2xl font-bold">{result.skippedCount}</span>
                  <span className="text-xs text-muted-foreground uppercase font-mono tracking-wider">Skipped</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <h2 className="text-xl font-bold tracking-tight pt-4 border-t mb-6">Section-wise Analysis</h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={stagger}
          >
            {Object.entries(result.sectionWise).map(([sectionName, stats]) => (
              <motion.div
                key={sectionName}
                className="bg-card border rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow"
                variants={fadeInUp}
              >
                <h3 className="font-semibold text-lg mb-4">{sectionName}</h3>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Score</span>
                    <span className="font-bold">{stats.scored} / {stats.total}</span>
                  </div>

                  <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden flex">
                    <div
                      className="bg-success h-full transition-all duration-500"
                      style={{ width: `${(stats.correct / (stats.correct + stats.incorrect + stats.skipped)) * 100}%` }}
                    />
                    <div
                      className="bg-destructive h-full transition-all duration-500"
                      style={{ width: `${(stats.incorrect / (stats.correct + stats.incorrect + stats.skipped)) * 100}%` }}
                    />
                    <div
                      className="bg-muted-foreground/30 h-full transition-all duration-500"
                      style={{ width: `${(stats.skipped / (stats.correct + stats.incorrect + stats.skipped)) * 100}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-xs text-muted-foreground pt-2">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success"/> {stats.correct} Correct</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-destructive"/> {stats.incorrect} Incorrect</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-muted-foreground/50"/> {stats.skipped} Skipped</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {attempt.fullscreenExitCount || attempt.tabSwitchCount ? (
            <motion.div
              className="mt-8 p-6 bg-warning/10 border border-warning/20 rounded-2xl"
              variants={fadeInUp}
            >
              <h3 className="font-bold text-warning flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5" /> Exam Proctoring Report
              </h3>
              <ul className="space-y-2 text-sm">
                {attempt.fullscreenExitCount ? (
                  <li>You exited fullscreen <strong>{attempt.fullscreenExitCount} times</strong> during this attempt.</li>
                ) : null}
                {attempt.tabSwitchCount ? (
                  <li>You switched tabs <strong>{attempt.tabSwitchCount} times</strong> during this attempt.</li>
                ) : null}
              </ul>
            </motion.div>
          ) : null}
        </>
      ) : (
        <motion.div className="mt-8" variants={fadeInUp}>
          <SolutionReport
            testId={testData.testMeta.id}
            questions={testData.questions as Question[]}
            result={result}
            answers={attempt.answers}
          />
        </motion.div>
      )}
    </motion.div>
  );
}
