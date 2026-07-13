"use client";

import React from "react";
import { QuestionOption } from "@/types";
import { cn } from "@/lib/utils";
import { FormattedText } from "@/components/shared/FormattedText";
import { ZoomableImage } from "@/components/shared/ZoomableImage";

interface OptionListProps {
  testId: string;
  options: QuestionOption[];
  selectedOption: string | null;
  onChange: (optionId: string) => void;
  showSolution?: boolean;
  correctAnswer?: string[];
}

export function OptionList({ testId, options, selectedOption, onChange, showSolution, correctAnswer }: OptionListProps) {
  return (
    <div className="space-y-3 mt-6">
      {options.map((option) => {
          const isSelected = selectedOption === option.id;
          const isCorrectOption = showSolution && correctAnswer?.includes(option.id);
          const isWrongSelection = showSolution && isSelected && !isCorrectOption;

          return (
            <button
              key={option.id}
              onClick={() => {
                if (!showSolution) onChange(option.id);
              }}
              role="radio"
              aria-checked={isSelected}
              disabled={showSolution}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-200 group/opt disabled:cursor-default",
                isCorrectOption
                  ? "border-success bg-success/10 ring-1 ring-success shadow-sm"
                  : isWrongSelection
                  ? "border-destructive bg-destructive/10 ring-1 ring-destructive shadow-sm"
                  : isSelected
                  ? "border-accent bg-accent/5 ring-1 ring-accent shadow-sm"
                  : "border-border hover:border-accent/40 hover:bg-muted/50 hover:-translate-y-0.5 hover:shadow-md"
              )}
            >
            {/* Option circle */}
              <div
                className={cn(
                  "flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center font-semibold text-sm transition-all duration-200",
                  isCorrectOption
                    ? "text-white border-transparent bg-success"
                    : isWrongSelection
                    ? "text-white border-transparent bg-destructive"
                    : isSelected
                    ? "text-white border-transparent"
                    : "bg-background border-muted-foreground/30 text-foreground group-hover/opt:border-accent/50"
                )}
                style={
                  (isSelected && !isCorrectOption && !isWrongSelection)
                    ? { background: "linear-gradient(135deg, var(--accent), var(--accent-secondary))" }
                    : undefined
                }
              >
              {option.id}
            </div>

            {/* Option content */}
            <div className="flex-1 text-base leading-relaxed overflow-hidden">
              {option.text && <FormattedText text={option.text} />}
              {option.image && (
                <div className="mt-2 w-full max-w-sm">
                  <ZoomableImage src={`/api/images/${testId}/${option.image}`} alt={`Option ${option.id}`} />
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
