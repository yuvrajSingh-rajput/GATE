import { NextResponse } from "next/server";
import { getAllTestMeta } from "@/data/tests";

export async function GET() {
  try {
    const data = getAllTestMeta();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to load test meta:", error);
    return NextResponse.json({ error: "Failed to load tests" }, { status: 500 });
  }
}
