import { TeacherDeleteDialog } from "@/app/dashboard/admin/teachers/_components/teacher-delete-dialog";
import { TeacherFormDialog } from "@/app/dashboard/admin/teachers/_components/teacher-form-dialog";
import { DataTable } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";

export type TeacherRow = {
  id: string;
  teacherCode: string;
  name: string;
  username: string;
  createdAt: Date;
};

type TeachersTableProps = {
  teachers: TeacherRow[];
};

export function TeachersTable({ teachers }: TeachersTableProps) {
  return (
    <DataTable
      columns={[
        {
          key: "teacherCode",
          header: "Kode Guru",
          cell: (teacher) => (
            <span className="font-medium">{teacher.teacherCode}</span>
          ),
        },
        {
          key: "name",
          header: "Nama",
          cell: (teacher) => teacher.name,
        },
        {
          key: "username",
          header: "Username",
          cell: (teacher) => teacher.username,
        },
        {
          key: "role",
          header: "Role",
          cell: () => <StatusBadge status="TEACHER" />,
        },
        {
          key: "createdAt",
          header: "Dibuat",
          cell: (teacher) =>
            new Intl.DateTimeFormat("id-ID", {
              dateStyle: "medium",
            }).format(teacher.createdAt),
        },
        {
          key: "actions",
          header: "Aksi",
          className: "min-w-48",
          cell: (teacher) => (
            <div className="flex flex-wrap gap-2">
              <TeacherFormDialog mode="update" teacher={teacher} />
              <TeacherDeleteDialog teacher={teacher} />
            </div>
          ),
        },
      ]}
      data={teachers}
      emptyDescription="Tambahkan guru pertama untuk mulai mengatur assignment mata pelajaran."
      emptyTitle="Belum ada data guru"
      getRowKey={(teacher) => teacher.id}
    />
  );
}
