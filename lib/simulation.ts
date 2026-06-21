import type { ProblemObject, SimulationResult, TrajectoryPoint } from "./types";
import { estimateEconomicExposure } from "./recommendations";

export function buildTrajectory(score: number, interventionWindow: number): TrajectoryPoint[] {
  return [0, 14, 30, 60, 90].map((day) => {
    const drift = day * (score / 100) * 0.38;
    const actionEffect = day >= interventionWindow ? (day - interventionWindow) * 0.32 : 0;

    return {
      day,
      noActionRisk: Math.min(100, Math.round(score + drift)),
      interventionRisk: Math.max(18, Math.round(score + drift * 0.45 - actionEffect))
    };
  });
}

export function simulateProblem(problem: ProblemObject, horizonDays = 90): SimulationResult {
  const exposure = estimateEconomicExposure(problem.dimensions, problem.affectedPopulation);
  const riskDelta = Math.max(12, Math.round(problem.score * 0.24));
  const noActionLoss = Math.round(exposure * (horizonDays / 60) * (problem.score / 100));
  const economicSavings = Math.round(noActionLoss * 0.75);

  return {
    problemId: problem.id,
    problemTitle: problem.title,
    horizonDays,
    noAction: {
      dropoutRateDelta: problem.id === "student-burnout" ? 34 : undefined,
      stressIndexDelta: Math.round(problem.score * 0.64),
      economicLoss: noActionLoss,
      recoveryMonths: problem.score >= 90 ? 30 : problem.score >= 80 ? 18 : 10,
      secondaryCrises: secondaryCrisesFor(problem.id)
    },
    intervention: {
      actionWithinDays: problem.actionWindowDays,
      riskReduction: riskDelta,
      economicSavings,
      recoveryMonths: problem.score >= 90 ? 6 : problem.score >= 80 ? 8 : 12,
      coBenefits: coBenefitsFor(problem.id)
    },
    trajectory: buildTrajectory(problem.score, problem.actionWindowDays)
  };
}

function secondaryCrisesFor(problemId: string): string[] {
  const map: Record<string, string[]> = {
    "student-burnout": ["teacher attrition", "parent disengagement", "media scrutiny"],
    "water-scarcity": ["clinic load", "school closures", "local price shocks"],
    "scholarship-access": ["dropout risk", "legal complaints", "enrollment decline"],
    "teacher-shortage": ["learning loss", "class cancellations", "family migration"],
    "digital-infrastructure-gap": ["remote learning failure", "assessment gaps", "equity complaints"]
  };

  return map[problemId] ?? ["service breakdown", "trust erosion", "budget shock"];
}

function coBenefitsFor(problemId: string): string[] {
  const map: Record<string, string[]> = {
    "student-burnout": ["academic performance recovery", "teacher retention", "community trust"],
    "water-scarcity": ["health-system relief", "service continuity", "supply-chain stability"],
    "scholarship-access": ["retention lift", "fairer access", "deadline recovery"],
    "teacher-shortage": ["class continuity", "staff morale", "rural coverage"],
    "digital-infrastructure-gap": ["remote learning access", "attendance recovery", "equity gains"]
  };

  return map[problemId] ?? ["lower response cost", "faster recovery", "better public confidence"];
}
