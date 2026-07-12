import { z } from "zod";

export const QuestionOptionSchema = z.object({
  id: z.enum(["A", "B", "C", "D"]),
  text: z.string().optional(),
  image: z.string().nullable().optional(),
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

export const QuestionArraySchema = z.array(QuestionSchema);

export type QuestionOption = z.infer<typeof QuestionOptionSchema>;
export type QuestionType = z.infer<typeof QuestionTypeSchema>;
export type Question = z.infer<typeof QuestionSchema>;
