"use client";

import React, { useMemo } from "react";
import { useAllResults, useAttempts } from "@/hooks/queries/useAttempts";
import { useAllTestsData } from "@/hooks/queries/useTests";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { BarChart2, TrendingUp, Target, Activity } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

const fadeInUp: any = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const stagger: any = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

export default function AnalyticsPage() {
  const { data: results, isLoading: isLoadingResults } = useAllResults();
  const { data: attempts, isLoading: isLoadingAttempts } = useAttempts();
  const { data: allTests, isLoading: isLoadingTests } = useAllTestsData();

  const isLoading = isLoadingResults || isLoadingAttempts || isLoadingTests;

  const { progressionData, radarData, summaryStats } = useMemo(() => {
    if (!results || !attempts || !allTests) {
      return { progressionData: [], radarData: [], summaryStats: null };
    }

    // Sort attempts by submittedAt date
    const submittedAttempts = attempts
      .filter((a) => a.status === "submitted" || a.status === "auto-submitted")
      .sort((a, b) => new Date(a.submittedAt || 0).getTime() - new Date(b.submittedAt || 0).getTime());

    const progData: any[] = [];
    const sectionAccuracy: Record<string, { correct: number; total: number }> = {};
    let totalMarksScored = 0;
    let totalMarksAvailable = 0;
    let totalCorrect = 0;
    let totalAttempted = 0;

    for (const attempt of submittedAttempts) {
      const res = results.find((r) => r.attemptId === attempt.id);
      const test = allTests.find((t) => t.testMeta.id === attempt.testId);
      if (!res || !test) continue;

      // Progression Data
      progData.push({
        name: test.testMeta.title.substring(0, 15) + "...",
        score: res.scoredMarks,
        total: res.totalMarks,
        date: new Date(attempt.submittedAt!).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      });

      totalMarksScored += res.scoredMarks;
      totalMarksAvailable += res.totalMarks;
      totalCorrect += res.correctCount;
      totalAttempted += (res.correctCount + res.incorrectCount);

      // Section Data
      for (const [section, stats] of Object.entries(res.sectionWise || {})) {
        if (!sectionAccuracy[section]) sectionAccuracy[section] = { correct: 0, total: 0 };
        sectionAccuracy[section].correct += stats.correct;
        sectionAccuracy[section].total += (stats.correct + stats.incorrect + stats.skipped);
      }
    }

    const radData = Object.entries(sectionAccuracy).map(([subject, stats]) => ({
      subject: subject.replace("General Aptitude", "Aptitude").substring(0, 15),
      accuracy: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
    }));

    return {
      progressionData: progData,
      radarData: radData,
      summaryStats: {
        testsTaken: submittedAttempts.length,
        averageScore: submittedAttempts.length > 0 ? Math.round(totalMarksScored / submittedAttempts.length) : 0,
        overallAccuracy: totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0,
      },
    };
  }, [results, attempts, allTests]);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <Skeleton className="h-12 w-64 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
        </div>
        <Skeleton className="h-[400px] w-full rounded-2xl" />
      </div>
    );
  }

  if (progressionData.length === 0) {
    return (
      <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="max-w-4xl mx-auto pb-20">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-md">
            <BarChart2 className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-heading text-3xl md:text-4xl tracking-tight">Performance Analytics</h1>
        </div>
        <div className="bg-card border rounded-2xl p-12 text-center shadow-sm">
          <div className="w-20 h-20 mx-auto bg-muted/50 rounded-full flex items-center justify-center mb-6">
            <TrendingUp className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold mb-2">Not enough data</h2>
          <p className="text-muted-foreground">Complete at least one mock test to unlock your performance analytics and charts.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="max-w-6xl mx-auto space-y-8 pb-20"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
      <motion.div variants={fadeInUp}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-md">
            <BarChart2 className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-heading text-3xl md:text-4xl tracking-tight">
            Performance <span className="gradient-text">Analytics</span>
          </h1>
        </div>
        <p className="text-muted-foreground text-lg ml-13">
          Track your progress and identify areas for improvement.
        </p>
      </motion.div>

      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6" variants={stagger}>
        <motion.div variants={fadeInUp} className="bg-card border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-muted-foreground">
            <Activity className="w-5 h-5 text-accent" />
            <h3 className="font-semibold uppercase tracking-wider text-sm">Tests Taken</h3>
          </div>
          <div className="text-4xl font-bold">{summaryStats?.testsTaken}</div>
        </motion.div>
        
        <motion.div variants={fadeInUp} className="bg-card border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-muted-foreground">
            <TrendingUp className="w-5 h-5 text-success" />
            <h3 className="font-semibold uppercase tracking-wider text-sm">Avg Score</h3>
          </div>
          <div className="text-4xl font-bold">{summaryStats?.averageScore}</div>
        </motion.div>

        <motion.div variants={fadeInUp} className="bg-card border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-muted-foreground">
            <Target className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold uppercase tracking-wider text-sm">Overall Accuracy</h3>
          </div>
          <div className="text-4xl font-bold">{summaryStats?.overallAccuracy}%</div>
        </motion.div>
      </motion.div>

      <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6" variants={stagger}>
        {/* Progression Chart */}
        <motion.div variants={fadeInUp} className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col h-[400px]">
          <h3 className="font-bold text-lg mb-6 tracking-tight">Score Progression</h3>
          <div className="flex-1 min-h-0 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressionData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} dy={10} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "12px", color: "hsl(var(--foreground))" }}
                  itemStyle={{ color: "hsl(var(--accent))" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: "hsl(var(--card))", strokeWidth: 2 }} 
                  activeDot={{ r: 6, fill: "hsl(var(--accent))" }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Subject Strength Radar */}
        <motion.div variants={fadeInUp} className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col h-[400px]">
          <h3 className="font-bold text-lg mb-6 tracking-tight">Subject Strengths (Accuracy %)</h3>
          <div className="flex-1 min-h-0 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "hsl(var(--foreground))", fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))" }} tickCount={5} />
                <Radar 
                  name="Accuracy" 
                  dataKey="accuracy" 
                  stroke="hsl(var(--accent))" 
                  fill="hsl(var(--accent))" 
                  fillOpacity={0.4} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "12px", color: "hsl(var(--foreground))" }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
