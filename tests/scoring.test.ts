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
