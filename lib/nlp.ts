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
