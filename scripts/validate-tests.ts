import fs from "fs";
import path from "path";
import { TestMetaSchema } from "../data/tests/_schema/testMeta.schema";
import { QuestionArraySchema } from "../data/tests/_schema/question.schema";

const testsDir = path.join(process.cwd(), "data", "tests");

function validateTests() {
  const entries = fs.readdirSync(testsDir, { withFileTypes: true });
  const testFolders = entries.filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"));
  let allValid = true;

  for (const folder of testFolders) {
    const testId = folder.name;
    const testPath = path.join(testsDir, testId);
    try {
      const metaPath = path.join(testPath, "meta.json");
      const questionsPath = path.join(testPath, "questions.json");

      const metaContent = fs.readFileSync(metaPath, "utf-8");
      const questionsContent = fs.readFileSync(questionsPath, "utf-8");

      TestMetaSchema.parse(JSON.parse(metaContent));
      QuestionArraySchema.parse(JSON.parse(questionsContent));

      console.log(`✅ [VALID] ${testId}`);
    } catch (error) {
      allValid = false;
      console.error(`❌ [INVALID] ${testId}:`);
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }

  if (!allValid) {
    console.error("Test validation failed. Please fix the JSON schemas.");
    process.exit(1);
  } else {
    console.log("All test JSON files are valid.");
  }
}

validateTests();
