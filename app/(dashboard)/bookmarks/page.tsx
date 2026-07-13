"use client";

import React, { useState, useMemo } from "react";
import { useAllTestsData } from "@/hooks/queries/useTests";
import { useBookmarks, useRemoveBookmark } from "@/hooks/queries/useBookmarks";
import { QuestionCard } from "@/features/quiz-engine/components/QuestionCard";
import { Question, AttemptAnswer } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Bookmark, ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const fadeInUp: any = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const stagger: any = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

export default function BookmarksPage() {
  const { data: allTests, isLoading: isLoadingTests } = useAllTestsData();
  const { data: bookmarks, isLoading: isLoadingBookmarks } = useBookmarks();
  const { mutate: removeBookmark } = useRemoveBookmark();

  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, AttemptAnswer>>({});
  const [solutionsRevealed, setSolutionsRevealed] = useState<Record<string, boolean>>({});

  const groupedBookmarks = useMemo(() => {
    if (!allTests || !bookmarks) return {};

    const groups: Record<string, Array<{ question: Question; testId: string }>> = {};

    for (const b of bookmarks) {
      const test = allTests.find((t) => t.testMeta.id === b.testId);
      if (!test) continue;
      const question = test.questions.find((q) => q.id === b.questionId);
      if (!question) continue;

      if (!groups[question.section]) {
        groups[question.section] = [];
      }
      groups[question.section].push({ question, testId: test.testMeta.id });
    }

    return groups;
  }, [allTests, bookmarks]);

  const isLoading = isLoadingTests || isLoadingBookmarks;

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-12 w-64 rounded-xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  const sections = Object.keys(groupedBookmarks).sort();

  const handleAnswerChange = (qId: string, selected: string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [qId]: { questionId: qId, status: "answered", selected, timeSpentSeconds: 0 },
    }));
    if (selected.length > 0) {
      setSolutionsRevealed((prev) => ({ ...prev, [qId]: true }));
    }
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto space-y-8 pb-20"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
      <motion.div variants={fadeInUp}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-md">
            <Bookmark className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-heading text-3xl md:text-4xl tracking-tight">
            Review <span className="gradient-text">Bookmarks</span>
          </h1>
        </div>
        <p className="text-muted-foreground text-lg ml-13">
          Revisit and practice your saved questions.
        </p>
      </motion.div>

      {sections.length === 0 ? (
        <motion.div variants={fadeInUp} className="bg-card border rounded-2xl p-12 text-center text-muted-foreground">
          You haven't bookmarked any questions yet. <br />
          Click the bookmark icon on any question to save it here for later review.
        </motion.div>
      ) : (
        <motion.div className="space-y-4" variants={stagger}>
          {sections.map((section) => {
            const isExpanded = expandedSection === section;
            const questions = groupedBookmarks[section];

            return (
              <motion.div key={section} variants={fadeInUp} className="bg-card border rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setExpandedSection(isExpanded ? null : section)}
                  className="w-full flex items-center justify-between p-5 bg-muted/20 hover:bg-muted/40 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("transition-transform duration-200", isExpanded && "rotate-90")}>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <h2 className="text-lg font-bold">{section}</h2>
                    <span className="bg-accent/10 text-accent text-xs font-bold px-2.5 py-0.5 rounded-full">
                      {questions.length}
                    </span>
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      className="overflow-hidden border-t"
                    >
                      <div className="p-4 space-y-4 bg-muted/5">
                        {questions.map((item, idx) => {
                          const isActive = activeQuestionId === item.question.id;

                          return (
                            <div key={item.question.id} className="border rounded-xl bg-background overflow-hidden shadow-sm">
                              <div
                                className={cn(
                                  "flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors",
                                  isActive && "bg-muted/50"
                                )}
                                onClick={() => setActiveQuestionId(isActive ? null : item.question.id)}
                              >
                                <div className="flex flex-col">
                                  <span className="font-semibold text-sm">
                                    Question {idx + 1}
                                  </span>
                                  <span className="text-xs text-muted-foreground line-clamp-1 mt-1">
                                    {item.question.questionText.replace(/<[^>]+>/g, '').substring(0, 100)}...
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeBookmark({ questionId: item.question.id, testId: item.testId });
                                    }}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                  <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform duration-200", isActive && "rotate-180")} />
                                </div>
                              </div>

                              <AnimatePresence>
                                {isActive && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="border-t"
                                  >
                                    <div className="p-4">
                                      <QuestionCard
                                        testId={item.testId}
                                        question={item.question}
                                        answer={answers[item.question.id]}
                                        onAnswerChange={(sel) => handleAnswerChange(item.question.id, sel)}
                                        isBookmarked={true}
                                        onToggleBookmark={() => removeBookmark({ questionId: item.question.id, testId: item.testId })}
                                        isPracticeMode={true}
                                        showSolution={solutionsRevealed[item.question.id]}
                                      />
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
}
