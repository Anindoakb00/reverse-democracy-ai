import type { ProblemObject } from "./types";

export interface BiasAuditResult {
  district: string;
  evidenceCount: number;
  averageConfidence: number;
  topProblemScore: number;
  warning?: string;
}

export function auditCoverageBias(problems: ProblemObject[]): BiasAuditResult[] {
  const districtMap = new Map<string, { count: number; confidence: number; topScore: number }>();

  for (const problem of problems) {
    for (const signal of problem.evidence) {
      const district = signal.location.district;
      const current = districtMap.get(district) ?? { count: 0, confidence: 0, topScore: 0 };
      current.count += 1;
      current.confidence += signal.confidence;
      current.topScore = Math.max(current.topScore, problem.score);
      districtMap.set(district, current);
    }
  }

  return [...districtMap.entries()]
    .map(([district, value]) => {
      const averageConfidence = value.confidence / value.count;
      return {
        district,
        evidenceCount: value.count,
        averageConfidence: Number(averageConfidence.toFixed(2)),
        topProblemScore: value.topScore,
        warning:
          value.count < 2 && value.topScore > 75
            ? "High-scoring problem has thin evidence coverage; request more source diversity."
            : undefined
      };
    })
    .sort((a, b) => b.topProblemScore - a.topProblemScore);
}
