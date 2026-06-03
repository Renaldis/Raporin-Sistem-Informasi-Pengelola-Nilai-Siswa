import { ReportExportButton } from "@/app/dashboard/admin/reports/_components/report-export-button";
import { ReportsTable } from "@/app/dashboard/admin/reports/_components/reports-table";
import { Pagination } from "@/components/pagination";
import { PageHeader } from "@/components/page-header";
import { SearchFilterBar } from "@/components/search-filter-bar";
import { SelectFilter } from "@/components/select-filter";
import { DEFAULT_PER_PAGE } from "@/constants/pagination";
import { getPerPage, getPositiveNumber } from "@/lib/pagination";
import { requireRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { getGraduationStatus, getScoreReportWhere } from "@/lib/reports";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const dynamic = "force-dynamic";

type AdminReportsPageProps = {
  searchParams: Promise<{
    search?: string;
    classRoomId?: string;
    subjectId?: string;
    academicYearId?: string;
    status?: string;
    page?: string;
    perPage?: string;
  }>;
};

const REPORTS_PATH = "/dashboard/admin/reports";
const STATUS_OPTIONS = [
  { label: "Lulus", value: "PASSED" },
  { label: "Tidak lulus", value: "FAILED" },
];

export default async function AdminReportsPage({
  searchParams,
}: AdminReportsPageProps) {
  await requireRole("ADMIN");

  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const classRoomId = params.classRoomId;
  const subjectId = params.subjectId;
  const academicYearId = params.academicYearId;
  const status = getGraduationStatus(params.status);
  const page = getPositiveNumber(params.page, 1);
  const perPage = getPerPage(params.perPage);
  const where = getScoreReportWhere({
    search,
    classRoomId,
    subjectId,
    academicYearId,
    status,
  });

  const [
    scores,
    totalScores,
    passedScores,
    failedScores,
    classRooms,
    subjects,
    academicYears,
  ] = await Promise.all([
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
            teacher: true,
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
    prisma.score.count({
      where: {
        ...where,
        status: "PASSED",
      },
    }),
    prisma.score.count({
      where: {
        ...where,
        status: "FAILED",
      },
    }),
    prisma.classRoom.findMany({
      orderBy: [{ level: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        level: true,
      },
    }),
    prisma.subject.findMany({
      orderBy: [{ name: "asc" }, { code: "asc" }],
      select: {
        id: true,
        code: true,
        name: true,
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
  ]);

  return (
    <>
      <PageHeader
        action={
          <ReportExportButton
            searchParams={{
              search,
              classRoomId,
              subjectId,
              academicYearId,
              status,
            }}
          />
        }
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard/admin" },
          { label: "Admin" },
          { label: "Laporan" },
        ]}
        description="Rekap nilai, filter kelas/mapel/tahun ajaran, dan export CSV."
        title="Laporan Nilai"
      />
      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Nilai
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{totalScores}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Lulus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{passedScores}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Tidak Lulus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{failedScores}</p>
          </CardContent>
        </Card>
      </section>
      <div className="grid gap-3 xl:grid-cols-[1fr_auto_auto]">
        <SearchFilterBar searchPlaceholder="Cari siswa, NIS, kelas, tahun, guru, kode mapel, atau mapel..." />
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
            label="Mapel"
            options={subjects.map((subject) => ({
              label: `${subject.code} - ${subject.name}`,
              value: subject.id,
            }))}
            paramName="subjectId"
            placeholder="Semua mapel"
          />
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
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
        <div className="rounded-lg border bg-card p-3">
          <SelectFilter
            label="Status"
            options={STATUS_OPTIONS}
            paramName="status"
            placeholder="Semua status"
          />
        </div>
      </div>
      <ReportsTable
        scores={scores.map((score) => ({
          id: score.id,
          studentNis: score.enrollment.student.nis,
          studentName: score.enrollment.student.name,
          classRoomName: score.enrollment.classRoom.name,
          academicYearName: score.enrollment.academicYear.name,
          subjectCode: score.teacherSubject.subject.code,
          subjectName: score.teacherSubject.subject.name,
          teacherName: score.teacherSubject.teacher.name,
          taskScore: score.taskScore,
          utsScore: score.utsScore,
          uasScore: score.uasScore,
          finalScore: score.finalScore,
          status: score.status,
        }))}
      />
      <Pagination
        basePath={REPORTS_PATH}
        page={page}
        perPage={perPage}
        searchParams={{
          search,
          classRoomId,
          subjectId,
          academicYearId,
          status,
          perPage: perPage === DEFAULT_PER_PAGE ? undefined : perPage,
        }}
        totalItems={totalScores}
      />
    </>
  );
}
