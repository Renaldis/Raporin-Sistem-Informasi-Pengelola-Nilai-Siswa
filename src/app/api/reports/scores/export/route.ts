import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import {
  getScoreReportCsvFilename,
  getScoreReportWhere,
  toCsvCell,
} from "@/lib/reports";

const CSV_HEADERS = [
  "NIS",
  "Nama Siswa",
  "Kelas",
  "Tahun Ajaran",
  "Kode Mapel",
  "Mata Pelajaran",
  "Guru",
  "Nilai Tugas",
  "Nilai UTS",
  "Nilai UAS",
  "Nilai Akhir",
  "Status",
];

export async function GET(request: Request) {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    return NextResponse.json(
      { message: "Anda tidak memiliki akses export laporan" },
      { status: 403 }
    );
  }

  const searchParams = new URL(request.url).searchParams;
  const scores = await prisma.score.findMany({
    where: getScoreReportWhere({
      search: searchParams.get("search") ?? undefined,
      classRoomId: searchParams.get("classRoomId") ?? undefined,
      subjectId: searchParams.get("subjectId") ?? undefined,
      academicYearId: searchParams.get("academicYearId") ?? undefined,
      status: searchParams.get("status") ?? undefined,
    }),
    include: {
      enrollment: {
        include: {
          student: true,
          classRoom: true,
          academicYear: true,
        },
      },
      teacherSubject: {
        include: {
          teacher: true,
          subject: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const rows = scores.map((score) => [
    score.enrollment.student.nis,
    score.enrollment.student.name,
    score.enrollment.classRoom.name,
    score.enrollment.academicYear.name,
    score.teacherSubject.subject.code,
    score.teacherSubject.subject.name,
    score.teacherSubject.teacher.name,
    score.taskScore,
    score.utsScore,
    score.uasScore,
    score.finalScore.toFixed(2),
    score.status === "PASSED" ? "LULUS" : "TIDAK LULUS",
  ]);

  const csv = [CSV_HEADERS, ...rows]
    .map((row) => row.map(toCsvCell).join(","))
    .join("\n");

  return new Response(csv, {
    headers: {
      "Content-Disposition": `attachment; filename="${getScoreReportCsvFilename()}"`,
      "Content-Type": "text/csv; charset=utf-8",
    },
  });
}
