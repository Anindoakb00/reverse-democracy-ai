import type { ProblemObject, Recommendation, ScoreDimensions, SemanticSignal } from "./types";

function money(value: number): number {
  return Math.round(value / 1000) * 1000;
}

export function estimateEconomicExposure(dimensions: ScoreDimensions, affectedPopulation: number): number {
  const severity = (dimensions.urgency + dimensions.costOfIgnoring + dimensions.recoveryDifficulty) / 300;
  return money(affectedPopulation * 420 * (1 + severity));
}

export function buildRecommendations(
  problemDraft: Pick<ProblemObject, "id" | "title" | "score" | "actionWindowDays" | "dimensions">,
  evidence: SemanticSignal[]
): Recommendation[] {
  const evidenceIds = evidence.map((signal) => signal.id);
  const owners = {
    "student-burnout": "Student Affairs + Counseling",
    "water-scarcity": "Water Board Emergency Cell",
    "scholarship-access": "Financial Aid Office",
    "teacher-shortage": "Education Staffing Unit",
    "digital-infrastructure-gap": "Infrastructure Program Office"
  } as const;

  const owner = owners[problemDraft.id as keyof typeof owners] ?? "Institutional Response Team";
  const baseCost = estimateEconomicExposure(
    problemDraft.dimensions,
    evidence.reduce((sum, signal) => sum + signal.affectedPopulationEstimate, 0)
  );

  return [
    {
      title: `Open response cell for ${problemDraft.title}`,
      owner,
      actionWindowDays: problemDraft.actionWindowDays,
      estimatedCost: money(baseCost * 0.08),
      expectedBenefit: "Create accountable ownership before the crisis crosses the next threshold.",
      evidenceIds
    },
    {
      title: "Launch targeted intervention and monitor leading indicators",
      owner,
      actionWindowDays: Math.max(3, Math.round(problemDraft.actionWindowDays / 2)),
      estimatedCost: money(baseCost * 0.16),
      expectedBenefit: "Reduce projected impact while keeping decision-makers inside the explainability loop.",
      evidenceIds: evidenceIds.slice(0, Math.max(1, Math.ceil(evidenceIds.length / 2)))
    }
  ];
}
