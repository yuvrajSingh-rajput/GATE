export function splitCodeBlocks(text: string): { type: "code" | "prose"; content: string }[] {
  if (!text) return [];

  const lines = text.split('\n');
  const result: { type: "code" | "prose"; content: string }[] = [];

  const isCode = (line: string) => {
    const trimmed = line.trim();
    if (!trimmed) return false;

    // Strong code indicators for C-like syntax
    if (/^#include/.test(trimmed)) return true;
    if (/(void|int|char|unsigned|float|double)\s+\*?[a-zA-Z_]\w*\s*\(/.test(trimmed)) return true;
    if (/(void|int|char|unsigned|float|double)\s+\*?[a-zA-Z_]\w*\s*(\[[^\]]*\])?\s*=/.test(trimmed)) return true;
    if (/^(for|while|if|else)\s*\(/.test(trimmed)) return true;
    if (/^(printf|scanf|malloc|free|enqueue|dequeue)\s*\(/.test(trimmed)) return true;
    if (/^return\s+/.test(trimmed)) return true;
    if (trimmed === '{' || trimmed === '}') return true;
    // Ends with semicolon, but only if it doesn't look like just a sentence ending in semicolon.
    // e.g. "a = 5;" is code.
    if (/[a-zA-Z0-9_+)-]\s*;\s*$/.test(trimmed)) {
      // If it contains typical math equality without programming assignment, be careful, but we assume it's code if it has semicolon.
      return true;
    }
    return false;
  };

  let currentBlockType: "code" | "prose" | null = null;
  let currentBlockLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let lineIsCode = isCode(line);

    // Lookahead/lookbehind context for ambiguous lines
    if (!lineIsCode) {
      const prevCode = i > 0 && isCode(lines[i - 1]);
      const nextCode = i < lines.length - 1 && isCode(lines[i + 1]);
      
      // Empty lines between code are code
      if (line.trim() === '' && prevCode && nextCode) {
        lineIsCode = true;
      }
      
      // Indented lines following code are likely code
      if (/^\s+/.test(line) && prevCode) {
        lineIsCode = true;
      }
    }

    if (currentBlockType === null) {
      currentBlockType = lineIsCode ? "code" : "prose";
      currentBlockLines.push(line);
    } else if ((currentBlockType === "code") === lineIsCode) {
      currentBlockLines.push(line);
    } else {
      result.push({ type: currentBlockType, content: currentBlockLines.join('\n') });
      currentBlockType = lineIsCode ? "code" : "prose";
      currentBlockLines = [line];
    }
  }

  if (currentBlockLines.length > 0 && currentBlockType) {
    result.push({ type: currentBlockType, content: currentBlockLines.join('\n') });
  }

  // Pass 2: Clean up single-line "code" blocks that are surrounded by prose and might be false positives.
  // The prompt requested "contiguous runs of lines that look like code... immediately followed/preceded by other such lines."
  for (let i = 0; i < result.length; i++) {
    if (result[i].type === "code" && result[i].content.split('\n').length === 1) {
      // It's a single line of code. Let's check if it's really code.
      // E.g. L = {0^m 1^n 2^k 3^l ...} would falsely match `{` or `}`.
      const content = result[i].content;
      // If it doesn't have a semicolon, and doesn't have a code keyword, it might just be math notation containing { or }.
      if (!/;$/.test(content.trim()) && !/^(void|int|char|unsigned|for|while|if)/.test(content.trim())) {
         result[i].type = "prose";
      }
    }
  }

  // Pass 3: Merge adjacent blocks of the same type (caused by Pass 2)
  const mergedResult: { type: "code" | "prose"; content: string }[] = [];
  for (const block of result) {
    if (mergedResult.length > 0 && mergedResult[mergedResult.length - 1].type === block.type) {
      mergedResult[mergedResult.length - 1].content += '\n' + block.content;
    } else {
      mergedResult.push(block);
    }
  }

  return mergedResult;
}
