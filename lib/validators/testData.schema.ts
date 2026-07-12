import { z } from "zod";

export const QuestionOptionSchema = z.object({
  id: z.enum(["A", "B", "C", "D"]),
  text: z.string(),
});

export const QuestionTypeSchema = z.enum(["MCQ", "MSQ", "NAT"]);

export const QuestionSchema = z.object({
  id: z.string(),
  number: z.number(),
  type: QuestionTypeSchema,
  marks: z.number(),
  negativeMarks: z.number(),
  section: z.string(),
  questionText: z.string(),
  questionImage: z.string().nullable(),
  options: z.array(QuestionOptionSchema),
  correctAnswer: z.array(z.string()),
  natRange: z.tuple([z.number(), z.number()]).nullable(),
  solution: z.string(),
});

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
});

export const TestDataSchema = z.object({
  testMeta: TestMetaSchema,
  questions: z.array(QuestionSchema),
});

export type QuestionOption = z.infer<typeof QuestionOptionSchema>;
export type QuestionType = z.infer<typeof QuestionTypeSchema>;
export type Question = z.infer<typeof QuestionSchema>;
export type TestMeta = z.infer<typeof TestMetaSchema>;
export type TestData = z.infer<typeof TestDataSchema>;
