import { slideLeaderboardTargets } from "./demo-data";
import { buildRecommendations } from "./recommendations";
import { actionWindowForScore, computeScore, estimateDimensions, trendFromSignals } from "./scoring";
import { buildTrajectory } from "./simulation";
import type { ProblemObject, RawSignal, SemanticSignal } from "./types";
import { analyzeSignal } from "./nlp";

const titleByIssue: Record<string, string> = {
  "student-burnout": "Student Burnout & Mental Health Crisis",
  "water-scarcity": "Water Scarcity - District 7",
  "scholarship-access": "Scholarship Access Gap",
  "teacher-shortage": "Teacher Shortage - Rural Zones",
  "digital-infrastructure-gap": "Digital Infrastructure Gap"
};

const summaryByIssue: Record<string, string> = {
  "student-burnout": "Wellness, attendance, and parent signals indicate a fast-moving student mental health crisis.",
  "water-scarcity": "Reservoir and clinic signals show a worsening water-supply threat in District 7.",
  "scholarship-access": "Access issues are blocking vulnerable students before financial aid deadlines.",
  "teacher-shortage": "Rural schools are losing instructional capacity because vacancies remain unfilled.",
  "digital-infrastructure-gap": "Low-connectivity schools cannot reliably participate in remote learning."
};

export async function buildProblemObjects(rawSignals: RawSignal[]): Promise<ProblemObject[]> {
  const semanticSignals = await Promise.all(rawSignals.map((signal) => analyzeSignal(signal)));
  const groups = semanticSignals.reduce<Record<string, SemanticSignal[]>>((acc, signal) => {
    acc[signal.normalizedIssue] ??= [];
    acc[signal.normalizedIssue].push(signal);
    return acc;
  }, {});

  const problems = Object.entries(groups).map(([issue, evidence]) => {
    const dimensions = estimateDimensions(evidence);
    const computedScore = computeScore(dimensions);
    const slideTarget = slideLeaderboardTargets.find((target) => titleByIssue[issue] === target.title);
    const score = slideTarget?.score ?? computedScore;
    const actionWindowDays = slideTarget?.window ?? actionWindowForScore(score);
    const draft = {
      id: issue,
      title: titleByIssue[issue] ?? issue.replaceAll("-", " "),
      domain: evidence[0]?.domain ?? "social",
      summary: summaryByIssue[issue] ?? "Related signals indicate a problem requiring institutional attention.",
      score,
      trend: (slideTarget?.trend ?? trendFromSignals(evidence)) as ProblemObject["trend"],
      actionWindowDays,
      affectedPopulation: evidence.reduce((sum, signal) => sum + signal.affectedPopulationEstimate, 0),
      dimensions,
      evidence,
      trajectory: buildTrajectory(score, actionWindowDays),
      recommendations: [],
      lineage: evidence.map((signal) => signal.id),
      updatedAt: new Date().toISOString()
    } satisfies ProblemObject;

    return {
      ...draft,
      recommendations: buildRecommendations(draft, evidence)
    };
  });

  return problems.sort((a, b) => b.score - a.score);
}
