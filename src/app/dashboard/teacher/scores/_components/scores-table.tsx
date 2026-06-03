import { ScoreDeleteDialog } from "@/app/dashboard/teacher/scores/_components/score-delete-dialog";
import { ScoreFormDialog } from "@/app/dashboard/teacher/scores/_components/score-form-dialog";
import { DataTable } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";

type EnrollmentOption = {
  id: string;
  studentName: string;
  studentNis: string;
  classRoomName: string;
  academicYearName: string;
};

type TeacherSubjectOption = {
  id: string;
  subjectCode: string;
  subjectName: string;
};

export type ScoreRow = {
  id: string;
  enrollmentId: string;
  teacherSubjectId: string;
  studentName: string;
  studentNis: string;
  classRoomName: string;
  academicYearName: string;
  subjectName: string;
  subjectCode: string;
  taskScore: number;
  utsScore: number;
  uasScore: number;
  finalScore: number;
  status: string;
  createdAt: Date;
};

type ScoresTableProps = {
  scores: ScoreRow[];
  enrollments: EnrollmentOption[];
  teacherSubjects: TeacherSubjectOption[];
};

export function ScoresTable({
  scores,
  enrollments,
  teacherSubjects,
}: ScoresTableProps) {
  return (
    <DataTable
      columns={[
        {
          key: "student",
          header: "Siswa",
          cell: (score) => (
            <div>
              <p className="font-medium">{score.studentName}</p>
              <p className="text-xs text-muted-foreground">
                {score.studentNis} | {score.classRoomName}
              </p>
            </div>
          ),
        },
        {
          key: "subject",
          header: "Mata Pelajaran",
          cell: (score) => (
            <div>
              <p className="font-medium">{score.subjectName}</p>
              <p className="text-xs text-muted-foreground">
                {score.subjectCode} | {score.academicYearName}
              </p>
            </div>
          ),
        },
        { key: "task", header: "Tugas", cell: (score) => score.taskScore },
        { key: "uts", header: "UTS", cell: (score) => score.utsScore },
        { key: "uas", header: "UAS", cell: (score) => score.uasScore },
        {
          key: "final",
          header: "Akhir",
          cell: (score) => score.finalScore.toFixed(2),
        },
        {
          key: "status",
          header: "Status",
          cell: (score) => <StatusBadge status={score.status} />,
        },
        {
          key: "actions",
          header: "Aksi",
          className: "min-w-48",
          cell: (score) => (
            <div className="flex flex-wrap gap-2">
              <ScoreFormDialog
                enrollments={enrollments}
                mode="update"
                score={score}
                teacherSubjects={teacherSubjects}
              />
              <ScoreDeleteDialog score={score} />
            </div>
          ),
        },
      ]}
      data={scores}
      emptyDescription="Input nilai siswa berdasarkan enrollment dan assignment mata pelajaran Anda."
      emptyTitle="Belum ada nilai"
      getRowKey={(score) => score.id}
    />
  );
}
