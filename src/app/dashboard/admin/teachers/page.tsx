import { TeacherFormDialog } from "@/app/dashboard/admin/teachers/_components/teacher-form-dialog";
import { TeachersTable } from "@/app/dashboard/admin/teachers/_components/teachers-table";
import { Pagination } from "@/components/pagination";
import { DEFAULT_PER_PAGE } from "@/constants/pagination";
import { PageHeader } from "@/components/page-header";
import { SearchFilterBar } from "@/components/search-filter-bar";
import { getPerPage, getPositiveNumber } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type AdminTeachersPageProps = {
  searchParams: Promise<{
    search?: string;
    page?: string;
    perPage?: string;
  }>;
};

const TEACHERS_PATH = "/dashboard/admin/teachers";

export default async function AdminTeachersPage({
  searchParams,
}: AdminTeachersPageProps) {
  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const page = getPositiveNumber(params.page, 1);
  const perPage = getPerPage(params.perPage);
  const where = search
    ? {
        OR: [
          { teacherCode: { contains: search, mode: "insensitive" as const } },
          { name: { contains: search, mode: "insensitive" as const } },
          {
            user: {
              username: { contains: search, mode: "insensitive" as const },
            },
          },
        ],
      }
    : {};

  const [teachers, totalTeachers] = await Promise.all([
    prisma.teacher.findMany({
      where,
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.teacher.count({ where }),
  ]);

  return (
    <>
      <PageHeader
        action={<TeacherFormDialog mode="create" />}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard/admin" },
          { label: "Admin" },
          { label: "Guru" },
        ]}
        description="Kelola data guru, akun login, kode guru, dan nama guru."
        title="Kelola Guru"
      />
      <SearchFilterBar searchPlaceholder="Cari kode guru, nama, atau username..." />
      <TeachersTable
        teachers={teachers.map((teacher) => ({
          id: teacher.id,
          teacherCode: teacher.teacherCode,
          name: teacher.name,
          username: teacher.user.username,
          createdAt: teacher.createdAt,
        }))}
      />
      <Pagination
        basePath={TEACHERS_PATH}
        page={page}
        perPage={perPage}
        searchParams={{
          search,
          perPage: perPage === DEFAULT_PER_PAGE ? undefined : perPage,
        }}
        totalItems={totalTeachers}
      />
    </>
  );
}
