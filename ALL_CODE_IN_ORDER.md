# Reverse Democracy AI - All Code In Order

I scanned the PPTX slide-by-slide. The deck contains a product and architecture spec, not a hidden codebase.
This file lists the complete generated project code in the order you would create it.

## File Order

1. `README.md`
2. `package.json`
3. `.env.example`
4. `tsconfig.json`
5. `next.config.ts`
6. `next-env.d.ts`
7. `app/layout.tsx`
8. `app/page.tsx`
9. `app/globals.css`
10. `components/reverse-democracy-dashboard.tsx`
11. `lib/types.ts`
12. `lib/demo-data.ts`
13. `lib/privacy.ts`
14. `lib/bias.ts`
15. `lib/nlp.ts`
16. `lib/scoring.ts`
17. `lib/recommendations.ts`
18. `lib/simulation.ts`
19. `lib/clustering.ts`
20. `lib/audit.ts`
21. `lib/store.ts`
22. `lib/neo4j.ts`
23. `app/api/problems/route.ts`
24. `app/api/signals/route.ts`
25. `app/api/ingest/demo/route.ts`
26. `app/api/problems/[id]/simulate/route.ts`
27. `app/api/audit/route.ts`
28. `app/api/bias/route.ts`
29. `scripts/seed.ts`
30. `tests/scoring.test.ts`
31. `spark/scoring_job.py`
32. `infra/Dockerfile`
33. `infra/docker-compose.yml`
34. `infra/kubernetes.yaml`

## README.md

```md
# Reverse Democracy AI

This is a complete starter implementation generated from the scanned deck
`Problems-compete-People-dont.pptx`.

The deck contains product and architecture requirements, not source-code files.
This project turns those slides into a runnable system:

- Slide 1: AI-powered problem prioritization identity and mission.
- Slide 2: Fragmented signal problem and failure mode.
- Slide 3: Raw signals become structured Problem Objects.
- Slide 4: Six-step intelligence pipeline.
- Slide 5: Six-dimension Problem Scoring Engine.
- Slide 6: Live dashboard, leaderboard, risk meter, heatmap, prediction curve.
- Slide 7: Future simulation engine for act-vs-ignore scenarios.
- Slide 8: React/Next.js frontend, LLM layer, Neo4j graph, Spark scoring, Kubernetes.
- Slide 9: Paradigm shift metrics and old-vs-new prioritization.
- Slide 10: Final mission narrative.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

The app works without paid services. If `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`,
or Neo4j settings are not configured, it falls back to deterministic local
heuristics and in-memory storage.

## Main Pieces

- `app/page.tsx`: dashboard entry point.
- `components/reverse-democracy-dashboard.tsx`: live command-center UI.
- `app/api/*`: ingestion, leaderboard, simulation, and audit APIs.
- `lib/clustering.ts`: converts raw signals into Problem Objects.
- `lib/scoring.ts`: six-dimension urgency scoring engine.
- `lib/simulation.ts`: no-action vs intervention projections.
- `lib/recommendations.ts`: intervention recommendations.
- `lib/nlp.ts`: heuristic plus optional LLM semantic extraction.
- `lib/neo4j.ts`: optional graph persistence adapter.
- `spark/scoring_job.py`: PySpark batch/stream scoring model.
- `infra/*`: Docker Compose, Dockerfile, and Kubernetes manifests.

## API Quickstart

```bash
curl http://localhost:3000/api/problems
curl -X POST http://localhost:3000/api/ingest/demo
curl -X POST http://localhost:3000/api/problems/student-burnout/simulate
```

Post a new signal:

```bash
curl -X POST http://localhost:3000/api/signals \
  -H "Content-Type: application/json" \
  -d "{\"source\":\"complaint\",\"channel\":\"student-portal\",\"text\":\"Students are reporting severe burnout and missed classes.\",\"location\":{\"district\":\"Central Campus\",\"lat\":23.78,\"lng\":90.41},\"confidence\":0.86}"
```

## Production Notes

- Replace in-memory storage with `lib/neo4j.ts` writes.
- Replace `lib/nlp.ts` heuristic mode with OpenAI or Claude by setting
  environment keys.
- Run `spark/scoring_job.py` on a Spark cluster for high-volume scoring.
- Deploy the Next.js service and Neo4j using `infra/kubernetes.yaml`.
```

## package.json

```json
{
  "name": "reverse-democracy-ai",
  "version": "1.0.0",
  "private": true,
  "description": "AI-powered problem prioritization system from the scanned Reverse Democracy AI deck.",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "seed": "tsx scripts/seed.ts"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.39.0",
    "lucide-react": "^0.468.0",
    "neo4j-driver": "^5.27.0",
    "next": "^15.1.0",
    "openai": "^4.77.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "@types/node": "^22.10.2",
    "@types/react": "^19.0.2",
    "@types/react-dom": "^19.0.2",
    "eslint": "^9.17.0",
    "eslint-config-next": "^15.1.0",
    "tsx": "^4.19.2",
    "typescript": "^5.7.2",
    "vitest": "^2.1.8"
  }
}
```

## .env.example

```bash
NEXT_PUBLIC_APP_NAME="Reverse Democracy AI"

# Optional LLM providers. The app works without these keys by using local heuristics.
OPENAI_API_KEY=""
ANTHROPIC_API_KEY=""
LLM_PROVIDER="heuristic"

# Optional Neo4j persistence. The app works without Neo4j by using in-memory storage.
NEO4J_URI="neo4j://localhost:7687"
NEO4J_USER="neo4j"
NEO4J_PASSWORD="password"

# API safety.
INGEST_SHARED_SECRET="change-me"
```

## tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "es2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## next.config.ts

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: "standalone"
};

export default nextConfig;
```

## next-env.d.ts

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// This file is generated by Next.js when dependencies are installed.
```

## app/layout.tsx

```tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Reverse Democracy AI",
  description: "AI-powered problem prioritization system."
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

## app/page.tsx

```tsx
import { ReverseDemocracyDashboard } from "@/components/reverse-democracy-dashboard";

export default function Home() {
  return <ReverseDemocracyDashboard />;
}
```

## app/globals.css

```css
:root {
  color-scheme: dark;
  --bg: #151414;
  --panel: rgba(34, 34, 32, 0.82);
  --panel-strong: rgba(43, 43, 40, 0.94);
  --text: #f6f1e8;
  --muted: #b8b1a6;
  --line: rgba(246, 241, 232, 0.12);
  --coral: #ff6b5f;
  --mint: #6ee7b7;
  --gold: #f4c95d;
  --blue: #8ab4ff;
  --danger: #ef4444;
  --safe: #22c55e;
}

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  min-height: 100%;
  background: var(--bg);
  color: var(--text);
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

body {
  background:
    linear-gradient(180deg, rgba(255, 107, 95, 0.08), transparent 34rem),
    repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.025) 0 1px, transparent 1px 96px),
    #151414;
}

button,
input,
select,
textarea {
  font: inherit;
}

button {
  color: inherit;
}

.app-shell {
  width: min(1480px, 100%);
  margin: 0 auto;
  padding: 28px;
}

.topbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 18px;
}

.topbar h1,
.panel h2 {
  margin: 0;
  letter-spacing: 0;
}

.topbar h1 {
  font-size: clamp(2.15rem, 4vw, 4.6rem);
  line-height: 0.95;
}

.subtitle {
  margin: 10px 0 0;
  color: var(--muted);
  font-size: 1.05rem;
}

.kicker {
  margin: 0 0 8px;
  color: var(--gold);
  text-transform: uppercase;
  font-size: 0.74rem;
  font-weight: 800;
}

.topbar-actions,
.form-row,
.trust-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.icon-button,
.primary-button {
  min-height: 42px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  cursor: pointer;
}

.icon-button {
  display: grid;
  width: 42px;
  place-items: center;
}

.primary-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 14px;
  background: var(--coral);
  color: #170f0d;
  font-weight: 800;
}

.icon-button:disabled,
.primary-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.metric-strip {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 12px;
}

.metric,
.panel {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--panel);
  backdrop-filter: blur(18px);
  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.22);
}

.metric {
  min-height: 82px;
  padding: 16px;
}

.metric span,
.dimension span,
.heatmap span,
.curve span,
.scenario span,
.recommendation span,
.layer span {
  color: var(--muted);
}

.metric strong {
  display: block;
  margin-top: 8px;
  font-size: 1.55rem;
}

.dashboard-grid,
.wide-grid {
  display: grid;
  gap: 12px;
}

.dashboard-grid {
  grid-template-columns: 1.08fr 1.45fr 0.95fr;
}

.wide-grid {
  grid-template-columns: 1fr 1fr;
  margin-top: 12px;
}

.panel {
  min-width: 0;
  padding: 18px;
}

.panel-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 16px;
}

.panel h2 {
  font-size: 1.28rem;
}

.table {
  display: grid;
  gap: 6px;
}

.table-row {
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr) 64px 68px;
  align-items: center;
  gap: 8px;
}

.table-head {
  color: var(--muted);
  font-size: 0.78rem;
}

.problem-row {
  width: 100%;
  min-height: 62px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.035);
  text-align: left;
}

.problem-row.selected {
  border-color: rgba(255, 107, 95, 0.72);
  background: rgba(255, 107, 95, 0.1);
}

.problem-row small {
  display: block;
  margin-top: 3px;
  color: var(--muted);
}

.summary {
  margin: 0 0 16px;
  color: var(--muted);
  line-height: 1.6;
}

.score-block {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 16px;
}

.score-block > div,
.recommendation,
.scenario,
.pipeline-step,
.layer,
.heatmap,
.curve,
.risk-meter {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.045);
  padding: 13px;
}

.score-block span {
  display: block;
  color: var(--muted);
}

.score-block strong {
  display: block;
  margin-top: 6px;
  font-size: 1.9rem;
}

.dimension-bars {
  display: grid;
  gap: 10px;
}

.dimension > div {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 6px;
  font-size: 0.88rem;
}

.bar {
  display: block;
  height: 9px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
}

.bar > span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--mint), var(--gold), var(--coral));
}

.recommendations {
  display: grid;
  gap: 8px;
  margin-top: 16px;
}

.recommendation p {
  margin: 8px 0 0;
  color: var(--muted);
}

.system-panel {
  display: grid;
  align-content: start;
  gap: 12px;
}

.risk-meter {
  display: grid;
  grid-template-columns: 116px 1fr;
  align-items: center;
  gap: 14px;
}

.risk-ring {
  --score: 0;
  display: grid;
  width: 104px;
  aspect-ratio: 1;
  place-items: center;
  border-radius: 50%;
  background:
    radial-gradient(circle at center, #22221f 0 56%, transparent 57%),
    conic-gradient(var(--coral) calc(var(--score) * 1%), rgba(255, 255, 255, 0.1) 0);
}

.risk-ring strong {
  font-size: 1.55rem;
}

.risk-ring span {
  margin-top: -26px;
  font-size: 0.75rem;
}

.risk-meter p {
  margin: 0;
  color: var(--muted);
  line-height: 1.45;
}

.heatmap > div:first-child,
.curve > div:first-child {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
}

.heatmap-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 6px;
}

.heatmap-grid span {
  min-height: 24px;
  border-radius: 6px;
  background: var(--coral);
}

.curve svg {
  width: 100%;
  height: 128px;
}

.curve polyline {
  fill: none;
  stroke-width: 5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.line-danger {
  stroke: var(--danger);
}

.line-safe {
  stroke: var(--safe);
}

.pipeline {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.pipeline-step span {
  color: var(--gold);
  font-weight: 900;
}

.pipeline-step strong {
  display: block;
  margin-top: 8px;
}

.pipeline-step p {
  margin: 8px 0 0;
  color: var(--muted);
  line-height: 1.45;
}

.scenario-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.scenario {
  display: grid;
  gap: 10px;
}

.scenario.danger {
  border-color: rgba(239, 68, 68, 0.45);
}

.scenario.safe {
  border-color: rgba(34, 197, 94, 0.45);
}

form {
  display: grid;
  gap: 12px;
}

textarea,
select,
input {
  width: 100%;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.28);
  color: var(--text);
  outline: none;
}

textarea {
  min-height: 128px;
  padding: 13px;
  resize: vertical;
}

select,
input {
  min-height: 42px;
  padding: 0 12px;
}

.form-row {
  display: grid;
  grid-template-columns: 150px minmax(0, 1fr) 120px;
}

.layers {
  display: grid;
  gap: 8px;
}

.layer {
  display: grid;
  grid-template-columns: 22px 70px 0.68fr 1.3fr;
  align-items: center;
  gap: 10px;
}

.layer p {
  margin: 0;
  color: var(--muted);
}

.trust-row {
  margin-top: 12px;
}

.trust-row span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--muted);
}

.empty-panel {
  display: grid;
  min-height: 360px;
  place-items: center;
  color: var(--muted);
}

@media (max-width: 1120px) {
  .dashboard-grid,
  .wide-grid,
  .metric-strip {
    grid-template-columns: 1fr 1fr;
  }

  .detail-panel {
    grid-column: 1 / -1;
  }
}

@media (max-width: 760px) {
  .app-shell {
    padding: 18px;
  }

  .topbar,
  .dashboard-grid,
  .wide-grid,
  .metric-strip,
  .pipeline,
  .scenario-grid,
  .score-block,
  .form-row {
    grid-template-columns: 1fr;
  }

  .topbar {
    display: grid;
  }

  .table-row {
    grid-template-columns: 40px minmax(0, 1fr) 54px;
  }

  .table-row span:last-child {
    display: none;
  }

  .risk-meter {
    grid-template-columns: 1fr;
  }

  .layer {
    grid-template-columns: 22px 70px 1fr;
  }

  .layer p {
    grid-column: 1 / -1;
  }
}
```

## components/reverse-democracy-dashboard.tsx

```tsx
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
```

## lib/types.ts

```ts
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
```

## lib/demo-data.ts

```ts
import type { DimensionWeights, RawSignal } from "./types";

export const dimensionWeights: DimensionWeights = {
  urgency: 0.22,
  impactRadius: 0.18,
  costOfIgnoring: 0.2,
  timeSensitivity: 0.18,
  recoveryDifficulty: 0.12,
  signalConfidence: 0.1
};

export const seedSignals: RawSignal[] = [
  {
    id: "sig-001",
    source: "survey",
    channel: "student-wellness-form",
    text: "Students report severe burnout, skipped classes, panic episodes, and no available counseling appointments.",
    location: { district: "Central Campus", lat: 23.7807, lng: 90.4072 },
    createdAt: new Date(Date.now() - 1000 * 60 * 9).toISOString(),
    confidence: 0.94,
    metadata: { sampleSize: 418, institution: "North District University" }
  },
  {
    id: "sig-002",
    source: "complaint",
    channel: "parent-hotline",
    text: "Parents say students are exhausted, missing exams, and asking for emergency mental health support.",
    location: { district: "Central Campus", lat: 23.7821, lng: 90.4055 },
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    confidence: 0.88,
    metadata: { calls: 62 }
  },
  {
    id: "sig-003",
    source: "sensor",
    channel: "water-board-iot",
    text: "Reservoir levels in District 7 dropped below the emergency threshold for the third consecutive day.",
    location: { district: "District 7", lat: 23.7351, lng: 90.3922 },
    createdAt: new Date(Date.now() - 1000 * 60 * 28).toISOString(),
    confidence: 0.96,
    metadata: { reservoirPercent: 18 }
  },
  {
    id: "sig-004",
    source: "report",
    channel: "public-health-office",
    text: "Clinics near District 7 report dehydration visits and supply stress related to water scarcity.",
    location: { district: "District 7", lat: 23.7322, lng: 90.3962 },
    createdAt: new Date(Date.now() - 1000 * 60 * 38).toISOString(),
    confidence: 0.91,
    metadata: { clinics: 5 }
  },
  {
    id: "sig-005",
    source: "direct",
    channel: "scholarship-portal",
    text: "Students from low-income families cannot access scholarship forms before deadline due to portal errors.",
    location: { district: "West Zone", lat: 23.7903, lng: 90.3625 },
    createdAt: new Date(Date.now() - 1000 * 60 * 49).toISOString(),
    confidence: 0.83,
    metadata: { affectedApplicants: 1200 }
  },
  {
    id: "sig-006",
    source: "social",
    channel: "community-social-listening",
    text: "Multiple posts mention rural schools cancelling classes because teacher vacancies remain unfilled.",
    location: { district: "Rural North", lat: 24.0102, lng: 90.4011 },
    createdAt: new Date(Date.now() - 1000 * 60 * 54).toISOString(),
    confidence: 0.74,
    metadata: { posts: 144 }
  },
  {
    id: "sig-007",
    source: "report",
    channel: "infrastructure-audit",
    text: "Digital infrastructure gap blocks remote learning access for several low-connectivity schools.",
    location: { district: "East Belt", lat: 23.8102, lng: 90.4501 },
    createdAt: new Date(Date.now() - 1000 * 60 * 66).toISOString(),
    confidence: 0.78,
    metadata: { schools: 18 }
  },
  {
    id: "sig-008",
    source: "news",
    channel: "local-news-monitor",
    text: "Editorial warns that scholarship access problems are growing but not yet visible in official meetings.",
    location: { district: "West Zone", lat: 23.7929, lng: 90.3659 },
    createdAt: new Date(Date.now() - 1000 * 60 * 72).toISOString(),
    confidence: 0.69,
    metadata: { articleReach: 18000 }
  }
];

export const slideLeaderboardTargets = [
  { title: "Student Burnout & Mental Health Crisis", score: 91, trend: "rising", window: 14 },
  { title: "Water Scarcity - District 7", score: 87, trend: "rising", window: 21 },
  { title: "Scholarship Access Gap", score: 79, trend: "stable", window: 45 },
  { title: "Teacher Shortage - Rural Zones", score: 74, trend: "easing", window: 60 },
  { title: "Digital Infrastructure Gap", score: 68, trend: "stable", window: 90 }
] as const;
```

## lib/privacy.ts

```ts
export function redactPii(text: string): string {
  return text
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[redacted-email]")
    .replace(/\+?\d[\d\s().-]{7,}\d/g, "[redacted-phone]")
    .replace(/\b(student|citizen|patient)\s+[A-Z][a-z]+\s+[A-Z][a-z]+\b/g, "$1 [redacted-name]");
}

export function anonymizeMetadata(
  metadata: Record<string, string | number | boolean> | undefined
): Record<string, string | number | boolean> | undefined {
  if (!metadata) return undefined;

  return Object.fromEntries(
    Object.entries(metadata).filter(([key]) => !["name", "email", "phone", "studentId", "patientId"].includes(key))
  );
}
```

## lib/bias.ts

```ts
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
```

## lib/nlp.ts

```ts
import type { ProblemDomain, RawSignal, SemanticSignal } from "./types";

const domainRules: Array<{ domain: ProblemDomain; issue: string; terms: string[]; population: number }> = [
  {
    domain: "education",
    issue: "student-burnout",
    terms: ["burnout", "stress", "panic", "mental", "counseling", "exam", "dropout"],
    population: 4200
  },
  {
    domain: "water",
    issue: "water-scarcity",
    terms: ["water", "reservoir", "dehydration", "scarcity", "supply"],
    population: 28000
  },
  {
    domain: "education",
    issue: "scholarship-access",
    terms: ["scholarship", "forms", "deadline", "low-income", "portal"],
    population: 1600
  },
  {
    domain: "labor",
    issue: "teacher-shortage",
    terms: ["teacher", "vacancies", "rural", "classes", "unfilled"],
    population: 5200
  },
  {
    domain: "infrastructure",
    issue: "digital-infrastructure-gap",
    terms: ["digital", "remote", "connectivity", "infrastructure", "schools"],
    population: 3400
  }
];

const urgentTerms = [
  "emergency",
  "severe",
  "panic",
  "threshold",
  "missed",
  "blocked",
  "scarcity",
  "crisis",
  "dropped",
  "exhausted"
];

const negativeTerms = ["severe", "panic", "exhausted", "dropped", "errors", "scarcity", "dehydration", "missed"];

export async function analyzeSignal(signal: RawSignal): Promise<SemanticSignal> {
  if (process.env.LLM_PROVIDER === "openai" && process.env.OPENAI_API_KEY) {
    return analyzeWithConfiguredLlm(signal, "openai");
  }

  if (process.env.LLM_PROVIDER === "anthropic" && process.env.ANTHROPIC_API_KEY) {
    return analyzeWithConfiguredLlm(signal, "anthropic");
  }

  return analyzeWithHeuristics(signal);
}

export function analyzeWithHeuristics(signal: RawSignal): SemanticSignal {
  const lower = signal.text.toLowerCase();
  const matched = domainRules
    .map((rule) => ({
      rule,
      score: rule.terms.filter((term) => lower.includes(term)).length
    }))
    .sort((a, b) => b.score - a.score)[0];

  const rule = matched && matched.score > 0 ? matched.rule : domainRules[0];
  const foundUrgentTerms = urgentTerms.filter((term) => lower.includes(term));
  const negativeMatches = negativeTerms.filter((term) => lower.includes(term)).length;
  const sentiment = Math.max(-0.95, -0.18 - negativeMatches * 0.14);
  const entities = [
    signal.location.district,
    ...rule.terms.filter((term) => lower.includes(term)).slice(0, 4)
  ];

  return {
    ...signal,
    domain: rule.domain,
    normalizedIssue: rule.issue,
    urgencyTerms: foundUrgentTerms,
    sentiment,
    entities,
    affectedPopulationEstimate: Number(signal.metadata?.affectedApplicants ?? rule.population)
  };
}

async function analyzeWithConfiguredLlm(signal: RawSignal, provider: "openai" | "anthropic"): Promise<SemanticSignal> {
  const fallback = analyzeWithHeuristics(signal);

  try {
    const prompt = [
      "Extract structured crisis intelligence from this signal.",
      "Return JSON with keys: domain, normalizedIssue, entities, sentiment, urgencyTerms, affectedPopulationEstimate.",
      `Signal: ${signal.text}`,
      `Location: ${signal.location.district}`
    ].join("\n");

    const text =
      provider === "openai"
        ? await callOpenAi(prompt)
        : await callAnthropic(prompt);
    const parsed = JSON.parse(text) as Partial<SemanticSignal>;

    return {
      ...fallback,
      domain: parsed.domain ?? fallback.domain,
      normalizedIssue: parsed.normalizedIssue ?? fallback.normalizedIssue,
      entities: parsed.entities ?? fallback.entities,
      sentiment: typeof parsed.sentiment === "number" ? parsed.sentiment : fallback.sentiment,
      urgencyTerms: parsed.urgencyTerms ?? fallback.urgencyTerms,
      affectedPopulationEstimate:
        typeof parsed.affectedPopulationEstimate === "number"
          ? parsed.affectedPopulationEstimate
          : fallback.affectedPopulationEstimate
    };
  } catch {
    return fallback;
  }
}

async function callOpenAi(prompt: string): Promise<string> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) throw new Error(`OpenAI request failed: ${response.status}`);
  const json = await response.json();
  return json.choices?.[0]?.message?.content ?? "{}";
}

async function callAnthropic(prompt: string): Promise<string> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "claude-3-5-sonnet-latest",
      max_tokens: 600,
      temperature: 0.1,
      messages: [{ role: "user", content: prompt }]
    })
  });

  if (!response.ok) throw new Error(`Anthropic request failed: ${response.status}`);
  const json = await response.json();
  return json.content?.[0]?.text ?? "{}";
}
```

## lib/scoring.ts

```ts
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
```

## lib/recommendations.ts

```ts
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
```

## lib/simulation.ts

```ts
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
```

## lib/clustering.ts

```ts
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
```

## lib/audit.ts

```ts
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
```

## lib/store.ts

```ts
import { seedSignals } from "./demo-data";
import { buildProblemObjects } from "./clustering";
import type { ProblemObject, RawSignal } from "./types";

interface StoreState {
  signals: RawSignal[];
  problems: ProblemObject[];
  initialized: boolean;
}

declare global {
  // eslint-disable-next-line no-var
  var reverseDemocracyStore: StoreState | undefined;
}

const state: StoreState =
  globalThis.reverseDemocracyStore ??
  (globalThis.reverseDemocracyStore = {
    signals: [...seedSignals],
    problems: [],
    initialized: false
  });

export async function ensureInitialized(): Promise<void> {
  if (!state.initialized) {
    state.problems = await buildProblemObjects(state.signals);
    state.initialized = true;
  }
}

export async function getProblems(): Promise<ProblemObject[]> {
  await ensureInitialized();
  return state.problems;
}

export async function getSignals(): Promise<RawSignal[]> {
  await ensureInitialized();
  return state.signals;
}

export async function addSignal(signal: RawSignal): Promise<ProblemObject[]> {
  state.signals = [signal, ...state.signals];
  state.problems = await buildProblemObjects(state.signals);
  state.initialized = true;
  return state.problems;
}

export async function resetDemoData(): Promise<ProblemObject[]> {
  state.signals = [...seedSignals];
  state.problems = await buildProblemObjects(state.signals);
  state.initialized = true;
  return state.problems;
}

export async function findProblem(id: string): Promise<ProblemObject | undefined> {
  const problems = await getProblems();
  return problems.find((problem) => problem.id === id);
}
```

## lib/neo4j.ts

```ts
import neo4j, { type Driver, type ManagedTransaction } from "neo4j-driver";
import type { ProblemObject, RawSignal } from "./types";

let driver: Driver | undefined;

export function getNeo4jDriver(): Driver | undefined {
  if (!process.env.NEO4J_URI || !process.env.NEO4J_USER || !process.env.NEO4J_PASSWORD) {
    return undefined;
  }

  driver ??= neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
  );

  return driver;
}

export async function persistProblemGraph(problem: ProblemObject): Promise<void> {
  const graph = getNeo4jDriver();
  if (!graph) return;

  const session = graph.session();
  try {
    await session.executeWrite(async (tx) => {
      await tx.run(
        `
        MERGE (p:Problem {id: $id})
        SET p.title = $title,
            p.score = $score,
            p.domain = $domain,
            p.trend = $trend,
            p.updatedAt = $updatedAt
        `,
        {
          id: problem.id,
          title: problem.title,
          score: problem.score,
          domain: problem.domain,
          trend: problem.trend,
          updatedAt: problem.updatedAt
        }
      );

      for (const signal of problem.evidence) {
        await persistSignal(tx, problem.id, signal);
      }
    });
  } finally {
    await session.close();
  }
}

async function persistSignal(
  tx: ManagedTransaction,
  problemId: string,
  signal: RawSignal
): Promise<void> {
  await tx.run(
    `
    MATCH (p:Problem {id: $problemId})
    MERGE (s:Signal {id: $id})
    SET s.source = $source,
        s.channel = $channel,
        s.text = $text,
        s.confidence = $confidence,
        s.createdAt = $createdAt,
        s.district = $district
    MERGE (s)-[:EVIDENCE_FOR]->(p)
    `,
    {
      problemId,
      id: signal.id,
      source: signal.source,
      channel: signal.channel,
      text: signal.text,
      confidence: signal.confidence,
      createdAt: signal.createdAt,
      district: signal.location.district
    }
  );
}
```

## app/api/problems/route.ts

```ts
import { NextResponse } from "next/server";
import { calculateSystemRisk } from "@/lib/scoring";
import { getProblems } from "@/lib/store";

export async function GET() {
  const problems = await getProblems();

  return NextResponse.json({
    problems,
    risk: calculateSystemRisk(problems),
    updatedAt: new Date().toISOString()
  });
}
```

## app/api/signals/route.ts

```ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { anonymizeMetadata, redactPii } from "@/lib/privacy";
import { addSignal, getSignals } from "@/lib/store";
import type { RawSignal } from "@/lib/types";

const signalSchema = z.object({
  source: z.enum(["complaint", "report", "social", "sensor", "news", "survey", "direct"]),
  channel: z.string().min(2),
  text: z.string().min(12),
  locale: z.string().optional(),
  location: z.object({
    district: z.string().min(2),
    lat: z.number(),
    lng: z.number()
  }),
  confidence: z.number().min(0).max(1).default(0.75),
  metadata: z.record(z.union([z.string(), z.number(), z.boolean()])).optional()
});

export async function GET() {
  const signals = await getSignals();
  return NextResponse.json({ signals });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = signalSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid signal", details: parsed.error.flatten() }, { status: 400 });
  }

  const signal: RawSignal = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...parsed.data,
    text: redactPii(parsed.data.text),
    metadata: anonymizeMetadata(parsed.data.metadata)
  };

  const problems = await addSignal(signal);
  return NextResponse.json({ signal, problems }, { status: 201 });
}
```

## app/api/ingest/demo/route.ts

```ts
import { NextResponse } from "next/server";
import { calculateSystemRisk } from "@/lib/scoring";
import { resetDemoData } from "@/lib/store";

export async function POST() {
  const problems = await resetDemoData();

  return NextResponse.json({
    message: "Demo signal stream reset.",
    problems,
    risk: calculateSystemRisk(problems),
    updatedAt: new Date().toISOString()
  });
}
```

## app/api/problems/[id]/simulate/route.ts

```ts
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
```

## app/api/audit/route.ts

```ts
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
```

## app/api/bias/route.ts

```ts
import { NextResponse } from "next/server";
import { auditCoverageBias } from "@/lib/bias";
import { getProblems } from "@/lib/store";

export async function GET() {
  const problems = await getProblems();

  return NextResponse.json({
    audit: auditCoverageBias(problems),
    updatedAt: new Date().toISOString()
  });
}
```

## scripts/seed.ts

```ts
import { seedSignals } from "../lib/demo-data";

console.log(JSON.stringify({ signals: seedSignals }, null, 2));
```

## tests/scoring.test.ts

```ts
import { describe, expect, it } from "vitest";
import { computeScore, actionWindowForScore } from "../lib/scoring";

describe("problem scoring", () => {
  it("computes a weighted 0-100 score", () => {
    const score = computeScore({
      urgency: 90,
      impactRadius: 80,
      costOfIgnoring: 85,
      timeSensitivity: 88,
      recoveryDifficulty: 70,
      signalConfidence: 92
    });

    expect(score).toBeGreaterThanOrEqual(80);
    expect(score).toBeLessThanOrEqual(90);
  });

  it("shrinks action windows as scores rise", () => {
    expect(actionWindowForScore(91)).toBe(14);
    expect(actionWindowForScore(87)).toBe(21);
    expect(actionWindowForScore(79)).toBe(45);
    expect(actionWindowForScore(68)).toBe(90);
  });
});
```

## spark/scoring_job.py

```py
from __future__ import annotations

from pyspark.sql import DataFrame, SparkSession
from pyspark.sql import functions as F


WEIGHTS = {
    "urgency": 0.22,
    "impact_radius": 0.18,
    "cost_of_ignoring": 0.20,
    "time_sensitivity": 0.18,
    "recovery_difficulty": 0.12,
    "signal_confidence": 0.10,
}


def score_dataframe(df: DataFrame) -> DataFrame:
    """Compute the same six-dimension score at Spark scale."""
    return (
        df.withColumn(
            "problem_score",
            F.round(
                F.col("urgency") * WEIGHTS["urgency"]
                + F.col("impact_radius") * WEIGHTS["impact_radius"]
                + F.col("cost_of_ignoring") * WEIGHTS["cost_of_ignoring"]
                + F.col("time_sensitivity") * WEIGHTS["time_sensitivity"]
                + F.col("recovery_difficulty") * WEIGHTS["recovery_difficulty"]
                + F.col("signal_confidence") * WEIGHTS["signal_confidence"]
            ).cast("int"),
        )
        .withColumn(
            "action_window_days",
            F.when(F.col("problem_score") >= 90, F.lit(14))
            .when(F.col("problem_score") >= 85, F.lit(21))
            .when(F.col("problem_score") >= 78, F.lit(45))
            .when(F.col("problem_score") >= 70, F.lit(60))
            .otherwise(F.lit(90)),
        )
    )


def main() -> None:
    spark = (
        SparkSession.builder.appName("reverse-democracy-scoring")
        .config("spark.sql.shuffle.partitions", "8")
        .getOrCreate()
    )

    input_path = spark.conf.get("spark.reverse_democracy.input", "data/problem_dimensions.jsonl")
    output_path = spark.conf.get("spark.reverse_democracy.output", "data/scored_problem_objects")

    raw = spark.read.json(input_path)
    scored = score_dataframe(raw)
    scored.write.mode("overwrite").json(output_path)


if __name__ == "__main__":
    main()
```

## infra/Dockerfile

```dockerfile
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json ./
RUN npm install

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

## infra/docker-compose.yml

```yaml
services:
  app:
    build:
      context: ..
      dockerfile: infra/Dockerfile
    ports:
      - "3000:3000"
    environment:
      NEO4J_URI: neo4j://neo4j:7687
      NEO4J_USER: neo4j
      NEO4J_PASSWORD: password
      LLM_PROVIDER: heuristic
    depends_on:
      - neo4j

  neo4j:
    image: neo4j:5
    ports:
      - "7474:7474"
      - "7687:7687"
    environment:
      NEO4J_AUTH: neo4j/password
    volumes:
      - neo4j-data:/data

volumes:
  neo4j-data:
```

## infra/kubernetes.yaml

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: reverse-democracy-config
data:
  LLM_PROVIDER: heuristic
  NEO4J_URI: neo4j://neo4j:7687
  NEO4J_USER: neo4j
---
apiVersion: v1
kind: Secret
metadata:
  name: reverse-democracy-secrets
type: Opaque
stringData:
  NEO4J_PASSWORD: password
  OPENAI_API_KEY: ""
  ANTHROPIC_API_KEY: ""
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: reverse-democracy-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: reverse-democracy-app
  template:
    metadata:
      labels:
        app: reverse-democracy-app
    spec:
      containers:
        - name: app
          image: reverse-democracy-ai:latest
          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: 3000
          envFrom:
            - configMapRef:
                name: reverse-democracy-config
            - secretRef:
                name: reverse-democracy-secrets
          readinessProbe:
            httpGet:
              path: /api/problems
              port: 3000
            initialDelaySeconds: 10
            periodSeconds: 15
---
apiVersion: v1
kind: Service
metadata:
  name: reverse-democracy-app
spec:
  selector:
    app: reverse-democracy-app
  ports:
    - name: http
      port: 80
      targetPort: 3000
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: neo4j
spec:
  replicas: 1
  selector:
    matchLabels:
      app: neo4j
  template:
    metadata:
      labels:
        app: neo4j
    spec:
      containers:
        - name: neo4j
          image: neo4j:5
          ports:
            - containerPort: 7474
            - containerPort: 7687
          env:
            - name: NEO4J_AUTH
              value: neo4j/password
---
apiVersion: v1
kind: Service
metadata:
  name: neo4j
spec:
  selector:
    app: neo4j
  ports:
    - name: browser
      port: 7474
      targetPort: 7474
    - name: bolt
      port: 7687
      targetPort: 7687
```
