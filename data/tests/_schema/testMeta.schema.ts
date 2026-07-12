import { z } from "zod";
import { QuestionSchema } from "./question.schema";

export const TestMetaSchema = z.object({
  id: z.string(),
  title: z.string(),
  source: z.string(),
  totalQuestions: z.number(),
  totalMarks: z.number(),
  durationMinutes: z.number(),
  sections: z.array(
    z.object({
      name: z.string(),
      range: z.tuple([z.number(), z.number()]),
    })
  ),
  extractionNotes: z.array(z.string()).optional(),
});

export const TestDataSchema = z.object({
  testMeta: TestMetaSchema,
  questions: z.array(QuestionSchema),
});

export type TestMeta = z.infer<typeof TestMetaSchema>;
export type TestData = z.infer<typeof TestDataSchema>;
