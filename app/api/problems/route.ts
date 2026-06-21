import { NextResponse } from "next/server";
import { calculateSystemRisk } from "@/lib/scoring";
import { getProblems } from "@/lib/store";

export async function GET() {
  const problems = await getProblems();

  return NextResponse.json({
    problems,
    risk: calculateSystemRisk(problems),
    updatedAt: new Date().toISOString()
  });
}
