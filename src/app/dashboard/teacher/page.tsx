import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export default async function TeacherDashboardPage() {
  const user = await requireRole("TEACHER");
  const teacher = await prisma.teacher.findUnique({
    where: { userId: user.id },
  });

  const [totalScores, totalStudents] = teacher
    ? await Promise.all([
        prisma.score.count({
          where: { teacherSubject: { teacherId: teacher.id } },
        }),
        prisma.score
          .findMany({
            where: { teacherSubject: { teacherId: teacher.id } },
            distinct: ["enrollmentId"],
            select: { enrollmentId: true },
          })
          .then((scores) => scores.length),
      ])
    : [0, 0];

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Dashboard" }, { label: "Guru" }]}
        description="Ringkasan nilai yang sudah diinput oleh guru."
        title="Dashboard Guru"
      />
      <section className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Siswa Dinilai
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{totalStudents}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Nilai Diinput
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{totalScores}</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
