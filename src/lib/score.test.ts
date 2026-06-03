import { describe, expect, it } from "vitest";

import {
  calculateFinalScore,
  determineGraduationStatus,
  validateScore,
} from "@/lib/score";

describe("score helpers", () => {
  it("validates score boundaries", () => {
    expect(validateScore(0)).toBe(true);
    expect(validateScore(100)).toBe(true);
    expect(validateScore(-1)).toBe(false);
    expect(validateScore(101)).toBe(false);
  });

  it("calculates final score using the configured weights", () => {
    expect(calculateFinalScore(80, 70, 90)).toBe(81);
  });

  it("determines graduation status", () => {
    expect(determineGraduationStatus(70)).toBe("PASSED");
    expect(determineGraduationStatus(69.99)).toBe("FAILED");
  });
});
