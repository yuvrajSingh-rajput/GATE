import { NextResponse } from "next/server";
import { getFullTest } from "@/data/tests";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: Promise<{ testId: string }> }) {
  try {
    const { testId } = await params;
    const data = getFullTest(testId);
    return NextResponse.json(data);
  } catch (error) {
    const { testId } = await params;
    console.error(`Failed to load test ${testId}:`, error);
    return NextResponse.json({ error: "Failed to load test" }, { status: 404 });
  }
}
