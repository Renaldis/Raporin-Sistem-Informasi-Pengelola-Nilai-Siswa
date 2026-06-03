import { StudentFormDialog } from "@/app/dashboard/admin/students/_components/student-form-dialog";
import { StudentsTable } from "@/app/dashboard/admin/students/_components/students-table";
import { Pagination } from "@/components/pagination";
import { PageHeader } from "@/components/page-header";
import { SearchFilterBar } from "@/components/search-filter-bar";
import { prisma } from "@/lib/prisma";

type AdminStudentsPageProps = {
  searchParams: Promise<{
    search?: string;
    page?: string;
    perPage?: string;
  }>;
};

const DEFAULT_PER_PAGE = 10;
const STUDENTS_PATH = "/dashboard/admin/students";

export default async function AdminStudentsPage({
  searchParams,
}: AdminStudentsPageProps) {
  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const page = getPositiveNumber(params.page, 1);
  const perPage = getPositiveNumber(params.perPage, DEFAULT_PER_PAGE);
  const where = search
    ? {
        OR: [
          { nis: { contains: search, mode: "insensitive" as const } },
          { name: { contains: search, mode: "insensitive" as const } },
          {
            user: {
              username: { contains: search, mode: "insensitive" as const },
            },
          },
        ],
      }
    : {};

  const [students, totalStudents] = await Promise.all([
    prisma.student.findMany({
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
    prisma.student.count({ where }),
  ]);

  return (
    <>
      <PageHeader
        action={<StudentFormDialog mode="create" />}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard/admin" },
          { label: "Admin" },
          { label: "Siswa" },
        ]}
        description="Kelola data siswa, akun login, NIS, dan nama siswa."
        title="Kelola Siswa"
      />
      <SearchFilterBar searchPlaceholder="Cari NIS, nama, atau username..." />
      <StudentsTable
        students={students.map((student) => ({
          id: student.id,
          nis: student.nis,
          name: student.name,
          username: student.user.username,
          createdAt: student.createdAt,
        }))}
      />
      <Pagination
        basePath={STUDENTS_PATH}
        page={page}
        perPage={perPage}
        searchParams={{
          search,
          perPage: perPage === DEFAULT_PER_PAGE ? undefined : perPage,
        }}
        totalItems={totalStudents}
      />
    </>
  );
}

function getPositiveNumber(value: string | undefined, fallback: number) {
  const number = Number(value);

  if (!Number.isInteger(number) || number < 1) {
    return fallback;
  }

  return number;
}
