import { EnrollmentFormDialog } from "@/app/dashboard/admin/enrollments/_components/enrollment-form-dialog";
import { EnrollmentsTable } from "@/app/dashboard/admin/enrollments/_components/enrollments-table";
import { Pagination } from "@/components/pagination";
import { PageHeader } from "@/components/page-header";
import { SearchFilterBar } from "@/components/search-filter-bar";
import { SelectFilter } from "@/components/select-filter";
import { DEFAULT_PER_PAGE } from "@/constants/pagination";
import { getPerPage, getPositiveNumber } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type AdminEnrollmentsPageProps = {
  searchParams: Promise<{
    search?: string;
    classRoomId?: string;
    academicYearId?: string;
    page?: string;
    perPage?: string;
  }>;
};

const ENROLLMENTS_PATH = "/dashboard/admin/enrollments";

export default async function AdminEnrollmentsPage({
  searchParams,
}: AdminEnrollmentsPageProps) {
  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const classRoomId = params.classRoomId;
  const academicYearId = params.academicYearId;
  const page = getPositiveNumber(params.page, 1);
  const perPage = getPerPage(params.perPage);
  const where = {
    ...(classRoomId ? { classRoomId } : {}),
    ...(academicYearId ? { academicYearId } : {}),
    ...(search
      ? {
          OR: [
            {
              student: {
                name: { contains: search, mode: "insensitive" as const },
              },
            },
            {
              student: {
                nis: { contains: search, mode: "insensitive" as const },
              },
            },
            {
              classRoom: {
                name: { contains: search, mode: "insensitive" as const },
              },
            },
            {
              classRoom: {
                level: { contains: search, mode: "insensitive" as const },
              },
            },
            {
              academicYear: {
                name: { contains: search, mode: "insensitive" as const },
              },
            },
          ],
        }
      : {}),
  };

  const [enrollments, totalEnrollments, students, classRooms, academicYears] =
    await Promise.all([
      prisma.studentClassEnrollment.findMany({
        where,
        include: {
          student: true,
          classRoom: true,
          academicYear: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.studentClassEnrollment.count({ where }),
      prisma.student.findMany({
        orderBy: [{ name: "asc" }, { nis: "asc" }],
        select: {
          id: true,
          nis: true,
          name: true,
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
          <EnrollmentFormDialog
            academicYears={academicYears}
            classRooms={classRooms}
            mode="create"
            students={students}
          />
        }
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard/admin" },
          { label: "Admin" },
          { label: "Enrollment" },
        ]}
        description="Kelola penempatan siswa ke kelas berdasarkan tahun ajaran."
        title="Enrollment Siswa-Kelas"
      />
      <div className="grid gap-3 xl:grid-cols-[1fr_auto_auto]">
        <SearchFilterBar searchPlaceholder="Cari siswa, NIS, kelas, level, atau tahun ajaran..." />
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
      <EnrollmentsTable
        academicYears={academicYears}
        classRooms={classRooms}
        enrollments={enrollments.map((enrollment) => ({
          id: enrollment.id,
          studentId: enrollment.studentId,
          classRoomId: enrollment.classRoomId,
          academicYearId: enrollment.academicYearId,
          studentName: enrollment.student.name,
          studentNis: enrollment.student.nis,
          classRoomName: enrollment.classRoom.name,
          classRoomLevel: enrollment.classRoom.level,
          academicYearName: enrollment.academicYear.name,
          isAcademicYearActive: enrollment.academicYear.isActive,
          createdAt: enrollment.createdAt,
        }))}
        students={students}
      />
      <Pagination
        basePath={ENROLLMENTS_PATH}
        page={page}
        perPage={perPage}
        searchParams={{
          search,
          classRoomId,
          academicYearId,
          perPage: perPage === DEFAULT_PER_PAGE ? undefined : perPage,
        }}
        totalItems={totalEnrollments}
      />
    </>
  );
}
