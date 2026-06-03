import { DataTable } from "@/components/data-table";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/permissions";

export default async function StudentDashboardPage() {
  const user = await requireRole("STUDENT");
  const activeAcademicYear = await prisma.academicYear.findFirst({
    where: { isActive: true },
  });

  const student = await prisma.student.findUnique({
    where: { userId: user.id },
  });

  const enrollment =
    student && activeAcademicYear
      ? await prisma.studentClassEnrollment.findUnique({
          where: {
            studentId_academicYearId: {
              studentId: student.id,
              academicYearId: activeAcademicYear.id,
            },
          },
          include: { classRoom: true },
        })
      : null;

  const scores = enrollment
    ? await prisma.score.findMany({
        where: { enrollmentId: enrollment.id },
        include: {
          teacherSubject: {
            include: {
              subject: true,
              teacher: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Dashboard" }, { label: "Siswa" }]}
        description="Nilai pribadi dan status kelulusan pada tahun ajaran aktif."
        title="Dashboard Siswa"
      />
      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Nama
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{student?.name ?? "-"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Kelas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{enrollment?.classRoom.name ?? "-"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tahun Ajaran
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{activeAcademicYear?.name ?? "-"}</p>
          </CardContent>
        </Card>
      </section>
      <DataTable
        columns={[
          {
            key: "subject",
            header: "Mata Pelajaran",
            cell: (score) => score.teacherSubject.subject.name,
          },
          {
            key: "teacher",
            header: "Guru",
            cell: (score) => score.teacherSubject.teacher.name,
          },
          { key: "task", header: "Tugas", cell: (score) => score.taskScore },
          { key: "uts", header: "UTS", cell: (score) => score.utsScore },
          { key: "uas", header: "UAS", cell: (score) => score.uasScore },
          {
            key: "final",
            header: "Nilai Akhir",
            cell: (score) => score.finalScore,
          },
          {
            key: "status",
            header: "Status",
            cell: (score) => <StatusBadge status={score.status} />,
          },
        ]}
        data={scores}
        emptyDescription="Nilai akan muncul setelah guru menginput data nilai."
        emptyTitle="Belum ada nilai"
        getRowKey={(score) => score.id}
      />
    </>
  );
}
