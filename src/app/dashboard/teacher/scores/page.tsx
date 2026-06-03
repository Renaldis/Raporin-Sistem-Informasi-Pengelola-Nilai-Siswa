import type { GraduationStatus, Prisma } from "@prisma/client";

import { ScoreFormDialog } from "@/app/dashboard/teacher/scores/_components/score-form-dialog";
import { ScoresTable } from "@/app/dashboard/teacher/scores/_components/scores-table";
import { Pagination } from "@/components/pagination";
import { PageHeader } from "@/components/page-header";
import { SearchFilterBar } from "@/components/search-filter-bar";
import { SelectFilter } from "@/components/select-filter";
import { DEFAULT_PER_PAGE } from "@/constants/pagination";
import { getPerPage, getPositiveNumber } from "@/lib/pagination";
import { requireRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type TeacherScoresPageProps = {
  searchParams: Promise<{
    search?: string;
    teacherSubjectId?: string;
    classRoomId?: string;
    academicYearId?: string;
    status?: string;
    page?: string;
    perPage?: string;
  }>;
};

const TEACHER_SCORES_PATH = "/dashboard/teacher/scores";
const STATUS_OPTIONS = [
  { label: "Lulus", value: "PASSED" },
  { label: "Tidak lulus", value: "FAILED" },
];

export default async function TeacherScoresPage({
  searchParams,
}: TeacherScoresPageProps) {
  const user = await requireRole("TEACHER");
  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const teacherSubjectId = params.teacherSubjectId;
  const classRoomId = params.classRoomId;
  const academicYearId = params.academicYearId;
  const status = getStatus(params.status);
  const page = getPositiveNumber(params.page, 1);
  const perPage = getPerPage(params.perPage);

  const teacher = await prisma.teacher.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });

  const where: Prisma.ScoreWhereInput = {
    teacherSubject: {
      teacherId: teacher?.id ?? "",
    },
    ...(teacherSubjectId ? { teacherSubjectId } : {}),
    ...(status ? { status } : {}),
    ...(classRoomId || academicYearId
      ? {
          enrollment: {
            ...(classRoomId ? { classRoomId } : {}),
            ...(academicYearId ? { academicYearId } : {}),
          },
        }
      : {}),
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

  const [
    scores,
    totalScores,
    enrollments,
    teacherSubjects,
    classRooms,
    academicYears,
  ] = teacher
    ? await Promise.all([
        prisma.score.findMany({
          where,
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
                subject: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          skip: (page - 1) * perPage,
          take: perPage,
        }),
        prisma.score.count({ where }),
        prisma.studentClassEnrollment.findMany({
          include: {
            student: true,
            classRoom: true,
            academicYear: true,
          },
          orderBy: [
            { academicYear: { isActive: "desc" } },
            { student: { name: "asc" } },
          ],
        }),
        prisma.teacherSubject.findMany({
          where: {
            teacherId: teacher.id,
          },
          include: {
            subject: true,
          },
          orderBy: [{ subject: { name: "asc" } }],
        }),
        prisma.classRoom.findMany({
          orderBy: [{ level: "asc" }, { name: "asc" }],
          select: {
            id: true,
            name: true,
            level: true,
          },
        }),
        prisma.academicYear.findMany({
          orderBy: [{ isActive: "desc" }, { name: "desc" }],
          select: {
            id: true,
            name: true,
            isActive: true,
          },
        }),
      ])
    : [[], 0, [], [], [], []];

  const enrollmentOptions = enrollments.map((enrollment) => ({
    id: enrollment.id,
    studentName: enrollment.student.name,
    studentNis: enrollment.student.nis,
    classRoomName: enrollment.classRoom.name,
    academicYearName: enrollment.academicYear.name,
  }));
  const teacherSubjectOptions = teacherSubjects.map((teacherSubject) => ({
    id: teacherSubject.id,
    subjectCode: teacherSubject.subject.code,
    subjectName: teacherSubject.subject.name,
  }));

  return (
    <>
      <PageHeader
        action={
          <ScoreFormDialog
            enrollments={enrollmentOptions}
            mode="create"
            teacherSubjects={teacherSubjectOptions}
          />
        }
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard/teacher" },
          { label: "Guru" },
          { label: "Nilai" },
        ]}
        description="Input, update, dan lihat nilai siswa sesuai assignment guru."
        title="Input Nilai"
      />
      <div className="grid gap-3 xl:grid-cols-[1fr_auto_auto]">
        <SearchFilterBar searchPlaceholder="Cari siswa, NIS, kelas, kode mapel, atau mapel..." />
        <div className="rounded-lg border bg-card p-3">
          <SelectFilter
            label="Mapel"
            options={teacherSubjectOptions.map((teacherSubject) => ({
              label: `${teacherSubject.subjectCode} - ${teacherSubject.subjectName}`,
              value: teacherSubject.id,
            }))}
            paramName="teacherSubjectId"
            placeholder="Semua mapel"
          />
        </div>
        <div className="rounded-lg border bg-card p-3">
          <SelectFilter
            label="Status"
            options={STATUS_OPTIONS}
            paramName="status"
            placeholder="Semua status"
          />
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-3">
          <SelectFilter
            label="Kelas"
            options={classRooms.map((classRoom) => ({
              label: `${classRoom.name} - ${classRoom.level}`,
              value: classRoom.id,
            }))}
            paramName="classRoomId"
            placeholder="Semua kelas"
          />
        </div>
        <div className="rounded-lg border bg-card p-3">
          <SelectFilter
            label="Tahun"
            options={academicYears.map((academicYear) => ({
              label: `${academicYear.name}${
                academicYear.isActive ? " - Aktif" : ""
              }`,
              value: academicYear.id,
            }))}
            paramName="academicYearId"
            placeholder="Semua tahun"
          />
        </div>
      </div>
      <ScoresTable
        enrollments={enrollmentOptions}
        scores={scores.map((score) => ({
          id: score.id,
          enrollmentId: score.enrollmentId,
          teacherSubjectId: score.teacherSubjectId,
          studentName: score.enrollment.student.name,
          studentNis: score.enrollment.student.nis,
          classRoomName: score.enrollment.classRoom.name,
          academicYearName: score.enrollment.academicYear.name,
          subjectName: score.teacherSubject.subject.name,
          subjectCode: score.teacherSubject.subject.code,
          taskScore: score.taskScore,
          utsScore: score.utsScore,
          uasScore: score.uasScore,
          finalScore: score.finalScore,
          status: score.status,
          createdAt: score.createdAt,
        }))}
        teacherSubjects={teacherSubjectOptions}
      />
      <Pagination
        basePath={TEACHER_SCORES_PATH}
        page={page}
        perPage={perPage}
        searchParams={{
          search,
          teacherSubjectId,
          classRoomId,
          academicYearId,
          status,
          perPage: perPage === DEFAULT_PER_PAGE ? undefined : perPage,
        }}
        totalItems={totalScores}
      />
    </>
  );
}

function getStatus(value: string | undefined): GraduationStatus | undefined {
  if (value === "PASSED" || value === "FAILED") {
    return value;
  }

  return undefined;
}
