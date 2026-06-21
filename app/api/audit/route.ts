import { NextRequest, NextResponse } from "next/server";
import { buildAuditTrace } from "@/lib/audit";
import { findProblem, getProblems } from "@/lib/store";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  const problem = id ? await findProblem(id) : (await getProblems())[0];

  if (!problem) {
    return NextResponse.json({ error: "Problem not found" }, { status: 404 });
  }

  return NextResponse.json({
    problemId: problem.id,
    trace: buildAuditTrace(problem)
  });
}
