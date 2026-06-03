import {
  BookOpen,
  ClipboardList,
  GraduationCap,
  Home,
  Layers,
  Library,
  LineChart,
  School,
  Users,
} from "lucide-react";

export const statusLabels = {
  PASSED: "LULUS",
  FAILED: "TIDAK LULUS",
  ACTIVE: "AKTIF",
  INACTIVE: "TIDAK AKTIF",
  ADMIN: "ADMIN",
  TEACHER: "GURU",
  STUDENT: "SISWA",
} as const;

export const dashboardNavigation = {
  ADMIN: [
    { title: "Dashboard", href: "/dashboard/admin", icon: Home },
    { title: "Siswa", href: "/dashboard/admin/students", icon: GraduationCap },
    { title: "Guru", href: "/dashboard/admin/teachers", icon: Users },
    { title: "Kelas", href: "/dashboard/admin/classes", icon: School },
    { title: "Mata Pelajaran", href: "/dashboard/admin/subjects", icon: Library },
    {
      title: "Tahun Ajaran",
      href: "/dashboard/admin/academic-years",
      icon: Layers,
    },
    {
      title: "Guru-Mapel",
      href: "/dashboard/admin/teacher-subjects",
      icon: BookOpen,
    },
    {
      title: "Enrollment",
      href: "/dashboard/admin/enrollments",
      icon: ClipboardList,
    },
    { title: "Laporan", href: "/dashboard/admin/reports", icon: LineChart },
  ],
  TEACHER: [
    { title: "Dashboard", href: "/dashboard/teacher", icon: Home },
    { title: "Nilai", href: "/dashboard/teacher/scores", icon: ClipboardList },
  ],
  STUDENT: [{ title: "Dashboard", href: "/dashboard/student", icon: Home }],
} as const;

export const routeLabels: Record<string, string> = {
  dashboard: "Dashboard",
  admin: "Admin",
  teacher: "Guru",
  student: "Siswa",
  students: "Siswa",
  teachers: "Guru",
  classes: "Kelas",
  subjects: "Mata Pelajaran",
  "academic-years": "Tahun Ajaran",
  "teacher-subjects": "Guru-Mapel",
  enrollments: "Enrollment",
  reports: "Laporan",
  scores: "Nilai",
};
