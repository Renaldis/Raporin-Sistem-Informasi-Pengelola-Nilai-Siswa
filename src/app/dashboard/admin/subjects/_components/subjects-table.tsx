import { SubjectDeleteDialog } from "@/app/dashboard/admin/subjects/_components/subject-delete-dialog";
import { SubjectFormDialog } from "@/app/dashboard/admin/subjects/_components/subject-form-dialog";
import { DataTable } from "@/components/data-table";

export type SubjectRow = {
  id: string;
  code: string;
  name: string;
  createdAt: Date;
};

type SubjectsTableProps = {
  subjects: SubjectRow[];
};

export function SubjectsTable({ subjects }: SubjectsTableProps) {
  return (
    <DataTable
      columns={[
        {
          key: "code",
          header: "Kode",
          cell: (subject) => <span className="font-medium">{subject.code}</span>,
        },
        {
          key: "name",
          header: "Mata Pelajaran",
          cell: (subject) => subject.name,
        },
        {
          key: "createdAt",
          header: "Dibuat",
          cell: (subject) =>
            new Intl.DateTimeFormat("id-ID", {
              dateStyle: "medium",
            }).format(subject.createdAt),
        },
        {
          key: "actions",
          header: "Aksi",
          className: "min-w-48",
          cell: (subject) => (
            <div className="flex flex-wrap gap-2">
              <SubjectFormDialog mode="update" subject={subject} />
              <SubjectDeleteDialog subject={subject} />
            </div>
          ),
        },
      ]}
      data={subjects}
      emptyDescription="Tambahkan mata pelajaran pertama untuk assignment guru."
      emptyTitle="Belum ada data mata pelajaran"
      getRowKey={(subject) => subject.id}
    />
  );
}
