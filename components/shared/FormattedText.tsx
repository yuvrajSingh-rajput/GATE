"use client";

import React, { useMemo } from "react";
import { splitCodeBlocks } from "@/lib/text-processing/splitCodeBlocks";
import { formatInlineNotation } from "@/lib/text-processing/formatSuperscript";
import { CodeBlock } from "@/components/shared/CodeBlock";
import { cn } from "@/lib/utils";

interface FormattedTextProps {
  text: string;
  className?: string;
}

export function FormattedText({ text, className }: FormattedTextProps) {
  const blocks = useMemo(() => splitCodeBlocks(text), [text]);

  return (
    <div className={cn("text-base whitespace-pre-wrap leading-relaxed", className)}>
      {blocks.map((block, index) => {
        if (block.type === "code") {
          return <CodeBlock key={`block-${index}`} code={block.content} />;
        }
        
        // Prose block: apply formatSuperscript to it
        const formattedNodes = formatInlineNotation(block.content);
        return (
          <span key={`block-${index}`}>
            {formattedNodes.map((node, i) => (
              <React.Fragment key={`node-${index}-${i}`}>{node}</React.Fragment>
            ))}
          </span>
        );
      })}
    </div>
  );
}
