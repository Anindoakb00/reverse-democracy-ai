export type SignalSource =
  | "complaint"
  | "report"
  | "social"
  | "sensor"
  | "news"
  | "survey"
  | "direct";

export type Trend = "rising" | "stable" | "easing";

export type ProblemDomain =
  | "education"
  | "water"
  | "health"
  | "infrastructure"
  | "labor"
  | "social";

export interface GeoPoint {
  district: string;
  lat: number;
  lng: number;
}

export interface RawSignal {
  id: string;
  source: SignalSource;
  channel: string;
  text: string;
  locale?: string;
  location: GeoPoint;
  createdAt: string;
  confidence: number;
  metadata?: Record<string, string | number | boolean>;
}

export interface SemanticSignal extends RawSignal {
  entities: string[];
  sentiment: number;
  urgencyTerms: string[];
  domain: ProblemDomain;
  normalizedIssue: string;
  affectedPopulationEstimate: number;
}

export interface ScoreDimensions {
  urgency: number;
  impactRadius: number;
  costOfIgnoring: number;
  timeSensitivity: number;
  recoveryDifficulty: number;
  signalConfidence: number;
}

export interface DimensionWeights {
  urgency: number;
  impactRadius: number;
  costOfIgnoring: number;
  timeSensitivity: number;
  recoveryDifficulty: number;
  signalConfidence: number;
}

export interface TrajectoryPoint {
  day: number;
  noActionRisk: number;
  interventionRisk: number;
}

export interface Recommendation {
  title: string;
  owner: string;
  actionWindowDays: number;
  estimatedCost: number;
  expectedBenefit: string;
  evidenceIds: string[];
}

export interface ProblemObject {
  id: string;
  title: string;
  domain: ProblemDomain;
  summary: string;
  score: number;
  trend: Trend;
  actionWindowDays: number;
  affectedPopulation: number;
  dimensions: ScoreDimensions;
  evidence: SemanticSignal[];
  trajectory: TrajectoryPoint[];
  recommendations: Recommendation[];
  lineage: string[];
  updatedAt: string;
}

export interface SimulationResult {
  problemId: string;
  problemTitle: string;
  horizonDays: number;
  noAction: {
    dropoutRateDelta?: number;
    stressIndexDelta: number;
    economicLoss: number;
    recoveryMonths: number;
    secondaryCrises: string[];
  };
  intervention: {
    actionWithinDays: number;
    riskReduction: number;
    economicSavings: number;
    recoveryMonths: number;
    coBenefits: string[];
  };
  trajectory: TrajectoryPoint[];
}

export interface AuditStep {
  step: string;
  inputIds: string[];
  output: string;
  confidence: number;
  timestamp: string;
}

export interface SystemRisk {
  score: number;
  label: "low" | "guarded" | "elevated" | "critical";
  updatedAt: string;
}
