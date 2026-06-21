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
