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
