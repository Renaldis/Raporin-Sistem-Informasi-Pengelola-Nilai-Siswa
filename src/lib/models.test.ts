import { describe, expect, it } from "vitest";

import { ScoreModel, StudentModel } from "@/lib/models";

describe("StudentModel", () => {
  it("returns a short student profile", () => {
    const student = new StudentModel("1", "20240001", "Siswa Demo");

    expect(student.getProfile()).toBe("Siswa Demo - 20240001");
  });
});

describe("ScoreModel", () => {
  it("calculates score and status", () => {
    const score = new ScoreModel(
      "X RPL 1",
      "Matematika",
      "2025/2026",
      "Guru Matematika",
      80,
      70,
      90
    );

    expect(score.calculateFinalScore()).toBe(81);
    expect(score.getGraduationStatus()).toBe("LULUS");
    expect(score.getScoreSummary()).toContain("Matematika");
  });
});
