import type { GraduationStatus } from "@prisma/client";

export function validateScore(score: number): boolean {
  return Number.isInteger(score) && score >= 0 && score <= 100;
}

export function calculateFinalScore(
  taskScore: number,
  utsScore: number,
  uasScore: number
): number {
  return taskScore * 0.3 + utsScore * 0.3 + uasScore * 0.4;
}

export function determineGraduationStatus(
  finalScore: number
): GraduationStatus {
  return finalScore >= 70 ? "PASSED" : "FAILED";
}

export function isDuplicateScore(
  existingScores: Array<{ enrollmentId: string; teacherSubjectId: string }>,
  enrollmentId: string,
  teacherSubjectId: string
): boolean {
  return existingScores.some(
    (score) =>
      score.enrollmentId === enrollmentId &&
      score.teacherSubjectId === teacherSubjectId
  );
}

export function setActiveAcademicYearState(
  academicYears: Array<{ id: string; isActive: boolean }>,
  selectedAcademicYearId: string
) {
  return academicYears.map((academicYear) => ({
    ...academicYear,
    isActive: academicYear.id === selectedAcademicYearId,
  }));
}
