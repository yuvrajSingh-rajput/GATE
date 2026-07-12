import { create } from "zustand";
import { AttemptAnswer, Attempt } from "@/types";

interface AttemptSessionState {
  attemptId: string | null;
  testId: string | null;
  answers: Record<string, AttemptAnswer>;
  currentQuestionId: string | null;
  durationMinutes: number;
  timeRemainingSeconds: number;
  status: "idle" | "in-progress" | "submitted" | "auto-submitted";
  
  // Actions
  hydrate: (attempt: Attempt, durationMinutes: number) => void;
  setAnswer: (questionId: string, answer: AttemptAnswer) => void;
  setCurrentQuestion: (questionId: string) => void;
  tickTimer: () => void;
  submitAttempt: (auto?: boolean) => void;
  reset: () => void;
}

export const useAttemptStore = create<AttemptSessionState>((set) => ({
  attemptId: null,
  testId: null,
  answers: {},
  currentQuestionId: null,
  durationMinutes: 0,
  timeRemainingSeconds: 0,
  status: "idle",

  hydrate: (attempt, durationMinutes) => {
    // Calculate time remaining based on startedAt and duration
    const startedTime = new Date(attempt.startedAt).getTime();
    const now = Date.now();
    const elapsedSeconds = Math.floor((now - startedTime) / 1000);
    const totalSeconds = durationMinutes * 60;
    const remaining = Math.max(0, totalSeconds - elapsedSeconds);

    set({
      attemptId: attempt.id,
      testId: attempt.testId,
      answers: attempt.answers || {},
      currentQuestionId: attempt.currentQuestionId,
      durationMinutes,
      timeRemainingSeconds: remaining,
      status: attempt.status,
    });
  },

  setAnswer: (questionId, answer) =>
    set((state) => ({
      answers: {
        ...state.answers,
        [questionId]: answer,
      },
    })),

  setCurrentQuestion: (questionId) =>
    set({ currentQuestionId: questionId }),

  tickTimer: () =>
    set((state) => {
      if (state.timeRemainingSeconds <= 0) return state;
      return { timeRemainingSeconds: state.timeRemainingSeconds - 1 };
    }),

  submitAttempt: (auto = false) =>
    set({ status: auto ? "auto-submitted" : "submitted" }),

  reset: () =>
    set({
      attemptId: null,
      testId: null,
      answers: {},
      currentQuestionId: null,
      durationMinutes: 0,
      timeRemainingSeconds: 0,
      status: "idle",
    }),
}));
