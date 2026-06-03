import { ClassRoomFormDialog } from "@/app/dashboard/admin/classes/_components/class-room-form-dialog";
import { ClassRoomsTable } from "@/app/dashboard/admin/classes/_components/class-rooms-table";
import { Pagination } from "@/components/pagination";
import { DEFAULT_PER_PAGE } from "@/constants/pagination";
import { PageHeader } from "@/components/page-header";
import { SearchFilterBar } from "@/components/search-filter-bar";
import { getPerPage, getPositiveNumber } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";

type AdminClassesPageProps = {
  searchParams: Promise<{
    search?: string;
    page?: string;
    perPage?: string;
  }>;
};

const CLASSES_PATH = "/dashboard/admin/classes";

export default async function AdminClassesPage({
  searchParams,
}: AdminClassesPageProps) {
  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const page = getPositiveNumber(params.page, 1);
  const perPage = getPerPage(params.perPage);
  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { level: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [classRooms, totalClassRooms] = await Promise.all([
    prisma.classRoom.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.classRoom.count({ where }),
  ]);

  return (
    <>
      <PageHeader
        action={<ClassRoomFormDialog mode="create" />}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard/admin" },
          { label: "Admin" },
          { label: "Kelas" },
        ]}
        description="Kelola data kelas dan level kelas."
        title="Kelola Kelas"
      />
      <SearchFilterBar searchPlaceholder="Cari nama kelas atau level..." />
      <ClassRoomsTable classRooms={classRooms} />
      <Pagination
        basePath={CLASSES_PATH}
        page={page}
        perPage={perPage}
        searchParams={{
          search,
          perPage: perPage === DEFAULT_PER_PAGE ? undefined : perPage,
        }}
        totalItems={totalClassRooms}
      />
    </>
  );
}
