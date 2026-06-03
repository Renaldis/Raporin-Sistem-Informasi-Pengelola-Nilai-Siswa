import { AcademicYearFormDialog } from "@/app/dashboard/admin/academic-years/_components/academic-year-form-dialog";
import { AcademicYearsTable } from "@/app/dashboard/admin/academic-years/_components/academic-years-table";
import { Pagination } from "@/components/pagination";
import { SelectFilter } from "@/components/select-filter";
import { DEFAULT_PER_PAGE } from "@/constants/pagination";
import { PageHeader } from "@/components/page-header";
import { SearchFilterBar } from "@/components/search-filter-bar";
import { getPerPage, getPositiveNumber } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";

type AdminAcademicYearsPageProps = {
  searchParams: Promise<{
    search?: string;
    status?: string;
    page?: string;
    perPage?: string;
  }>;
};

const ACADEMIC_YEARS_PATH = "/dashboard/admin/academic-years";

export default async function AdminAcademicYearsPage({
  searchParams,
}: AdminAcademicYearsPageProps) {
  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const status = params.status;
  const page = getPositiveNumber(params.page, 1);
  const perPage = getPerPage(params.perPage);
  const where = {
    ...(search
      ? {
          name: { contains: search, mode: "insensitive" as const },
        }
      : {}),
    ...(status === "active"
      ? { isActive: true }
      : status === "inactive"
        ? { isActive: false }
        : {}),
  };

  const [academicYears, totalAcademicYears] = await Promise.all([
    prisma.academicYear.findMany({
      where,
      orderBy: [
        {
          isActive: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.academicYear.count({ where }),
  ]);

  return (
    <>
      <PageHeader
        action={<AcademicYearFormDialog mode="create" />}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard/admin" },
          { label: "Admin" },
          { label: "Tahun Ajaran" },
        ]}
        description="Kelola tahun ajaran dan status tahun ajaran aktif."
        title="Kelola Tahun Ajaran"
      />
      <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
        <SearchFilterBar searchPlaceholder="Cari tahun ajaran..." />
        <div className="rounded-lg border bg-card p-3">
          <SelectFilter
            label="Status"
            options={[
              { label: "Aktif", value: "active" },
              { label: "Tidak Aktif", value: "inactive" },
            ]}
            paramName="status"
            placeholder="Semua status"
          />
        </div>
      </div>
      <AcademicYearsTable academicYears={academicYears} />
      <Pagination
        basePath={ACADEMIC_YEARS_PATH}
        page={page}
        perPage={perPage}
        searchParams={{
          search,
          status,
          perPage: perPage === DEFAULT_PER_PAGE ? undefined : perPage,
        }}
        totalItems={totalAcademicYears}
      />
    </>
  );
}
