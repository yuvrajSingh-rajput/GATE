"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAttempt } from "@/hooks/queries/useAttempts";
import { useAttemptStore } from "@/features/quiz-engine/store/attempt-session.store";
import { useAutoSave } from "@/features/quiz-engine/hooks/useAutoSave";
import { useTimer } from "@/features/quiz-engine/hooks/useTimer";
import { useKeyboardNav } from "@/features/quiz-engine/hooks/useKeyboardNav";
import { useAttemptLock } from "@/hooks/useAttemptLock";
import { deriveStatus } from "@/features/quiz-engine/lib/status";
import { QuestionCard } from "@/features/quiz-engine/components/QuestionCard";
import { QuestionPalette } from "@/features/quiz-engine/components/QuestionPalette";
import { PaletteLegend } from "@/features/quiz-engine/components/PaletteLegend";
import { SectionTabs } from "@/features/quiz-engine/components/SectionTabs";
import { NavigationControls } from "@/features/quiz-engine/components/NavigationControls";
import { SubmitConfirmDialog } from "@/features/quiz-engine/components/SubmitConfirmDialog";
import { Timer } from "@/features/quiz-engine/components/Timer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Question } from "@/types";
import { useTest } from "@/hooks/queries/useTests";

export default function QuizTakingPage() {
  const { testId, attemptId } = useParams();
  const router = useRouter();

  // Query Attempt from DB
  const { data: attempt, isLoading } = useAttempt(attemptId as string);
  const store = useAttemptStore();
  const { forceSave } = useAutoSave();
  useTimer(); // starts the timer if status is in-progress

  const isTestActive = store.status === "in-progress";

  const [violationType, setViolationType] = useState<"tab-switch" | "fullscreen-exit" | null>(null);
  const { requestFullscreen, exitFullscreen } = useAttemptLock({
    attempt: attempt || undefined,
    isActive: isTestActive,
    onViolation: (type) => setViolationType(type),
    onAutoSubmit: () => {
      forceSave();
      store.submitAttempt(true);
    },
  });

  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  const { data: testData, isLoading: isLoadingTest } = useTest(testId as string);
  const testMeta = testData?.testMeta;
  const questions = (testData?.questions || []) as Question[];

  // Hydrate Store
  useEffect(() => {
    if (attempt && testMeta && store.attemptId !== attempt.id) {
      store.hydrate(attempt, testMeta.durationMinutes);
    }
  }, [attempt, testMeta, store]);

  // Determine active section based on current question
  const currentQuestion = questions.find((q) => q.id === store.currentQuestionId);
  const currentAnswer = currentQuestion ? store.answers[currentQuestion.id] : undefined;

  useEffect(() => {
    if (currentQuestion && currentQuestion.section !== activeSection) {
      setActiveSection(currentQuestion.section);
    }
  }, [currentQuestion, activeSection]);

  // Mark current question as visited
  useEffect(() => {
    if (currentQuestion && store.status === "in-progress") {
      if (!currentAnswer || currentAnswer.status === "not-visited") {
        store.setAnswer(currentQuestion.id, {
          questionId: currentQuestion.id,
          selected: currentAnswer?.selected || [],
          status: "not-answered",
          timeSpentSeconds: currentAnswer?.timeSpentSeconds || 0,
        });
      }
    }
  }, [currentQuestion, currentAnswer, store.status, store.setAnswer]);

  // Handle Redirection if already submitted
  useEffect(() => {
    if (store.status === "submitted" || store.status === "auto-submitted") {
      forceSave();
      router.replace(`/results/${attemptId}`);
    }
  }, [store.status, testId, attemptId, router, forceSave]);

  // Navigate Questions Keyboard hook
  const handleNavigate = (qId: string) => {
    store.setCurrentQuestion(qId);
  };

  const handleSaveAndNext = () => {
    if (!currentQuestion) return;
    const answer = store.answers[currentQuestion.id];
    
    // Update status
    const hasAnswer = (answer?.selected?.length || 0) > 0;
    const newStatus = deriveStatus(answer?.status, hasAnswer, false);
    
    store.setAnswer(currentQuestion.id, {
      questionId: currentQuestion.id,
      selected: answer?.selected || [],
      status: newStatus,
      timeSpentSeconds: (answer?.timeSpentSeconds || 0), // we don't track time per question yet
    });

    const currentIndex = questions.findIndex((q) => q.id === currentQuestion.id);
    if (currentIndex < questions.length - 1) {
      store.setCurrentQuestion(questions[currentIndex + 1].id);
    }
  };

  const handleMarkForReviewAndNext = () => {
    if (!currentQuestion) return;
    const answer = store.answers[currentQuestion.id];
    
    const hasAnswer = (answer?.selected?.length || 0) > 0;
    const newStatus = deriveStatus(answer?.status, hasAnswer, true);

    store.setAnswer(currentQuestion.id, {
      questionId: currentQuestion.id,
      selected: answer?.selected || [],
      status: newStatus,
      timeSpentSeconds: (answer?.timeSpentSeconds || 0),
    });

    const currentIndex = questions.findIndex((q) => q.id === currentQuestion.id);
    if (currentIndex < questions.length - 1) {
      store.setCurrentQuestion(questions[currentIndex + 1].id);
    }
  };

  const handleClearResponse = () => {
    if (!currentQuestion) return;
    const answer = store.answers[currentQuestion.id];
    
    store.setAnswer(currentQuestion.id, {
      questionId: currentQuestion.id,
      selected: [],
      status: "not-answered",
      timeSpentSeconds: (answer?.timeSpentSeconds || 0),
    });
  };

  const handlePrevious = () => {
    if (!currentQuestion) return;
    const currentIndex = questions.findIndex((q) => q.id === currentQuestion.id);
    if (currentIndex > 0) {
      store.setCurrentQuestion(questions[currentIndex - 1].id);
    }
  };

  const handleAnswerChange = (selected: string[]) => {
    if (!currentQuestion) return;
    const currentAnswer = store.answers[currentQuestion.id];
    
    store.setAnswer(currentQuestion.id, {
      questionId: currentQuestion.id,
      selected,
      status: currentAnswer?.status || "not-answered", 
      timeSpentSeconds: currentAnswer?.timeSpentSeconds || 0,
    });
  };

  const handleSubmit = () => {
    forceSave();
    store.submitAttempt(false);
  };

  useKeyboardNav({
    questions,
    currentQuestionId: store.currentQuestionId,
    onNavigate: handleNavigate,
    onMarkForReview: handleMarkForReviewAndNext,
    onSaveAndNext: handleSaveAndNext,
  });

  if (isLoading || isLoadingTest || store.attemptId !== attemptId || !testMeta || !currentQuestion) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Skeleton className="h-[400px] w-[600px] rounded-xl" />
      </div>
    );
  }

  // Filter questions for the right panel palette based on active section
  const sectionQuestions = questions.filter(q => q.section === activeSection);
  const currentIndex = questions.findIndex(q => q.id === currentQuestion.id);

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-background relative z-[9999]">
      {violationType && (
        <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-background/95 backdrop-blur-md">
          <div className="bg-card p-8 rounded-2xl shadow-xl max-w-md text-center border">
            <h2 className="text-2xl font-bold mb-4 text-destructive">Exam Paused</h2>
            <p className="text-muted-foreground mb-8">
              {violationType === "tab-switch" 
                ? "You have switched tabs or minimized the window. Your exam is paused and this violation has been recorded."
                : "You have exited fullscreen. Your exam is paused and this exit has been recorded."}
            </p>
            <Button size="lg" onClick={() => {
              setViolationType(null);
              requestFullscreen(document.documentElement);
            }} className="w-full">
              Resume Exam
            </Button>
          </div>
        </div>
      )}
      {/* Top Bar specific to quiz */}
      <header className="flex items-center justify-between px-4 md:px-6 h-14 border-b border-border/60 bg-card shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-heading text-lg tracking-tight">
            GATE<span className="gradient-text">Prep</span>
          </span>
          <span className="text-border">|</span>
          <span className="text-sm font-medium text-muted-foreground truncate max-w-[200px] md:max-w-none">{testMeta.title}</span>
        </div>
        <Timer />
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area */}
        <div className="flex flex-col flex-1 overflow-hidden border-r bg-muted/10">
          {/* Section Tabs */}
          <SectionTabs
            sections={testMeta.sections}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
          
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            <QuestionCard
              testId={testId as string}
              question={currentQuestion}
              answer={store.answers[currentQuestion.id]}
              onAnswerChange={handleAnswerChange}
              isBookmarked={false}
              onToggleBookmark={() => {}}
            />
          </div>
          
          <div className="shrink-0 p-4 bg-card border-t">
            <NavigationControls
              onPrevious={handlePrevious}
              onSaveAndNext={handleSaveAndNext}
              onClearResponse={handleClearResponse}
              onMarkForReviewAndNext={handleMarkForReviewAndNext}
              hasPrevious={currentIndex > 0}
              hasNext={currentIndex < questions.length - 1}
            />
          </div>
        </div>

        {/* Right Panel (Palette) */}
        <div className="hidden lg:flex w-80 flex-col bg-card shrink-0">
          <div className="p-4 border-b">
            <PaletteLegend />
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="font-semibold text-sm mb-4">Question Palette</h3>
            <QuestionPalette
              questions={sectionQuestions}
              onNavigate={handleNavigate}
            />
          </div>
          <div className="p-4 border-t">
            <Button
              className="w-full h-12 text-base font-bold gradient-bg text-white rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)] active:scale-[0.98]"
              onClick={() => setSubmitDialogOpen(true)}
            >
              Submit Test
            </Button>
          </div>
        </div>
      </div>

      <SubmitConfirmDialog
        open={submitDialogOpen}
        onOpenChange={setSubmitDialogOpen}
        onConfirm={handleSubmit}
        questions={questions}
      />
    </div>
  );
}
