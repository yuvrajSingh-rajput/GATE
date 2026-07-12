import { useEffect } from "react";
import { Question } from "@/types";

interface UseKeyboardNavProps {
  questions: Question[];
  currentQuestionId: string | null;
  onNavigate: (questionId: string) => void;
  onMarkForReview: () => void;
  onSaveAndNext: () => void;
}

export function useKeyboardNav({
  questions,
  currentQuestionId,
  onNavigate,
  onMarkForReview,
  onSaveAndNext,
}: UseKeyboardNavProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const currentIndex = questions.findIndex((q) => q.id === currentQuestionId);
      if (currentIndex === -1) return;

      switch (e.key) {
        case "ArrowRight":
          if (currentIndex < questions.length - 1) {
            onNavigate(questions[currentIndex + 1].id);
          }
          break;
        case "ArrowLeft":
          if (currentIndex > 0) {
            onNavigate(questions[currentIndex - 1].id);
          }
          break;
        case "Enter":
          e.preventDefault();
          onSaveAndNext();
          break;
        case "m":
        case "M":
          e.preventDefault();
          onMarkForReview();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [questions, currentQuestionId, onNavigate, onMarkForReview, onSaveAndNext]);
}
