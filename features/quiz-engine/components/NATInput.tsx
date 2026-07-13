"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface NATInputProps {
  value: string;
  onChange: (value: string) => void;
  showSolution?: boolean;
  natRange?: [number, number] | null;
}

export function NATInput({ value, onChange, showSolution, natRange }: NATInputProps) {
  const [localValue, setLocalValue] = useState(value);

  // Sync with prop when question changes or answer is cleared
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Allow empty string, minus sign, digits, and single decimal point
    if (/^-?\d*\.?\d*$/.test(val)) {
      setLocalValue(val);
      onChange(val);
    }
  };

  const numVal = parseFloat(localValue);
  const isCorrect = showSolution && !isNaN(numVal) && natRange && numVal >= natRange[0] && numVal <= natRange[1];
  const isIncorrect = showSolution && localValue !== "" && !isCorrect;

  return (
    <div className="w-full max-w-sm mt-4">
      <Input
        type="text"
        inputMode="decimal"
        placeholder="Enter your answer (e.g., 2.54)"
        value={localValue}
        onChange={handleChange}
        disabled={showSolution}
        className={cn(
          "h-12 text-lg font-mono placeholder:text-base focus-visible:ring-offset-2 transition-colors disabled:opacity-100",
          isCorrect 
            ? "border-success bg-success/10 text-success focus-visible:ring-success"
            : isIncorrect
            ? "border-destructive bg-destructive/10 text-destructive focus-visible:ring-destructive"
            : "border-primary/20 focus-visible:ring-primary"
        )}
      />
      {showSolution && natRange && (
        <div className="mt-2 text-sm text-success font-medium">
          Correct Range: [{natRange[0]}, {natRange[1]}]
        </div>
      )}
      <p className="text-xs text-muted-foreground mt-2">
        Type a number. Both positive and negative decimals are accepted.
      </p>
    </div>
  );
}
