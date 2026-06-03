import { TeacherSubjectFormDialog } from "@/app/dashboard/admin/teacher-subjects/_components/teacher-subject-form-dialog";
import { TeacherSubjectsTable } from "@/app/dashboard/admin/teacher-subjects/_components/teacher-subjects-table";
import { Pagination } from "@/components/pagination";
import { SelectFilter } from "@/components/select-filter";
import { DEFAULT_PER_PAGE } from "@/constants/pagination";
import { PageHeader } from "@/components/page-header";
import { SearchFilterBar } from "@/components/search-filter-bar";
import { getPerPage, getPositiveNumber } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type AdminTeacherSubjectsPageProps = {
  searchParams: Promise<{
    search?: string;
    teacherId?: string;
    subjectId?: string;
    page?: string;
    perPage?: string;
  }>;
};

const TEACHER_SUBJECTS_PATH = "/dashboard/admin/teacher-subjects";

export default async function AdminTeacherSubjectsPage({
  searchParams,
}: AdminTeacherSubjectsPageProps) {
  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const teacherId = params.teacherId;
  const subjectId = params.subjectId;
  const page = getPositiveNumber(params.page, 1);
  const perPage = getPerPage(params.perPage);
  const where = {
    ...(teacherId ? { teacherId } : {}),
    ...(subjectId ? { subjectId } : {}),
    ...(search
      ? {
          OR: [
            {
              teacher: {
                name: { contains: search, mode: "insensitive" as const },
              },
            },
            {
              teacher: {
                teacherCode: { contains: search, mode: "insensitive" as const },
              },
            },
            {
              subject: {
                name: { contains: search, mode: "insensitive" as const },
              },
            },
            {
              subject: {
                code: { contains: search, mode: "insensitive" as const },
              },
            },
          ],
        }
      : {}),
  };

  const [teacherSubjects, totalTeacherSubjects, teachers, subjects] =
    await Promise.all([
      prisma.teacherSubject.findMany({
        where,
        include: {
          teacher: true,
          subject: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.teacherSubject.count({ where }),
      prisma.teacher.findMany({
        orderBy: [{ name: "asc" }, { teacherCode: "asc" }],
        select: {
          id: true,
          name: true,
          teacherCode: true,
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
    ]);

  return (
    <>
      <PageHeader
        action={
          <TeacherSubjectFormDialog
            mode="create"
            subjects={subjects}
            teachers={teachers}
          />
        }
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard/admin" },
          { label: "Admin" },
          { label: "Guru-Mapel" },
        ]}
        description="Kelola assignment guru dan mata pelajaran."
        title="Assignment Guru-Mapel"
      />
      <div className="grid gap-3 xl:grid-cols-[1fr_auto_auto]">
        <SearchFilterBar searchPlaceholder="Cari guru, kode guru, kode mapel, atau mapel..." />
        <div className="rounded-lg border bg-card p-3">
          <SelectFilter
            label="Guru"
            options={teachers.map((teacher) => ({
              label: `${teacher.teacherCode} - ${teacher.name}`,
              value: teacher.id,
            }))}
            paramName="teacherId"
            placeholder="Semua guru"
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
      <TeacherSubjectsTable
        subjects={subjects}
        teacherSubjects={teacherSubjects.map((teacherSubject) => ({
          id: teacherSubject.id,
          teacherId: teacherSubject.teacherId,
          subjectId: teacherSubject.subjectId,
          teacherName: teacherSubject.teacher.name,
          teacherCode: teacherSubject.teacher.teacherCode,
          subjectName: teacherSubject.subject.name,
          subjectCode: teacherSubject.subject.code,
          createdAt: teacherSubject.createdAt,
        }))}
        teachers={teachers}
      />
      <Pagination
        basePath={TEACHER_SUBJECTS_PATH}
        page={page}
        perPage={perPage}
        searchParams={{
          search,
          teacherId,
          subjectId,
          perPage: perPage === DEFAULT_PER_PAGE ? undefined : perPage,
        }}
        totalItems={totalTeacherSubjects}
      />
    </>
  );
}
