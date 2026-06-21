import { NextResponse } from "next/server";
import { simulateProblem } from "@/lib/simulation";
import { findProblem } from "@/lib/store";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const problem = await findProblem(id);

  if (!problem) {
    return NextResponse.json({ error: "Problem not found" }, { status: 404 });
  }

  return NextResponse.json({ simulation: simulateProblem(problem) });
}

export async function GET(request: Request, context: RouteContext) {
  return POST(request, context);
}
