import { dimensionWeights } from "./demo-data";
import type {
  DimensionWeights,
  ProblemObject,
  ScoreDimensions,
  SemanticSignal,
  SystemRisk,
  Trend
} from "./types";

const clamp = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, value));

export function computeScore(
  dimensions: ScoreDimensions,
  weights: DimensionWeights = dimensionWeights
): number {
  const weighted =
    dimensions.urgency * weights.urgency +
    dimensions.impactRadius * weights.impactRadius +
    dimensions.costOfIgnoring * weights.costOfIgnoring +
    dimensions.timeSensitivity * weights.timeSensitivity +
    dimensions.recoveryDifficulty * weights.recoveryDifficulty +
    dimensions.signalConfidence * weights.signalConfidence;

  return Math.round(clamp(weighted));
}

export function estimateDimensions(signals: SemanticSignal[]): ScoreDimensions {
  const count = Math.max(signals.length, 1);
  const avgConfidence = signals.reduce((sum, signal) => sum + signal.confidence, 0) / count;
  const avgSentiment = signals.reduce((sum, signal) => sum + signal.sentiment, 0) / count;
  const urgencyTerms = signals.reduce((sum, signal) => sum + signal.urgencyTerms.length, 0);
  const affectedPopulation = signals.reduce((sum, signal) => sum + signal.affectedPopulationEstimate, 0);
  const districts = new Set(signals.map((signal) => signal.location.district));
  const newest = Math.min(
    ...signals.map((signal) => Date.now() - new Date(signal.createdAt).getTime())
  );
  const minutesSinceNewest = newest / 1000 / 60;

  return {
    urgency: clamp(55 + urgencyTerms * 8 + (avgSentiment < -0.4 ? 14 : 0) - minutesSinceNewest / 20),
    impactRadius: clamp(45 + districts.size * 12 + Math.log10(affectedPopulation + 1) * 10),
    costOfIgnoring: clamp(48 + Math.log10(affectedPopulation + 10) * 12 + (avgSentiment < -0.5 ? 12 : 0)),
    timeSensitivity: clamp(50 + urgencyTerms * 7 + (minutesSinceNewest < 30 ? 15 : 0)),
    recoveryDifficulty: clamp(42 + districts.size * 7 + (affectedPopulation > 1000 ? 16 : 0)),
    signalConfidence: clamp(avgConfidence * 100)
  };
}

export function trendFromSignals(signals: SemanticSignal[]): Trend {
  const recent = signals.filter((signal) => Date.now() - new Date(signal.createdAt).getTime() < 45 * 60 * 1000);
  const negative = signals.filter((signal) => signal.sentiment < -0.35);

  if (recent.length >= 2 && negative.length >= 2) return "rising";
  if (recent.length === 0) return "easing";
  return "stable";
}

export function actionWindowForScore(score: number): number {
  if (score >= 90) return 14;
  if (score >= 85) return 21;
  if (score >= 78) return 45;
  if (score >= 70) return 60;
  return 90;
}

export function calculateSystemRisk(problems: ProblemObject[]): SystemRisk {
  if (problems.length === 0) {
    return { score: 0, label: "low", updatedAt: new Date().toISOString() };
  }

  const topThree = problems
    .map((problem) => problem.score)
    .sort((a, b) => b - a)
    .slice(0, 3);
  const score = Math.round(topThree.reduce((sum, value) => sum + value, 0) / topThree.length);

  return {
    score,
    label: score >= 88 ? "critical" : score >= 75 ? "elevated" : score >= 55 ? "guarded" : "low",
    updatedAt: new Date().toISOString()
  };
}
