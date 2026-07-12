import fs from "fs";
import path from "path";
import { TestDataSchema } from "../lib/validators/testData.schema";

const testsDir = path.join(process.cwd(), "data", "tests");

function validateTests() {
  const files = fs.readdirSync(testsDir).filter(file => file.endsWith(".json"));
  let allValid = true;

  for (const file of files) {
    const filePath = path.join(testsDir, file);
    try {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const jsonData = JSON.parse(fileContent);
      
      TestDataSchema.parse(jsonData);
      console.log(`✅ [VALID] ${file}`);
    } catch (error) {
      allValid = false;
      console.error(`❌ [INVALID] ${file}:`);
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
