import { StudentFormDialog } from "@/app/dashboard/admin/students/_components/student-form-dialog";
import { StudentsTable } from "@/app/dashboard/admin/students/_components/students-table";
import { PageHeader } from "@/components/page-header";
import { prisma } from "@/lib/prisma";

export default async function AdminStudentsPage() {
  const students = await prisma.student.findMany({
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <>
      <PageHeader
        action={<StudentFormDialog mode="create" />}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard/admin" },
          { label: "Admin" },
          { label: "Siswa" },
        ]}
        description="Kelola data siswa, akun login, NIS, dan nama siswa."
        title="Kelola Siswa"
      />
      <StudentsTable
        students={students.map((student) => ({
          id: student.id,
          nis: student.nis,
          name: student.name,
          username: student.user.username,
          createdAt: student.createdAt,
        }))}
      />
    </>
  );
}
