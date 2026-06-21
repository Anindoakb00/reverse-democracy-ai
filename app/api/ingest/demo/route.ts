import { NextResponse } from "next/server";
import { calculateSystemRisk } from "@/lib/scoring";
import { resetDemoData } from "@/lib/store";

export async function POST() {
  const problems = await resetDemoData();

  return NextResponse.json({
    message: "Demo signal stream reset.",
    problems,
    risk: calculateSystemRisk(problems),
    updatedAt: new Date().toISOString()
  });
}
