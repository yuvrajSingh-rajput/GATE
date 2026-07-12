"use client";

import React from "react";
import { QuestionOption } from "@/types";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { FormattedText } from "@/components/shared/FormattedText";

interface MSQOptionListProps {
  options: QuestionOption[];
  selectedOptions: string[];
  onChange: (optionId: string) => void;
}

export function MSQOptionList({ options, selectedOptions, onChange }: MSQOptionListProps) {
  return (
    <div className="space-y-3 mt-6">
      {options.map((option) => {
        const isSelected = selectedOptions.includes(option.id);
        return (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            role="checkbox"
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
                "flex-shrink-0 w-8 h-8 rounded-md border flex items-center justify-center font-medium transition-colors",
                isSelected
                  ? "bg-primary border-primary text-primary-foreground"
                  : "bg-background border-muted-foreground/30 text-transparent"
              )}
            >
              <Check className="w-5 h-5" />
            </div>
            <div className="flex-1 text-base leading-relaxed">
              <span className="font-semibold mr-2">{option.id}.</span>
              <FormattedText text={option.text} className="inline" />
            </div>
          </button>
        );
      })}
    </div>
  );
}
