import { SubjectFormDialog } from "@/app/dashboard/admin/subjects/_components/subject-form-dialog";
import { SubjectsTable } from "@/app/dashboard/admin/subjects/_components/subjects-table";
import { Pagination } from "@/components/pagination";
import { DEFAULT_PER_PAGE } from "@/constants/pagination";
import { PageHeader } from "@/components/page-header";
import { SearchFilterBar } from "@/components/search-filter-bar";
import { getPerPage, getPositiveNumber } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";

type AdminSubjectsPageProps = {
  searchParams: Promise<{
    search?: string;
    page?: string;
    perPage?: string;
  }>;
};

const SUBJECTS_PATH = "/dashboard/admin/subjects";

export default async function AdminSubjectsPage({
  searchParams,
}: AdminSubjectsPageProps) {
  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const page = getPositiveNumber(params.page, 1);
  const perPage = getPerPage(params.perPage);
  const where = search
    ? {
        OR: [
          { code: { contains: search, mode: "insensitive" as const } },
          { name: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [subjects, totalSubjects] = await Promise.all([
    prisma.subject.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.subject.count({ where }),
  ]);

  return (
    <>
      <PageHeader
        action={<SubjectFormDialog mode="create" />}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard/admin" },
          { label: "Admin" },
          { label: "Mata Pelajaran" },
        ]}
        description="Kelola kode dan nama mata pelajaran."
        title="Kelola Mata Pelajaran"
      />
      <SearchFilterBar searchPlaceholder="Cari kode atau nama mata pelajaran..." />
      <SubjectsTable subjects={subjects} />
      <Pagination
        basePath={SUBJECTS_PATH}
        page={page}
        perPage={perPage}
        searchParams={{
          search,
          perPage: perPage === DEFAULT_PER_PAGE ? undefined : perPage,
        }}
        totalItems={totalSubjects}
      />
    </>
  );
}
