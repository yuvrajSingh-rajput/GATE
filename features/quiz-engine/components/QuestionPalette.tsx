"use client";

import React from "react";
import { Question } from "@/types";
import { useAttemptStore } from "../store/attempt-session.store";
import { cn } from "@/lib/utils";

interface QuestionPaletteProps {
  questions: Question[];
  onNavigate: (questionId: string) => void;
}

export function QuestionPalette({ questions, onNavigate }: QuestionPaletteProps) {
  const { answers, currentQuestionId } = useAttemptStore();

  const getStatusColor = (questionId: string, isCurrent: boolean) => {
    const answer = answers[questionId];
    const status = answer?.status || "not-visited";

    let baseClass = "bg-muted border border-border text-muted-foreground";

    switch (status) {
      case "not-answered":
        baseClass = "bg-destructive text-white border-transparent";
        break;
      case "answered":
        baseClass = "bg-success text-white border-transparent";
        break;
      case "marked":
        baseClass = "bg-violet-600 text-white border-transparent";
        break;
      case "answered-marked":
        baseClass = "bg-violet-600 text-white border-transparent"; // dot is added below
        break;
    }

    if (isCurrent) {
      baseClass = cn(baseClass, "ring-2 ring-primary ring-offset-2 ring-offset-background");
    }

    return baseClass;
  };

  return (
    <div className="grid grid-cols-5 gap-2">
      {questions.map((q) => {
        const answer = answers[q.id];
        const isAnsweredMarked = answer?.status === "answered-marked";
        const isCurrent = q.id === currentQuestionId;

        return (
          <button
            key={q.id}
            onClick={() => onNavigate(q.id)}
            aria-label={`Question ${q.number}`}
            className={cn(
              "relative w-full aspect-square rounded-md flex items-center justify-center text-sm font-medium transition-transform hover:scale-105 active:scale-95",
              getStatusColor(q.id, isCurrent)
            )}
          >
            {q.number}
            {isAnsweredMarked && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-success translate-x-1 translate-y-1 ring-2 ring-background" />
            )}
          </button>
        );
      })}
    </div>
  );
}
