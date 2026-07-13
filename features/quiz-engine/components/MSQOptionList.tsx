"use client";

import React from "react";
import { QuestionOption } from "@/types";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { FormattedText } from "@/components/shared/FormattedText";
import { ZoomableImage } from "@/components/shared/ZoomableImage";

interface MSQOptionListProps {
  testId: string;
  options: QuestionOption[];
  selectedOptions: string[];
  onChange: (optionId: string) => void;
  showSolution?: boolean;
  correctAnswer?: string[];
}

export function MSQOptionList({ testId, options, selectedOptions, onChange, showSolution, correctAnswer }: MSQOptionListProps) {
  return (
    <div className="space-y-3 mt-6">
      {options.map((option) => {
          const isSelected = selectedOptions.includes(option.id);
          const isCorrectOption = showSolution && correctAnswer?.includes(option.id);
          const isWrongSelection = showSolution && isSelected && !isCorrectOption;
          const isMissedCorrect = showSolution && !isSelected && isCorrectOption;

          return (
            <button
              key={option.id}
              onClick={() => {
                if (!showSolution) onChange(option.id);
              }}
              role="checkbox"
              aria-checked={isSelected}
              disabled={showSolution}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-200 group/opt disabled:cursor-default",
                isCorrectOption && isSelected
                  ? "border-success bg-success/10 ring-1 ring-success shadow-sm"
                  : isWrongSelection
                  ? "border-destructive bg-destructive/10 ring-1 ring-destructive shadow-sm"
                  : isMissedCorrect
                  ? "border-success/50 bg-success/5 border-dashed"
                  : isSelected
                  ? "border-accent bg-accent/5 ring-1 ring-accent shadow-sm"
                  : "border-border hover:border-accent/40 hover:bg-muted/50 hover:-translate-y-0.5 hover:shadow-md"
              )}
            >
            {/* Checkbox indicator */}
              <div
                className={cn(
                  "flex-shrink-0 w-8 h-8 rounded-md border flex items-center justify-center font-medium transition-all duration-200",
                  (isCorrectOption && isSelected) || isMissedCorrect
                    ? "text-white border-transparent bg-success"
                    : isWrongSelection
                    ? "text-white border-transparent bg-destructive"
                    : isSelected
                    ? "text-white border-transparent"
                    : "bg-background border-muted-foreground/30 text-transparent group-hover/opt:border-accent/50"
                )}
                style={
                  (isSelected && !showSolution)
                    ? { background: "linear-gradient(135deg, var(--accent), var(--accent-secondary))" }
                    : undefined
                }
              >
              <Check className="w-5 h-5" />
            </div>

            {/* Option content */}
            <div className="flex-1 text-base leading-relaxed overflow-hidden">
              <span className="font-semibold mr-2">{option.id}.</span>
              {option.text && <FormattedText text={option.text} className="inline" />}
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
