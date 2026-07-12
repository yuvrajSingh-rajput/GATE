import React from "react";

// Converts "0^m 1^n 2^k 3^l" style plain-text notation into React nodes
// with real <sup>/<sub> tags. Does NOT touch code blocks.
export function formatInlineNotation(text: string): React.ReactNode[] {
  // Capture base character/token immediately followed by ^ or _ and a run of alphanumeric characters.
  // Example matches: "0^m", "2^k", "x_i", "a^(n-1)"
  const pattern = /([A-Za-z0-9])([\^_])(\([^)]+\)|[A-Za-z0-9]+)/g;
  
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;
  
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.substring(lastIndex, match.index));
    }
    
    const base = match[1];
    const operator = match[2];
    let token = match[3];
    
    if (token.startsWith("(") && token.endsWith(")")) {
      token = token.slice(1, -1);
    }
    
    nodes.push(base); // Push base as plain text
    
    if (operator === "^") {
      nodes.push(
        <sup key={`sup-${match.index}`} className="text-[0.7em] align-super">
          {token}
        </sup>
      );
    } else {
      nodes.push(
        <sub key={`sub-${match.index}`} className="text-[0.7em] align-sub">
          {token}
        </sub>
      );
    }
    
    lastIndex = pattern.lastIndex;
  }
  
  if (lastIndex < text.length) {
    nodes.push(text.substring(lastIndex));
  }
  
  return nodes;
}
