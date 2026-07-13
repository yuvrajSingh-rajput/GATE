"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useAllTestsData } from "@/hooks/queries/useTests";
import { useAttempts } from "@/hooks/queries/useAttempts";
import { useBookmarks, useAddBookmark, useRemoveBookmark } from "@/hooks/queries/useBookmarks";
import { QuestionCard } from "@/features/quiz-engine/components/QuestionCard";
import { Question, AttemptAnswer } from "@/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Shuffle, Filter } from "lucide-react";
import { computeScore } from "@/features/quiz-engine/lib/scoring";

export default function PracticePage() {
  const { data: allTests, isLoading: isLoadingTests } = useAllTestsData();
  const { data: attempts, isLoading: isLoadingAttempts } = useAttempts();
  const { data: bookmarks, isLoading: isLoadingBookmarks } = useBookmarks();
  const { mutate: addBookmark } = useAddBookmark();
  const { mutate: removeBookmark } = useRemoveBookmark();

  const [typeFilter, setTypeFilter] = useState<"ALL" | "MCQ" | "MSQ" | "NAT">("ALL");
  const [sectionFilter, setSectionFilter] = useState<"ALL" | string>("ALL");
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [incorrectOnly, setIncorrectOnly] = useState(false);
  const [shuffle, setShuffle] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState<AttemptAnswer | undefined>();
  const [showSolution, setShowSolution] = useState(false);

  // Compute all incorrectly answered question IDs
  const incorrectQuestionIds = useMemo(() => {
    if (!attempts || !allTests) return new Set<string>();
    const incorrectSet = new Set<string>();

    for (const attempt of attempts) {
      const test = allTests.find((t) => t.testMeta.id === attempt.testId);
      if (!test) continue;

      for (const question of test.questions) {
        const answer = attempt.answers[question.id];
        if (!answer || answer.status === "not-visited" || answer.status === "not-answered" || answer.selected.length === 0) {
          continue;
        }

        let isCorrect = false;
        let isPartial = false;

        if (question.type === "NAT") {
          const val = parseFloat(answer.selected[0]);
          if (!isNaN(val) && question.natRange && val >= question.natRange[0] && val <= question.natRange[1]) {
            isCorrect = true;
          }
        } else if (question.type === "MCQ") {
          const userAns = [...answer.selected].sort();
          const correctAns = [...question.correctAnswer].sort();
          if (userAns.length === correctAns.length && userAns.every((val, i) => val === correctAns[i])) {
            isCorrect = true;
          }
        } else if (question.type === "MSQ") {
          const userSet = new Set(answer.selected);
          const correctSet = new Set(question.correctAnswer);
          const isExactMatch = userSet.size === correctSet.size && [...userSet].every((val) => correctSet.has(val));
          const hasIncorrectSelection = [...userSet].some((val) => !correctSet.has(val));

          if (isExactMatch) {
            isCorrect = true;
          } else if (!hasIncorrectSelection && userSet.size > 0) {
            isPartial = true;
          }
        }

        if (!isCorrect && !isPartial) {
          incorrectSet.add(question.id);
        }
      }
    }
    return incorrectSet;
  }, [attempts, allTests]);

  const filteredQuestions = useMemo(() => {
    if (!allTests) return [];
    let qList: Array<{ question: Question; testId: string }> = [];

    for (const test of allTests) {
      for (const question of test.questions) {
        qList.push({ question, testId: test.testMeta.id });
      }
    }

    if (typeFilter !== "ALL") {
      qList = qList.filter((q) => q.question.type === typeFilter);
    }
    if (sectionFilter !== "ALL") {
      qList = qList.filter((q) => q.question.section === sectionFilter);
    }
    if (bookmarkedOnly && bookmarks) {
      const bookmarkedIds = new Set(bookmarks.map((b) => b.questionId));
      qList = qList.filter((q) => bookmarkedIds.has(q.question.id));
    }
    if (incorrectOnly) {
      qList = qList.filter((q) => incorrectQuestionIds.has(q.question.id));
    }

    if (shuffle) {
      // Deterministic pseudo-shuffle for stable renders unless toggle changes
      const shuffled = [...qList];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    }

    return qList;
  }, [allTests, typeFilter, sectionFilter, bookmarkedOnly, incorrectOnly, shuffle, bookmarks, incorrectQuestionIds]);

  // Reset state when filters change
  useEffect(() => {
    setCurrentIndex(0);
    setCurrentAnswer(undefined);
    setShowSolution(false);
  }, [typeFilter, sectionFilter, bookmarkedOnly, incorrectOnly, shuffle]);

  const isLoading = isLoadingTests || isLoadingAttempts || isLoadingBookmarks;

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-12 w-64 rounded-xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-[600px] w-full rounded-2xl" />
      </div>
    );
  }

  const currentItem = filteredQuestions[currentIndex];

  const handleAnswerChange = (selected: string[]) => {
    if (!currentItem) return;
    setCurrentAnswer({
      questionId: currentItem.question.id,
      status: "answered",
      selected,
      timeSpentSeconds: 0,
    });
    // Immediately show solution upon selection
    if (selected.length > 0) {
      setShowSolution(true);
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setCurrentAnswer(undefined);
      setShowSolution(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isBookmarked = !!currentItem && !!bookmarks?.some(
    (b) => b.questionId === currentItem.question.id && b.testId === currentItem.testId
  );

  const handleToggleBookmark = () => {
    if (!currentItem) return;
    if (isBookmarked) {
      removeBookmark({ questionId: currentItem.question.id, testId: currentItem.testId });
    } else {
      addBookmark({ questionId: currentItem.question.id, testId: currentItem.testId, createdAt: new Date().toISOString() });
    }
  };

  // Derive unique sections for the filter
  const allSections = Array.from(new Set(allTests?.flatMap(t => t.questions.map(q => q.section)) || []));

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-md">
          <Compass className="w-5 h-5 text-white" />
        </div>
        <h1 className="font-heading text-3xl md:text-4xl tracking-tight">
          Practice <span className="gradient-text">Mode</span>
        </h1>
      </div>

      {/* Filters */}
      <div className="bg-card border rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          <Filter className="w-4 h-4" /> Filters
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="w-full px-4 py-2 bg-background border rounded-xl outline-none focus:border-accent/50 text-sm"
          >
            <option value="ALL">All Types</option>
            <option value="MCQ">MCQ</option>
            <option value="MSQ">MSQ</option>
            <option value="NAT">NAT</option>
          </select>

          <select
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
            className="w-full px-4 py-2 bg-background border rounded-xl outline-none focus:border-accent/50 text-sm"
          >
            <option value="ALL">All Sections</option>
            {allSections.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <div className="flex items-center space-x-2">
            <Switch id="bookmark-filter" checked={bookmarkedOnly} onCheckedChange={setBookmarkedOnly} />
            <Label htmlFor="bookmark-filter" className="cursor-pointer">Bookmarked Only</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="incorrect-filter" checked={incorrectOnly} onCheckedChange={setIncorrectOnly} />
            <Label htmlFor="incorrect-filter" className="cursor-pointer">Incorrect Past</Label>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center space-x-2">
            <Switch id="shuffle-filter" checked={shuffle} onCheckedChange={setShuffle} />
            <Label htmlFor="shuffle-filter" className="cursor-pointer flex items-center gap-1.5">
              <Shuffle className="w-4 h-4" /> Shuffle Questions
            </Label>
          </div>
          <div className="text-sm font-medium text-muted-foreground">
            {filteredQuestions.length} Questions Found
          </div>
        </div>
      </div>

      {/* Main Question Area */}
      {filteredQuestions.length === 0 ? (
        <div className="bg-card border rounded-2xl p-12 text-center text-muted-foreground">
          No questions match your current filters.
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {currentItem && (
            <motion.div
              key={`${currentItem.question.id}-${currentIndex}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <QuestionCard
                testId={currentItem.testId}
                question={currentItem.question}
                answer={currentAnswer}
                onAnswerChange={handleAnswerChange}
                isBookmarked={isBookmarked}
                onToggleBookmark={handleToggleBookmark}
                isPracticeMode={true}
                showSolution={showSolution}
                onNextQuestion={handleNext}
              />

              {/* Progress Indicator */}
              <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                <span>Question {currentIndex + 1} of {filteredQuestions.length}</span>
                {currentIndex < filteredQuestions.length - 1 && !showSolution && (
                  <Button variant="ghost" size="sm" onClick={handleNext}>
                    Skip for now
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
