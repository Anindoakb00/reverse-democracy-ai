"use client";

import {
  Activity,
  BrainCircuit,
  Gauge,
  GitBranch,
  Network,
  Play,
  RefreshCw,
  Send,
  ShieldCheck,
  Siren,
  Sparkles
} from "lucide-react";
import { type CSSProperties, type FormEvent, useEffect, useMemo, useState } from "react";
import type { ProblemObject, SimulationResult, SystemRisk } from "@/lib/types";

interface ProblemsPayload {
  problems: ProblemObject[];
  risk: SystemRisk;
  updatedAt: string;
}

const dimensionLabels: Array<[keyof ProblemObject["dimensions"], string]> = [
  ["urgency", "Urgency"],
  ["impactRadius", "Impact radius"],
  ["costOfIgnoring", "Cost of ignoring"],
  ["timeSensitivity", "Time sensitivity"],
  ["recoveryDifficulty", "Recovery difficulty"],
  ["signalConfidence", "Signal confidence"]
];

export function ReverseDemocracyDashboard() {
  const [payload, setPayload] = useState<ProblemsPayload | null>(null);
  const [selectedId, setSelectedId] = useState("student-burnout");
  const [simulation, setSimulation] = useState<SimulationResult | null>(null);
  const [busy, setBusy] = useState(false);

  const selected = useMemo(
    () => payload?.problems.find((problem) => problem.id === selectedId) ?? payload?.problems[0],
    [payload, selectedId]
  );

  async function loadProblems() {
    setBusy(true);
    const response = await fetch("/api/problems", { cache: "no-store" });
    const data = (await response.json()) as ProblemsPayload;
    setPayload(data);
    setSelectedId((current) => data.problems.find((problem) => problem.id === current)?.id ?? data.problems[0]?.id ?? "");
    setBusy(false);
  }

  async function runSimulation(problemId = selected?.id) {
    if (!problemId) return;
    const response = await fetch(`/api/problems/${problemId}/simulate`, { method: "POST" });
    const data = (await response.json()) as { simulation: SimulationResult };
    setSimulation(data.simulation);
  }

  async function resetDemo() {
    setBusy(true);
    await fetch("/api/ingest/demo", { method: "POST" });
    await loadProblems();
    setBusy(false);
  }

  useEffect(() => {
    void loadProblems();
  }, []);

  useEffect(() => {
    if (selected) void runSimulation(selected.id);
  }, [selected?.id]);

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="kicker">AI-powered problem prioritization system</p>
          <h1>Reverse Democracy AI</h1>
          <p className="subtitle">Problems compete. People do not.</p>
        </div>
        <div className="topbar-actions">
          <button className="icon-button" onClick={resetDemo} title="Reset demo signal stream" disabled={busy}>
            <RefreshCw size={18} />
          </button>
          <button className="primary-button" onClick={() => runSimulation()} disabled={!selected}>
            <Play size={17} />
            Simulate
          </button>
        </div>
      </header>

      <section className="metric-strip" aria-label="System metrics">
        <Metric label="Active problems" value={payload?.problems.length ?? 0} />
        <Metric label="System risk" value={payload?.risk.score ?? 0} suffix="/100" />
        <Metric label="Top score" value={payload?.problems[0]?.score ?? 0} suffix="/100" />
        <Metric label="Fastest action window" value={payload?.problems[0]?.actionWindowDays ?? 0} suffix=" days" />
      </section>

      <section className="dashboard-grid">
        <ProblemLeaderboard
          problems={payload?.problems ?? []}
          selectedId={selected?.id ?? ""}
          onSelect={setSelectedId}
        />
        {selected ? (
          <ProblemDetail problem={selected} />
        ) : (
          <section className="panel empty-panel">Loading problem intelligence...</section>
        )}
        <SystemPanel risk={payload?.risk} selected={selected} />
      </section>

      <section className="wide-grid">
        <PipelinePanel />
        <SimulationPanel simulation={simulation} />
      </section>

      <section className="wide-grid">
        <SignalIntake onSubmitted={loadProblems} />
        <ArchitecturePanel />
      </section>
    </main>
  );
}

function Metric({ label, value, suffix = "" }: { label: string; value: number | string; suffix?: string }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>
        {value}
        {suffix}
      </strong>
    </div>
  );
}

function ProblemLeaderboard({
  problems,
  selectedId,
  onSelect
}: {
  problems: ProblemObject[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <section className="panel leaderboard">
      <div className="panel-heading">
        <div>
          <p className="kicker">Live intelligence</p>
          <h2>Problem leaderboard</h2>
        </div>
        <Gauge size={21} />
      </div>
      <div className="table">
        <div className="table-row table-head">
          <span>Rank</span>
          <span>Problem</span>
          <span>Score</span>
          <span>Window</span>
        </div>
        {problems.map((problem, index) => (
          <button
            className={`table-row problem-row ${problem.id === selectedId ? "selected" : ""}`}
            key={problem.id}
            onClick={() => onSelect(problem.id)}
            title={`Open ${problem.title}`}
          >
            <span>#{index + 1}</span>
            <span>
              {problem.title}
              <small>{problem.trend}</small>
            </span>
            <strong>{problem.score}</strong>
            <span>{problem.actionWindowDays}d</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function ProblemDetail({ problem }: { problem: ProblemObject }) {
  return (
    <section className="panel detail-panel">
      <div className="panel-heading">
        <div>
          <p className="kicker">Problem object</p>
          <h2>{problem.title}</h2>
        </div>
        <Siren size={22} />
      </div>
      <p className="summary">{problem.summary}</p>
      <div className="score-block">
        <div>
          <span>Problem Score</span>
          <strong>{problem.score}</strong>
        </div>
        <div>
          <span>Affected population</span>
          <strong>{problem.affectedPopulation.toLocaleString()}</strong>
        </div>
      </div>
      <DimensionBars problem={problem} />
      <div className="recommendations">
        {problem.recommendations.map((recommendation) => (
          <div className="recommendation" key={recommendation.title}>
            <strong>{recommendation.title}</strong>
            <span>{recommendation.owner}</span>
            <p>{recommendation.expectedBenefit}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function DimensionBars({ problem }: { problem: ProblemObject }) {
  return (
    <div className="dimension-bars">
      {dimensionLabels.map(([key, label]) => {
        const value = problem.dimensions[key];
        return (
          <div className="dimension" key={key}>
            <div>
              <span>{label}</span>
              <strong>{Math.round(value)}</strong>
            </div>
            <span className="bar">
              <span style={{ width: `${Math.max(6, value)}%` }} />
            </span>
          </div>
        );
      })}
    </div>
  );
}

function SystemPanel({ risk, selected }: { risk?: SystemRisk; selected?: ProblemObject }) {
  return (
    <section className="panel system-panel">
      <div className="panel-heading">
        <div>
          <p className="kicker">Command center</p>
          <h2>System view</h2>
        </div>
        <Activity size={21} />
      </div>
      <RiskMeter risk={risk} />
      <Heatmap problem={selected} />
      {selected ? <PredictionCurve problem={selected} /> : null}
    </section>
  );
}

function RiskMeter({ risk }: { risk?: SystemRisk }) {
  const score = risk?.score ?? 0;
  return (
    <div className="risk-meter">
      <div className="risk-ring" style={{ "--score": score } as CSSProperties}>
        <strong>{score}</strong>
        <span>{risk?.label ?? "loading"}</span>
      </div>
      <p>Aggregate risk updates as signals are ingested, clustered, and rescored.</p>
    </div>
  );
}

function Heatmap({ problem }: { problem?: ProblemObject }) {
  const cells = Array.from({ length: 24 }, (_, index) => {
    const signalHit = problem?.evidence[index % Math.max(1, problem.evidence.length)];
    const intensity = signalHit ? Math.min(1, signalHit.confidence + (problem.score / 100) * 0.25) : 0.18;
    return <span key={index} style={{ opacity: intensity }} />;
  });

  return (
    <div className="heatmap">
      <div>
        <strong>Problem density</strong>
        <span>{problem?.evidence[0]?.location.district ?? "No district"}</span>
      </div>
      <div className="heatmap-grid">{cells}</div>
    </div>
  );
}

function PredictionCurve({ problem }: { problem: ProblemObject }) {
  const points = problem.trajectory.map((point, index) => {
    const x = 12 + index * 54;
    const y = 116 - point.noActionRisk;
    return `${x},${y}`;
  });
  const intervention = problem.trajectory.map((point, index) => {
    const x = 12 + index * 54;
    const y = 116 - point.interventionRisk;
    return `${x},${y}`;
  });

  return (
    <div className="curve">
      <div>
        <strong>Prediction curve</strong>
        <span>0/14/30/60/90 days</span>
      </div>
      <svg viewBox="0 0 244 128" role="img" aria-label="Risk trajectory">
        <polyline points={points.join(" ")} className="line-danger" />
        <polyline points={intervention.join(" ")} className="line-safe" />
      </svg>
    </div>
  );
}

function PipelinePanel() {
  const steps = [
    ["Collect", "APIs, portals, social, sensors, and direct input"],
    ["Understand", "LLM semantics, sentiment, entities, geography"],
    ["Detect", "Cluster signals into living Problem Objects"],
    ["Score", "Six-dimensional urgency index from 0 to 100"],
    ["Simulate", "Model 30/60/90-day future states"],
    ["Recommend", "Evidence-backed intervention windows"]
  ];

  return (
    <section className="panel pipeline-panel">
      <div className="panel-heading">
        <div>
          <p className="kicker">Core engine</p>
          <h2>Six-step pipeline</h2>
        </div>
        <GitBranch size={21} />
      </div>
      <div className="pipeline">
        {steps.map(([name, detail], index) => (
          <div className="pipeline-step" key={name}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{name}</strong>
            <p>{detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SimulationPanel({ simulation }: { simulation: SimulationResult | null }) {
  return (
    <section className="panel simulation-panel">
      <div className="panel-heading">
        <div>
          <p className="kicker">Simulation engine</p>
          <h2>Cost of doing nothing</h2>
        </div>
        <Sparkles size={21} />
      </div>
      {simulation ? (
        <div className="scenario-grid">
          <div className="scenario danger">
            <strong>Ignore for {simulation.horizonDays} days</strong>
            <span>Stress +{simulation.noAction.stressIndexDelta}%</span>
            <span>Loss ${simulation.noAction.economicLoss.toLocaleString()}</span>
            <span>Recovery {simulation.noAction.recoveryMonths} months</span>
          </div>
          <div className="scenario safe">
            <strong>Act within {simulation.intervention.actionWithinDays} days</strong>
            <span>Risk -{simulation.intervention.riskReduction}%</span>
            <span>Savings ${simulation.intervention.economicSavings.toLocaleString()}</span>
            <span>Recovery {simulation.intervention.recoveryMonths} months</span>
          </div>
        </div>
      ) : (
        <p className="summary">Run a simulation to compare no-action and intervention outcomes.</p>
      )}
    </section>
  );
}

function SignalIntake({ onSubmitted }: { onSubmitted: () => Promise<void> }) {
  const [text, setText] = useState("");
  const [district, setDistrict] = useState("Central Campus");
  const [source, setSource] = useState("complaint");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!text.trim()) return;
    setBusy(true);
    await fetch("/api/signals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source,
        channel: "manual-intake",
        text,
        location: { district, lat: 23.78, lng: 90.4 },
        confidence: 0.82
      })
    });
    setText("");
    await onSubmitted();
    setBusy(false);
  }

  return (
    <section className="panel intake-panel">
      <div className="panel-heading">
        <div>
          <p className="kicker">Signal intake</p>
          <h2>Direct input</h2>
        </div>
        <Send size={21} />
      </div>
      <form onSubmit={submit}>
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="A new signal, report, complaint, sensor alert, or community observation..."
        />
        <div className="form-row">
          <select value={source} onChange={(event) => setSource(event.target.value)}>
            <option value="complaint">Complaint</option>
            <option value="report">Report</option>
            <option value="social">Social</option>
            <option value="sensor">Sensor</option>
            <option value="news">News</option>
            <option value="survey">Survey</option>
            <option value="direct">Direct</option>
          </select>
          <input value={district} onChange={(event) => setDistrict(event.target.value)} />
          <button className="primary-button" disabled={busy}>
            <Send size={17} />
            Ingest
          </button>
        </div>
      </form>
    </section>
  );
}

function ArchitecturePanel() {
  const layers = [
    ["Layer 5", "Analytics and output", "Leaderboard, simulations, heatmaps, alerts"],
    ["Layer 4", "Problem graph", "Neo4j relationships, temporal tracking, scoring"],
    ["Layer 3", "AI processing core", "LLM engine, NLP, entity resolution, clustering"],
    ["Layer 2", "API gateway", "Auth, routing, rate limiting, embedded widgets"],
    ["Layer 1", "Frontend", "React/Next.js dashboard and mobile surfaces"]
  ];

  return (
    <section className="panel architecture-panel">
      <div className="panel-heading">
        <div>
          <p className="kicker">Technical architecture</p>
          <h2>Designed for scale</h2>
        </div>
        <Network size={21} />
      </div>
      <div className="layers">
        {layers.map(([layer, title, detail]) => (
          <div className="layer" key={layer}>
            <BrainCircuit size={18} />
            <span>{layer}</span>
            <strong>{title}</strong>
            <p>{detail}</p>
          </div>
        ))}
      </div>
      <div className="trust-row">
        <span>
          <ShieldCheck size={16} />
          Explainability first
        </span>
        <span>
          <ShieldCheck size={16} />
          Privacy by default
        </span>
        <span>
          <ShieldCheck size={16} />
          Human in the loop
        </span>
      </div>
    </section>
  );
}
