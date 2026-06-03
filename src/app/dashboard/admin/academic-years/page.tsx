import { ModulePlaceholder } from "@/components/module-placeholder";

export default function AdminAcademicYearsPage() {
  return (
    <ModulePlaceholder
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard/admin" },
        { label: "Admin" },
        { label: "Tahun Ajaran" },
      ]}
      description="Kelola tahun ajaran dan status tahun ajaran aktif."
      title="Kelola Tahun Ajaran"
    />
  );
}
