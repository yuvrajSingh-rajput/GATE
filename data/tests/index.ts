import fs from "node:fs";
import path from "node:path";
import { TestMetaSchema, TestMeta, TestData } from "./_schema/testMeta.schema";
import { QuestionArraySchema, Question } from "./_schema/question.schema";

const TESTS_DIR = path.join(process.cwd(), "data", "tests");

export function getAllTestIds(): string[] {
  return fs
    .readdirSync(TESTS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
    .map((entry) => entry.name);
}

export function getTestMeta(testId: string): TestMeta {
  const raw = fs.readFileSync(path.join(TESTS_DIR, testId, "meta.json"), "utf-8");
  return TestMetaSchema.parse(JSON.parse(raw));
}

export function getAllTestMeta(): TestMeta[] {
  return getAllTestIds().map(getTestMeta);
}

export function getTestQuestions(testId: string): Question[] {
  const raw = fs.readFileSync(path.join(TESTS_DIR, testId, "questions.json"), "utf-8");
  return QuestionArraySchema.parse(JSON.parse(raw));
}

export function getFullTest(testId: string): TestData {
  return { testMeta: getTestMeta(testId), questions: getTestQuestions(testId) };
}
