export type { Question, QuestionOption, QuestionType } from "../data/tests/_schema/question.schema";
export type { TestMeta, TestData } from "../data/tests/_schema/testMeta.schema";
export interface AttemptAnswer {
  questionId: string;
  selected: string[];
  status: "not-visited" | "not-answered" | "answered" | "marked" | "answered-marked";
  timeSpentSeconds: number;
}

export interface Attempt {
  id: string;
  testId: string;
  startedAt: string;
  submittedAt: string | null;
  durationMinutes: number;
  answers: Record<string, AttemptAnswer>;
  currentQuestionId: string | null;
  status: "in-progress" | "submitted" | "auto-submitted";
  fullscreenExitCount?: number;
  tabSwitchCount?: number;
}

export interface AttemptResult {
  attemptId: string;
  testId: string;
  totalMarks: number;
  scoredMarks: number;
  correctCount: number;
  incorrectCount: number;
  skippedCount: number;
  sectionWise: Record<string, { scored: number; total: number; correct: number; incorrect: number; skipped: number }>;
  accuracy: number;
  submittedAt: string;
}

export interface Bookmark {
  questionId: string;
  testId: string;
  createdAt: string;
}

export interface Note {
  questionId: string;
  content: string;
  updatedAt: string;
}

export interface UserProfile {
  name: string;
  createdAt: string;
  streak: { current: number; longest: number; lastActiveDate: string };
}
