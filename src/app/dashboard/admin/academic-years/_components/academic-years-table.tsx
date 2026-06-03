import { AcademicYearFormDialog } from "@/app/dashboard/admin/academic-years/_components/academic-year-form-dialog";
import { SetActiveAcademicYearButton } from "@/app/dashboard/admin/academic-years/_components/set-active-academic-year-button";
import { DataTable } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";

export type AcademicYearRow = {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
};

type AcademicYearsTableProps = {
  academicYears: AcademicYearRow[];
};

export function AcademicYearsTable({ academicYears }: AcademicYearsTableProps) {
  return (
    <DataTable
      columns={[
        {
          key: "name",
          header: "Tahun Ajaran",
          cell: (academicYear) => (
            <span className="font-medium">{academicYear.name}</span>
          ),
        },
        {
          key: "status",
          header: "Status",
          cell: (academicYear) => (
            <StatusBadge status={academicYear.isActive ? "ACTIVE" : "INACTIVE"} />
          ),
        },
        {
          key: "createdAt",
          header: "Dibuat",
          cell: (academicYear) =>
            new Intl.DateTimeFormat("id-ID", {
              dateStyle: "medium",
            }).format(academicYear.createdAt),
        },
        {
          key: "actions",
          header: "Aksi",
          className: "min-w-60",
          cell: (academicYear) => (
            <div className="flex flex-wrap gap-2">
              <AcademicYearFormDialog
                academicYear={academicYear}
                mode="update"
              />
              <SetActiveAcademicYearButton academicYear={academicYear} />
            </div>
          ),
        },
      ]}
      data={academicYears}
      emptyDescription="Tambahkan tahun ajaran untuk mulai mengatur enrollment siswa."
      emptyTitle="Belum ada data tahun ajaran"
      getRowKey={(academicYear) => academicYear.id}
    />
  );
}
