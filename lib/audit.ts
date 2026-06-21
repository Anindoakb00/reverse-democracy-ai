import type { AuditStep, ProblemObject } from "./types";

export function buildAuditTrace(problem: ProblemObject): AuditStep[] {
  const now = new Date().toISOString();
  const inputIds = problem.evidence.map((signal) => signal.id);

  return [
    {
      step: "Collect Signals",
      inputIds,
      output: `${problem.evidence.length} raw signals normalized across source, time, channel, and geography.`,
      confidence: 0.96,
      timestamp: now
    },
    {
      step: "Understand Context",
      inputIds,
      output: `Detected domain=${problem.domain}, entities=${problem.evidence.flatMap((signal) => signal.entities).slice(0, 6).join(", ")}.`,
      confidence: average(problem.evidence.map((signal) => signal.confidence)),
      timestamp: now
    },
    {
      step: "Detect Problems",
      inputIds,
      output: `Clustered signals into Problem Object '${problem.title}'.`,
      confidence: 0.88,
      timestamp: now
    },
    {
      step: "Score Impact",
      inputIds,
      output: `Problem Score ${problem.score}/100 across urgency, impact, cost, time sensitivity, recovery difficulty, and confidence.`,
      confidence: problem.dimensions.signalConfidence / 100,
      timestamp: now
    },
    {
      step: "Simulate Future",
      inputIds: [problem.id],
      output: `Projected risk trajectory over 30/60/90 days with and without intervention.`,
      confidence: 0.81,
      timestamp: now
    },
    {
      step: "Recommend Action",
      inputIds: [problem.id],
      output: `${problem.recommendations.length} evidence-backed actions generated for the ${problem.actionWindowDays}-day window.`,
      confidence: 0.84,
      timestamp: now
    }
  ];
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2));
}
