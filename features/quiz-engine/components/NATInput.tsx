"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface NATInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function NATInput({ value, onChange }: NATInputProps) {
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

  return (
    <div className="w-full max-w-sm mt-4">
      <Input
        type="text"
        inputMode="decimal"
        placeholder="Enter your answer (e.g., 2.54)"
        value={localValue}
        onChange={handleChange}
        className="h-12 text-lg font-mono placeholder:text-base border-primary/20 focus-visible:ring-primary focus-visible:ring-offset-2"
      />
      <p className="text-xs text-muted-foreground mt-2">
        Type a number. Both positive and negative decimals are accepted.
      </p>
    </div>
  );
}
