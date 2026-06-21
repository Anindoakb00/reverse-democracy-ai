import { NextResponse } from "next/server";
import { auditCoverageBias } from "@/lib/bias";
import { getProblems } from "@/lib/store";

export async function GET() {
  const problems = await getProblems();

  return NextResponse.json({
    audit: auditCoverageBias(problems),
    updatedAt: new Date().toISOString()
  });
}
