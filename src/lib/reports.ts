import "server-only";

import type { GraduationStatus, Prisma } from "@prisma/client";

export type ScoreReportFilters = {
  search?: string;
  classRoomId?: string;
  subjectId?: string;
  academicYearId?: string;
  status?: string;
};

export function getScoreReportWhere(
  filters: ScoreReportFilters
): Prisma.ScoreWhereInput {
  const search = filters.search?.trim() ?? "";
  const status = getGraduationStatus(filters.status);

  return {
    ...(filters.classRoomId || filters.academicYearId
      ? {
          enrollment: {
            ...(filters.classRoomId ? { classRoomId: filters.classRoomId } : {}),
            ...(filters.academicYearId
              ? { academicYearId: filters.academicYearId }
              : {}),
          },
        }
      : {}),
    ...(filters.subjectId
      ? {
          teacherSubject: {
            subjectId: filters.subjectId,
          },
        }
      : {}),
    ...(status ? { status } : {}),
    ...(search
      ? {
          OR: [
            {
              enrollment: {
                student: {
                  name: { contains: search, mode: "insensitive" as const },
                },
              },
            },
            {
              enrollment: {
                student: {
                  nis: { contains: search, mode: "insensitive" as const },
                },
              },
            },
            {
              enrollment: {
                classRoom: {
                  name: { contains: search, mode: "insensitive" as const },
                },
              },
            },
            {
              enrollment: {
                academicYear: {
                  name: { contains: search, mode: "insensitive" as const },
                },
              },
            },
            {
              teacherSubject: {
                teacher: {
                  name: { contains: search, mode: "insensitive" as const },
                },
              },
            },
            {
              teacherSubject: {
                subject: {
                  code: { contains: search, mode: "insensitive" as const },
                },
              },
            },
            {
              teacherSubject: {
                subject: {
                  name: { contains: search, mode: "insensitive" as const },
                },
              },
            },
          ],
        }
      : {}),
  };
}

export function getGraduationStatus(
  value: string | undefined
): GraduationStatus | undefined {
  if (value === "PASSED" || value === "FAILED") {
    return value;
  }

  return undefined;
}

export function getScoreReportCsvFilename() {
  const date = new Date().toISOString().slice(0, 10);
  return `laporan-nilai-${date}.csv`;
}

export function toCsvCell(value: string | number) {
  const normalized = String(value).replaceAll('"', '""');
  return `"${normalized}"`;
}
