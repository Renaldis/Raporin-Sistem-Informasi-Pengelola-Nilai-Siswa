import { ModulePlaceholder } from "@/components/module-placeholder";

export default function AdminStudentsPage() {
  return (
    <ModulePlaceholder
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard/admin" },
        { label: "Admin" },
        { label: "Siswa" },
      ]}
      description="Kelola data siswa, akun login, NIS, dan nama siswa."
      title="Kelola Siswa"
    />
  );
}
