"use client";

import React, { useState } from "react";
import { Question, AttemptResult, AttemptAnswer } from "@/types";
import { FormattedText } from "@/components/shared/FormattedText";
import { ZoomableImage } from "@/components/shared/ZoomableImage";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, MinusCircle } from "lucide-react";

interface SolutionReportProps {
  questions: Question[];
  result: AttemptResult;
  answers: Record<string, AttemptAnswer>;
}

export function SolutionReport({ questions, result, answers }: SolutionReportProps) {
  const [filter, setFilter] = useState<"all" | "correct" | "incorrect" | "skipped">("all");

  const filteredQuestions = questions.filter((q) => {
    const ans = answers[q.id];
    const isAnswered = ans && ans.selected && ans.selected.length > 0;
    let isCorrect = false;

    if (isAnswered) {
      if (q.type === "MCQ" || q.type === "MSQ") {
        isCorrect =
          ans.selected.length === q.correctAnswer.length &&
          ans.selected.every((val) => q.correctAnswer.includes(val));
      } else if (q.type === "NAT" && q.natRange) {
        const val = parseFloat(ans.selected[0]);
        isCorrect = val >= q.natRange[0] && val <= q.natRange[1];
      }
    }

    if (filter === "all") return true;
    if (filter === "skipped") return !isAnswered;
    if (filter === "correct") return isCorrect;
    if (filter === "incorrect") return isAnswered && !isCorrect;
    return true;
  });

  return (
    <div className="space-y-8">
      <div className="flex gap-2 pb-4 border-b">
        <button
          onClick={() => setFilter("all")}
          className={cn("px-4 py-2 rounded-full text-sm font-medium transition-colors", filter === "all" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80")}
        >
          All
        </button>
        <button
          onClick={() => setFilter("correct")}
          className={cn("px-4 py-2 rounded-full text-sm font-medium transition-colors", filter === "correct" ? "bg-success text-success-foreground" : "bg-muted hover:bg-muted/80")}
        >
          Correct
        </button>
        <button
          onClick={() => setFilter("incorrect")}
          className={cn("px-4 py-2 rounded-full text-sm font-medium transition-colors", filter === "incorrect" ? "bg-destructive text-destructive-foreground" : "bg-muted hover:bg-muted/80")}
        >
          Incorrect
        </button>
        <button
          onClick={() => setFilter("skipped")}
          className={cn("px-4 py-2 rounded-full text-sm font-medium transition-colors", filter === "skipped" ? "bg-muted-foreground/20" : "bg-muted hover:bg-muted/80")}
        >
          Skipped
        </button>
      </div>

      <div className="space-y-12">
        {filteredQuestions.map((q) => {
          const ans = answers[q.id];
          const isAnswered = ans && ans.selected && ans.selected.length > 0;
          let isCorrect = false;

          if (isAnswered) {
            if (q.type === "MCQ" || q.type === "MSQ") {
              isCorrect =
                ans.selected.length === q.correctAnswer.length &&
                ans.selected.every((val) => q.correctAnswer.includes(val));
            } else if (q.type === "NAT" && q.natRange) {
              const val = parseFloat(ans.selected[0]);
              isCorrect = val >= q.natRange[0] && val <= q.natRange[1];
            }
          }

          return (
            <div key={q.id} className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col gap-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <Badge className="bg-primary text-primary-foreground">Q. {q.number}</Badge>
                  <Badge variant="outline">{q.type}</Badge>
                  {isAnswered ? (
                    isCorrect ? (
                      <span className="flex items-center gap-1 text-success text-sm font-bold">
                        <CheckCircle2 className="w-4 h-4" /> Correct (+{q.marks})
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-destructive text-sm font-bold">
                        <XCircle className="w-4 h-4" /> Incorrect (-{q.negativeMarks})
                      </span>
                    )
                  ) : (
                    <span className="flex items-center gap-1 text-muted-foreground text-sm font-bold">
                      <MinusCircle className="w-4 h-4" /> Skipped (0)
                    </span>
                  )}
                </div>
              </div>

              <div>
                <FormattedText text={q.questionText} />
                {q.questionImage && (
                  <div className="mt-4">
                    <ZoomableImage src={`/images/questions/${q.questionImage}`} alt={`Question ${q.number}`} />
                  </div>
                )}
              </div>

              {q.options && q.options.length > 0 && (
                <div className="space-y-2 mt-4">
                  <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Options</h4>
                  {q.options.map((opt) => {
                    const isSelectedByMe = isAnswered && ans.selected.includes(opt.id);
                    const isActuallyCorrect = q.correctAnswer.includes(opt.id);

                    let optClass = "border-border bg-background";
                    if (isActuallyCorrect) {
                      optClass = "border-success bg-success/10 ring-1 ring-success";
                    } else if (isSelectedByMe && !isActuallyCorrect) {
                      optClass = "border-destructive bg-destructive/10 ring-1 ring-destructive";
                    }

                    return (
                      <div key={opt.id} className={cn("flex items-start gap-4 p-4 rounded-xl border", optClass)}>
                        <div className="font-bold shrink-0">{opt.id}.</div>
                        <div className="flex-1">
                          <FormattedText text={opt.text} />
                        </div>
                        {isActuallyCorrect && (
                          <Badge className="bg-success text-success-foreground shrink-0">Correct Option</Badge>
                        )}
                        {isSelectedByMe && !isActuallyCorrect && (
                          <Badge variant="destructive" className="shrink-0">Your Answer</Badge>
                        )}
                        {isSelectedByMe && isActuallyCorrect && (
                          <Badge variant="outline" className="shrink-0 bg-background text-success border-success">Your Answer</Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {q.type === "NAT" && (
                <div className="mt-4 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 p-4 rounded-xl border border-success bg-success/10 flex items-center justify-between">
                      <span className="font-semibold">Correct Range:</span>
                      <span className="font-bold">{q.natRange?.[0]} to {q.natRange?.[1]}</span>
                    </div>
                    <div className={cn("flex-1 p-4 rounded-xl border flex items-center justify-between", isAnswered ? (isCorrect ? "border-success bg-success/5" : "border-destructive bg-destructive/5") : "bg-muted")}>
                      <span className="font-semibold">Your Answer:</span>
                      <span className="font-bold">{isAnswered ? ans.selected[0] : "None"}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-4 p-4 bg-muted/40 rounded-xl border">
                <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Solution</h4>
                <FormattedText text={q.solution || "No detailed solution provided."} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
