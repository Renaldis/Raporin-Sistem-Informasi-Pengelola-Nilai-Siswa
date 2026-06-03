import { EnrollmentDeleteDialog } from "@/app/dashboard/admin/enrollments/_components/enrollment-delete-dialog";
import { EnrollmentFormDialog } from "@/app/dashboard/admin/enrollments/_components/enrollment-form-dialog";
import { DataTable } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";

type StudentOption = {
  id: string;
  nis: string;
  name: string;
};

type ClassRoomOption = {
  id: string;
  name: string;
  level: string;
};

type AcademicYearOption = {
  id: string;
  name: string;
  isActive: boolean;
};

export type EnrollmentRow = {
  id: string;
  studentId: string;
  classRoomId: string;
  academicYearId: string;
  studentName: string;
  studentNis: string;
  classRoomName: string;
  classRoomLevel: string;
  academicYearName: string;
  isAcademicYearActive: boolean;
  createdAt: Date;
};

type EnrollmentsTableProps = {
  enrollments: EnrollmentRow[];
  students: StudentOption[];
  classRooms: ClassRoomOption[];
  academicYears: AcademicYearOption[];
};

export function EnrollmentsTable({
  enrollments,
  students,
  classRooms,
  academicYears,
}: EnrollmentsTableProps) {
  return (
    <DataTable
      columns={[
        {
          key: "student",
          header: "Siswa",
          cell: (enrollment) => (
            <div>
              <p className="font-medium">{enrollment.studentName}</p>
              <p className="text-xs text-muted-foreground">
                {enrollment.studentNis}
              </p>
            </div>
          ),
        },
        {
          key: "classRoom",
          header: "Kelas",
          cell: (enrollment) => (
            <div>
              <p className="font-medium">{enrollment.classRoomName}</p>
              <p className="text-xs text-muted-foreground">
                {enrollment.classRoomLevel}
              </p>
            </div>
          ),
        },
        {
          key: "academicYear",
          header: "Tahun Ajaran",
          cell: (enrollment) => (
            <div className="flex flex-col gap-1">
              <span className="font-medium">{enrollment.academicYearName}</span>
              <StatusBadge
                status={enrollment.isAcademicYearActive ? "ACTIVE" : "INACTIVE"}
              />
            </div>
          ),
        },
        {
          key: "createdAt",
          header: "Dibuat",
          cell: (enrollment) =>
            new Intl.DateTimeFormat("id-ID", {
              dateStyle: "medium",
            }).format(enrollment.createdAt),
        },
        {
          key: "actions",
          header: "Aksi",
          className: "min-w-48",
          cell: (enrollment) => (
            <div className="flex flex-wrap gap-2">
              <EnrollmentFormDialog
                academicYears={academicYears}
                classRooms={classRooms}
                enrollment={enrollment}
                mode="update"
                students={students}
              />
              <EnrollmentDeleteDialog enrollment={enrollment} />
            </div>
          ),
        },
      ]}
      data={enrollments}
      emptyDescription="Tambahkan enrollment agar siswa masuk ke kelas pada tahun ajaran tertentu."
      emptyTitle="Belum ada enrollment siswa"
      getRowKey={(enrollment) => enrollment.id}
    />
  );
}
