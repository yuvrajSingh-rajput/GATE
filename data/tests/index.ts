import test2 from "./test-2.json";
import { TestMeta, TestData } from "@/lib/validators/testData.schema";

export const TEST_MANIFEST: TestMeta[] = [test2.testMeta as TestMeta];

const TEST_DATA_MAP: Record<string, TestData> = {
  "test-2": test2 as TestData,
};

export function getTestData(testId: string): TestData | null {
  return TEST_DATA_MAP[testId] || null;
}
