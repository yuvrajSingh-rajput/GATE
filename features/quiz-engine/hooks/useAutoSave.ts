import { useEffect, useRef, useCallback } from "react";
import { useAttemptStore } from "../store/attempt-session.store";
import { useUpdateAttempt } from "@/hooks/queries/useAttempts";

export function useAutoSave() {
  const { attemptId, answers, currentQuestionId, status } = useAttemptStore();
  const { mutate: updateAttempt } = useUpdateAttempt();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // We want to save whenever answers or currentQuestionId changes, but debounced by 2 seconds.
  useEffect(() => {
    if (!attemptId || status !== "in-progress") return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      updateAttempt({
        id: attemptId,
        updates: {
          answers,
          currentQuestionId,
        },
      });
    }, 2000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [answers, currentQuestionId, attemptId, status, updateAttempt]);

  // Provide a function to force an immediate save (e.g., when navigating away or submitting)
  // Provide a function to force an immediate save (e.g., when navigating away or submitting)
  const forceSave = useCallback(() => {
    if (!attemptId) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    updateAttempt({
      id: attemptId,
      updates: {
        answers,
        currentQuestionId,
        ...((status === "submitted" || status === "auto-submitted") ? { status, submittedAt: new Date().toISOString() } : {})
      },
    });
  }, [attemptId, answers, currentQuestionId, status, updateAttempt]);

  return { forceSave };
}
