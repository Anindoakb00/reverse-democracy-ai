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
