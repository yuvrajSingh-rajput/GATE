"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { cn } from "@/lib/utils";

interface KatexRendererProps {
  content: string;
  className?: string;
}

export function KatexRenderer({ content, className }: KatexRendererProps) {
  // preprocess to replace \$ with $ for math if needed, but standard remark-math handles $...$ and $$...$$ out of the box.
  
  return (
    <div className={cn("text-base md:text-lg leading-7 whitespace-pre-line", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          p: ({ node, ...props }) => <span {...props} />, // avoid block level p tags that break inline flex
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
