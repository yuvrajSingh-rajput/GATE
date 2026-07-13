"use client";

import React, { useState, useMemo } from "react";
import { useAllTestsData } from "@/hooks/queries/useTests";
import { useAttempts } from "@/hooks/queries/useAttempts";
import { useBookmarks, useAddBookmark, useRemoveBookmark } from "@/hooks/queries/useBookmarks";
import { QuestionCard } from "@/features/quiz-engine/components/QuestionCard";
import { Question, AttemptAnswer } from "@/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, RotateCcw, AlertTriangle } from "lucide-react";

const fadeInUp: any = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const stagger: any = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

export default function RevisionPage() {
  const { data: allTests, isLoading: isLoadingTests } = useAllTestsData();
  const { data: attempts, isLoading: isLoadingAttempts } = useAttempts();
  const { data: bookmarks, isLoading: isLoadingBookmarks } = useBookmarks();
  const { mutate: addBookmark } = useAddBookmark();
  const { mutate: removeBookmark } = useRemoveBookmark();

  const [sessionActive, setSessionActive] = useState(false);
  const [revisionSet, setRevisionSet] = useState<Array<{ question: Question; testId: string }>>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState<AttemptAnswer | undefined>();
  const [showSolution, setShowSolution] = useState(false);

  // Compute all incorrectly answered questions
  const allIncorrectQuestions = useMemo(() => {
    if (!attempts || !allTests) return [];
    
    const incorrectMap = new Map<string, { question: Question; testId: string }>();

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
          incorrectMap.set(question.id, { question, testId: test.testMeta.id });
        }
      }
    }
    return Array.from(incorrectMap.values());
  }, [attempts, allTests]);

  const generateRevisionSet = () => {
    if (allIncorrectQuestions.length === 0) return;

    // Shuffle and pick up to 10
    const shuffled = [...allIncorrectQuestions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 10);

    setRevisionSet(selected);
    setCurrentIndex(0);
    setCurrentAnswer(undefined);
    setShowSolution(false);
    setSessionActive(true);
  };

  const endSession = () => {
    setSessionActive(false);
    setRevisionSet([]);
  };

  const isLoading = isLoadingTests || isLoadingAttempts || isLoadingBookmarks;

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-12 w-64 rounded-xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  const currentItem = revisionSet[currentIndex];

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
    if (currentIndex < revisionSet.length - 1) {
      setCurrentIndex((i) => i + 1);
      setCurrentAnswer(undefined);
      setShowSolution(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      endSession();
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
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-heading text-3xl md:text-4xl tracking-tight">
            Smart <span className="gradient-text">Revision</span>
          </h1>
        </div>
        <p className="text-muted-foreground text-lg ml-13">
          Auto-generated review sets based on your weak areas.
        </p>
      </motion.div>

      {!sessionActive ? (
        <motion.div variants={fadeInUp} className="bg-card border rounded-2xl p-8 sm:p-12 text-center shadow-sm">
          <div className="w-20 h-20 mx-auto bg-accent/10 text-accent rounded-full flex items-center justify-center mb-6">
            <RotateCcw className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-4">Ready for a quick review?</h2>
          
          {allIncorrectQuestions.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 mt-4 text-muted-foreground">
              <AlertTriangle className="w-6 h-6 text-warning" />
              <p>You don't have any incorrectly answered questions yet.<br/> Take a mock test to build your revision pool.</p>
            </div>
          ) : (
            <>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                We'll generate a custom set of up to 10 questions that you've answered incorrectly in past mock tests to help you improve.
              </p>
              <Button onClick={generateRevisionSet} className="rounded-xl px-8 py-6 text-lg gradient-bg text-white hover:shadow-[var(--shadow-glow)] hover:-translate-y-0.5 transition-all">
                <Zap className="w-5 h-5 mr-2" /> Generate Revision Set
              </Button>
              <p className="text-sm text-muted-foreground mt-4 font-medium">
                {allIncorrectQuestions.length} total questions available for revision
              </p>
            </>
          )}
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          {currentItem && (
            <motion.div
              key={`${currentItem.question.id}-${currentIndex}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                  Revision Session Active
                </div>
                <Button variant="ghost" size="sm" onClick={endSession} className="text-muted-foreground hover:text-destructive">
                  End Session
                </Button>
              </div>

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
                <span>Question {currentIndex + 1} of {revisionSet.length}</span>
                {currentIndex < revisionSet.length - 1 && !showSolution && (
                  <Button variant="ghost" size="sm" onClick={handleNext}>
                    Skip for now
                  </Button>
                )}
                {currentIndex === revisionSet.length - 1 && showSolution && (
                   <Button variant="default" size="sm" onClick={endSession}>
                    Finish Review
                 </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
}
