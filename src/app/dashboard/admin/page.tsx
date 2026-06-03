import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [
    totalStudents,
    totalTeachers,
    totalClasses,
    totalSubjects,
    totalTeacherSubjects,
    totalScores,
    totalPassed,
    totalFailed,
    activeAcademicYear,
  ] = await Promise.all([
    prisma.student.count(),
    prisma.teacher.count(),
    prisma.classRoom.count(),
    prisma.subject.count(),
    prisma.teacherSubject.count(),
    prisma.score.count(),
    prisma.score.count({ where: { status: "PASSED" } }),
    prisma.score.count({ where: { status: "FAILED" } }),
    prisma.academicYear.findFirst({ where: { isActive: true } }),
  ]);

  const cards = [
    { title: "Total Siswa", value: totalStudents },
    { title: "Total Guru", value: totalTeachers },
    { title: "Total Kelas", value: totalClasses },
    { title: "Total Mata Pelajaran", value: totalSubjects },
    { title: "Assignment Guru-Mapel", value: totalTeacherSubjects },
    { title: "Total Nilai", value: totalScores },
    { title: "Total Lulus", value: totalPassed },
    { title: "Total Tidak Lulus", value: totalFailed },
    { title: "Tahun Ajaran Aktif", value: activeAcademicYear?.name ?? "-" },
  ];

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Dashboard" }, { label: "Admin" }]}
        description="Ringkasan data akademik dan pengolahan nilai siswa."
        title="Dashboard Admin"
      />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  );
}
