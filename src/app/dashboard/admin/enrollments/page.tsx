import { ModulePlaceholder } from "@/components/module-placeholder";

export default function AdminEnrollmentsPage() {
  return (
    <ModulePlaceholder
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard/admin" },
        { label: "Admin" },
        { label: "Enrollment" },
      ]}
      description="Kelola penempatan siswa ke kelas berdasarkan tahun ajaran."
      title="Enrollment Siswa-Kelas"
    />
  );
}
