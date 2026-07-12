"use client";

import React from "react";
import { QuestionOption } from "@/types";
import { cn } from "@/lib/utils";
import { FormattedText } from "@/components/shared/FormattedText";

interface OptionListProps {
  options: QuestionOption[];
  selectedOption: string | null;
  onChange: (optionId: string) => void;
}

export function OptionList({ options, selectedOption, onChange }: OptionListProps) {
  return (
    <div className="space-y-3 mt-6">
      {options.map((option) => {
        const isSelected = selectedOption === option.id;
        return (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            role="radio"
            aria-checked={isSelected}
            className={cn(
              "w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all",
              isSelected
                ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm"
                : "border-border hover:border-primary/40 hover:bg-muted/50"
            )}
          >
            <div
              className={cn(
                "flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center font-medium text-sm transition-colors",
                isSelected
                  ? "bg-primary border-primary text-primary-foreground"
                  : "bg-background border-muted-foreground/30 text-foreground"
              )}
            >
              {option.id}
            </div>
            <div className="flex-1 text-base leading-relaxed">
              <FormattedText text={option.text} />
            </div>
          </button>
        );
      })}
    </div>
  );
}
