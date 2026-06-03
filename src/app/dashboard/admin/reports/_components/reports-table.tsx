import { DataTable } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";

export type ReportScoreRow = {
  id: string;
  studentNis: string;
  studentName: string;
  classRoomName: string;
  academicYearName: string;
  subjectCode: string;
  subjectName: string;
  teacherName: string;
  taskScore: number;
  utsScore: number;
  uasScore: number;
  finalScore: number;
  status: string;
};

type ReportsTableProps = {
  scores: ReportScoreRow[];
};

export function ReportsTable({ scores }: ReportsTableProps) {
  return (
    <DataTable
      columns={[
        {
          key: "student",
          header: "Siswa",
          cell: (score) => (
            <div>
              <p className="font-medium">{score.studentName}</p>
              <p className="text-xs text-muted-foreground">{score.studentNis}</p>
            </div>
          ),
        },
        {
          key: "class",
          header: "Kelas",
          cell: (score) => (
            <div>
              <p className="font-medium">{score.classRoomName}</p>
              <p className="text-xs text-muted-foreground">
                {score.academicYearName}
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
                {score.subjectCode} | {score.teacherName}
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
      ]}
      data={scores}
      emptyDescription="Data laporan akan muncul setelah guru menginput nilai siswa."
      emptyTitle="Belum ada data laporan"
      getRowKey={(score) => score.id}
    />
  );
}
