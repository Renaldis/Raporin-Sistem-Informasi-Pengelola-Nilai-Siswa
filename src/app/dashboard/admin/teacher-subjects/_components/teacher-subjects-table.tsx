import { TeacherSubjectDeleteDialog } from "@/app/dashboard/admin/teacher-subjects/_components/teacher-subject-delete-dialog";
import { TeacherSubjectFormDialog } from "@/app/dashboard/admin/teacher-subjects/_components/teacher-subject-form-dialog";
import { DataTable } from "@/components/data-table";

type TeacherOption = {
  id: string;
  name: string;
  teacherCode: string;
};

type SubjectOption = {
  id: string;
  code: string;
  name: string;
};

export type TeacherSubjectRow = {
  id: string;
  teacherId: string;
  subjectId: string;
  teacherName: string;
  teacherCode: string;
  subjectName: string;
  subjectCode: string;
  createdAt: Date;
};

type TeacherSubjectsTableProps = {
  teacherSubjects: TeacherSubjectRow[];
  teachers: TeacherOption[];
  subjects: SubjectOption[];
};

export function TeacherSubjectsTable({
  teacherSubjects,
  teachers,
  subjects,
}: TeacherSubjectsTableProps) {
  return (
    <DataTable
      columns={[
        {
          key: "teacher",
          header: "Guru",
          cell: (teacherSubject) => (
            <div>
              <p className="font-medium">{teacherSubject.teacherName}</p>
              <p className="text-xs text-muted-foreground">
                {teacherSubject.teacherCode}
              </p>
            </div>
          ),
        },
        {
          key: "subject",
          header: "Mata Pelajaran",
          cell: (teacherSubject) => (
            <div>
              <p className="font-medium">{teacherSubject.subjectName}</p>
              <p className="text-xs text-muted-foreground">
                {teacherSubject.subjectCode}
              </p>
            </div>
          ),
        },
        {
          key: "createdAt",
          header: "Dibuat",
          cell: (teacherSubject) =>
            new Intl.DateTimeFormat("id-ID", {
              dateStyle: "medium",
            }).format(teacherSubject.createdAt),
        },
        {
          key: "actions",
          header: "Aksi",
          className: "min-w-48",
          cell: (teacherSubject) => (
            <div className="flex flex-wrap gap-2">
              <TeacherSubjectFormDialog
                mode="update"
                subjects={subjects}
                teacherSubject={teacherSubject}
                teachers={teachers}
              />
              <TeacherSubjectDeleteDialog teacherSubject={teacherSubject} />
            </div>
          ),
        },
      ]}
      data={teacherSubjects}
      emptyDescription="Tambahkan assignment agar guru dapat mengelola nilai berdasarkan mata pelajaran."
      emptyTitle="Belum ada assignment guru-mapel"
      getRowKey={(teacherSubject) => teacherSubject.id}
    />
  );
}
