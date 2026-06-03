import { StudentDeleteDialog } from "@/app/dashboard/admin/students/_components/student-delete-dialog";
import { StudentFormDialog } from "@/app/dashboard/admin/students/_components/student-form-dialog";
import { DataTable } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";

export type StudentRow = {
  id: string;
  nis: string;
  name: string;
  username: string;
  createdAt: Date;
};

type StudentsTableProps = {
  students: StudentRow[];
};

export function StudentsTable({ students }: StudentsTableProps) {
  return (
    <DataTable
      columns={[
        {
          key: "nis",
          header: "NIS",
          cell: (student) => <span className="font-medium">{student.nis}</span>,
        },
        {
          key: "name",
          header: "Nama",
          cell: (student) => student.name,
        },
        {
          key: "username",
          header: "Username",
          cell: (student) => student.username,
        },
        {
          key: "role",
          header: "Role",
          cell: () => <StatusBadge status="STUDENT" />,
        },
        {
          key: "createdAt",
          header: "Dibuat",
          cell: (student) =>
            new Intl.DateTimeFormat("id-ID", {
              dateStyle: "medium",
            }).format(student.createdAt),
        },
        {
          key: "actions",
          header: "Aksi",
          className: "min-w-48",
          cell: (student) => (
            <div className="flex flex-wrap gap-2">
              <StudentFormDialog mode="update" student={student} />
              <StudentDeleteDialog student={student} />
            </div>
          ),
        },
      ]}
      data={students}
      emptyDescription="Tambahkan siswa pertama untuk mulai mengelola akun dan nilai."
      emptyTitle="Belum ada data siswa"
      getRowKey={(student) => student.id}
    />
  );
}
